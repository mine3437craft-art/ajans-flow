const TR = 'tr-TR';

export function money(value: number | string | null | undefined): string {
  const n = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
  return new Intl.NumberFormat(TR, {
    style: 'currency', currency: 'TRY',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

export function dateTR(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(TR, { day: 'numeric', month: 'long', year: 'numeric' });
}

export function dateShort(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(TR, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** <input type="date"> için YYYY-AA-GG. */
export function isoDate(value: string | Date | null | undefined): string {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export function num(value: number | string | null | undefined): number {
  const n = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export const TASK_STATUS_LABEL: Record<string, string> = {
  bekliyor: 'Bekliyor', devam: 'Devam ediyor', tamamlandi: 'Tamamlandı', iptal: 'İptal',
};
export const PRIORITY_LABEL: Record<string, string> = {
  dusuk: 'Düşük', normal: 'Normal', yuksek: 'Yüksek',
};
export const CUSTOMER_STATUS_LABEL: Record<string, string> = {
  aktif: 'Aktif', duraklatildi: 'Duraklatıldı', ayrildi: 'Ayrıldı',
};
export const POST_STATUS_LABEL: Record<string, string> = {
  planlandi: 'Planlandı', hazir: 'Hazır', yayinlandi: 'Yayınlandı', iptal: 'İptal',
};
export const DEBT_LABEL: Record<string, string> = {
  alacak: 'Alacak', borc: 'Borç',
};

export const INCOME_CATEGORIES = ['Müşteri Ödemesi', 'Danışmanlık', 'Proje', 'Reklam Geliri', 'Diğer'];
export const EXPENSE_CATEGORIES = ['Maaş', 'Reklam', 'Yazılım', 'Ofis', 'Vergi', 'Ekipman', 'Diğer'];
export const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'X', 'Facebook'];
export const PACKAGES = ['Başlangıç', 'Standart', 'Profesyonel', 'Kurumsal'];
