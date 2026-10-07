/**
 * Sektör sayfalarının paylaşılan yardımcıları (yalnız bu klasör kullanır).
 *
 * Metin ve veri `src/lib/site-icerik.ts` içinde kalır; burada sadece sunum
 * kararları (hangi sektöre hangi ikon, hangi görsel nereye düşer) ve medya
 * künyesinden ölçü okuma var. UYDURMA MEDYA YOK: künyede kaydı olmayan
 * dosya hiç basılmaz, kutusu da açılmaz.
 */

import type { IkonAdi } from '@/components/site/Ikonlar';
import { MARKA } from '@/lib/site';
import { NAV, SEKTORLER, medyaYolu, type Sektor, type Vaka } from '@/lib/site-icerik';
/** Medya künyesi — yalnız "bu dosya var mı, ölçüsü ne" sorusu için okunur. */
import kunyeHam from '../../../../public/site/medya/kunye.json';

type KunyeKaydi = {
  dosya: string;
  tur?: string;
  marka?: string;
  baslik?: string;
  genislik?: number;
  yukseklik?: number;
};

const KUNYE = new Map((kunyeHam as KunyeKaydi[]).map((k) => [k.dosya, k]));

/* ------------------------------------------------------------------ */
/* İkonlar — tasarım kararı, içerik verisi değil                       */
/* ------------------------------------------------------------------ */

const SEKTOR_IKONU: Record<string, IkonAdi> = {
  'go-kart': 'oynat',
  'oto-galeri': 'grafik',
  'kafe-restoran': 'qr',
  'avukat-hukuk': 'kalkan',
  mimar: 'kalem',
  saglik: 'arti',
  spor: 'yildiz',
  anaokulu: 'tik',
  guzellik: 'instagram',
  otel: 'konum',
  emlak: 'drone',
  magaza: 'kutu',
};

export function sektorIkonu(anahtar: string): IkonAdi {
  return SEKTOR_IKONU[anahtar] ?? 'kutu';
}

/** Vitrindeki sıra numarası — "01", "02"… Veriden sayılır, elle yazılmaz. */
export function sektorSirasi(sektor: Sektor): number {
  return SEKTORLER.findIndex((s) => s.anahtar === sektor.anahtar) + 1;
}

export function ikiBasamak(n: number): string {
  return String(n).padStart(2, '0');
}

/* ------------------------------------------------------------------ */
/* Kısa vaat — menüde zaten yazılı olan tek satır                      */
/* ------------------------------------------------------------------ */

const SEKTOR_MENUSU = NAV.find((o) => o.href === '/sektorler')?.alt ?? [];

export function kisaVaat(sektor: Sektor): string {
  return SEKTOR_MENUSU.find((o) => o.href === `/sektorler/${sektor.slug}`)?.aciklama ?? sektor.metaBaslik;
}

/* ------------------------------------------------------------------ */
/* Başlık — şablon markayı sonuna ekliyor, 60 karakteri aşmasın        */
/* ------------------------------------------------------------------ */

const BASLIK_EKI = ` | ${MARKA.ad}`;

/**
 * Kök layout başlığa ` | Ajans Flow` ekliyor. İçerikteki başlık markayı
 * zaten içeriyorsa ya da ekle birlikte 60 karakteri geçiyorsa başlık
 * olduğu gibi (absolute) basılır.
 */
export function sayfaBasligi(metaBaslik: string): string | { absolute: string } {
  const tasiyor = metaBaslik.includes(MARKA.ad);
  return tasiyor || metaBaslik.length + BASLIK_EKI.length > 60 ? { absolute: metaBaslik } : metaBaslik;
}

/* ------------------------------------------------------------------ */
/* Medya — künyede gerçekten duran dosyalar                            */
/* ------------------------------------------------------------------ */

export type Gorsel = {
  dosya: string;
  yol: string;
  alt: string;
  /** CSS aspect-ratio değeri — kutu önceden rezerve edilir (CLS 0). */
  oran: string;
  /** genişlik / yükseklik (sayısal) — hangi kutuya uyduğunu seçmek için. */
  oranSayi: number;
  genislik: number;
  yukseklik: number;
  /** Dar ve uzun bir mobil ekran görüntüsü mü (telefon çerçevesine girer). */
  telefonMu: boolean;
};

/** Künyede kayıtlı fotoğrafı ölçüsü ve açıklamasıyla döndürür; yoksa null. */
export function fotoBilgisi(dosya: string | undefined): Gorsel | null {
  if (!dosya) return null;
  const kayit = KUNYE.get(dosya);
  if (!kayit?.genislik || !kayit.yukseklik) return null;
  return {
    dosya,
    yol: medyaYolu(dosya),
    alt: [kayit.marka, kayit.baslik].filter(Boolean).join(' — ') || dosya,
    oran: `${kayit.genislik} / ${kayit.yukseklik}`,
    oranSayi: kayit.genislik / kayit.yukseklik,
    genislik: kayit.genislik,
    yukseklik: kayit.yukseklik,
    telefonMu: kayit.yukseklik / kayit.genislik >= 1.9 && dosya.includes('mobil'),
  };
}

/** Videonun kutu oranı — künyedeki gerçek ölçüden. */
export function videoOrani(dosya: string | undefined): 'yatay' | 'dikey' {
  const kayit = dosya ? KUNYE.get(dosya) : undefined;
  return kayit?.genislik && kayit.yukseklik && kayit.yukseklik > kayit.genislik ? 'dikey' : 'yatay';
}

/** Vakanın künyede GERÇEKTEN duran fotoğrafları. */
export function vakaFotograflari(vaka: Vaka | undefined): Gorsel[] {
  return (vaka?.medya.foto ?? []).map(fotoBilgisi).filter((g): g is Gorsel => Boolean(g));
}

/**
 * Hedef orana (genişlik/yükseklik) en yakın fotoğraf. Kutu oranı sabit
 * olduğu için en az kırpılan kare seçilir — "cover" ile yarısı kesilmiş
 * fotoğraf göstermemenin tek yolu bu.
 */
export function oranaUygun(gorseller: Gorsel[], hedef: number): Gorsel | null {
  if (!gorseller.length) return null;
  return [...gorseller].sort(
    (a, b) => Math.abs(Math.log(a.oranSayi / hedef)) - Math.abs(Math.log(b.oranSayi / hedef)),
  )[0];
}

/**
 * Yazılım tarafını GÖSTEREN kare: canlı sitenin / QR menünün / formun
 * ekran görüntüsü. Dosya adından anlaşılır; yoksa null döner ve örnek iş
 * bölümü videoya ya da tipografiye düşer.
 */
const ARAYUZ_IZI = /(qr-menu|web-mobil|mobil-form|masaustu|-form\b)/;

export function vakaArayuzu(vaka: Vaka | undefined): Gorsel | null {
  return vakaFotograflari(vaka).find((g) => ARAYUZ_IZI.test(g.dosya)) ?? null;
}

/**
 * Stüdyo kanadının kolajı — en çok dört kare. Arayüz/ekran görüntüleri
 * BURAYA GİRMEZ: onlar yazılım tarafının kanıtı, stüdyonun değil.
 */
export function vakaKolaji(vaka: Vaka | undefined, haric: string[] = []): Gorsel[] {
  return vakaFotograflari(vaka)
    .filter((g) => !haric.includes(g.dosya) && !ARAYUZ_IZI.test(g.dosya))
    .slice(0, 4);
}

/* ------------------------------------------------------------------ */
/* Tipografi — uzun paragrafı kırmak (METİN DEĞİŞMEZ, yalnız düzen)    */
/* ------------------------------------------------------------------ */

/**
 * Paragrafın ilk cümlesini ayırır: ilki büyük puntoda "giriş", kalanı
 * normal gövde olur. Tek kelime bile değişmez, yalnız ölçek değişir.
 * Cümle sonu bulunamazsa metin olduğu gibi tek parça döner.
 */
export function cumleAyir(metin: string): [string, string] {
  const eslesme = /^([\s\S]+?[.!?])\s+([\s\S]+)$/.exec(metin);
  return eslesme ? [eslesme[1], eslesme[2]] : [metin, ''];
}
