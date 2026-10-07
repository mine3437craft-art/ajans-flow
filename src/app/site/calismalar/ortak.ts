/**
 * Çalışmalar (vaka) sayfalarının ortak türetmeleri.
 *
 * Metin üretmez: bütün içerik `src/lib/site-icerik.ts` içindeki VAKALAR,
 * HIZMETLER ve SEKTORLER verisinden, bütün medya `kunye.json` künyesinden
 * gelir. Burada yalnızca "hangi kare nerede durur", "hangi logo hangi
 * zeminde okunur", "hangi vaka hangi sektöre denk gelir" hesaplanır.
 */
import {
  HIZMETLER,
  SEKTORLER,
  VAKALAR,
  hizmetBul,
  type Sektor,
  type Vaka,
} from '@/lib/site-icerik';
/* Otomotiv ürün sayfaları (okuma amaçlı): May Motors vakasından üç ürün
   sayfasına köprü kuruyoruz. Slug'lar derleme zamanında doğrulanır. */
import { URUNLER } from '../otomotiv-yazilimlari/icerik';
import { siteAdresi } from '@/lib/site';
import { VARSAYILAN_MARKALAR, type MarkaYazi } from '@/components/site/MarkaSeridi';
import type { IkonAdi } from '@/components/site/Ikonlar';
import {
  ekranMi,
  markaKayitlari,
  medyaKaydi,
  medyaKayitlari,
  oran,
  posterAdi,
  type MedyaKaydi,
} from './medya';

/** Ziyaretçinin gördüğü yol (proxy başına `/site` ekler). */
export const CALISMALAR_YOLU = '/calismalar';

/** JSON-LD ve paylaşım kartları için tam adres (kök layout ile aynı biçim). */
export function tamAdres(yol = ''): string {
  return `${siteAdresi()}${yol}`;
}

/* ------------------------------------------------------------------ */
/* Hizmet → ikon                                                       */
/* ------------------------------------------------------------------ */

const HIZMET_IKONLARI: Record<string, IkonAdi> = {
  'sosyal-medya': 'instagram',
  'icerik-stratejisi': 'menu',
  fotograf: 'kamera',
  video: 'oynat',
  tiktok: 'oynat',
  'kurgu-edit': 'kamera',
  drone: 'drone',
  'meta-reklam': 'megafon',
  'google-ads': 'arama',
  'google-isletme': 'konum',
  'web-sitesi': 'kod',
  'qr-menu': 'qr',
  'kurumsal-kimlik': 'kalem',
  buyume: 'grafik',
  'veri-analizi': 'grafik',
};

export function hizmetIkonu(anahtar: string): IkonAdi {
  return HIZMET_IKONLARI[anahtar] ?? 'kutu';
}

/* ------------------------------------------------------------------ */
/* Sektör eşlemesi                                                     */
/* ------------------------------------------------------------------ */

/**
 * Vakanın denk geldiği sektör sayfaları: sektörün `ornekIs` alanı bu vakayı
 * gösteriyorsa ya da sektör adı vakanın sektör adıyla aynıysa.
 */
export function vakaSektorleri(vaka: Vaka): Sektor[] {
  const ad = vaka.sektor.toLocaleLowerCase('tr');
  return SEKTORLER.filter(
    (s) => s.ornekIs?.vakaSlug === vaka.slug || s.ad.toLocaleLowerCase('tr') === ad,
  );
}

/** Ana sayfadaki sektör kapısının CSS'le okuduğu anahtarlar. */
export function vakaSektorAnahtarlari(vaka: Vaka): string[] {
  return vakaSektorleri(vaka).map((s) => s.anahtar);
}

/** Sektör kapısı seçimine tepki verecek sektörler (en az bir vakası olan). */
export const KAPILI_SEKTORLER: Sektor[] = SEKTORLER.filter((s) =>
  VAKALAR.some((v) => vakaSektorAnahtarlari(v).includes(s.anahtar)),
);

/* ------------------------------------------------------------------ */
/* Logolar                                                             */
/* ------------------------------------------------------------------ */

/**
 * Logonun okunduğu zemin — dosyalar tek tek ölçüldü:
 *   'koyu' = beyaz mürekkep, KOYU zemin ister
 *   'acik' = koyu mürekkep, AÇIK zemin ister
 * Listede olmayan logo hiç basılmaz; yerine tipografik kelime-işaret
 * çıkar (yanlış zeminde kaybolan logo riski yok).
 */
export type LogoTonu = 'acik' | 'koyu';

const LOGO_TONU: Record<string, LogoTonu> = {
  'logo/masgokart-logo.png': 'acik',
  'logo/masgokart-logo-beyaz.png': 'koyu',
  'logo/maymotors-logo-yatay.svg': 'koyu',
  'logo/maymotors-logo-beyaz.svg': 'koyu',
  'logo/maymotors-simge.svg': 'koyu',
  'logo/maymotors-simge-raster.png': 'koyu',
  'logo/kule-istanbul-cafe-logo.png': 'koyu',
  'logo/kule-istanbul-cafe-amblem.png': 'acik',
  'logo/kok-cafe-lounge-logo.png': 'koyu',
  'logo/minik-starlar-ligi-amblem.png': 'acik',
  'logo/airsoft-istinye-logo.png': 'acik',
  'logo/mancurya-bufe-logo.png': 'acik',
  'logo/teras-kilyos-logo.png': 'acik',
};

export type VakaLogosu = { kayit: MedyaKaydi; ton: LogoTonu };

export function vakaLogosu(vaka: Vaka): VakaLogosu | undefined {
  const dosya = vaka.medya.logo;
  const kayit = medyaKaydi(dosya);
  const ton = dosya ? LOGO_TONU[dosya] : undefined;
  return kayit && ton ? { kayit, ton } : undefined;
}

/** Logosu olmayan marka: marka şeridiyle aynı tipografik varyant. */
export function markaYaziVaryanti(marka: string): MarkaYazi {
  return VARSAYILAN_MARKALAR.find((m) => m.ad === marka)?.yazi ?? 'serif';
}

/* ------------------------------------------------------------------ */
/* Kapak karesi                                                        */
/* ------------------------------------------------------------------ */

/** Izgara kartında en iyi duran kare (hepsi künyede var). */
const KAPAK_SECIMI: Record<string, string> = {
  'kule-istanbul-cafe': 'foto/kule-istanbul-qr-menu-masaustu.jpg',
};

export function vakaKapagi(vaka: Vaka): MedyaKaydi | undefined {
  return (
    medyaKaydi(KAPAK_SECIMI[vaka.slug]) ??
    medyaKaydi(vaka.medya.poster) ??
    medyaKayitlari(vaka.medya.foto)[0]
  );
}

/* ------------------------------------------------------------------ */
/* Medya bölümleri                                                     */
/* ------------------------------------------------------------------ */

export type VakaKlibi = {
  kayit: MedyaKaydi;
  /** Künyede gerçekten duran poster (yoksa Video bileşeni türetmez). */
  poster?: string;
  /** 'yatay' | 'dikey' | 'kare' — kutu oranı bununla kilitlenir. */
  oran: 'yatay' | 'dikey' | 'kare';
};

/** Bento gözü: sütun ve satır açıklığı CSS'e inline yazılır. */
export type BentoGozu = {
  kayit: MedyaKaydi;
  en: 1 | 2;
  boy: 1 | 2;
  /** Afiş / tasarım karesi: kırpılmaz, kutuya sığdırılır (metni kesilmesin). */
  sigdir: boolean;
};

export type VakaMedyasi = {
  klipler: VakaKlibi[];
  /** Cihaz çerçevesine girecek ürün ekranları. */
  cihazlar: MedyaKaydi[];
  /** Farklı ölçeklerde dizilen kareler (bento). */
  bento: BentoGozu[];
  klipSayi: number;
  kareSayi: number;
  toplam: number;
};

/** Sayfada aynı anda tek video oynuyor; ikiden fazlası hem bant hem GPU. */
const EN_COK_KLIP = 2;

/**
 * Afiş, kampanya görseli, sosyal medya tasarımı ve marka kartı: içinde
 * YAZI olan kareler. Bunlar kırpılmaz — `object-fit: contain` ile kutuya
 * sığdırılır, yoksa başlığın yarısı kesilir.
 */
function grafikMi(k: MedyaKaydi): boolean {
  return /afi[sş]|tasar[ıi]m|kampanya|marka kart|jenerik/i.test(k.baslik ?? '');
}

/**
 * Vakanın klipleri. Önce `VAKALAR[].medya.video` (içerik ajanının seçtiği
 * ana klip), sonra künyede aynı markaya ait diğer klipler. Künye tek
 * doğruluk kaynağı: dosya silinirse kare sessizce düşer.
 */
export function vakaKlipleri(vaka: Vaka, enCok = EN_COK_KLIP): VakaKlibi[] {
  const ana = medyaKaydi(vaka.medya.video);
  const sira = [...(ana ? [ana] : []), ...markaKayitlari(vaka.marka, 'video')];
  const gorulen = new Set<string>();
  const klipler: VakaKlibi[] = [];
  for (const kayit of sira) {
    if (gorulen.has(kayit.dosya)) continue;
    gorulen.add(kayit.dosya);
    const o = oran(kayit);
    klipler.push({
      kayit,
      poster: posterAdi(kayit),
      oran: o >= 1.5 ? 'yatay' : o <= 0.7 ? 'dikey' : 'kare',
    });
    if (klipler.length >= enCok) break;
  }
  return klipler;
}

/** Vakanın kareleri: içerik sırası önce, markanın künyedeki kalanı sonra. */
export function vakaKareleri(vaka: Vaka): MedyaKaydi[] {
  const sirali = medyaKayitlari(vaka.medya.foto);
  const gorulen = new Set(sirali.map((k) => k.dosya));
  return [...sirali, ...markaKayitlari(vaka.marka, 'foto').filter((k) => !gorulen.has(k.dosya))];
}

/**
 * Bento ölçüsü. Gözler KARE (satır yüksekliği sütun genişliğine eşit,
 * sayfa.css'te saf CSS uzunluklarıyla kuruluyor), dolayısıyla:
 *   (2×1) ≈ 2,07  ·  (1×1) ≈ 1,00  ·  (1×2) ≈ 0,50  ·  (2×2) ≈ 1,00
 * Kare kendi oranına en yakın göze yerleşir; kırpma en aza iner.
 * Değerler CSS uzunluğundan geldiği için görsel yüklenmeden önce de
 * kutu rezervedir → CLS 0.
 */
export function bentoOlcu(kayit: MedyaKaydi, vurgulu = false): BentoGozu {
  const o = oran(kayit);
  const sigdir = grafikMi(kayit);
  if (vurgulu) return { kayit, en: 2, boy: 2, sigdir };
  if (o >= 1.75) return { kayit, en: 2, boy: 1, sigdir };
  if (o <= 0.78) return { kayit, en: 1, boy: 2, sigdir };
  return { kayit, en: 1, boy: 1, sigdir };
}

export function vakaMedyasi(vaka: Vaka): VakaMedyasi {
  const klipler = vakaKlipleri(vaka);
  const kareler = vakaKareleri(vaka);
  const cihazlar: MedyaKaydi[] = [];
  const bentoya: MedyaKaydi[] = [];

  for (const kare of kareler) {
    const o = oran(kare);
    // Telefon çerçevesi 390/844, dizüstü 16/10: ekran karesi ancak orana
    // uyuyorsa çerçeveye girer, uymayan kare kırpılmasın diye bentoya gider.
    if (ekranMi(kare) && (o <= 0.6 || (o >= 1.3 && o <= 2.4))) cihazlar.push(kare);
    else bentoya.push(kare);
  }

  // Vurgulu göz (2×2) KARE bir göz olduğu için yalnız gerçekten kareye
  // yakın bir fotoğrafa verilir; yoksa çapa yok (dikey bir kareyi 2×2'ye
  // koymak karenin dörtte birini keserdi).
  const capa =
    bentoya.length >= 4
      ? bentoya.find((k) => {
          const o = oran(k);
          return o >= 0.9 && o <= 1.15;
        })
      : undefined;
  const bento = bentoya.map((k) => bentoOlcu(k, k === capa));

  return {
    klipler,
    cihazlar,
    bento,
    klipSayi: klipler.length,
    kareSayi: kareler.length,
    toplam: klipler.length + kareler.length,
  };
}

/** Cihaz çerçevesi türü. */
export function cihazTuru(kare: MedyaKaydi): 'telefon' | 'dizustu' {
  return oran(kare) <= 0.6 ? 'telefon' : 'dizustu';
}

/* ------------------------------------------------------------------ */
/* Filtre (hizmete göre)                                               */
/* ------------------------------------------------------------------ */

export type Filtre = { anahtar: string; etiket: string; sayi: number };

/** Vakalarda gerçekten geçen hizmetler, çok geçenden aza doğru. */
export const FILTRELER: Filtre[] = HIZMETLER.map((h) => ({
  anahtar: h.anahtar,
  etiket: h.kisaAd,
  sayi: VAKALAR.filter((v) => v.hizmetler.includes(h.anahtar)).length,
}))
  .filter((f) => f.sayi > 0)
  .sort((a, b) => b.sayi - a.sayi);

/* ------------------------------------------------------------------ */
/* Diğer yardımcılar                                                   */
/* ------------------------------------------------------------------ */

/** Aynı sektör, sonra en çok hizmeti paylaşan vakalar. */
export function digerVakalar(vaka: Vaka, adet = 3): Vaka[] {
  const sektorler = new Set(vakaSektorAnahtarlari(vaka));
  return VAKALAR.filter((v) => v.slug !== vaka.slug)
    .map((v) => ({
      vaka: v,
      puan:
        (vakaSektorAnahtarlari(v).some((a) => sektorler.has(a)) ? 10 : 0) +
        v.hizmetler.filter((h) => vaka.hizmetler.includes(h)).length,
    }))
    .sort((a, b) => b.puan - a.puan)
    .slice(0, adet)
    .map((x) => x.vaka);
}

/**
 * Meta açıklaması sınırına sığdır: önce cümle/öbek sonunda kesmeyi dener,
 * olmazsa kelime ortasından kesmeden üç nokta koyar.
 */
export function kisalt(metin: string, sinir = 155): string {
  if (metin.length <= sinir) return metin;
  const pencere = metin.slice(0, sinir);
  const durak = Math.max(
    pencere.lastIndexOf('. '),
    pencere.lastIndexOf('; '),
    pencere.lastIndexOf('! '),
  );
  if (durak > sinir * 0.55) return `${metin.slice(0, durak)}.`;
  const bosluk = pencere.slice(0, sinir - 1).lastIndexOf(' ');
  const govde = bosluk > sinir * 0.6 ? pencere.slice(0, bosluk) : pencere.slice(0, sinir - 1);
  return `${govde.replace(/[\s,;:.]+$/, '')}…`;
}

/** Vakalarda geçen farklı sektör ve hizmet sayısı (uydurma değil, sayım). */
export const VAKA_SAYILARI = {
  calisma: VAKALAR.length,
  sektor: new Set(VAKALAR.map((v) => v.sektor.toLocaleLowerCase('tr'))).size,
  hizmet: new Set(VAKALAR.flatMap((v) => v.hizmetler)).size,
};

/**
 * Uzun bir paragrafın ilk cümlesini ayırır: kâğıt bantta ilk cümle serif
 * aksanla (`.af-aksan`), kalanı normal metin olarak basılır. Nokta yoksa
 * ya da cümle çok uzunsa metin bölünmez.
 */
export function cumleAyir(metin: string): { ilk: string; kalan: string } {
  const yer = metin.indexOf('. ');
  if (yer < 0 || yer > 180) return { ilk: metin, kalan: '' };
  return { ilk: metin.slice(0, yer + 1), kalan: metin.slice(yer + 2).trim() };
}

/** Bağlantı etiketi için alan adı; adres bozuksa adresin kendisi. */
export function alanAdi(adres: string): string {
  try {
    return new URL(adres).hostname.replace(/^www\./, '');
  } catch {
    return adres;
  }
}

/* ==================================================================== */
/* HARF KADRAJI — tek satırlık anahtar kelime                            */
/*                                                                      */
/* SITE-GIRIS.md: kadraj ikonu SEYREK kullanılır — bir sayfada EN ÇOK    */
/* BİR kez, tek satırlık bir anahtar kelimede. Kelime UYDURULMAZ:        */
/* markanın KENDİ adından birebir alınmış tek sözcüktür (tam marka adı   */
/* ayrıca mono künyede ve <h1> bağlamında duruyor).                      */
/* ==================================================================== */

const ANAHTAR_KELIME: Record<string, string> = {
  'mas-go-kart': 'MAS',
  'may-motors': 'May',
  'kule-istanbul-cafe': 'Kule',
  'kok-cafe-lounge': 'Kök',
  'minik-starlar-ligi': 'Starlar',
  'mimar-elif-kara': 'Mimar',
};

/** Markanın adından alınmış tek sözcük (eşleşme yoksa ilk sözcük). */
export function anahtarKelime(vaka: Vaka): string {
  return ANAHTAR_KELIME[vaka.slug] ?? vaka.marka.split(' ')[0];
}

/**
 * Harflerin İÇİNE yalnızca YATAY klip girer (SITE-GIRIS.md "mutlak
 * kural"): tek satırlık açıklık ~5:1 geniştir, 404×720 dikey bir klip
 * oraya 2,5× yukarı ölçeklenir ve karenin %14'ü görünür. Arşivdeki tek
 * yatay grup MAS klipleri; dolayısıyla kadrajda video YALNIZCA MAS
 * sayfasında ve vitrin girişinde akar. Diğer beş vaka, konseptin
 * belgelenmiş durumuyla (saveData hâli) marka gradyanıyla dolar:
 * 0 bayt, marka doğru, kontrast tabanı #E2541F/#000 = 5,52:1.
 */
export const KADRAJ_KLIBI = 'video/hero-mas-gokart-gece-grid.mp4';

/** Kadraj dolgusu: 24 KB AVIF / 48 KB WebP, 1024×576 (gece gridi). */
export const KADRAJ_DOLGU_AVIF = 'poster/hk-dolgu-gece-grid.avif';
export const KADRAJ_DOLGU_WEBP = 'poster/hk-dolgu-gece-grid.webp';

/** Vakanın kadrajında klip akar mı? (yatay klibi olan marka) */
export function kadrajKlibi(vaka: Vaka): string | undefined {
  return markaKayitlari(vaka.marka, 'video').some((k) => oran(k) >= 1.5)
    ? KADRAJ_KLIBI
    : undefined;
}

/* ==================================================================== */
/* VİTRİN — liste sayfasının sinematik kartları                          */
/* ==================================================================== */

/**
 * Pencere oranı ÖLÇEK RİTMİ kurar ama keyfî seçilmez: her kart kendi
 * karesinin oranına EN YAKIN paleti alır, böylece kırpma en aza iner
 * (dikey bir afişi 16:9 pencereye sokmak afişin yarısını keserdi).
 * Değer CSS `aspect-ratio` olarak yazılır → görsel gelmeden kutu
 * rezerve, CLS 0.
 */
function oranPaleti(o: number): string {
  if (o >= 1.5) return '16 / 9';
  if (o >= 1.15) return '16 / 10';
  if (o >= 0.9) return '1 / 1';
  return '4 / 5';
}

export type VitrinPenceresi = {
  oranCss: string;
  kare?: MedyaKaydi;
  klip?: VakaKlibi;
};

/**
 * Vitrin kartının penceresi. İlk kartta (tam genişlik) maskelenmiş video
 * önizlemesi vardır — yalnız YATAY klip: dikey klip geniş pencereye 2,5×
 * ölçeklenir ve karenin %14'ü görünür.
 */
export function vitrinPenceresi(vaka: Vaka, sira: number): VitrinPenceresi {
  const klip = sira === 0 ? vitrinKlibi(vaka) : undefined;
  if (klip) return { oranCss: '16 / 9', klip };

  const elle = medyaKaydi(KAPAK_SECIMI[vaka.slug]);
  const kareler = vakaKareleri(vaka);
  // Ürün ekranı kareleri vitrinde kırpılmasın diye elenir; markanın
  // başka karesi yoksa geri alınır.
  const havuz = kareler.filter((k) => !ekranMi(k));
  const kare = elle ?? havuz[0] ?? kareler[0] ?? medyaKaydi(vaka.medya.poster);
  return { oranCss: kare ? oranPaleti(oran(kare)) : '4 / 5', kare };
}

/** Vitrinin ilk kartında maskelenmiş video önizlemesi (varsa). */
export function vitrinKlibi(vaka: Vaka): VakaKlibi | undefined {
  return vakaKlipleri(vaka, 1).find((k) => k.oran === 'yatay');
}

/* ==================================================================== */
/* ARŞİV SAYILARI — sayım, iddia değil                                   */
/* ==================================================================== */

/**
 * Veri şeridindeki rakamların tamamı SAYIMDIR: vaka sayısı veriden,
 * klip ve kare sayısı künyeden. Uydurma oran, yüzde ya da "artış" yok.
 */
export const ARSIV = {
  calisma: VAKALAR.length,
  sektor: VAKA_SAYILARI.sektor,
  hizmet: VAKA_SAYILARI.hizmet,
  klip: VAKALAR.reduce((t, v) => t + markaKayitlari(v.marka, 'video').length, 0),
  kare: VAKALAR.reduce((t, v) => t + markaKayitlari(v.marka, 'foto').length, 0),
};

/* ==================================================================== */
/* BAĞLI İŞ — vakadan ürün sayfasına köprü                               */
/* ==================================================================== */

export type BagliBaglanti = { etiket: string; yol: string; ozet?: string; birincil?: boolean };

export type BagliIs = {
  ustEtiket: string;
  baslik: string;
  giris: string;
  /** Cihaz çerçevesine girecek ekran karesi (künyeden). */
  ekran?: MedyaKaydi;
  cerceve: 'telefon' | 'dizustu';
  baglantilar: BagliBaglanti[];
};

/**
 * Yalnız iki vakada var ve ikisi de GERÇEK bir sayfaya gider:
 *   Kule İstanbul → çalışan QR menü demosu (/demo/qr-menu)
 *   May Motors    → otomotiv yazılımları ve üç ürün sayfası
 * Demo verisi örnektir (demo-menu.ts başında yazılı); o yüzden dil
 * "bu markanın menüsü" değil "aynı sistemin demosu".
 */
export function bagliIs(vaka: Vaka): BagliIs | undefined {
  if (vaka.slug === 'kule-istanbul-cafe') {
    return {
      ustEtiket: 'Çalışan demo',
      baslik: 'Aynı sistemi şimdi elinizde açın.',
      giris:
        'Bu iş için kurduğumuz menü sisteminin çalışan bir demosu sitede duruyor: dört dil, anlık arama, alerjenden hesaplanan diyet filtreleri. Demodaki işletme ve ürünler örnektir, müşteri verisi görünmez.',
      ekran: medyaKaydi('foto/kule-istanbul-qr-menu-mobil.jpg'),
      cerceve: 'telefon',
      baglantilar: [
        { etiket: 'Çalışan demoyu açın', yol: '/demo/qr-menu', birincil: true },
        {
          etiket: 'QR dijital menü hizmeti',
          yol: '/qr-menu',
          ozet: hizmetBul('qr-menu')?.ozet,
        },
      ],
    };
  }
  if (vaka.slug === 'may-motors') {
    return {
      ustEtiket: 'Yazılım tarafı',
      baslik: 'Bu galerinin dijital zinciri üç ayrı akış.',
      giris:
        'Değerleme, ilan hazırlama ve galeri muhasebesi aynı işin parçaları. Her birinin nasıl çalıştığını — ekran ekran, örnek damgalı — otomotiv yazılımları sayfalarında yazdık.',
      ekran: medyaKaydi('foto/maymotors-web-mobil-form.jpg'),
      cerceve: 'telefon',
      baglantilar: [
        { etiket: 'Otomotiv yazılımları', yol: '/otomotiv-yazilimlari', birincil: true },
        ...URUNLER.map((u) => ({
          etiket: u.kisaAd,
          yol: `/otomotiv-yazilimlari/${u.slug}`,
          ozet: u.ozet,
        })),
      ],
    };
  }
  return undefined;
}
