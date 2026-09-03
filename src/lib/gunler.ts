/**
 * Saf, veritabanı bağlantısı içermeyen gün yardımcıları. Client
 * component'ler bunu import eder — `src/lib/tekrar.ts` "server-only" ve
 * veritabanı bağlantısı içerdiği için tarayıcıya sızdırılamaz.
 */

/** ISO gün numaraları: 1 = Pazartesi … 7 = Pazar */
export const GUNLER: Array<{ no: number; kisa: string; uzun: string }> = [
  { no: 1, kisa: 'Pzt', uzun: 'Pazartesi' },
  { no: 2, kisa: 'Sal', uzun: 'Salı' },
  { no: 3, kisa: 'Çar', uzun: 'Çarşamba' },
  { no: 4, kisa: 'Per', uzun: 'Perşembe' },
  { no: 5, kisa: 'Cum', uzun: 'Cuma' },
  { no: 6, kisa: 'Cmt', uzun: 'Cumartesi' },
  { no: 7, kisa: 'Paz', uzun: 'Pazar' },
];

export function gunAdlari(weekdays: number[] | null | undefined): string {
  if (!weekdays || weekdays.length === 0) return '—';
  return [...weekdays]
    .sort((a, b) => a - b)
    .map((n) => GUNLER.find((g) => g.no === n)?.kisa ?? '?')
    .join(', ');
}
