/**
 * AKIŞ KARTI durumu — ana sayfadaki iki adacık (sektör kapısı, eksik
 * işaretleme) ile Akış Kartı'nı birbirine bağlar.
 *
 * Paylaşılan sözleşme (iletişim formu bunu okur):
 *   sessionStorage['af-akis'] = { "sektor": "kafe-restoran", "eksikler": ["qr_menu"] }
 *   document.documentElement.dataset.sektor = "kafe-restoran"
 *
 * Sektör anahtarları `SEKTORLER[].anahtar`, eksik anahtarları
 * `EKSIKLER[].anahtar` ile birebir aynıdır. Doğrulama burada yapılmaz;
 * her adacık kendi seçeneklerini sunucudan prop olarak alır ve yalnız o
 * listedeki anahtarları yazar (veri dosyaları istemci paketine girmesin).
 */

export const AKIS_ANAHTARI = 'af-akis';
export const AKIS_OLAYI = 'af-akis-degisti';

export type Akis = {
  sektor: string | null;
  eksikler: string[];
};

export const BOS_AKIS: Akis = { sektor: null, eksikler: [] };

function metinDizisi(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.length > 0) : [];
}

/** Depodaki durumu okur. Depo kapalıysa (gizli sekme) boş durum döner. */
export function akisOku(): Akis {
  if (typeof window === 'undefined') return BOS_AKIS;
  try {
    const ham = window.sessionStorage.getItem(AKIS_ANAHTARI);
    if (!ham) return BOS_AKIS;
    const veri = JSON.parse(ham) as unknown;
    if (!veri || typeof veri !== 'object') return BOS_AKIS;
    const nesne = veri as Record<string, unknown>;
    return {
      sektor: typeof nesne.sektor === 'string' && nesne.sektor ? nesne.sektor : null,
      eksikler: metinDizisi(nesne.eksikler),
    };
  } catch {
    return BOS_AKIS;
  }
}

/**
 * Durumu yazar: sessionStorage + `<html data-sektor>` + olay.
 * Depoya yazmak başarısız olsa bile (gizli sekme, kota) sayfa içi olay
 * gider; kart ve CSS yine güncellenir.
 */
export function akisYaz(durum: Akis): void {
  if (typeof window === 'undefined') return;
  const temiz: Akis = { sektor: durum.sektor || null, eksikler: [...new Set(durum.eksikler)] };
  try {
    const kayit: Record<string, unknown> = { eksikler: temiz.eksikler };
    if (temiz.sektor) kayit.sektor = temiz.sektor;
    window.sessionStorage.setItem(AKIS_ANAHTARI, JSON.stringify(kayit));
  } catch {
    /* depo kapalı — yalnız sayfa içi durum kalır */
  }
  const kok = document.documentElement;
  if (temiz.sektor) kok.dataset.sektor = temiz.sektor;
  else delete kok.dataset.sektor;
  window.dispatchEvent(new CustomEvent<Akis>(AKIS_OLAYI, { detail: temiz }));
}

/** Değişiklikleri dinler; temizleme işlevi döner. */
export function akisDinle(geriCagri: (durum: Akis) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const isle = (e: Event) => {
    const olay = e as CustomEvent<Akis>;
    geriCagri(olay.detail ?? akisOku());
  };
  window.addEventListener(AKIS_OLAYI, isle);
  return () => window.removeEventListener(AKIS_OLAYI, isle);
}
