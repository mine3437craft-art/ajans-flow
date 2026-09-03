import 'server-only';
import { sql } from './db';

export type VideoDurum = {
  customer_id: number;
  musteri: string;
  haftalik: number;   // haftada kaç video paylaşılıyor
  depoda: number;     // stokta kaç video var
  haftaKaldi: number | null;  // stok kaç haftaya yeter (haftalık 0 ise null)
  seviye: 'kritik' | 'azaliyor' | 'yeterli' | 'planlanmamis';
};

/**
 * Müşteri başına video stoğu ve stoğun kaç haftaya yettiği.
 *
 *   kritik    : 1 haftadan az kaldı — çekime gidilmeli
 *   azaliyor  : 2 haftadan az kaldı
 *   yeterli   : 2 hafta ve üzeri
 *   planlanmamis : haftalık paylaşım sayısı girilmemiş
 */
export async function videoDurumu(musteriId?: number): Promise<VideoDurum[]> {
  const rows = (await sql`
    SELECT c.id AS customer_id, c.name AS musteri,
           c.haftalik_video::int AS haftalik,
           COUNT(v.id) FILTER (WHERE v.status = 'depoda')::int AS depoda
    FROM customers c
    LEFT JOIN videos v ON v.customer_id = c.id
    WHERE c.status = 'aktif'
      AND (${musteriId ?? null}::int IS NULL OR c.id = ${musteriId ?? null})
    GROUP BY c.id, c.name, c.haftalik_video
    ORDER BY c.name
  `) as Array<{ customer_id: number; musteri: string; haftalik: number; depoda: number }>;

  return rows.map((r) => {
    if (r.haftalik <= 0) {
      return { ...r, haftaKaldi: null, seviye: 'planlanmamis' as const };
    }
    const haftaKaldi = r.depoda / r.haftalik;
    const seviye = haftaKaldi < 1 ? 'kritik' as const
      : haftaKaldi < 2 ? 'azaliyor' as const
      : 'yeterli' as const;
    return { ...r, haftaKaldi, seviye };
  });
}

/** Panoda gösterilecek uyarılar: yalnızca stoğu azalanlar. */
export async function videoUyarilari(): Promise<VideoDurum[]> {
  const hepsi = await videoDurumu();
  return hepsi
    .filter((v) => v.seviye === 'kritik' || v.seviye === 'azaliyor')
    .sort((a, b) => (a.haftaKaldi ?? 99) - (b.haftaKaldi ?? 99));
}
