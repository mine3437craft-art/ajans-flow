/**
 * `public/site/medya/kunye.json` okuma yardımcıları (çalışmalar sayfaları).
 *
 * Künyede OLMAYAN dosyaya hiç atıf yapılmaz: listeler buradan süzülür,
 * dosya silinirse kare sessizce düşer. Sunucu bileşenlerinde okunduğu
 * için künye istemci paketine girmez.
 */
import kunyeHam from '../../../../public/site/medya/kunye.json';

export type MedyaKaydi = {
  dosya: string;
  tur?: string;
  marka?: string;
  baslik?: string;
  aciklama?: string;
  genislik?: number;
  yukseklik?: number;
};

const KUNYE = kunyeHam as MedyaKaydi[];
const HARITA = new Map(KUNYE.map((k) => [k.dosya, k]));

/** Tek dosyanın künye kaydı (yoksa undefined). */
export function medyaKaydi(dosya: string | undefined): MedyaKaydi | undefined {
  return dosya ? HARITA.get(dosya) : undefined;
}

/** Listeden yalnız künyede gerçekten duran dosyalar. */
export function medyaKayitlari(dosyalar: readonly string[] | undefined): MedyaKaydi[] {
  return (dosyalar ?? [])
    .map((d) => HARITA.get(d))
    .filter((k): k is MedyaKaydi => Boolean(k));
}

/** Genişlik / yükseklik. Ölçü yoksa 1 (kare varsayımı). */
export function oran(k: MedyaKaydi): number {
  const g = k.genislik ?? 0;
  const y = k.yukseklik ?? 0;
  return g > 0 && y > 0 ? g / y : 1;
}

/** `aspect-ratio` değeri — kutu önceden rezerve edilir, düzen kaymaz. */
export function oranCss(k: MedyaKaydi): string {
  return k.genislik && k.yukseklik ? `${k.genislik} / ${k.yukseklik}` : '4 / 3';
}

/** Video bileşeninin beklediği oran adı. */
export function videoOrani(k: MedyaKaydi): 'yatay' | 'dikey' | 'kare' {
  const o = oran(k);
  if (o >= 1.5) return 'yatay';
  if (o <= 0.7) return 'dikey';
  return 'kare';
}

/**
 * Künye başlığında "ekran" geçen kareler ürün ekran görüntüsüdür; bunlar
 * cihaz çerçevesinin içinde gösterilir. Başlık değişirse kare sessizce
 * foto ızgarasına düşer — sayfa bozulmaz.
 */
export function ekranMi(k: MedyaKaydi): boolean {
  return /ekran/i.test(k.baslik ?? '');
}

/** Görsel alt metni: künyedeki başlık + marka. */
export function altMetni(k: MedyaKaydi): string {
  const bas = k.baslik?.trim();
  if (bas && k.marka) return `${k.marka} — ${bas}`;
  return bas ?? k.marka ?? '';
}

/* ==================================================================== */
/* MARKA EŞLEMESİ — künyenin tamamı, markaya göre                        */
/*                                                                      */
/* `VAKALAR[].medya` her markanın arşivinin YALNIZCA bir bölümünü        */
/* sayıyor (ör. Kule İstanbul'un üç klibi orada hiç yok). Vitrin ve      */
/* bento ızgarası künyedeki `marka` alanından besleniyor: dosya varsa    */
/* görünür, künyeden silinirse sessizce düşer. UYDURMA YOK — eklenen     */
/* her kare o markanın gerçekten çekilmiş dosyası.                      */
/* ==================================================================== */

/** Dosya yolunun klasörü: 'foto/x.jpg' → 'foto'. */
function klasoru(dosya: string): string {
  const yer = dosya.indexOf('/');
  return yer > 0 ? dosya.slice(0, yer) : '';
}

/**
 * Bir markanın künyedeki kayıtları, klasöre göre süzülmüş ve künye
 * sırasında. Marka adı birebir eşleşir (künye ile VAKALAR aynı yazımı
 * kullanıyor); eşleşmezse boş liste döner ve sayfa bozulmaz.
 */
export function markaKayitlari(
  marka: string,
  klasor: 'video' | 'poster' | 'foto' | 'logo',
): MedyaKaydi[] {
  return KUNYE.filter((k) => k.marka === marka && klasoru(k.dosya) === klasor);
}

/** Videonun künyedeki posteri (aynı ad, `poster/` altında). */
export function posterAdi(video: MedyaKaydi): string | undefined {
  const ad = video.dosya.replace(/^video\//, 'poster/').replace(/\.(mp4|webm|mov)$/i, '.jpg');
  return HARITA.has(ad) ? ad : undefined;
}
