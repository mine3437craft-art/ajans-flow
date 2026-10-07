/**
 * Hizmet hub'ının gruplaması ve ikon eşlemesi.
 *
 * `src/lib/site-icerik.ts` içindeki HIZMETLER düz bir liste; on beş hizmeti
 * okunur dört öbeğe burada ayırıyoruz. METİN KAYNAĞI DEĞİL: hizmet adı,
 * özeti ve gövdesi her zaman içerik dosyasından okunur; burada yalnızca
 * öbek başlığı, bant rengi ve ikon durur.
 *
 * Bant kuralı (SITE-TASARIM.md §3): kâğıt = stüdyo işleri, koyu = yazılım
 * işleri, beyaz = nötr ara. `bant` detay sayfasının hero'sunda, `bantHub`
 * hub'daki öbek bölümünde kullanılır.
 */

import type { AkisSekli } from '@/components/site/AkisHatti';
import type { Bant } from '@/components/site/Bolum';
import type { IkonAdi } from '@/components/site/Ikonlar';
import { HIZMETLER, type Hizmet } from '@/lib/site-icerik';

/**
 * Öbeğin GÖRSEL REJİMİ — hub'da her öbek farklı bir yüzeyde ve farklı bir
 * ritimde yaşar, böylece sayfa "düz kart ızgarası" olmaktan çıkar:
 *
 *   kagit → kâğıt bandı, editoryal: iki büyük öncü kart + ince çizgili
 *           numaralı satır listesi. Ölçek farkı burada kurulur.
 *   veri  → mono veri şeridi: her hizmet bir satır, kapsam/adım/paket
 *           sayıları tabular rakamla. Rakamlar İÇERİKTEN SAYILIR,
 *           uydurma yok.
 *   plaka → koyu plaka: devasa tek kelime + telefon çerçevesinde gerçek
 *           ürün ekranı. Sayfanın "nefes kesen" ikinci anı.
 *   imza  → tek hizmetlik geniş imza şeridi: logo vitrini + ok.
 */
export type GrupRejimi = 'kagit' | 'veri' | 'plaka' | 'imza';

export type HizmetGrubu = {
  anahtar: string;
  /** Bölüm başlığı */
  ad: string;
  /** Mono üst etiket */
  ustEtiket: string;
  /** Bölüm girişi */
  giris: string;
  /** Hub'daki çapa bağlantısının kısa etiketi */
  cipEtiketi: string;
  /** Detay sayfası hero bandı */
  bant: Bant;
  /** Hub'daki öbek bandı */
  bantHub: Bant;
  /** Hub'daki görsel rejim (yukarıdaki tabloya bak) */
  rejim: GrupRejimi;
  /**
   * Devasa tek kelime — öbek adının İÇİNDEN alınır, yeni metin değil.
   * Yalnız `plaka` ve `imza` rejimlerinde basılır.
   */
  anahtarKelime: string;
  akis: AkisSekli;
  /** HIZMETLER içindeki `anahtar` değerleri — sıra sayfada görünen sıradır. */
  hizmetler: string[];
};

export const HIZMET_GRUPLARI: HizmetGrubu[] = [
  {
    anahtar: 'sosyal-produksiyon',
    ad: 'Sosyal medya ve prodüksiyon',
    ustEtiket: 'Grup 01 · Stüdyo',
    giris:
      'Hesabın planı, çekimi, kurgusu ve yayını aynı ekipte. Plan ayrı yerde, çekim ayrı yerde yapıldığında içerik takvimi ilk ayda dağılıyor; bu yüzden hepsini bir arada tutuyoruz.',
    cipEtiketi: 'Sosyal ve prodüksiyon',
    bant: 'kagit',
    bantHub: 'kagit',
    rejim: 'kagit',
    anahtarKelime: 'Prodüksiyon',
    akis: 'duz',
    hizmetler: ['sosyal-medya', 'tiktok', 'icerik-stratejisi', 'buyume', 'fotograf', 'video', 'kurgu-edit', 'drone'],
  },
  {
    anahtar: 'reklam-olcum',
    ad: 'Reklam yönetimi ve ölçüm',
    ustEtiket: 'Grup 02 · Reklam',
    giris:
      'Reklam bütçesi hizmet bedelinden ayrıdır ve harcanan paranın nereye gittiğini görmeniz gerekir. Kurulumu, kampanyayı ve ölçümü birlikte kuruyoruz; tahminle değil rakamla konuşuyoruz.',
    cipEtiketi: 'Reklam ve ölçüm',
    bant: 'kagit',
    bantHub: 'beyaz',
    rejim: 'veri',
    anahtarKelime: 'Reklam',
    akis: 'veri',
    hizmetler: ['meta-reklam', 'google-ads', 'google-isletme', 'veri-analizi'],
  },
  {
    anahtar: 'web-yazilim',
    ad: 'Web sitesi ve yazılım',
    ustEtiket: 'Grup 03 · Yazılım',
    giris:
      'Ajansın ayırt edici tarafı burası: hazır şablon yetmediğinde kodu kendimiz yazıyoruz. Reklamın bağlandığı sayfayı da, menünün çalıştığı sistemi de aynı ekip kuruyor.',
    cipEtiketi: 'Web ve yazılım',
    bant: 'koyu',
    bantHub: 'koyu',
    rejim: 'plaka',
    anahtarKelime: 'Yazılım',
    akis: 'kare',
    hizmetler: ['web-sitesi', 'qr-menu'],
  },
  {
    anahtar: 'tasarim',
    ad: 'Tasarım',
    ustEtiket: 'Grup 04 · Tasarım',
    giris:
      'Logo, menü, katalog ve sosyal medya şablonları aynı kuralla çizildiğinde marka her yerde aynı dili konuşuyor. Kimlik işini çekim ve web işinden ayrı tutmuyoruz.',
    cipEtiketi: 'Tasarım',
    bant: 'kagit',
    bantHub: 'kagit',
    rejim: 'imza',
    anahtarKelime: 'Tasarım',
    akis: 'imza',
    hizmetler: ['kurumsal-kimlik'],
  },
];

/** Hizmet anahtarı → tasarım sistemindeki ikon adı. */
const IKON: Record<string, IkonAdi> = {
  'sosyal-medya': 'instagram',
  'icerik-stratejisi': 'menu',
  buyume: 'arti',
  fotograf: 'kamera',
  video: 'oynat',
  tiktok: 'oynat',
  'kurgu-edit': 'kamera',
  drone: 'drone',
  'meta-reklam': 'megafon',
  'google-ads': 'arama',
  'google-isletme': 'konum',
  'veri-analizi': 'grafik',
  'web-sitesi': 'kod',
  'qr-menu': 'qr',
  'kurumsal-kimlik': 'kalem',
};

export function hizmetIkonu(anahtar: string): IkonAdi {
  return IKON[anahtar] ?? 'kutu';
}

/** Öbeğin hizmetlerini veri sırasıyla, gerçek nesne olarak döndürür. */
export function grupHizmetleri(grup: HizmetGrubu): Hizmet[] {
  return grup.hizmetler
    .map((anahtar) => HIZMETLER.find((h) => h.anahtar === anahtar))
    .filter((h): h is Hizmet => Boolean(h));
}

/** Bir hizmetin bağlı olduğu öbek. */
export function hizmetGrubu(anahtar: string): HizmetGrubu | undefined {
  return HIZMET_GRUPLARI.find((g) => g.hizmetler.includes(anahtar));
}

/* ====================================================================
   GÖRSEL YÜKSELTME — hub'ın ölçek farkı için yardımcılar
   ==================================================================== */

/**
 * Öbeğin mozaiğinde basılacak GERÇEK dosyalar (`public/site/medya/kunye.json`).
 * Oranları bilerek farklıdır: kare + geniş + dikey yan yana durunca ızgara
 * "şablon" gibi okunmaz. Künyede olmayan dosya `medya.ts` tarafından
 * sessizce düşürülür; burada uydurma ad YOK.
 *
 * Reklam öbeğinin mozaiği YOKTUR: reklam işinin gösterilecek bir karesi
 * yok, o öbek veri şeridiyle anlatılır.
 */
export const GRUP_MOZAIK: Record<string, readonly string[]> = {
  'sosyal-produksiyon': [
    'foto/kok-cafe-izgara-pirzola.jpg', // 1003×1003 — kare
    'foto/mas-gokart-pist-drone-01.jpg', // 1024×576  — geniş
    'foto/kok-cafe-reels-burger-sunumu.jpg', // 720×1280  — dikey
  ],
  'web-yazilim': [
    'foto/maymotors-web-mobil-form.jpg', // 739×1600 — telefon
    'foto/kule-istanbul-qr-menu-mobil.jpg', // 390×844  — telefon
  ],
  tasarim: [
    'logo/kule-istanbul-cafe-logo.png', // 195×120 — logo vitrini
    'foto/coin-coffee-sosyal-medya-tasarimi.jpg', // 720×900 — şablon karesi
  ],
};

/**
 * Sayının Türkçe yazımı. Hizmet sayısı ARTIK ELDE YAZILMIYOR: başlıklar
 * `HIZMETLER.length`ten türetiliyor, böylece içeriğe yeni hizmet eklenince
 * sayfadaki "on üç" gibi bir ifade yanlış kalmıyor.
 */
const SAYI_YAZI: Record<number, string> = {
  10: 'On',
  11: 'On bir',
  12: 'On iki',
  13: 'On üç',
  14: 'On dört',
  15: 'On beş',
  16: 'On altı',
  17: 'On yedi',
  18: 'On sekiz',
  19: 'On dokuz',
  20: 'Yirmi',
};

/** "On beş" — bilinmeyen sayıda rakama düşer ("21"). */
export function sayiYazi(n: number): string {
  return SAYI_YAZI[n] ?? String(n);
}

/** Hizmet sayısının yazısı: "On beş" */
export const HIZMET_SAYISI_YAZI = sayiYazi(HIZMETLER.length);
