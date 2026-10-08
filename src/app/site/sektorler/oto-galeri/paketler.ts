/**
 * Oto galeri SUNUM sayfasının kendi verisi.
 *
 * Bu dosya yeni bilgi UYDURMAZ: bütün maddeler zaten yayında olan üç
 * kaynaktan derlenmiştir —
 *   · `src/lib/site-icerik.ts` → SEKTORLER['oto-galeri'].webTarafi
 *   · `src/lib/site-icerik.ts` → VAKALAR['may-motors'].yaptiklarimiz
 *   · `src/app/site/otomotiv-yazilimlari/icerik.ts` → URUNLER
 * Fiyat, süre, yüzde, müşteri yorumu ve ödül BURAYA GİRMEZ.
 *
 * Ekran görüntülerinin künyesi: `public/site/medya/urun/kunye.json`.
 * Hepsi yerelde yalnız DEMO veriyle çekildi; sayfada her birinin yanında
 * "örnek veri" damgası zorunludur.
 */

import type { IkonAdi } from '@/components/site/Ikonlar';

/** `public/site/medya/urun/` altındaki bir ekran görüntüsü. */
export type Ekran = {
  /** Uzantısız dosya adı; `.avif` + `.jpg` ikizi vardır. */
  ad: string;
  genislik: number;
  yukseklik: number;
  /** Ekran okuyucuya giden açıklama. */
  alt: string;
  /** Çerçevenin altındaki mono altyazı. */
  altyazi: string;
};

export type Paket = {
  no: string;
  /** Sayfa içi çapa. */
  anahtar: string;
  ad: string;
  /** Menüde ve rayda görünen kısa ad. */
  kisaAd: string;
  simge: IkonAdi;
  /** Tek cümle: ne işe yarıyor. */
  neIseYarar: string;
  /** Rayda görünen tek satır. */
  raySatiri: string;
  /** Kartta madde madde kapsam. */
  kapsam: string[];
  /** `/otomotiv-yazilimlari/<urun>` alt sayfası. */
  urunYolu: string;
  urunEtiketi: string;
  /** Kartın içindeki telefon ekranı. */
  kartEkrani: Ekran;
};

/* ------------------------------------------------------------------ */
/* Ekran görüntüleri                                                   */
/* ------------------------------------------------------------------ */

const TEL = { genislik: 390, yukseklik: 844 } as const;
const MAS = { genislik: 1280, yukseklik: 800 } as const;

export const EKRANLAR = {
  satFiyatTelefon: {
    ...TEL,
    ad: 'maymotors-aracini-sat-fiyat-telefon',
    alt: 'May Motors sitesinin “Aracını Sat” akışının son adımı: örnek bir araç için tahmini nakit alış fiyatı ve randevu düğmesi. Ekrandaki bütün değerler örnek veridir.',
    altyazi: 'Aracını Sat · fiyat tahmini',
  },
  satFiyatMasaustu: {
    ...MAS,
    ad: 'maymotors-aracini-sat-fiyat-masaustu',
    alt: 'May Motors sitesinin “Aracını Sat” akışı masaüstünde: beş adımlı ilerleme rayı ve tahmini nakit alış fiyatı. Ekrandaki bütün değerler örnek veridir.',
    altyazi: 'Aracını Sat · beş adım',
  },
  degerlemeMasaustu: {
    ...MAS,
    ad: 'may-degerleme-masaustu',
    alt: 'Galerinin içeride kullandığı değerleme ekranı: 13 parçalı kaporta şeması, sonuç kutusu, fiyat kırıcılar tablosu ve dayanak ilan listesi. Ekrandaki bütün değerler örnek veridir.',
    altyazi: 'Dükkandaki değerleme ekranı',
  },
  finansOzetTelefon: {
    ...TEL,
    ad: 'may-finans-ozet-telefon',
    alt: 'Galeri muhasebesinin telefon özeti: günün geliri, gideri, nakit ve kart ayrımı ile ayın net kârı. Ekrandaki bütün tutarlar örnek veridir.',
    altyazi: 'Telefonda günlük özet',
  },
  finansKayitlarTelefon: {
    ...TEL,
    ad: 'may-finans-kayitlar-telefon',
    alt: 'Gelir-gider kayıtları telefon görünümünde: kategori, açıklama, tarih ve ödeme yöntemi. Ekrandaki bütün tutarlar örnek veridir.',
    altyazi: 'Kayıtlar',
  },
  finansGirisTelefon: {
    ...TEL,
    ad: 'may-finans-veri-girisi-telefon',
    alt: 'Telefondan hızlı gelir-gider kaydı: gelir veya gider, nakit veya kart, tarih, kategori ve tutar alanları. Ekrandaki bütün değerler örnek veridir.',
    altyazi: 'Hızlı kayıt',
  },
  finansAylikMasaustu: {
    ...MAS,
    ad: 'may-finans-aylik-analiz-masaustu',
    alt: 'Galeri muhasebesinin aylık analiz ekranı: yıllık gelir, gider ve net kâr kartları ile 12 aylık gelir-gider-net kâr grafiği. Ekrandaki bütün tutarlar örnek veridir.',
    altyazi: 'Aylık analiz',
  },
  finansAracMasaustu: {
    ...MAS,
    ad: 'may-finans-arac-alim-satim-masaustu',
    alt: 'Araç alım-satım takibi: stok ve satılan araç sayıları, ciro, net kâr; araç kartlarında maliyet, ortak payları ve muayene tarihi. Plakalar “34 DEMO 01” biçiminde örnek veridir.',
    altyazi: 'Araç alım-satım ve kârlılık',
  },
  finansKasaMasaustu: {
    ...MAS,
    ad: 'may-finans-ortak-kasalari-masaustu',
    alt: 'Ortak kasaları ekranı: ortak bazında kasa bakiyesi, araç başına ortalama kâr ve avans ile para giriş-çıkış geçmişi. Ortak adları ve tutarlar örnek veridir.',
    altyazi: 'Ortak kasaları',
  },
  ilanKimlikTelefon: {
    ...TEL,
    ad: 'maymotors-ilan-kimlik-telefon',
    alt: 'İlan sihirbazının birinci adımı: stoktan seçme ya da ruhsattan okuma, marka ve model çipleri, versiyon alanı. Ekrandaki bütün değerler örnek veridir.',
    altyazi: '1/6 · Araç kimliği',
  },
  ilanHasarTelefon: {
    ...TEL,
    ad: 'maymotors-ilan-hasar-telefon',
    alt: 'İlan sihirbazının hasar adımı: araç şeması üzerinde parçaya dokunarak orijinal, lokal boyalı, boyalı ya da değişen işaretleme. Ekrandaki bütün değerler örnek veridir.',
    altyazi: '3/6 · Hasar ve ekspertiz',
  },
  ilanOnizlemeTelefon: {
    ...TEL,
    ad: 'maymotors-ilan-onizleme-telefon',
    alt: 'İlanın müşteriye nasıl görüneceğinin önizlemesi: fiyat, rozetler ve teknik özellik tablosu. Ekrandaki bütün değerler örnek veridir.',
    altyazi: 'Müşterinin göreceği ilan',
  },
} as const satisfies Record<string, Ekran>;

/** Sayfada kaç ekran görüntüsü var — veri şeridi bunu sayar, elle yazılmaz. */
export const EKRAN_SAYISI = Object.keys(EKRANLAR).length;

/* ------------------------------------------------------------------ */
/* Üç paket                                                            */
/* ------------------------------------------------------------------ */

export const PAKETLER: Paket[] = [
  {
    no: '01',
    anahtar: 'web-sitesi',
    ad: 'Galeriye özel web sitesi',
    kisaAd: 'Web sitesi',
    simge: 'kod',
    neIseYarar:
      'Aracını satmak isteyen kişi galeriye gelmeden bir fiyat fikri alıyor, araç arayan kişi stoğu sitede geziyor. İki talep de aynı panele düşüyor.',
    raySatiri: 'Araç vitrini, “Aracını Sat” akışı ve galerinin kendi yönetim paneli',
    kapsam: [
      'Satılık ve kiralık araç vitrini: filtreli liste ve araç detay sayfaları',
      '“Aracını Sat” akışı: basamaklı araç seçimi, kaporta durumu ve tahmini nakit alış fiyatı',
      'Araç değerleme formu: 13 parçalı kaporta şeması, hasar kaydı ve donanım bilgisi',
      'Sahte form gönderimini kesen telefon doğrulaması',
      'Galerinin kendi yönetim paneli: araç ekleme, fotoğraf yükleme, satıldı işaretleme',
      'Telefon öncelikli tasarım; arama ve WhatsApp düğmeleri her ekranda elin altında',
    ],
    urunYolu: '/otomotiv-yazilimlari/arac-degerleme',
    urunEtiketi: 'Değerleme akışı',
    kartEkrani: EKRANLAR.satFiyatTelefon,
  },
  {
    no: '02',
    anahtar: 'muhasebe',
    ad: 'Muhasebe ve finans takibi',
    kisaAd: 'Muhasebe',
    simge: 'grafik',
    neIseYarar:
      '“Bu araç kâr etti mi, kimin kasasına yazılıyor?” sorusu tartışma yerine tabloya bağlanıyor. Kayıt telefondan, analiz bilgisayardan.',
    raySatiri: 'Araç bazlı kârlılık, gelir-gider, ortak kasaları ve taksit takibi',
    kapsam: [
      'Araç bazlı kâr dosyası: alış, noter ve plaka masrafı, kaporta, lastik, bakım, satış',
      'Günlük gelir-gider kaydı; nakit ve kart ayrımı, kategori ve açıklama',
      'Ortak kasaları: kasa bakiyesi, avans, para giriş-çıkışı ve ortak payları',
      'Taksitli ve vadeli satışlarda tahsilat takibi',
      'Sigorta, muayene ve vergi tarihlerinin tek yerde tutulması',
      'Haftalık ve aylık analiz; Excel ile iki yönlü alışveriş',
    ],
    urunYolu: '/otomotiv-yazilimlari/galeri-muhasebe',
    urunEtiketi: 'Galeri muhasebesi',
    kartEkrani: EKRANLAR.finansOzetTelefon,
  },
  {
    no: '03',
    anahtar: 'ilan',
    ad: 'İlan açıklaması ve görseli',
    kisaAd: 'İlan hazırlama',
    simge: 'kalem',
    neIseYarar:
      'Araç bir kez giriliyor; ilan metni, baskıya hazır araç kartı ve sosyal medya gönderisi birlikte çıkıyor. Her ilan aynı üslupta.',
    raySatiri: 'İlan metni, hasar işaretleme, fiyat araştırması ve ilan görseli',
    kapsam: [
      'Altı bölümlü ilan sihirbazı: araç kimliği, donanım, hasar, fotoğraf, metin, fiyat',
      'Kaporta haritası: parçaya dokunarak orijinal, lokal boyalı, boyalı, değişen işaretleme',
      'Girilen bilgiden satır satır kurulan ilan açıklaması; metni siz düzeltip onaylıyorsunuz',
      'Tek veriden üç çıktı: ilan metni, markalı araç kartı ve sosyal medya gönderisi',
      'Fiyat araştırması için ilan ve piyasa bilgisinin derli toplu tutulduğu çalışma alanı',
      'Yayın öncesi önizleme: ilanın müşteriye nasıl görüneceği aynı ekranda',
    ],
    urunYolu: '/otomotiv-yazilimlari/ilan-hazirlama',
    urunEtiketi: 'İlan hazırlama',
    kartEkrani: EKRANLAR.ilanHasarTelefon,
  },
];

/* ------------------------------------------------------------------ */
/* Süreç — kurulumdan teslime                                          */
/* Uydurma süre, tarih ve taahhüt YOK: yalnız adımların sırası ve her   */
/* adımda ne teslim edildiği.                                          */
/* ------------------------------------------------------------------ */

export const SUREC_ADIMLARI: { no: string; baslik: string; metin: string; cikti: string }[] = [
  {
    no: '01',
    baslik: 'Galeriyi dinliyoruz',
    metin:
      'Aracı kaça alıyorsunuz, ilanı kim yazıyor, kasayı kim tutuyor, ortaklık nasıl işliyor? Mevcut düzeni olduğu gibi çıkarıyoruz; çalışan bir parçayı değiştirmek için sebep yoksa ona dokunmuyoruz.',
    cikti: 'Yazılı eksik listesi ve kapsam taslağı',
  },
  {
    no: '02',
    baslik: 'Tıklanabilir maket',
    metin:
      'Kod yazmadan önce ekranları maket olarak hazırlıyoruz. Gezip “burası böyle olmasın” diyorsunuz; değişiklik makette yapılıyor, kodda değil.',
    cikti: 'Onayladığınız ekran akışı',
  },
  {
    no: '03',
    baslik: 'Kurulum',
    metin:
      'Onaylanan kapsamı yazıyoruz. Değerleme oranları, kâr formülü ve ortak payları ayar dosyasında durur; galerinin kendi alışkanlığına göre birlikte belirliyoruz.',
    cikti: 'Çalışan site, panel ve muhasebe ekranları',
  },
  {
    no: '04',
    baslik: 'Veri ve devir',
    metin:
      'Stoktaki araçları, açık taksitleri ve kasa durumunu sisteme alıyoruz. Elinizde Excel varsa oradan yüklüyoruz; yoksa birlikte giriyoruz.',
    cikti: 'Gerçek verisiyle dolu, kullanıma hazır kurulum',
  },
  {
    no: '05',
    baslik: 'Teslim ve kullanım',
    metin:
      'Ekibe yerinde gösteriyoruz: ilan nasıl açılır, kayıt nasıl girilir, ay sonunda hangi ekrana bakılır. Sonrasında da aynı ekip arkasında duruyor.',
    cikti: 'Kullanım eğitimi ve iletişim hattı',
  },
];
