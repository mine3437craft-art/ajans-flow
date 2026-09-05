/**
 * Düzenlenmiş Notlar'daki bölüm sırası. İçindekiler ve sayfadaki gruplar
 * bu sırayla dizilir; listede olmayan bölümler sona, alfabetik gelir.
 * Hem istemci (form) hem sunucu (sayfa) kullandığı için düz modül —
 * 'use client' dosyasından sabit dışa aktarmak sunucuda referans nesnesi verir.
 */
export const BOLUMLER = ['Başlarken', 'Araçlar', 'Katmanlar', 'Maskeler', 'Renk', 'Kaydetme', 'Ekip', 'Genel'];

export function bolumSirasi(a: string, b: string): number {
  const ia = BOLUMLER.indexOf(a);
  const ib = BOLUMLER.indexOf(b);
  if (ia === -1 && ib === -1) return a.localeCompare(b, 'tr');
  if (ia === -1) return 1;
  if (ib === -1) return -1;
  return ia - ib;
}
