import 'server-only';
import { sql } from './db';
import { num, bugunTR } from './format';

/** Kasa hesabi + o ayki hareket ozeti. */
export type Hesap = {
  id: number;
  name: string;
  account_type: string;
  balance: string;
  notes: string | null;
  ay_gelir: string;
  ay_gider: string;
};

/**
 * Gelir/gider ve hesaplar arasi transferin ortak gorunumu. `kaynak` hangi
 * tablodan geldigini soyler; silme islemi buna gore farkli aksiyona gider.
 */
export type Hareket = {
  kaynak: 'islem' | 'transfer';
  id: number;
  tur: 'gelir' | 'gider' | 'transfer';
  amount: string;
  category: string;
  description: string | null;
  occurred_on: string;
  musteri: string | null;
  hesap: string | null;
  hedef_hesap: string | null;
};

export type KasaOzet = {
  toplamVarlik: number;
  bekleyenBorc: number;
  bekleyenAlacak: number;
  netDurum: number;
};

/** "2026-09" -> "2026-09-01"; gecersizse icinde bulunulan ay. */
export function ayBasi(ay: string | undefined): { period: string; periodStart: string } {
  const period = /^\d{4}-\d{2}$/.test(ay ?? '') ? ay! : bugunTR().slice(0, 7);
  return { period, periodStart: `${period}-01` };
}

export async function hesaplariGetir(periodStart: string): Promise<Hesap[]> {
  return (await sql`
    SELECT a.id, a.name, a.account_type, a.balance, a.notes,
           COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'gelir'), 0) AS ay_gelir,
           COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'gider'), 0) AS ay_gider
    FROM cash_accounts a
    LEFT JOIN transactions t
      ON t.account_id = a.id
     AND t.occurred_on >= ${periodStart}::date
     AND t.occurred_on <  (${periodStart}::date + INTERVAL '1 month')
    GROUP BY a.id
    ORDER BY a.account_type, a.name
  `) as Hesap[];
}

/** Hesap secim kutulari icin ad + bakiye; toplama/gruplama yapmaz. */
export async function hesapSecenekleri(): Promise<
  Array<{ id: number; name: string; account_type: string; balance: string }>
> {
  return (await sql`
    SELECT id, name, account_type, balance FROM cash_accounts
    ORDER BY account_type, name
  `) as Array<{ id: number; name: string; account_type: string; balance: string }>;
}

/**
 * Bir ayin butun para hareketleri: gelir, gider ve transferler tek listede.
 * `hesapId` verilirse transferler icin hem cikis hem giris tarafi eslenir --
 * hesabin ekstresi gibi calisir.
 */
export async function hareketleriGetir(opts: {
  periodStart: string;
  hesapId?: number | null;
  tur?: string | null;
}): Promise<Hareket[]> {
  const hesapId = Number.isInteger(opts.hesapId) ? opts.hesapId! : null;
  const tur = opts.tur === 'gelir' || opts.tur === 'gider' || opts.tur === 'transfer'
    ? opts.tur
    : null;

  return (await sql`
    SELECT * FROM (
      SELECT 'islem'::text AS kaynak, t.id, t.type AS tur, t.amount, t.category,
             t.description, t.occurred_on, t.created_at, c.name AS musteri,
             a.name AS hesap, NULL::text AS hedef_hesap
      FROM transactions t
      LEFT JOIN customers c     ON c.id = t.customer_id
      LEFT JOIN cash_accounts a ON a.id = t.account_id
      WHERE t.occurred_on >= ${opts.periodStart}::date
        AND t.occurred_on <  (${opts.periodStart}::date + INTERVAL '1 month')
        AND (${hesapId}::int IS NULL OR t.account_id = ${hesapId}::int)
        AND (${tur}::text IS NULL OR t.type = ${tur}::text)

      UNION ALL

      SELECT 'transfer'::text, tr.id, 'transfer'::text, tr.amount,
             'Hesap Transferi'::text, tr.description, tr.occurred_on, tr.created_at,
             NULL::text, f.name, h.name
      FROM cash_transfers tr
      JOIN cash_accounts f ON f.id = tr.from_account_id
      JOIN cash_accounts h ON h.id = tr.to_account_id
      WHERE tr.occurred_on >= ${opts.periodStart}::date
        AND tr.occurred_on <  (${opts.periodStart}::date + INTERVAL '1 month')
        AND (${hesapId}::int IS NULL
             OR tr.from_account_id = ${hesapId}::int
             OR tr.to_account_id = ${hesapId}::int)
        AND (${tur}::text IS NULL OR ${tur}::text = 'transfer')
    ) x
    ORDER BY occurred_on DESC, created_at DESC, id DESC
    LIMIT 400
  `) as Hareket[];
}

/** Toplam varlik + bekleyen borc/alacak. Kasa ve Pano ayni rakami gostersin diye tek yerde. */
export async function kasaOzeti(): Promise<KasaOzet> {
  const [varlik] = (await sql`
    SELECT COALESCE(SUM(balance), 0) AS toplam FROM cash_accounts
  `) as Array<{ toplam: string }>;

  const [borc] = (await sql`
    SELECT
      COALESCE(SUM(amount - paid_amount) FILTER (WHERE direction = 'borc'), 0)   AS toplam_borc,
      COALESCE(SUM(amount - paid_amount) FILTER (WHERE direction = 'alacak'), 0) AS toplam_alacak
    FROM debts WHERE paid_amount < amount
  `) as Array<{ toplam_borc: string; toplam_alacak: string }>;

  const toplamVarlik = num(varlik?.toplam);
  const bekleyenBorc = num(borc?.toplam_borc);
  const bekleyenAlacak = num(borc?.toplam_alacak);
  return {
    toplamVarlik,
    bekleyenBorc,
    bekleyenAlacak,
    netDurum: toplamVarlik - bekleyenBorc + bekleyenAlacak,
  };
}
