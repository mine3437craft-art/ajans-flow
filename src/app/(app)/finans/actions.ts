'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { assertPageAccess, logActivity } from '@/lib/auth';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, money } from '@/lib/format';

function str(fd: FormData, key: string): string | null {
  const v = String(fd.get(key) ?? '').trim();
  return v === '' ? null : v;
}

function sayi(fd: FormData, key: string): number | null {
  const raw = str(fd, key);
  if (!raw) return null;
  const n = parseInt(raw, 10);
  return Number.isInteger(n) ? n : null;
}

/** Kasa, Gelir/Gider ve Pano ayni rakamlari gostersin. */
function tazele() {
  revalidatePath('/kasa');
  revalidatePath('/finans');
  revalidatePath('/');
  revalidatePath('/raporlar');
}

/**
 * Gelir/gider kaydi. Bir kasa hesabi secildiyse ayni SQL ifadesi icinde
 * (CTE ile, atomik olarak) o hesabin bakiyesi gelirde artar, giderde azalir --
 * "kaydi yaz ama bakiyeyi guncelleme" gibi yarim bir durum olusamaz.
 * `useActionState` ile cagrilir: hata cökme ekrani yerine formun ustunde cikar.
 */
export async function createTransaction(
  _prev: string | null,
  formData: FormData,
): Promise<string | null> {
  // Finansal veri — her çağrıda yetki kontrolü. Menüyü gizlemek yetmez.
  const user = await assertPageAccess('finans');

  const type = String(formData.get('type') ?? '');
  if (type !== 'gelir' && type !== 'gider') return 'Geçersiz işlem türü.';

  const amount = parseFloat(String(formData.get('amount') ?? '').replace(',', '.'));
  if (!Number.isFinite(amount) || amount <= 0) return 'Tutar sıfırdan büyük olmalı.';

  const category = str(formData, 'category') ?? 'Diğer';
  const allowed = type === 'gelir' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const safeCategory = allowed.includes(category) ? category : 'Diğer';

  const occurredOn = str(formData, 'occurred_on');
  if (!occurredOn) return 'Tarih zorunludur.';

  const customerId = sayi(formData, 'customer_id');
  const accountId = sayi(formData, 'account_id');

  const rows = (await sql`
    WITH yeni AS (
      INSERT INTO transactions
        (type, amount, category, description, occurred_on, customer_id, account_id, created_by)
      VALUES (${type}, ${amount}, ${safeCategory}, ${str(formData, 'description')},
              ${occurredOn}, ${customerId}, ${accountId}, ${user.id})
      RETURNING id, type, amount, account_id
    ),
    kasa AS (
      UPDATE cash_accounts a
      SET balance = a.balance + CASE WHEN y.type = 'gelir' THEN y.amount ELSE -y.amount END,
          updated_at = NOW()
      FROM yeni y
      WHERE a.id = y.account_id
      RETURNING a.id, a.name, a.balance
    )
    SELECT yeni.id, kasa.name AS hesap, kasa.balance AS yeni_bakiye
    FROM yeni LEFT JOIN kasa ON TRUE
  `) as Array<{ id: number; hesap: string | null; yeni_bakiye: string | null }>;

  const kayit = rows[0];
  await logActivity({
    userId: user.id, action: 'ekle', entity: type, entityId: kayit?.id,
    detail: `${safeCategory} — ${amount}${kayit?.hesap ? ` (${kayit.hesap})` : ''}`,
    isFinancial: true,
  });
  tazele();

  // Bicim: ok|<kayit id>|<kasa etkisi>. Kayit id'si her seferinde farkli
  // oldugu icin ayni islem art arda girildiginde de dizge degisir; boylece
  // useActionState yeni bir deger gorur ve form gercekten sifirlanir.
  const etki = kayit?.hesap ? `${kayit.hesap} → ${money(kayit.yeni_bakiye)}` : '';
  return `ok|${kayit?.id ?? 0}|${etki}`;
}

/** Kaydi siler ve bagli oldugu kasa hesabinda etkisini geri alir. */
export async function deleteTransaction(formData: FormData) {
  const user = await assertPageAccess('finans');
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!Number.isInteger(id)) throw new Error('Geçersiz kayıt.');

  const rows = (await sql`
    WITH silinen AS (
      DELETE FROM transactions WHERE id = ${id}
      RETURNING id, type, amount, category, account_id
    ),
    kasa AS (
      UPDATE cash_accounts a
      SET balance = a.balance - CASE WHEN s.type = 'gelir' THEN s.amount ELSE -s.amount END,
          updated_at = NOW()
      FROM silinen s
      WHERE a.id = s.account_id
      RETURNING a.id
    )
    SELECT id, category, amount FROM silinen
  `) as Array<{ id: number; category: string; amount: string }>;

  await logActivity({
    userId: user.id, action: 'sil', entity: 'işlem', entityId: id,
    detail: rows[0] ? `${rows[0].category} — ${rows[0].amount}` : undefined,
    isFinancial: true,
  });
  tazele();
}

/**
 * Var olan bir kaydi bir kasa hesabina baglar (veya bagini degistirir).
 * Eski hesaptan etki geri alinir, yeni hesaba uygulanir -- ikisi de ayni
 * SQL ifadesinde. Eski ve yeni hesap ayniysa hicbir bakiye oynatilmaz;
 * ayni satiri tek ifadede iki kez guncellemek sessizce yanlis sonuc verirdi.
 */
export async function kasayaBagla(formData: FormData) {
  const user = await assertPageAccess('finans');
  const id = sayi(formData, 'id');
  const accountId = sayi(formData, 'account_id');
  if (!id || !accountId) return;

  await sql`
    WITH eski AS (
      SELECT id, type, amount, account_id FROM transactions WHERE id = ${id}
    ),
    guncel AS (
      UPDATE transactions t SET account_id = ${accountId}
      FROM eski e WHERE t.id = e.id AND e.account_id IS DISTINCT FROM ${accountId}::int
      RETURNING t.id
    ),
    geri_al AS (
      UPDATE cash_accounts a
      SET balance = a.balance - CASE WHEN e.type = 'gelir' THEN e.amount ELSE -e.amount END,
          updated_at = NOW()
      FROM eski e
      WHERE a.id = e.account_id AND e.account_id IS DISTINCT FROM ${accountId}::int
      RETURNING a.id
    ),
    uygula AS (
      UPDATE cash_accounts a
      SET balance = a.balance + CASE WHEN e.type = 'gelir' THEN e.amount ELSE -e.amount END,
          updated_at = NOW()
      FROM eski e
      WHERE a.id = ${accountId}::int AND e.account_id IS DISTINCT FROM ${accountId}::int
      RETURNING a.id
    )
    SELECT id FROM guncel
  `;

  await logActivity({
    userId: user.id, action: 'güncelle', entity: 'işlem', entityId: id,
    detail: 'kasa bağlandı', isFinancial: true,
  });
  tazele();
}
