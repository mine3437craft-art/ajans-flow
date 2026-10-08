/**
 * Ajans Flow kurumsal web sitesinin TÜM metinleri ve yapısı.
 *
 * Bu dosya sitenin tek içerik kaynağıdır: 15 hizmet sayfası, 12 sektör sayfası,
 * vaka çalışmaları, süreç, SSS, menü, ana sayfa ve QR menü mevzuat bölümü.
 * Sayfa bileşenleri metin yazmaz; buradan okur.
 *
 * KURALLAR (sahibinin kararları — SITE-BRIEF.md 8 ve 8.1):
 *   1. FİYAT YAZILMAZ. Paket kartlarında yalnızca kapsam anlatılır, rakam yok.
 *   2. UYDURMA YOK: müşteri yorumu, ödül, sertifika, "%X artış", takipçi/ciro
 *      rakamı, kuruluş yılı, ekip sayısı yazılmaz.
 *   3. Kullanılabilecek doğrulanmış veriler: 12+ marka, 244+ Instagram
 *      gönderisi, İstanbul / 4.Levent, Instagram @ajansflow (mavi tikli).
 *   4. Yazılımlar "yaptığımız iş" (vaka) diliyle anlatılır; ürün/lisans dili yok.
 *   5. sahibinden.com için temkinli dil: "ilan açıklaması ve görseli hazırlama,
 *      ilan yönetim akışı, fiyat araştırması". Otomatik veri çekme/senkronizasyon
 *      İDDİA EDİLMEZ.
 *   6. QR menü mevzuatında "zorunlu / ceza yersiniz" dili KULLANILMAZ.
 *      Doğru çerçeve: "mevzuata uygun kurgu". Bkz. QR_MENU_BILGI.
 *   7. Her metin özgün olmalı; aynı cümle iki sayfada tekrarlanmaz.
 *
 * Bu dosya istemci bileşenleri tarafından da okunur: 'server-only' KOYMAYIN.
 */

import { ILETISIM, MARKA, siteYolu } from '@/lib/site';

/** İletişim ve marka sabitleri tek yerden okunsun diye yeniden dışa verilir. */
export { ILETISIM, MARKA };

/* ================================================================== */
/* Ortak tipler                                                        */
/* ================================================================== */

/** Sık sorulan soru. */
export type Sss = { soru: string; cevap: string };

/** Numaralı süreç adımı. */
export type SurecAdimi = { adim: number; baslik: string; aciklama: string };

/** Paket kartı. Sahibinin kararı gereği fiyat alanı YOKTUR. */
export type Paket = { ad: string; kapsam: string[] };

/** Çok seviyeli menü ögesi. */
export type NavOge = {
  etiket: string;
  href: string;
  /** Açılır menüde etiketin altında görünen tek satır. */
  aciklama?: string;
  alt?: NavOge[];
};

/** Bir hizmet sayfasının tüm içeriği. */
export type Hizmet = {
  /** Çapraz referanslarda kullanılan kısa anahtar. */
  anahtar: string;
  /** URL parçası (ASCII). Tam adres: /hizmetler/<slug> */
  slug: string;
  ad: string;
  /** Menü ve kartlarda kullanılan kısa ad. */
  kisaAd: string;
  /** Tek cümlelik özet. */
  ozet: string;
  /** Gövde metni; her eleman bir paragraf. */
  aciklama: string[];
  neleriKapsar: string[];
  kimeGore: string[];
  surec: SurecAdimi[];
  paket: Paket[];
  sss: Sss[];
  anahtarKelimeler: string[];
  /** En çok 60 karakter. */
  metaBaslik: string;
  /** En çok 155 karakter. */
  metaAciklama: string;
  simge: string;
  /** Diğer hizmetlerin `anahtar` değerleri. */
  ilgiliHizmetler: string[];
  /** public/site/medya altındaki dosya; medyaYolu() ile adrese çevirin. */
  medya?: string;
};

/** Bir sektör sayfasının tüm içeriği. */
export type Sektor = {
  anahtar: string;
  /** Tam adres: /sektorler/<slug> */
  slug: string;
  ad: string;
  baslik: string;
  giris: string;
  webTarafi: { baslik: string; maddeler: string[] };
  sosyalTarafi: { baslik: string; maddeler: string[] };
  /** Referansı olmayan sektörde bu alan BOŞ bırakılır — örnek iş uydurulmaz. */
  ornekIs?: { marka: string; ozet: string; vakaSlug: string };
  sss: Sss[];
  anahtarKelimeler: string[];
  metaBaslik: string;
  metaAciklama: string;
};

/** Vaka çalışması medyası. Dosyalar public/site/medya altındadır. */
export type VakaMedyasi = {
  video?: string;
  poster?: string;
  foto?: string[];
  logo?: string;
};

/** Gerçek iş / vaka çalışması. */
export type Vaka = {
  slug: string;
  marka: string;
  sektor: string;
  baslik: string;
  ozet: string;
  /** Müşterinin işe başlamadan önceki sorunu. */
  zorluk: string;
  yaptiklarimiz: string[];
  /** Ölçülebilir rakam yoksa "ne teslim ettik" anlatılır. */
  sonuc: string;
  /** HIZMETLER içindeki `anahtar` değerleri. */
  hizmetler: string[];
  medya: VakaMedyasi;
  canliBaglanti?: string;
};

/** Mevzuat maddesi: metin + birincil kaynak. */
export type MevzuatMaddesi = {
  baslik: string;
  metin: string;
  kaynak: {
    /** Yönetmelik / kanun / kılavuz adı. */
    mevzuat: string;
    /** Madde numarası (biliniyorsa). */
    madde?: string;
    /** Resmî Gazete tarih ve sayısı. */
    resmiGazete?: string;
    baglanti?: string;
  };
};

/** public/site/medya altındaki bir dosyanın site içi adresi. */
export function medyaYolu(dosya: string): string {
  return siteYolu(`/medya/${dosya}`);
}

/* ================================================================== */
/* 6. Site menüsü                                                      */
/* ================================================================== */

export const NAV: NavOge[] = [
  {
    etiket: 'Hizmetler',
    href: '/hizmetler',
    aciklama: 'Sosyal medya, prodüksiyon, reklam, web ve yazılım',
    alt: [
      { etiket: 'Sosyal Medya Yönetimi', href: '/hizmetler/sosyal-medya-yonetimi', aciklama: 'Hesaplarınızın düzenli ve tutarlı yönetimi' },
      { etiket: 'İçerik Stratejisi ve Planlama', href: '/hizmetler/icerik-stratejisi', aciklama: 'Hedefi olan içerik takvimi' },
      { etiket: 'TikTok İçerik ve Hesap Yönetimi', href: '/hizmetler/tiktok-icerik-yonetimi', aciklama: 'Seri içerik, trend takibi, dikey çekim' },
      { etiket: 'Profesyonel Fotoğraf Çekimi', href: '/hizmetler/fotograf-cekimi', aciklama: 'Ürün, mekân ve ekip çekimleri' },
      { etiket: 'Video ve Reels Prodüksiyonu', href: '/hizmetler/video-produksiyon', aciklama: 'Fikirden kurguya kısa video' },
      { etiket: 'Kurgu ve Edit (Post Prodüksiyon)', href: '/hizmetler/kurgu-ve-edit', aciklama: 'Ham çekimden yayına hazır video' },
      { etiket: 'Drone Çekimi', href: '/hizmetler/drone-cekimi', aciklama: 'Havadan sinematik görüntü' },
      { etiket: 'Reklam Yönetimi: Meta, Google ve TikTok', href: '/hizmetler/meta-reklam-yonetimi', aciklama: 'Meta Business kurulumu, TikTok Ads, optimizasyon' },
      { etiket: 'Google Ads Yönetimi', href: '/hizmetler/google-ads-yonetimi', aciklama: 'Arama ve harita reklamları, ayrıntılı kurgu' },
      { etiket: 'Google İşletme Profili', href: '/hizmetler/google-isletme-profili', aciklama: 'Haritalarda doğru ve güncel görünüm' },
      { etiket: 'Web Sitesi Tasarımı ve Yazılımı', href: '/hizmetler/web-sitesi-tasarimi', aciklama: 'Sektöre özel entegrasyonlu siteler' },
      { etiket: 'QR Dijital Menü', href: '/hizmetler/qr-dijital-menu', aciklama: 'Çok dilli menü, sipariş ve rezervasyon' },
      { etiket: 'Grafik Tasarım ve Kurumsal Kimlik', href: '/hizmetler/kurumsal-kimlik-tasarim', aciklama: 'Logo, menü, katalog, şablon' },
      { etiket: 'Etkileşim ve Takipçi Büyütme', href: '/hizmetler/etkilesim-takipci-buyutme', aciklama: 'Gerçek ve ilgili kitle' },
      { etiket: 'Veri Analizi ve Raporlama', href: '/hizmetler/veri-analizi-raporlama', aciklama: 'Tahmin değil ölçüm' },
    ],
  },
  {
    etiket: 'Sektörler',
    href: '/sektorler',
    aciklama: 'İşinize göre web sitesi ve sosyal medya kurgusu',
    alt: [
      { etiket: 'Go Kart ve Eğlence Merkezi', href: '/sektorler/go-kart-eglence-merkezi', aciklama: 'Seans takvimi ve rezervasyon' },
      { etiket: 'Oto Galeri ve Otomotiv', href: '/sektorler/oto-galeri', aciklama: 'Değerleme formu ve ilan akışı' },
      { etiket: 'Kafe ve Restoran', href: '/sektorler/kafe-restoran', aciklama: 'QR menü, sipariş, rezervasyon' },
      { etiket: 'Avukat ve Hukuk Bürosu', href: '/sektorler/avukat-hukuk', aciklama: 'Randevu ve KVKK uyumlu form' },
      { etiket: 'Mimar ve İç Mimar', href: '/sektorler/mimar-ic-mimar', aciklama: 'Proje galerisi ve 360 görsel' },
      { etiket: 'Diş Kliniği ve Sağlık', href: '/sektorler/dis-klinigi-saglik', aciklama: 'Randevu ve mevzuata uygun tanıtım' },
      { etiket: 'Spor Salonu ve Spor Okulu', href: '/sektorler/spor-salonu', aciklama: 'Deneme dersi ve ders programı' },
      { etiket: 'Anaokulu ve Eğitim', href: '/sektorler/anaokulu-egitim', aciklama: 'Kayıt formu ve veli bilgilendirme' },
      { etiket: 'Güzellik Salonu ve Kuaför', href: '/sektorler/guzellik-kuafor', aciklama: 'Online randevu ve hizmet listesi' },
      { etiket: 'Otel ve Turizm', href: '/sektorler/otel-turizm', aciklama: 'Rezervasyon talebi ve çok dilli site' },
      { etiket: 'Emlak ve İnşaat', href: '/sektorler/emlak-insaat', aciklama: 'Portföy listesi ve proje sayfaları' },
      { etiket: 'Mağaza ve E-Ticaret', href: '/sektorler/magaza-eticaret', aciklama: 'Ürün vitrini ve WhatsApp sipariş' },
    ],
  },
  { etiket: 'Çalışmalar', href: '/calismalar', aciklama: 'Gerçek markalar, gerçek işler' },
  { etiket: 'Rehber', href: '/rehber', aciklama: 'Mevzuat, reklam ve web sitesi rehberleri' },
  { etiket: 'Hakkımızda', href: '/hakkimizda' },
  { etiket: 'İletişim', href: '/iletisim' },
];

/** Alt bilgideki yasal ve iletişim bağlantıları. */
export const ALT_MENU: NavOge[] = [
  { etiket: 'Gizlilik Politikası', href: '/gizlilik' },
  { etiket: 'KVKK Aydınlatma Metni', href: '/kvkk' },
  { etiket: 'İletişim', href: '/iletisim' },
];

/** Her sayfada görünen birincil çağrı. */
export const BIRINCIL_CAGRI = {
  etiket: 'Ücretsiz analiz iste',
  href: '/iletisim',
  altMetin: 'Bağlayıcı değil, ücretsiz. Instagram, web siteniz ve Google profilinize bakıp eksikleri yazılı paylaşırız.',
} as const;

/* ================================================================== */
/* 1. Hizmetler (13 sayfa)                                             */
/* ================================================================== */

export const HIZMETLER: Hizmet[] = [
  /* ---------------------------------------------------------------- */
  {
    anahtar: 'sosyal-medya',
    slug: 'sosyal-medya-yonetimi',
    ad: 'Sosyal Medya Yönetimi',
    kisaAd: 'Sosyal medya',
    ozet: 'Instagram ve Facebook hesaplarınızı plan, çekim ve yayın dahil uçtan uca biz yürütüyoruz.',
    aciklama: [
      'Çoğu işletme sosyal medyayı akşam kapanıştan sonra, yorgunken ve acele yapıyor. Sonuç tahmin edilebilir: bir hafta üç paylaşım, sonra on gün sessizlik. Hesap büyümüyor çünkü düzen yok. Sosyal medya yönetimi hizmetimiz tam bu düzeni kuruyor: ayın hangi gününde ne yayınlanacağı siz onaylamadan belli oluyor, çekim günü takvime giriyor, yayın saatinde gönderi hazır duruyor.',
      'Her markaya aynı şablonu uygulamıyoruz. Bir kafenin akışı iştah açan kareler ve mekân videolarıyla kurulur; bir oto galerinin akışı araç detayı, güven ve fiyat bilgisiyle kurulur. İlk iş, işinizin hangi içeriğinden müşteri geldiğini bulmak. Onu bulduktan sonra üretimi o eksende yoğunlaştırıyoruz.',
      'Hesabınızın şifresini istemek zorunda değiliz; Meta Business üzerinden iş ortağı erişimi yeterli. Böylece yetki sizde kalır, çalışmayı bitirmek istediğinizde erişim tek tıkla kapanır. Bu, ajansla çalışırken en çok tedirgin olunan konu ve biz baştan şeffaf tutuyoruz.',
    ],
    neleriKapsar: [
      'Aylık içerik takvimi hazırlanması ve onayınıza sunulması',
      'Gönderi ve Reels metinleri, hashtag ve etiket düzeni',
      'Mekânınızda planlı çekim günleri (fotoğraf ve video)',
      'Tasarım şablonlarıyla tutarlı görsel dil',
      'Yayın planına göre paylaşım ve hikâye akışı',
      'Yorum ve DM yönetimi, sık sorulan sorulara hazır yanıt seti',
      'Profil düzeni: biyografi, öne çıkanlar, bağlantı ve iletişim düğmeleri',
      'Aylık performans özeti ve sonraki ay için öneriler',
    ],
    kimeGore: [
      'Paylaşıma zaman ayıramayan, işin başında duran işletme sahibi',
      'Hesabı olan ama düzensiz paylaştığı için büyümeyen markalar',
      'Fiziksel mekâna müşteri çekmesi gereken kafe, restoran, salon ve klinikler',
      'Tek kişilik pazarlama ekibi olan, üretim desteğine ihtiyaç duyan şirketler',
    ],
    surec: [
      { adim: 1, baslik: 'Hesap incelemesi', aciklama: 'Mevcut akışınızı, rakiplerinizi ve geçmiş gönderi performansını inceliyoruz. Neyin tuttuğunu, neyin boşa gittiğini yazılı paylaşıyoruz.' },
      { adim: 2, baslik: 'Görsel dil ve takvim', aciklama: 'Renk, yazı tipi ve şablon düzenini belirliyor; ilk ayın içerik takvimini çıkarıyoruz. Takvimi siz onaylıyorsunuz.' },
      { adim: 3, baslik: 'Çekim günü', aciklama: 'Mekânınıza gelip ayın içeriğini tek seferde çekiyoruz. Böylece her gün telefonla uğraşmanız gerekmiyor.' },
      { adim: 4, baslik: 'Yayın ve topluluk', aciklama: 'Gönderileri planlı saatlerde yayınlıyor, yorum ve mesajları takip ediyoruz.' },
      { adim: 5, baslik: 'Aylık değerlendirme', aciklama: 'Hangi içerik ne getirdi, bir sonraki ay neyi artıracağız? Rakamlara bakıp planı güncelliyoruz.' },
    ],
    paket: [
      {
        ad: 'Düzen',
        kapsam: [
          'Tek platform (Instagram) yönetimi',
          'Aylık içerik takvimi ve metin yazımı',
          'Ayda bir çekim günü',
          'Gönderi ve hikâye yayını',
          'Yorum ve DM takibi',
          'Aylık performans özeti',
        ],
      },
      {
        ad: 'Büyüme',
        kapsam: [
          'Instagram ve Facebook birlikte yönetimi',
          'Artırılmış içerik hacmi: daha fazla gönderi ve Reels',
          'Ayda iki çekim günü',
          'Reels kurgu ve altyazı',
          'Meta reklam kampanyalarının kurulumu ve takibi',
          'Google İşletme Profili gönderileri',
          'Aylık rapor ve görüşme',
        ],
      },
      {
        ad: 'Tam kapsam',
        kapsam: [
          'Çok şubeli veya çok markalı yönetim',
          'Platform karması: Instagram, Facebook, TikTok ve YouTube Shorts (TikTok üretimi ayrı hizmet olarak da alınabilir)',
          'Çekim takvimi ihtiyaca göre planlanır',
          'Drone çekimi dahil prodüksiyon',
          'Kurumsal kimlik ve şablon seti',
          'Reklam yönetimi ve dönüşüm ölçümü',
          'Aylık rapor sunumu ve strateji toplantısı',
        ],
      },
    ],
    sss: [
      { soru: 'Hesabımın şifresini vermem gerekiyor mu?', cevap: 'Gerekmiyor. Meta Business Suite üzerinden iş ortağı erişimi veriyorsunuz; yetki sizde kalıyor ve dilediğiniz an kaldırabiliyorsunuz. Şifreyle çalışmayı tercih eden müşterilerimiz de var, karar sizin.' },
      { soru: 'İçerikleri ben onaylayacak mıyım?', cevap: 'Evet. Aylık takvim yayına girmeden size geliyor; başlıkları, görselleri ve yayın günlerini onaylıyorsunuz. Acil bir kampanya çıkarsa WhatsApp üzerinden hızlı onay alıyoruz.' },
      { soru: 'Çekim için mekânı kapatmak gerekiyor mu?', cevap: 'Hayır. Çekimi yoğun olmayan saatlerde planlıyoruz. Yemek çekimlerinde mutfakla birlikte çalışıyor, servis akışını bozmuyoruz.' },
      { soru: 'Kaç gönderi paylaşılacak?', cevap: 'Gönderi sayısı paket kapsamına göre belirleniyor ve takvimde açıkça yazılı oluyor. Sayıyı işinizin temposuna göre ayarlıyoruz; sezonluk işletmelerde yoğun aylarda artırıyoruz.' },
      { soru: 'Sözleşmeyi erken bitirebilir miyim?', cevap: 'Uzun süreli taahhüt istemiyoruz. Kapsamı ve süreyi ücretsiz analizden sonra birlikte belirliyoruz; devam etmek istemezseniz erişimleri ve ürettiğimiz dosyaları teslim ediyoruz.' },
      { soru: 'Paket içinde reklam da var mı?', cevap: 'Reklam yönetimi büyüme ve tam kapsam paketlerinin içinde; reklamın kendi bütçesi ise ayrıdır ve doğrudan platforma ödenir. Yalnızca içerik üretimi ve yayın isteyen, reklam vermeyen müşterilerimiz de var.' },
    ],
    anahtarKelimeler: ['sosyal medya yönetimi', 'sosyal medya ajansı', 'Instagram hesap yönetimi', 'sosyal medya yönetimi fiyatları', 'İstanbul sosyal medya ajansı'],
    metaBaslik: 'Sosyal Medya Yönetimi | İstanbul — Ajans Flow',
    metaAciklama: 'Instagram ve Facebook hesaplarınızı içerik takvimi, çekim, yayın ve topluluk yönetimiyle tek ekipten yürütüyoruz. Ücretsiz analizle başlayın.',
    simge: '📱',
    ilgiliHizmetler: ['icerik-stratejisi', 'tiktok', 'fotograf', 'video', 'meta-reklam'],
    medya: 'foto/mas-gokart-sosyal-medya-tasarimi.jpg',
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'icerik-stratejisi',
    slug: 'icerik-stratejisi',
    ad: 'İçerik Stratejisi ve Planlama',
    kisaAd: 'İçerik stratejisi',
    ozet: 'Ne yayınlayacağınızı, kime ve hangi sırayla anlatacağınızı yazılı bir plana dönüştürüyoruz.',
    aciklama: [
      'İçerik üretmek zor değil; neyi üreteceğine karar vermek zor. İşletmelerin çoğu bu kararı her sabah yeniden veriyor ve o yüzden akışları dağınık görünüyor. İçerik stratejisi, bu kararı bir kere ve toplu olarak vermenizi sağlıyor: hangi başlıkları konuşacağız, hangi formatta, hangi sıklıkta ve hangi sonucu bekliyoruz.',
      'Çalışmaya markanızın gerçek satış hikâyesinden başlıyoruz. Müşteriniz hangi soruyla geliyor? Satın almadan önce neyden tereddüt ediyor? Fiyattan mı, güvenden mi, mesafeden mi? Bu soruların cevapları içerik başlıklarına dönüşüyor. Böylece "beğeni toplayan" değil, "soruyu cevaplayan" içerik üretiyoruz.',
      'Teslim ettiğimiz şey slayt değil, kullanılabilir bir dosya: içerik sütunları, ay bazlı takvim, format dağılımı, çekim listesi ve ölçüm kriterleri. Kendi ekibiniz uygulayacaksa plan tek başına yeterli; uygulamayı da bize bırakabilirsiniz.',
    ],
    neleriKapsar: [
      'Marka ve rakip incelemesi, mevcut içerik denetimi',
      'Hedef kitle tanımı ve müşterinin satın alma yolculuğu',
      'İçerik sütunları: hangi başlık grubunda ne anlatılacak',
      'Format dağılımı: gönderi, Reels, hikâye, karusel, uzun video',
      'Üç aylık yayın takvimi ve haftalık ritim',
      'Çekim listesi: hangi karede ne çekilecek',
      'Metin tonu rehberi ve hazır cümle kalıpları',
      'Ölçüm kriterleri: hangi sayıya bakacağız, neyi başarı sayacağız',
    ],
    kimeGore: [
      'Kendi ekibiyle üretim yapan ama yön arayan markalar',
      'Yeni açılan, sıfırdan bir dijital hikâye kurması gereken işletmeler',
      'Çok şubeli işletmelerde şubeler arası tutarlılık arayan yöneticiler',
      'Sosyal medyada ne anlatacağını bilmediği için paylaşmaktan vazgeçmiş markalar',
    ],
    surec: [
      { adim: 1, baslik: 'Keşif görüşmesi', aciklama: 'İşin nasıl yürüdüğünü, müşterinin nereden geldiğini ve en kârlı hizmetin hangisi olduğunu dinliyoruz.' },
      { adim: 2, baslik: 'İçerik denetimi', aciklama: 'Geçmiş gönderileri ve rakip akışlarını inceliyor; hangi başlığın karşılık bulduğunu çıkarıyoruz.' },
      { adim: 3, baslik: 'Strateji taslağı', aciklama: 'İçerik sütunlarını, formatları ve ritmi taslak hâlinde sunuyoruz. Bu aşamada itiraz ve ekleme bekliyoruz.' },
      { adim: 4, baslik: 'Takvim ve çekim listesi', aciklama: 'Onaylanan stratejiyi üç aylık takvime ve çekim listesine çeviriyoruz.' },
      { adim: 5, baslik: 'Devir ve takip', aciklama: 'Planı ekibinize anlatıyoruz. İlk ay sonunda sonuçlara birlikte bakıp takvimi düzeltiyoruz.' },
    ],
    paket: [
      {
        ad: 'Plan',
        kapsam: [
          'Tek platform için içerik stratejisi',
          'İçerik denetimi ve rakip incelemesi',
          'İçerik sütunları ve format dağılımı',
          'Bir aylık örnek takvim',
          'Teslim görüşmesi',
        ],
      },
      {
        ad: 'Plan ve takvim',
        kapsam: [
          'Çok platformlu strateji',
          'Hedef kitle ve satın alma yolculuğu haritası',
          'Üç aylık yayın takvimi',
          'Çekim listesi ve kare kare brief',
          'Metin tonu rehberi',
          'Ölçüm kriterleri tablosu',
        ],
      },
      {
        ad: 'Plan, takvim ve uygulama',
        kapsam: [
          'Üç aylık strateji ve takvim',
          'İçerik üretiminin tamamı Ajans Flow tarafında',
          'Çekim günleri planlanır',
          'Reklam kurgusu stratejiyle birlikte kurulur',
          'Aylık değerlendirme toplantısı',
        ],
      },
    ],
    sss: [
      { soru: 'Strateji dosyasını kendi ekibim uygulayabilir mi?', cevap: 'Evet, dosya bu amaçla hazırlanıyor. Takvim, çekim listesi ve ton rehberi bir pazarlama sorumlusunun tek başına uygulayabileceği netlikte yazılıyor. Takıldığınız yerde danışmak için görüşme planlıyoruz.' },
      { soru: 'Strateji ne kadar süre geçerli kalır?', cevap: 'İçerik sütunları genelde bir yıl ayakta kalıyor; takvim ise üç ayda bir yenilenmeli. Platformların davranışı ve sezon değiştiği için takvimi dondurmak doğru olmuyor.' },
      { soru: 'Rakip analizi neyi kapsıyor?', cevap: 'Aynı şehirde veya aynı sektörde öne çıkan hesapların içerik karmasına, yayın sıklığına ve hangi gönderilerinde etkileşim topladığına bakıyoruz. Rakiplerin özel verilerine erişimimiz yok; yalnızca herkese açık içeriği inceliyoruz.' },
      { soru: 'Takvimi hazırlarken benden ne isteyeceksiniz?', cevap: 'Hizmet ve ürün listesi, sezon yoğunluğunuz, varsa kampanya planınız ve geçmiş çekim arşiviniz. Bir de en sık duyduğunuz müşteri sorularını; onlar en iyi içerik başlıkları oluyor.' },
      { soru: 'Sadece strateji alıp sonra üretim için dönebilir miyim?', cevap: 'Elbette. Strateji tek başına satılan bir iş; sonra üretim veya reklam için dönen müşterilerimiz oluyor. Planı biz hazırladığımız için üretime geçiş hızlı oluyor.' },
    ],
    anahtarKelimeler: ['içerik stratejisi', 'sosyal medya içerik takvimi', 'marka içerik planı', 'içerik planlama ajansı'],
    metaBaslik: 'İçerik Stratejisi ve Planlama | Ajans Flow',
    metaAciklama: 'Markanız için hedefi olan içerik takvimi: içerik sütunları, format dağılımı, çekim listesi ve ölçüm kriterleri. Rastgele paylaşım yerine plan.',
    simge: '🗂️',
    ilgiliHizmetler: ['sosyal-medya', 'tiktok', 'veri-analizi', 'kurumsal-kimlik'],
  },


  /* ---------------------------------------------------------------- */
  {
    anahtar: 'tiktok',
    slug: 'tiktok-icerik-yonetimi',
    ad: 'TikTok İçerik Üretimi ve Hesap Yönetimi',
    kisaAd: 'TikTok yönetimi',
    ozet: 'TikTok hesabınızı platformun kendi diline göre kuruyor, seri içerik üretip düzenli yayınlıyoruz.',
    aciklama: [
      'TikTok, diğer platformlardan bir konuda ayrılıyor: içeriği kime göstereceğine karar verirken takipçi sayısına neredeyse hiç bakmıyor. Yeni açılmış bir hesabın videosu da keşfete düşebiliyor. Yerel bir işletme için bunun anlamı şu: bölgenizdeki insanlara ulaşmak için yıllarca kitle biriktirmeniz gerekmiyor, doğru videoyu üretmeniz yeterli.',
      'Ama platformun kendi dili var ve bu dil öğrenilmeden sonuç çıkmıyor. Instagram’dan olduğu gibi aktarılan, logosu köşede duran, reklam gibi başlayan bir video TikTok’ta ilk iki saniyede kapatılıyor. Bu yüzden TikTok’u Reels’in kopyası olarak değil, ayrı bir hesap olarak kurguluyoruz: ayrı plan, ayrı çekim listesi, ayrı kurgu temposu.',
      'İşin merkezine seri içerik koyuyoruz. Tek videoluk fikirler yerine devam eden formatlar kuruyoruz: haftanın yeni ürünü, mutfakta bir gün, en çok sorulan soru, bir işin baştan sona yapılışı. Seri hem izleyiciyi geri getiriyor hem de her hafta "ne çekeceğiz" tartışmasını bitiriyor. Yorum bölümü de içerik kaynağı oluyor; gelen soru bir sonraki videonun konusu haline geliyor.',
      'Trend takibi işin teknik tarafı: o hafta hangi ses, hangi geçiş ve hangi anlatım kalıbı hareket görüyor? Markaya uymayan trendi zorlamıyoruz, uyanları hızlı uyguluyoruz. Bir de şunu baştan söyleyelim: TikTok’ta mekânın gerçek hâli işe yarıyor. Aşırı parlatılmış tanıtım filmi yerine iyi kurgulanmış, gerçek görünen video daha iyi iş yapıyor.',
    ],
    neleriKapsar: [
      'TikTok işletme hesabının kurulması, profil ve biyografi düzeni',
      'Platforma özel içerik planı: seri formatlar ve yayın ritmi',
      'Haftalık trend takibi; ses, anlatım kalıbı ve konu seçimi',
      'Dikey çekim: mekân, ürün, süreç ve ekip videoları',
      'Hızlı tempolu kurgu, altyazı ve ekran içi metin yerleşimi',
      'Lisansı temiz ses ve platform kütüphanesi kullanımı',
      'Yorum yönetimi ve yorumlardan yeni içerik üretimi',
      'TikTok aramasına yönelik açıklama ve etiket düzeni',
      'Hesap performansının izlenmesi: izlenme kaynakları ve tamamlama oranı',
      'İsteğe bağlı: aynı videoların Reels ve Shorts için yeniden kırpımı',
    ],
    kimeGore: [
      'Genç kitleye ulaşmak isteyen yerel işletmeler',
      'Instagram’da büyümesi yavaşlamış, yeni kanal arayan markalar',
      'Anlatılacak bir süreci olan işler: mutfak, atölye, kuaför, pist, saha',
      'TikTok hesabı açıp birkaç video sonra bırakmış markalar',
      'Reels üretip aynı videoyu TikTok’a atan ama sonuç alamayan hesaplar',
    ],
    surec: [
      { adim: 1, baslik: 'Hesap ve niş taraması', aciklama: 'Sektörünüzde TikTok’ta ne tuttuğunu inceliyoruz: hangi formatlar izleniyor, hangi anlatım kalıbı çalışıyor, bölgenizde kim üretiyor. Varsa mevcut hesabınızın geçmiş videolarını da ölçüyoruz.' },
      { adim: 2, baslik: 'Seri formatların belirlenmesi', aciklama: 'İki ya da üç devam eden format kuruyoruz ve her birinin ilk videolarını yazıyoruz. Format onaylanmadan çekime çıkmıyoruz.' },
      { adim: 3, baslik: 'Toplu çekim günü', aciklama: 'Mekânınızda tek günde birden fazla videonun çekimini yapıyoruz. Dikey kadraj, kısa planlar ve doğal ses önceliğiyle çalışıyoruz.' },
      { adim: 4, baslik: 'Kurgu ve yayın', aciklama: 'Hızlı tempolu kurgu, altyazı ve kapak karesini hazırlayıp videoları yayın takvimine yerleştiriyoruz. Yorumları takip ediyoruz.' },
      { adim: 5, baslik: 'Ölçüm ve format ayıklama', aciklama: 'Hangi format izlenmeyi tamamlıyor, hangisi ilk saniyelerde kaybediyor? Tutmayan formatı kapatıp tutanı çoğaltıyoruz.' },
    ],
    paket: [
      {
        ad: 'TikTok başlangıç',
        kapsam: [
          'İşletme hesabının kurulması ve profil düzeni',
          'Niş taraması ve iki seri formatın belirlenmesi',
          'Bir toplu çekim günü',
          'Kurgu, altyazı ve kapak kareleriyle teslim',
          'Yayın takvimi ve ilk ay yorum takibi',
        ],
      },
      {
        ad: 'Seri üretim',
        kapsam: [
          'Sürekli TikTok hesap yönetimi',
          'Artırılmış video hacmi ve haftalık trend takibi',
          'Aylık çekim günleri',
          'Yorum yönetimi ve yorumdan içerik üretimi',
          'Aylık performans raporu ve format ayıklaması',
        ],
      },
      {
        ad: 'TikTok ve kısa video',
        kapsam: [
          'TikTok, Reels ve Shorts için birlikte üretim',
          'Platform başına ayrı kurgu ve kırpım',
          'TikTok Ads ve Spark Ads kurgusuyla desteklenmiş erişim',
          'İçerik üreticisi iş birliklerinin planlanması',
          'Aylık rapor sunumu',
        ],
      },
    ],
    sss: [
      { soru: 'Instagram Reels videolarımı TikTok’a yüklesem olmaz mı?', cevap: 'Teknik olarak olur, sonuç olarak genelde olmuyor. İki platformun tempo ve anlatım beklentisi farklı; üstelik diğer platformun logosunu taşıyan videolar TikTok’ta daha az yayılıyor. Bu yüzden aynı çekim gününde çekip her platform için ayrı kurgulamayı tercih ediyoruz.' },
      { soru: 'Takipçim yok, sıfırdan başlamak dezavantaj mı?', cevap: 'TikTok’ta en az dezavantaj yaratan yer burası. Platform videoyu önce küçük bir gruba gösteriyor, izlenme tamamlanırsa kitleyi büyütüyor. Yani belirleyici olan takipçi sayısı değil ilk saniyeler. Buna karşılık belirli bir izlenme rakamı garanti etmiyoruz.' },
      { soru: 'Kameraya biz mi çıkmak zorundayız?', cevap: 'Zorunda değilsiniz. Ürün, süreç ve mekân odaklı formatlarla yüz görünmeden de güçlü bir akış kurulabiliyor. Ancak işin başındaki kişinin kameraya çıktığı hesaplar genelde daha hızlı güven kuruyor; isterseniz kısa ve rahat formatlarla başlıyoruz.' },
      { soru: 'Müzik ve ses seçiminde telif riski var mı?', cevap: 'Riski baştan kapatıyoruz. İşletme hesapları için platformun ticari kullanıma açık ses kütüphanesini ya da lisansı net kaynakları kullanıyoruz. Popüler bir parçanın ticari kullanım hakkı doğrulanmadıysa markanızın hesabında kullanmıyoruz.' },
      { soru: 'Haftada kaç video yayınlanacak?', cevap: 'Video sayısı paket kapsamına göre belirleniyor ve içerik takviminde açıkça yazılı oluyor. TikTok’ta düzen sayıdan önemli: haftada az sayıda ama kesintisiz yayın, bir hafta yoğun sonra üç hafta sessiz kalmaktan iyi sonuç veriyor.' },
    ],
    anahtarKelimeler: ['TikTok hesap yönetimi', 'TikTok içerik üretimi', 'TikTok ajansı', 'TikTok video çekimi', 'kısa video içerik ajansı'],
    metaBaslik: 'TikTok Hesap Yönetimi ve İçerik Üretimi',
    metaAciklama: 'TikTok hesabınızı platformun diline göre kuruyoruz: seri içerik formatları, haftalık trend takibi, dikey çekim ve hızlı kurgu. Yerel işletmeler için.',
    simge: '🎵',
    ilgiliHizmetler: ['video', 'kurgu-edit', 'meta-reklam', 'sosyal-medya'],
    medya: 'foto/kok-cafe-reels-mutfak-alevi.jpg',
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'fotograf',
    slug: 'fotograf-cekimi',
    ad: 'Profesyonel Fotoğraf Çekimi',
    kisaAd: 'Fotoğraf çekimi',
    ozet: 'Ürününüzü, mekânınızı ve ekibinizi satışa hizmet eden karelerle çekiyoruz.',
    aciklama: [
      'Telefon kamerası iyi bir şey, ama ışık bilmiyorsa iyi değil. Bir yemeğin buharı, bir aracın boyası ya da bir mekânın ferahlığı doğru ışıkta bambaşka görünüyor. Fotoğraf çekimi hizmetimizde amaç sanat eseri üretmek değil; müşterinizin ekranda gördüğü kareyle mekâna geldiğinde gördüğü şeyin aynı olması.',
      'Çekime listeyle geliyoruz. Menüden hangi ürünler, mekândan hangi köşeler, ekipten kimler çekilecek; hepsi önceden yazılı. Bu yüzden tek çekim gününde ayın içeriği çıkıyor ve tabaklar soğumadan iş bitiyor. Yemek çekimlerinde mutfakla birlikte çalışıyor, sunumu servise çıkacak hâliyle çekiyoruz; stilize edilmiş, gerçekte o şekilde gelmeyen tabak çekmiyoruz.',
      'Bu çekim en çok QR dijital menü işlerinde işe yarıyor. Menüdeki her ürünün fotoğrafı buradan çıkıyor; çekim gününde menünün tamamını sırayla çekip doğrudan menüye işliyoruz. Yani menüye koyacak fotoğraf aramak zorunda kalmıyorsunuz.',
      'Teslimi iki formatta yapıyoruz: sosyal medya için kare ve dikey kırpımlar, web sitesi ve baskı için yüksek çözünürlüklü dosyalar. Dosyalar sizin; istediğiniz yerde kullanırsınız. Düzenlenmiş kareleri de ham dosyalarla birlikte arşivlenebilir hâlde veriyoruz.',
    ],
    neleriKapsar: [
      'Çekim öncesi kare listesi ve moodboard hazırlığı',
      'Mekânınızda profesyonel kamera ve ışık ekipmanıyla çekim',
      'Ürün ve yemek çekimi, sunum düzenlemesi',
      'QR dijital menü için menüdeki tüm ürünlerin tek tek çekilmesi',
      'Mekân ve atmosfer çekimi, detay kareleri',
      'Ekip ve portre çekimi',
      'Renk ve ışık düzenlemesi (retouch)',
      'Sosyal medya için kare ve dikey kırpımlar',
      'Web sitesi ve baskı için yüksek çözünürlüklü teslim',
      'Düzenli arşiv klasörü ve dosya isimlendirme',
    ],
    kimeGore: [
      'QR dijital menüye geçen ve menüdeki her ürünün fotoğrafına ihtiyaç duyan mekânlar',
      'Basılı menüsünü veya kataloğunu yenileyen kafe, restoran ve pastaneler',
      'Ürün görseli olmadığı için satış yapamayan mağaza ve e-ticaret işletmeleri',
      'Web sitesini yenilerken içerik görseline ihtiyaç duyan şirketler',
      'Kurumsal tanıtım ve ekip görseli gereken ofisler, klinikler, bürolar',
    ],
    surec: [
      { adim: 1, baslik: 'Brief ve kare listesi', aciklama: 'Hangi ürün, hangi köşe, hangi kişi çekilecek? Listeyi birlikte çıkarıp sayıyı netleştiriyoruz.' },
      { adim: 2, baslik: 'Çekim planı', aciklama: 'Işığın en iyi olduğu saati ve mekânın en sakin zamanını seçiyoruz. Gereken aksesuar ve sunum malzemesini önceden söylüyoruz.' },
      { adim: 3, baslik: 'Çekim günü', aciklama: 'Ekipmanla geliyor, listeyi sırayla çekiyoruz. Çekim sırasında ekranda birlikte bakıp onay alıyoruz.' },
      { adim: 4, baslik: 'Seçki ve düzenleme', aciklama: 'En iyi kareleri seçip renk ve ışık düzenlemesini yapıyoruz. Seçkiyi önce siz görüyorsunuz.' },
      { adim: 5, baslik: 'Teslim', aciklama: 'Sosyal medya ve web için ayrı klasörlerde, isimlendirilmiş ve kullanıma hazır teslim ediyoruz.' },
    ],
    paket: [
      {
        ad: 'Yarım gün',
        kapsam: [
          'Tek mekânda yarım günlük çekim',
          'Sınırlı kare listesi (ürün veya mekân odaklı)',
          'Temel renk ve ışık düzenlemesi',
          'Sosyal medya kırpımlarıyla teslim',
        ],
      },
      {
        ad: 'Tam gün',
        kapsam: [
          'Tam günlük çekim',
          'Ürün, mekân ve ekip kareleri birlikte',
          'Sunum ve stil desteği',
          'Detaylı düzenleme',
          'Sosyal medya + web + baskı formatlarında teslim',
        ],
      },
      {
        ad: 'Düzenli çekim',
        kapsam: [
          'Aylık tekrarlayan çekim günleri',
          'Sezon ve kampanya çekimleri',
          'Video ve Reels çekimiyle aynı güne planlama',
          'Marka arşivinin düzenli büyütülmesi',
          'Çekim arşivinin tek klasörde yönetimi',
        ],
      },
    ],
    sss: [
      { soru: 'Kaç fotoğraf teslim ediyorsunuz?', cevap: 'Sayı, çekim süresine ve kare listesine göre değişiyor; teklif aşamasında net bir adet yazıyoruz. Önemli olan adet değil, listedeki her ürün ve köşenin kullanılabilir bir karesinin olması. QR menü işlerinde ölçüt daha nettir: menüdeki her ürünün bir karesi olmalı, o yüzden listeyi menü üzerinden kuruyoruz.' },
      { soru: 'Fotoğrafların kullanım hakkı kimde?', cevap: 'Teslim ettiğimiz kareleri işletmenizin tanıtımında süresiz kullanabiliyorsunuz. Biz de kendi portföyümüzde gösterebilmek için izin istiyoruz; istemezseniz göstermiyoruz.' },
      { soru: 'Stüdyo mu, mekânda mı çekim yapıyorsunuz?', cevap: 'Çoğunlukla mekânda çekiyoruz, çünkü mekânın kendi atmosferi satışın parçası. Beyaz fon gereken ürün çekimlerinde taşınabilir fon ve ışık düzeni kuruyoruz.' },
      { soru: 'Yemek çekiminde tabakları siz mi hazırlıyorsunuz?', cevap: 'Sunumu mutfağınız yapıyor, biz kadrajı ve ışığı kuruyoruz. Gerekirse tabak düzeni, peçete ve arka plan konusunda yönlendiriyoruz. Yenmeyen malzemeyle süsleme yapmıyoruz; müşteri tabağı sipariş ettiğinde aynısını görmeli.' },
      { soru: 'Çekim sonrası değişiklik isteyebilir miyim?', cevap: 'Evet. Seçki teslimi sonrası bir tur düzeltme hakkınız oluyor: kırpma, parlaklık veya belirli bir karenin değiştirilmesi gibi. Kapsam dışı yeni çekim talebi ayrı planlanıyor.' },
    ],
    anahtarKelimeler: ['profesyonel fotoğraf çekimi', 'ürün fotoğrafı çekimi İstanbul', 'kurumsal fotoğraf çekimi', 'mekan çekimi', 'yemek fotoğrafı çekimi'],
    metaBaslik: 'Profesyonel Fotoğraf Çekimi İstanbul | Ajans Flow',
    metaAciklama: 'Ürün, yemek, mekân ve ekip çekimi: kare listesiyle gelen planlı çekim, renk düzenlemesi, sosyal medya ve web için ayrı formatlarda teslim.',
    simge: '📷',
    ilgiliHizmetler: ['qr-menu', 'video', 'drone', 'sosyal-medya', 'kurumsal-kimlik'],
    medya: 'foto/kok-cafe-izgara-pirzola.jpg',
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'video',
    slug: 'video-produksiyon',
    ad: 'Video ve Reels Prodüksiyonu',
    kisaAd: 'Video ve Reels',
    ozet: 'Fikirden kurguya kadar, ilk üç saniyede dikkat çeken kısa videolar üretiyoruz.',
    aciklama: [
      'Kısa video artık sosyal medyanın ana dili. Ama uzun uzun çekilip kesilen her video Reels olmuyor: dikey kadraj, ilk saniyedeki kanca, sessiz izlenebilirlik ve altyazı bu formatın kendi kuralları. Biz videoyu baştan bu kurallara göre planlıyoruz; masaüstü için çekilmiş bir filmi telefona sığdırmaya çalışmıyoruz.',
      'Çekim öncesinde kısa bir senaryo çıkarıyoruz: ilk kare ne olacak, hangi hareket var, hangi ses kullanılacak, son karede hangi çağrı duruyor. Mekânınızda tek günde birkaç video çekip bir aylık akışı tamamlıyoruz. Kurgu, renk, altyazı ve kapak karesi bizde; siz onaylayıp yayınlıyorsunuz ya da yayını da biz yapıyoruz.',
      'Müzik tarafında dikkatliyiz. Ticari kullanım hakkı net olmayan parçaları markanızın hesabında kullanmak, sonradan gönderinin sessize alınmasına kadar gidebiliyor. Bu yüzden ya platformun kendi kütüphanesinden ya da lisansı temiz kaynaklardan seçiyoruz.',
      'Çekimi kendiniz yaptıysanız yalnızca post prodüksiyon tarafını da devralıyoruz: kurgu, renk, ses, altyazı ve format uyarlamaları ayrı bir hizmet olarak duruyor. Ayrıntısı kurgu ve edit sayfasında.',
    ],
    neleriKapsar: [
      'Kısa senaryo ve çekim planı (storyboard)',
      'Dikey (9:16) ve kare formatta çekim',
      'Mekân, ürün, süreç ve ekip videoları',
      'Röportaj ve tanıtım filmi çekimi',
      'Kurgu, renk düzenlemesi, ses dengeleme',
      'Altyazı ve metin animasyonu',
      'Kapak karesi (cover) tasarımı',
      'Lisansı temiz müzik seçimi',
      'Platforma göre ayrı dışa aktarım: Reels, Shorts, TikTok, web',
    ],
    kimeGore: [
      'Reels paylaşmak isteyip çekmeye ya da kurgulamaya zamanı olmayan işletmeler',
      'Mekânın atmosferini satan kafe, restoran, eğlence merkezi ve oteller',
      'Üretim süreci anlatmaya değer olan imalatçı ve atölyeler',
      'Tanıtım filmi veya kurumsal video ihtiyacı olan şirketler',
    ],
    surec: [
      { adim: 1, baslik: 'Fikir ve senaryo', aciklama: 'Hangi videoyu neden çekiyoruz? Kanca, akış ve kapanış çağrısını yazıya döküyoruz.' },
      { adim: 2, baslik: 'Çekim planı', aciklama: 'Kaç video, hangi sırayla, hangi saatte çekilecek? Gereken hareket, aksesuar ve kişileri önceden netleştiriyoruz.' },
      { adim: 3, baslik: 'Çekim', aciklama: 'Kamera, ışık ve gerekirse gimbal ile çekiyoruz. Aynı günde birden fazla video çıkarıyoruz.' },
      { adim: 4, baslik: 'Kurgu ve onay', aciklama: 'Kurgu, altyazı, müzik ve kapak karesi hazırlanıyor. İlk kurguyu onayınıza sunuyoruz.' },
      { adim: 5, baslik: 'Teslim ve yayın', aciklama: 'Platforma göre ayrı dosyalar teslim ediliyor; isterseniz yayın takvimine yerleştirip biz paylaşıyoruz.' },
    ],
    paket: [
      {
        ad: 'Reels seti',
        kapsam: [
          'Tek çekim gününde birden fazla kısa video',
          'Dikey format, altyazı ve kapak karesi',
          'Platform kütüphanesinden müzik',
          'Sosyal medya için teslim',
        ],
      },
      {
        ad: 'Prodüksiyon',
        kapsam: [
          'Senaryo ve storyboard',
          'Çok sahneli çekim, röportaj desteği',
          'Gelişmiş kurgu, renk ve ses düzenlemesi',
          'Metin animasyonu ve grafik',
          'Reels, Shorts, TikTok ve web formatlarında dışa aktarım',
        ],
      },
      {
        ad: 'Tanıtım filmi',
        kapsam: [
          'Kurumsal tanıtım filmi veya marka videosu',
          'Çok lokasyonlu çekim planı',
          'Drone çekimi dahil',
          'Seslendirme ve müzik lisansı yönetimi',
          'Uzun sürüm ve sosyal medya kısa sürümleri',
        ],
      },
    ],
    sss: [
      { soru: 'Videolarda oyuncu kullanıyor musunuz?', cevap: 'Çoğu işte mekânın kendi ekibi en inandırıcı oluyor; kamera karşısında rahat olan bir çalışan, dışarıdan gelen bir yüzden daha iyi iş görüyor. Profesyonel oyuncu veya içerik üreticisi gerekiyorsa bunu ayrı bir kalem olarak planlıyoruz.' },
      { soru: 'Reels ne kadar uzun olmalı?', cevap: 'Tek bir doğru süre yok; anlatılan şeye bağlı. Mekân tanıtımı on beş saniyede bitebilir, bir süreç anlatımı kırk saniyeye çıkabilir. Kural şu: gereğinden uzun olan her saniye izlenme oranını düşürüyor.' },
      { soru: 'Müzik telif sorunu yaşar mıyım?', cevap: 'Bu riski baştan kapatıyoruz. Instagram ve TikTok’un işletme hesapları için sunduğu kütüphaneleri ya da lisansı net kaynakları kullanıyoruz. Hakkı doğrulanmamış popüler bir parçayı markanızın hesabına koymuyoruz.' },
      { soru: 'Çekilen videonun ham dosyalarını alabilir miyim?', cevap: 'Evet, talep ederseniz ham çekim dosyalarını da teslim ediyoruz. Dosya boyutu büyük olduğu için aktarımı harici disk veya bulut üzerinden planlıyoruz.' },
      { soru: 'Kurguda kaç revizyon hakkım var?', cevap: 'İlk kurgudan sonra bir tur düzeltme standart kapsamda. Kesim sırası, altyazı metni, müzik değişikliği gibi talepler bu turda karşılanıyor. Senaryoyu baştan değiştiren talepler yeni iş olarak ele alınıyor.' },
    ],
    anahtarKelimeler: ['video prodüksiyon ajansı İstanbul', 'reels çekimi', 'tanıtım filmi', 'sosyal medya video çekimi', 'kısa video prodüksiyon'],
    metaBaslik: 'Video ve Reels Prodüksiyonu İstanbul | Ajans Flow',
    metaAciklama: 'Senaryodan kurguya kısa video prodüksiyonu: dikey format, altyazı, kapak karesi ve lisansı temiz müzik. Tanıtım filmi ve Reels seti üretimi.',
    simge: '🎬',
    ilgiliHizmetler: ['kurgu-edit', 'tiktok', 'fotograf', 'drone', 'meta-reklam'],
    medya: 'video/kok-cafe-burger-hazirlama.mp4',
  },


  /* ---------------------------------------------------------------- */
  {
    anahtar: 'kurgu-edit',
    slug: 'kurgu-ve-edit',
    ad: 'Kurgu ve Edit (Post Prodüksiyon)',
    kisaAd: 'Kurgu ve edit',
    ozet: 'Elinizdeki ham çekimleri kurgu, renk, ses ve altyazıyla yayına hazır videolara dönüştürüyoruz.',
    aciklama: [
      'Çoğu işletmenin telefonunda yüzlerce çekim var ama yayınlanmış videosu yok. Çünkü zor olan kısım çekmek değil: hangi saniyenin kalacağına karar vermek, sesi dengelemek, altyazıyı yazmak ve aynı videoyu her platformun formatına uyarlamak. Kurgu ve edit hizmeti tam bu işi devralıyor. Çekimi siz yapın ya da biz yapalım; sonrasını biz bitiriyoruz.',
      'Akış basit: ham dosyaları bize aktarıyorsunuz, biz kullanılabilir anları ayıklıyor, kurguyu kuruyor, renk ve ses düzenlemesini yapıyor, altyazıyı yerleştiriyor ve kapak karesini hazırlıyoruz. Teslim tek dosya değil: aynı video dikey, kare ve yatay oranlarda çıkıyor. Böylece Reels, TikTok, Shorts ve web sitesi için ayrı sürümleriniz oluyor ve her platformda kadrajın dışında kalan bir baş ya da kesilen bir yazı olmuyor.',
      'Altyazıyı ciddiye alıyoruz çünkü kısa videoların büyük kısmı sessiz izleniyor. Otomatik çevirinin bıraktığı hâliyle değil, elden geçirilmiş, doğru yazılmış ve okunabilir boyutta yerleştirilmiş altyazı kullanıyoruz. Türkçe karakter hataları ve ekranın altında kaybolan satırlar bu işi baştan bozuyor.',
      'Düzenli çalışan markalar için haftalık edit paketi kuruyoruz: siz hafta boyunca çekiyor, belirli bir günde dosyaları gönderiyorsunuz, biz o haftanın videolarını kurgulayıp teslim ediyoruz. Üretim durmuyor ve her video için ayrı teklif beklemeniz gerekmiyor.',
    ],
    neleriKapsar: [
      'Ham dosyaların incelenmesi ve kullanılabilir anların ayıklanması',
      'Kurgu: kesim sırası, ritim ve tempo',
      'Renk düzenlemesi ve farklı çekimler arasında renk tutarlılığı',
      'Ses işi: seviye dengeleme, gürültü azaltma, müzik yerleşimi',
      'Altyazı yazımı, zamanlaması ve okunabilir yerleşimi',
      'Metin ve grafik animasyonları, logo ve marka ögelerinin eklenmesi',
      'Dikey (9:16), kare (1:1) ve yatay (16:9) formatlara uyarlama',
      'Reels, TikTok, Shorts ve web sitesi için ayrı dışa aktarım',
      'Kapak karesi hazırlanması',
      'İsimlendirilmiş klasör düzeniyle arşiv teslimi',
    ],
    kimeGore: [
      'Kendi çekimini yapan ama kurgulamaya zaman bulamayan işletmeler',
      'Telefonunda biriken çekimleri bir türlü kullanamayan markalar',
      'Düzenli kısa video üretmek isteyip edit darboğazına takılan ekipler',
      'Etkinlik veya organizasyon sonrası elinde çok materyal kalan kurumlar',
      'Mevcut videolarını başka platformların formatına uyarlamak isteyenler',
    ],
    surec: [
      { adim: 1, baslik: 'Dosya devri ve brief', aciklama: 'Ham dosyaları bulut üzerinden veya harici diskle alıyoruz. Hangi videonun nerede yayınlanacağını, hedef süreyi ve tonunu birlikte netleştiriyoruz.' },
      { adim: 2, baslik: 'Seçki ve kaba kurgu', aciklama: 'Kullanılabilir anları ayıklayıp kesim sırasını kuruyoruz. Kaba kurguyu önce size gösteriyoruz; akış onaylanmadan ince işe geçmiyoruz.' },
      { adim: 3, baslik: 'İnce kurgu', aciklama: 'Renk düzenlemesi, ses dengeleme, müzik, altyazı ve grafikler bu aşamada giriyor. Kapak karesi de burada hazırlanıyor.' },
      { adim: 4, baslik: 'Düzeltme turu', aciklama: 'Kesim sırası, altyazı metni veya müzik gibi talepleri tek turda topluyor ve uyguluyoruz.' },
      { adim: 5, baslik: 'Format uyarlama ve teslim', aciklama: 'Onaylı videoyu dikey, kare ve yatay oranlara uyarlıyor; platform başına ayrı dosya olarak isimlendirilmiş klasörde teslim ediyoruz.' },
    ],
    paket: [
      {
        ad: 'Tek video',
        kapsam: [
          'Bir videonun kurgusu',
          'Renk ve ses düzenlemesi',
          'Altyazı ve kapak karesi',
          'Tek platform için dışa aktarım',
          'Bir düzeltme turu',
        ],
      },
      {
        ad: 'Video seti',
        kapsam: [
          'Aynı çekimden birden fazla videonun kurgusu',
          'Metin ve grafik animasyonları',
          'Dikey, kare ve yatay format uyarlamaları',
          'Reels, TikTok, Shorts ve web için ayrı dosyalar',
          'Arşiv klasörü ve teslim listesi',
        ],
      },
      {
        ad: 'Haftalık edit paketi',
        kapsam: [
          'Her hafta belirli günde dosya devri ve teslim',
          'Hafta içinde sabit sayıda video kurgusu',
          'Marka şablonu: giriş, altyazı stili ve kapanış düzeni',
          'Tüm formatlarda dışa aktarım',
          'Aylık arşiv düzenlemesi',
        ],
      },
    ],
    sss: [
      { soru: 'Çekimi ben yapsam, yalnızca kurgu için çalışabilir miyiz?', cevap: 'Evet, bu hizmetin en çok talep edilen hâli bu. Çekimi siz yapıyorsunuz, kurgudan sonrasını biz bitiriyoruz. İlk işte kısa bir çekim yönergesi veriyoruz: hangi oranda, hangi ışıkta ve kaç saniyelik planlar çekerseniz kurgu daha iyi çıkıyor.' },
      { soru: 'Dosyaları nasıl göndereceğim, boyutları çok büyük?', cevap: 'Bulut üzerinden klasör paylaşımıyla çalışıyoruz; çok büyük arşivlerde harici diskle teslim alıp geri veriyoruz. Telefon çekimlerinde videoyu sıkıştırmadan, özgün kalitede göndermenizi istiyoruz; sıkıştırılmış dosya kurguda bozuluyor.' },
      { soru: 'Kaç düzeltme turu var?', cevap: 'Standart kapsamda kaba kurgu onayından sonra bir tur düzeltme bulunuyor. Kesim sırası, altyazı metni, müzik veya grafik değişikliği bu turda karşılanıyor. Videonun anlatımını baştan değiştiren talepler yeni iş olarak ele alınıyor.' },
      { soru: 'Altyazıyı otomatik mi çıkarıyorsunuz?', cevap: 'İlk döküm için otomatik araçlardan yararlanıyoruz ama yayına öyle çıkmıyor. Metni elden geçiriyor, Türkçe karakter ve noktalama hatalarını düzeltiyor, satır uzunluklarını okunacak şekilde bölüyoruz. Marka adları ve ürün isimlerini doğru yazdığımızdan ayrıca emin oluyoruz.' },
      { soru: 'Eski çekimlerimi kullanabilir misiniz?', cevap: 'Çoğu zaman evet. Arşivi inceleyip hangi karelerin kullanılabilir olduğunu söylüyoruz. Çok karanlık, aşırı titrek veya çözünürlüğü düşük görüntüleri kurguya zorla sokmuyoruz; sonuç markanızı iyi göstermiyor.' },
      { soru: 'Dikey ve yatay sürüm ayrı iş mi sayılıyor?', cevap: 'Aynı videonun format uyarlamaları video seti ve haftalık paket kapsamının içinde. Tek video paketinde bir platform için teslim yapıyoruz, ek formatları kapsamda açıkça yazıyoruz. Teklifte hangi formatların dahil olduğunu kalem kalem gösteriyoruz.' },
    ],
    anahtarKelimeler: ['video kurgu hizmeti', 'post prodüksiyon', 'video edit ajansı', 'reels kurgu', 'videoya altyazı ekleme'],
    metaBaslik: 'Video Kurgu ve Edit (Post Prodüksiyon)',
    metaAciklama: 'Ham çekimlerinizi kurgu, renk, ses ve altyazıyla bitiriyoruz. Dikey, kare ve yatay formatta Reels, TikTok ve Shorts teslimi. Haftalık edit paketleri.',
    simge: '✂️',
    ilgiliHizmetler: ['video', 'tiktok', 'fotograf', 'sosyal-medya'],
    medya: 'foto/kok-cafe-reels-burger-sunumu.jpg',
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'drone',
    slug: 'drone-cekimi',
    ad: 'Drone Çekimi',
    kisaAd: 'Drone çekimi',
    ozet: 'Tesisinizi, projenizi ve etkinliğinizi havadan, tek karede anlatan görüntülerle çekiyoruz.',
    aciklama: [
      'Bazı işler yerden anlatılamıyor. Bir go kart pistinin uzunluğu, bir inşaat projesinin konumu, bir tesisin büyüklüğü ya da bir sahil mekânının manzarası ancak havadan görüldüğünde anlaşılıyor. Drone çekimi tam bu anlatım için var: ziyaretçi, mekâna gelmeden önce ölçeği kavrıyor.',
      'Çekim planını uçuş kurallarına göre yapıyoruz. Her yere, her saatte ve her yükseklikte uçulamıyor; havalimanı çevresi, kalabalık alanlar ve bazı bölgeler için ayrı değerlendirme gerekiyor. Lokasyonu önceden kontrol ediyor, uçuşun uygun olup olmadığını size çekimden önce söylüyoruz. Uygun değilse alternatif açılar öneriyoruz, "nasılsa görülmez" diyerek uçmuyoruz.',
      'Teslimde iki şeye dikkat ediyoruz: havadan çekilen görüntünün yerdeki çekimle aynı renk diline oturması ve sosyal medya için dikey kırpımın baştan düşünülmesi. Yoksa güzel bir havadan plan, telefonda kadrajın dışında kalıyor.',
    ],
    neleriKapsar: [
      'Uçuş öncesi lokasyon ve mevzuat değerlendirmesi',
      'Havadan video ve fotoğraf çekimi',
      'Yükselen açı, yörünge ve takip çekimleri',
      'Tesis, pist, şantiye ve arazi görüntüleme',
      'Etkinlik ve kalabalık açılarının planlı çekimi',
      'Yer çekimleriyle renk uyumu',
      'Sosyal medya için dikey kırpım, web için geniş kırpım',
      'Kurgu ve müzikli kısa sürüm teslimi',
    ],
    kimeGore: [
      'Go kart pisti, halı saha, airsoft ve açık alan eğlence tesisleri',
      'İnşaat firmaları ve emlak projeleri',
      'Otel, tatil köyü, plaj ve sahil işletmeleri',
      'Fabrika, depo ve geniş arazili işletmeler',
      'Açık hava etkinliği düzenleyen organizasyonlar',
    ],
    surec: [
      { adim: 1, baslik: 'Lokasyon kontrolü', aciklama: 'Adresi ve çevresini inceliyor, uçuşun uygun olup olmadığını ve en iyi saat aralığını belirliyoruz.' },
      { adim: 2, baslik: 'Uçuş planı', aciklama: 'Hangi açılar çekilecek, hangi hareket kullanılacak? Planı sizinle paylaşıyoruz.' },
      { adim: 3, baslik: 'Çekim', aciklama: 'Havadan planları çekiyor, aynı gün yerden destek çekimleri alıyoruz. İkisi birlikte kurguda birbirini tamamlıyor.' },
      { adim: 4, baslik: 'Kurgu ve teslim', aciklama: 'Renk düzenlemesi, kurgu ve kırpımlar hazırlanıyor; web ve sosyal medya için ayrı dosyalar teslim ediliyor.' },
    ],
    paket: [
      {
        ad: 'Tek lokasyon',
        kapsam: [
          'Tek adreste havadan çekim',
          'Havadan fotoğraf ve kısa video planları',
          'Temel renk düzenlemesi',
          'Sosyal medya kırpımıyla teslim',
        ],
      },
      {
        ad: 'Havadan ve yerden',
        kapsam: [
          'Aynı gün havadan ve yerden çekim',
          'Kurgulu tanıtım videosu',
          'Müzik ve altyazı',
          'Dikey ve yatay sürüm',
        ],
      },
      {
        ad: 'Proje takibi',
        kapsam: [
          'Belirli aralıklarla tekrarlayan uçuşlar',
          'İnşaat veya proje ilerleme arşivi',
          'Dönem karşılaştırmalı görsel teslim',
          'Yıl sonu derleme videosu',
        ],
      },
    ],
    sss: [
      { soru: 'Her yerde drone uçurulabiliyor mu?', cevap: 'Hayır. Havalimanı çevresi, bazı kamu alanları ve kalabalık ortamlar için kısıtlamalar var; bazı uçuşlar ayrı izin gerektiriyor. Lokasyonu çekimden önce değerlendirip size net cevap veriyoruz.' },
      { soru: 'Mevzuat değişirse ne oluyor?', cevap: 'İnsansız hava aracı mevzuatı Sivil Havacılık Genel Müdürlüğü tarafından güncelleniyor ve değişebiliyor. Her çekim öncesi güncel durumu kontrol ediyoruz; yine de kendi işletmenizle ilgili özel bir uçuş planlıyorsanız güncel kuralları SHGM’nin resmî kaynağından teyit etmenizi öneriyoruz.' },
      { soru: 'Hava şartları çekimi etkiler mi?', cevap: 'Evet, en çok rüzgâr. Rüzgâr sınırının üstünde uçmuyoruz; görüntü titriyor ve güvenli olmuyor. Bu durumda çekimi erteliyoruz ve ek ücret talep etmiyoruz.' },
      { soru: 'Etkinlikte kalabalığın üstünden çekim yapabiliyor musunuz?', cevap: 'Kalabalık üzerinde uçuş ayrı bir risk ve ayrı bir izin konusu. Bu tür çekimlerde kalabalığın yanından, güvenli mesafeden açılar planlıyoruz; sonucu çoğu zaman tepeden çekimden daha etkileyici oluyor.' },
      { soru: 'Çekimi ne kadar sürede teslim ediyorsunuz?', cevap: 'Teslim süresi kurgunun kapsamına bağlı; teklif aşamasında tarih veriyoruz. Yalnızca ham havadan görüntü isteniyorsa çekimin ertesi günü aktarım yapabiliyoruz.' },
    ],
    anahtarKelimeler: ['drone çekimi İstanbul', 'havadan çekim', 'drone çekim fiyatları', 'drone tanıtım videosu', 'şantiye havadan çekim'],
    metaBaslik: 'Drone Çekimi İstanbul | Havadan Çekim - Ajans Flow',
    metaAciklama: 'Tesis, pist, şantiye ve etkinlik için havadan video ve fotoğraf çekimi. Uçuş öncesi lokasyon değerlendirmesi, kurgu ve dikey kırpımla teslim.',
    simge: '🚁',
    ilgiliHizmetler: ['video', 'fotograf', 'web-sitesi'],
    medya: 'foto/mas-gokart-pist-drone-01.jpg',
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'meta-reklam',
    slug: 'meta-reklam-yonetimi',
    ad: 'Meta (Instagram/Facebook), Google ve TikTok Reklam Yönetimi',
    kisaAd: 'Reklam yönetimi',
    ozet: 'Üç platformdaki reklamlarınızı tek elden kuruyor, kreatifini üretiyor ve sonuç başına maliyet düşene kadar iyileştiriyoruz.',
    aciklama: [
      'Instagram’daki "Tanıtımı Öne Çıkar" düğmesi kolay olduğu için yaygın, ama ölçümü de hedeflemesi de zayıf. Reklamın asıl gücü platformların kendi reklam yöneticilerinde: hangi kitleye, hangi mesajla, hangi yerleşimde göründüğünüzü seçiyor ve sonucu kampanya bazında görüyorsunuz. Biz işi oradan yürütüyoruz.',
      'Üç platformu birlikte yönetiyoruz çünkü üçü farklı işe yarıyor. Meta (Instagram ve Facebook) ilgi ve bölge hedeflemesinde güçlü; mesaj, form ve ziyaret toplamanın en hızlı yolu. Google aramada ihtiyacı yakalıyor: çözüm arayan kişinin karşısına çıkıyorsunuz. TikTok ise yeni kitleye ulaşmakta güçlü ve kreatif maliyeti düşük. Hangisine ne kadar bütçe gideceğine tek bir tabloya bakıp birlikte karar veriyoruz.',
      'İlk ay kurulum ayı ve bu ayı atlamıyoruz. Meta Business hesabınızın yapısını düzene sokuyor, sayfa ve reklam hesabı bağlantılarını kuruyor, piksel ile dönüşüm API bağlantısını doğruluyor, varsa ürün kataloğunu bağlıyoruz. TikTok tarafında işletme hesabı, reklam hesabı ve pixel kurulumunu yapıyoruz. Ölçüm doğrulanmadan bütçeyi büyütmüyoruz.',
      'Bütçe konusunda net olalım: reklam bütçesi doğrudan Meta, Google veya TikTok’a ödenir ve bizim hizmet bedelinden ayrıdır. Bütçeyi siz belirliyorsunuz, harcamayı panelden canlı görüyorsunuz. Bütçe üzerinden komisyon almıyoruz; bize ödediğiniz bedel kurulum, kreatif, test, optimizasyon ve raporlama işinin karşılığı.',
    ],
    neleriKapsar: [
      'Meta Business kurulumu: işletme hesabı yapısı, sayfa ve reklam hesabı bağlantıları, rol ve izin yönetimi, işletme doğrulaması',
      'Ölçüm kurulumu: Meta pixel ve dönüşüm API, TikTok pixel, Google dönüşüm etiketleri ve olay doğrulaması',
      'Ürün kataloğu bağlantısı ve katalog reklamları (mağaza ve e-ticaret için)',
      'Mesaj yönetimi: Meta Inbox düzeni, WhatsApp ve Instagram mesaj kampanyaları, hazır yanıt seti',
      'Kitle kurulumu: ilgi alanı, bölge ve yarıçap, benzer kitle, yeniden pazarlama',
      'Google Ads tarafında arama ve harita kampanyaları (ayrıntılı kurgu Google Ads sayfasında)',
      'TikTok Ads kurulumu: kampanya yapısı, ilgi ve davranış hedeflemesi, Spark Ads ile mevcut videoların reklama çevrilmesi',
      'Kreatif üretimi: reklam metinleri, görsel ve dikey video varyantları',
      'Haftalık optimizasyon: kapatma, bütçe kaydırma, yeni varyant, arama terimi temizliği',
      'Platform kırılımlı aylık rapor: harcama, erişim, sonuç ve sonuç başına maliyet',
    ],
    kimeGore: [
      'Düğmeye basıp tanıtım yapan ama sonucu ölçemeyen işletmeler',
      'Randevu, rezervasyon veya mesaj talebi toplamak isteyen yerel işletmeler',
      'Belirli bir semt veya yarıçapta müşteri arayan mekânlar',
      'Satış yapan mağaza ve e-ticaret işletmeleri',
      'Birden fazla platformda reklam veren ama hangisinin çalıştığını bilmeyen markalar',
    ],
    surec: [
      { adim: 1, baslik: 'Kurulum', aciklama: 'Meta Business yapısını, TikTok ve Google reklam hesaplarını düzene sokuyoruz; pixel, dönüşüm olayları ve varsa katalog bağlantısını kurup her olayı tek tek test ederek doğruluyoruz. Ölçüm çalışmadan kampanya açmıyoruz.' },
      { adim: 2, baslik: 'Kreatif', aciklama: 'Her platform için ayrı kreatif üretiyoruz: Meta’ya görsel ve kısa video, TikTok’a platformun diline uygun dikey video, Google’a arama reklam metinleri. Aynı kreatifi üç yere kopyalamak en sık yapılan hata.' },
      { adim: 3, baslik: 'Test', aciklama: 'Kontrollü bütçeyle birkaç kitle ve birkaç kreatifi aynı anda deniyoruz. Amaç bu aşamada satış değil, hangi mesajın ve hangi kitlenin tuttuğunu öğrenmek. Test süresini ve bütçesini baştan yazıyoruz.' },
      { adim: 4, baslik: 'Optimizasyon', aciklama: 'Kazanan kurguya bütçe kaydırıyor, verim alınamayanı kapatıyoruz. Haftalık olarak arama terimlerini temizliyor, yorulan kreatifi yeniliyor ve platformlar arası bütçe dağılımını sonuca göre güncelliyoruz.' },
      { adim: 5, baslik: 'Raporlama', aciklama: 'Ay sonunda platform kırılımlı tek sayfa: ne harcandı, kaç sonuç geldi, sonuç başına maliyet ne oldu ve gelecek ay nereye ağırlık vereceğiz. Raporu birlikte okuyup kararı veriyoruz.' },
    ],
    paket: [
      {
        ad: 'Kurulum ve ölçüm',
        kapsam: [
          'Meta Business hesap yapısı, sayfa ve reklam hesabı bağlantıları',
          'Rol, izin ve işletme doğrulaması düzeni',
          'Meta pixel ve dönüşüm API kurulumu, olay doğrulaması',
          'Tek platformda ilk kampanyanın kurulumu ve yayına alınması',
          'Panel kullanım eğitimi ve devir notu',
        ],
      },
      {
        ad: 'Aylık reklam yönetimi',
        kapsam: [
          'Seçtiğiniz platformlarda sürekli kampanya yönetimi',
          'Kreatif üretimi: reklam metni ve görsel varyantları',
          'Yeniden pazarlama kitleleri',
          'Mesaj kampanyaları ve Inbox düzeni',
          'Haftalık optimizasyon ve kreatif yenileme',
          'Platform kırılımlı aylık rapor',
        ],
      },
      {
        ad: 'Çok platformlu yönetim ve kreatif üretim',
        kapsam: [
          'Meta, Google ve TikTok kampanyalarının birlikte yönetimi',
          'TikTok Ads ve Spark Ads kurgusu',
          'Reklam için özel çekim, dikey video ve kurgu üretimi',
          'Ürün kataloğu bağlantısı ve katalog reklamları',
          'Açılış sayfası veya form sayfası geliştirmesi',
          'Platformlar arası bütçe dağılımı ve aylık rapor sunumu',
        ],
      },
    ],
    sss: [
      { soru: 'Reklam bütçesi ne kadar olmalı?', cevap: 'Tek bir doğru rakam yok; hedefinize, bölgenizin rekabetine ve ürününüzün fiyatına bağlı. Bunu birlikte hesaplıyoruz: aylık kaç yeni müşteri istiyorsunuz, bir müşterinin size değeri ne, kaç mesajdan bir satış çıkıyor? Bu üç bilgiden anlamlı bir bütçe çıkıyor.' },
      { soru: 'Reklam bütçesini kime ödüyorum?', cevap: 'Doğrudan platforma: Meta, Google veya TikTok’a. Kendi kartınızı veya işletme kartınızı reklam hesabına tanımlıyorsunuz; harcamayı canlı olarak panelden görüyorsunuz. Bütçe üzerinden komisyon almıyoruz, hizmet bedeli ayrı.' },
      { soru: 'Üç platformda birden reklam vermem şart mı?', cevap: 'Değil. Tek platformla başlamak çoğu işletme için daha sağlıklı; bütçe bölünmediği için öğrenme daha hızlı oluyor. Hangisiyle başlanacağına işinize göre karar veriyoruz ve sonuç geldikçe ikinci platformu ekliyoruz.' },
      { soru: 'TikTok reklamı yerel bir işletme için işe yarar mı?', cevap: 'Kitlesi uygunsa yarıyor; özellikle genç kitleye ve yeni açılan mekânlara ulaşmakta kreatif maliyeti düşük kalıyor. Avantajı şu: mevcut TikTok videolarınızı Spark Ads ile doğrudan reklama çevirebiliyoruz, sıfırdan reklam filmi çekmeniz gerekmiyor. Kitleniz TikTok’ta değilse bütçeyi oraya aktarmıyoruz.' },
      { soru: 'Reklam hesabım kapatıldı, düzeltebilir misiniz?', cevap: 'Kapatma sebebine bakıyoruz. Çoğu durumda eksik işletme doğrulaması, reklam politikasına aykırı metin veya ödeme sorunu çıkıyor; bunları düzeltip itiraz sürecini yürütebiliyoruz. Meta’nın kararını garanti edemeyeceğimizi baştan söylüyoruz.' },
      { soru: 'Kampanya amacını ve reklam kreatifini kim belirliyor?', cevap: 'Kampanya amacını işinizin dönüşüm yoluna göre biz öneriyor, siz onaylıyorsunuz: randevuyla çalışan bir salonda mesaj, satış yapan bir mağazada satış, yeni açılan bir mekânda erişim kampanyası daha mantıklı oluyor. Kreatifi aylık yönetim paketinde mevcut arşivinizden hazırlıyoruz; reklam için özel çekim veya dikey video gerekiyorsa prodüksiyonu da üstleniyor ve kapsamı teklifte ayrı yazıyoruz.' },
    ],
    anahtarKelimeler: ['Instagram reklam ajansı', 'Meta reklam yönetimi', 'Facebook reklam ajansı', 'tiktok reklam yönetimi', 'tiktok ajansı', 'Meta Business kurulumu'],
    metaBaslik: 'Meta, Google ve TikTok Reklam Yönetimi | Ajans Flow',
    metaAciklama: 'Meta Business kurulumu, pixel ve dönüşüm ölçümü, TikTok Ads ve arama reklamları. Kurulum, kreatif, test, optimizasyon ve aylık raporlama döngüsü.',
    simge: '🎯',
    ilgiliHizmetler: ['google-ads', 'tiktok', 'kurgu-edit', 'veri-analizi', 'web-sitesi'],
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'google-ads',
    slug: 'google-ads-yonetimi',
    ad: 'Google Ads Yönetimi',
    kisaAd: 'Google Ads',
    ozet: 'Hizmetinizi arayan kişinin karşısına, doğru anahtar kelimeyle ve ölçülebilir şekilde çıkıyoruz.',
    aciklama: [
      'Sosyal medya reklamı insanın ilgisini yakalar; Google reklamı ihtiyacını yakalar. "4.Levent diş kliniği" ya da "oto galeri araç değerleme" yazan kişi çözüm arıyor, keşif yapmıyor. Bu yüzden Google Ads doğru kurulduğunda en yüksek niyetli trafiği getiriyor.',
      'Yanlış kurulduğunda ise en hızlı para harcayan kanal. Geniş eşleme bırakılmış bir kampanya, işinizle alakası olmayan aramalarda gösterilip bütçeyi birkaç günde bitiriyor. Biz anahtar kelime listesini daraltarak, hariç tutulan kelimeleri düzenli güncelleyerek ve dönüşümleri gerçekten ölçerek çalışıyoruz.',
      'Her kampanyada tek bir soruya cevap arıyoruz: bir müşteri adayı bize kaça geliyor? Arama hacmi, tıklama sayısı ve gösterim güzel rakamlar ama kasaya girmiyor. Telefon, form ve WhatsApp dönüşlerini ölçüme bağlayıp maliyeti o eksende izliyoruz.',
    ],
    neleriKapsar: [
      'Google Ads hesabı kurulumu ve faturalandırma düzeni',
      'Anahtar kelime araştırması ve hariç tutulan kelime listesi',
      'Arama ağı kampanyaları ve reklam metin varyantları',
      'Yerel kampanyalar: belirli ilçe veya yarıçap hedefleme',
      'Arama, Performance Max ve yeniden pazarlama kurguları',
      'Dönüşüm takibi: form gönderimi, telefon tıklaması, WhatsApp',
      'Açılış sayfası önerileri ve dönüşüm engellerinin giderilmesi',
      'Aylık rapor: harcama, dönüşüm ve dönüşüm başına maliyet',
    ],
    kimeGore: [
      'Hizmeti aranan, acil ihtiyaç karşılayan işletmeler (servis, klinik, hukuk, tamir)',
      'Belirli bir bölgeden müşteri çeken yerel işletmeler',
      'Niş bir ürün veya yazılım satan, arama hacmi düşük ama niyeti yüksek işler',
      'Reklam harcamasının geri dönüşünü rakamla görmek isteyen yöneticiler',
    ],
    surec: [
      { adim: 1, baslik: 'Arama niyeti araştırması', aciklama: 'Müşterinizin hangi kelimelerle aradığını çıkarıyoruz. Satın alma niyeti olan kelimelerle bilgi arayan kelimeleri ayırıyoruz.' },
      { adim: 2, baslik: 'Ölçüm kurulumu', aciklama: 'Form, telefon ve WhatsApp dönüşlerini ölçüme bağlıyoruz. Ölçüm olmadan kampanya yayına almıyoruz.' },
      { adim: 3, baslik: 'Kampanya kurulumu', aciklama: 'Kampanya yapısını, reklam metinlerini ve uzantıları hazırlayıp yayına alıyoruz.' },
      { adim: 4, baslik: 'Arama terimi temizliği', aciklama: 'Hangi aramalarda göründüğünüzü haftalık inceliyor, alakasız olanları hariç tutuyoruz. Bütçeyi en çok bu adım koruyor.' },
      { adim: 5, baslik: 'Raporlama ve büyütme', aciklama: 'Dönüşüm başına maliyeti izliyor, verim veren kampanyayı büyütüyoruz.' },
    ],
    paket: [
      {
        ad: 'Kurulum',
        kapsam: [
          'Google Ads hesabı kurulumu',
          'Anahtar kelime ve hariç tutulan kelime listesi',
          'Tek kampanya kurulumu ve reklam metinleri',
          'Dönüşüm takibi kurulumu',
          'Panel kullanım eğitimi',
        ],
      },
      {
        ad: 'Aylık yönetim',
        kapsam: [
          'Çok kampanyalı yönetim',
          'Haftalık arama terimi temizliği',
          'Reklam metni testleri ve uzantı güncellemeleri',
          'Yeniden pazarlama kampanyası',
          'Aylık rapor',
        ],
      },
      {
        ad: 'Yönetim ve açılış sayfası',
        kapsam: [
          'Kampanya yönetimi',
          'Reklam için özel açılış sayfası tasarımı ve yazılımı',
          'Form ve WhatsApp dönüşüm akışı',
          'Google İşletme Profili ile birlikte yerel kurgu',
          'Meta reklamlarıyla ortak bütçe planı',
          'Aylık rapor sunumu',
        ],
      },
    ],
    sss: [
      { soru: 'Google Ads mi, SEO mu daha iyi?', cevap: 'İkisi farklı işe yarıyor. Reklam yarın müşteri getirir ama ödemeyi kestiğinizde durur; SEO ve içerik yavaş birikir ama kalıcıdır. Yeni açılan işletmelerde reklamla başlayıp içeriği paralel kurmak genelde en sağlıklı yol.' },
      { soru: 'Reklam bütçesini kime ödeyeceğim?', cevap: 'Doğrudan Google’a. Kartınız reklam hesabına tanımlı olur, faturayı Google keser. Bizim hizmet bedelimiz kampanya yönetiminin karşılığıdır ve bütçeden bağımsızdır.' },
      { soru: 'İlk sıra garantisi veriyor musunuz?', cevap: 'Hayır, kimse veremez. Reklam sıralaması teklif, reklam kalitesi ve açılış sayfası deneyiminin birlikte hesaplandığı bir açık artırmayla belirleniyor. Garanti sözü veren bir teklife temkinli yaklaşmanızı öneririz.' },
      { soru: 'Hesabın sahibi kim olacak?', cevap: 'Hesap sizin adınıza açılıyor ve sahipliği sizde kalıyor. Biz yönetici erişimiyle çalışıyoruz; çalışmayı bitirirseniz erişim kapanır, hesap ve veri sizde kalır. Bu, ajans değiştirirken geçmiş verinizi kaybetmemeniz için önemli.' },
      { soru: 'Küçük bütçeyle Google Ads mantıklı mı?', cevap: 'Niş ve yerel aramalarda evet; herkesin yarıştığı geniş kelimelerde küçük bütçe çabuk tükeniyor. Bu yüzden ilk ayda bütçeyi dar bir kelime grubunda ve küçük bir bölgede yoğunlaştırmayı tercih ediyoruz.' },
    ],
    anahtarKelimeler: ['Google Ads ajansı', 'Google reklam yönetimi', 'Google Ads uzmanı İstanbul', 'arama reklamları yönetimi'],
    metaBaslik: 'Google Ads Yönetimi | Google Reklam Ajansı',
    metaAciklama: 'Google arama reklamlarının kurulumu, anahtar kelime ve hariç tutma yönetimi, dönüşüm ölçümü. Müşteri adayı başına maliyeti rakamla takip ediyoruz.',
    simge: '🔍',
    ilgiliHizmetler: ['meta-reklam', 'google-isletme', 'web-sitesi', 'veri-analizi'],
    // Not: Meta ve TikTok tarafı ile ortak bütçe yönetimi reklam-yonetimi sayfasında anlatılır.
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'google-isletme',
    slug: 'google-isletme-profili',
    ad: 'Google İşletme Profili Yönetimi',
    kisaAd: 'Google İşletme Profili',
    ozet: 'Haritalarda ve aramalarda doğru bilgiyle, güncel fotoğrafla ve yanıtlanmış yorumlarla görünmenizi sağlıyoruz.',
    aciklama: [
      'Yerel bir işletme için en çok iş getiren dijital varlık çoğu zaman web sitesi değil, Google İşletme Profili. İnsan telefonunu çıkarıp "yakınımdaki kafe" veya "Levent noter" yazıyor ve haritadaki kartlara bakıyor. O kartta eksik telefon, yanlış çalışma saati ya da üç yıllık bir fotoğraf varsa sıradaki işletmeye geçiyor.',
      'Profili baştan düzene sokuyoruz: kategori seçimi, hizmet listesi, çalışma saatleri, hizmet bölgesi, randevu ve menü bağlantıları, ürün kartları. Ardından düzenli bakımı kuruyoruz: yeni fotoğraf yüklenmesi, gönderi paylaşımı, soru-cevap bölümünün doldurulması ve yorumlara zamanında yanıt verilmesi.',
      'Yorum konusunda net bir sınırımız var: yorum satın almıyoruz, sahte yorum yazmıyoruz ve karşılığında indirim vaat eden yorum kampanyaları kurmuyoruz. Bunlar hem platform kurallarına hem tüketici mevzuatına aykırı. Bunun yerine gerçek müşteriden yorum istemeyi kolaylaştıran akışlar kuruyoruz: QR kod, kısa bağlantı, fiş üzerinde çağrı.',
    ],
    neleriKapsar: [
      'Profil açma veya sahiplik doğrulaması desteği',
      'Kategori, hizmet ve ürün listelerinin doldurulması',
      'Ad, adres, telefon bilgisinin site ve sosyal medyayla birebir eşlenmesi',
      'Çalışma saatleri, tatil günleri ve hizmet bölgesi düzeni',
      'Fotoğraf yüklemeleri ve kapak düzeni',
      'Düzenli işletme gönderileri (kampanya, duyuru, etkinlik)',
      'Soru-cevap bölümünün hazırlanması',
      'Yorumlara yanıt yazımı ve gerçek yorum toplama akışı (QR veya kısa bağlantı)',
      'Arama ve harita görünüm istatistiklerinin raporlanması',
    ],
    kimeGore: [
      'Fiziksel adrese müşteri çeken tüm yerel işletmeler',
      'Haritada yanlış veya eksik bilgiyle görünen işletmeler',
      'Yorumları yanıtsız kalan mekânlar',
      'Yeni açılan ve haritada henüz yer almayan işletmeler',
    ],
    surec: [
      { adim: 1, baslik: 'Profil denetimi', aciklama: 'Mevcut profili, kategorileri ve rakiplerin görünümünü inceliyoruz. Eksik ve hatalı alanları listeliyoruz.' },
      { adim: 2, baslik: 'Bilgi düzeni', aciklama: 'Ad, adres, telefon, saat ve hizmet bilgisini düzeltip sitedeki bilgiyle birebir aynı hâle getiriyoruz.' },
      { adim: 3, baslik: 'Görsel ve içerik', aciklama: 'Güncel fotoğrafları yükleyip ilk gönderileri ve soru-cevap bölümünü hazırlıyoruz.' },
      { adim: 4, baslik: 'Yorum akışı', aciklama: 'Gerçek müşterinin yorum bırakmasını kolaylaştıran QR veya kısa bağlantı kurgusunu kuruyoruz.' },
      { adim: 5, baslik: 'Aylık bakım', aciklama: 'Gönderi, fotoğraf ve yorum yanıtlarını sürdürüyor; arama ve yol tarifi istatistiklerini raporluyoruz.' },
    ],
    paket: [
      {
        ad: 'Düzenleme',
        kapsam: [
          'Profil denetimi ve eksik alanların doldurulması',
          'Kategori ve hizmet listesi düzeni',
          'Bilgi tutarlılığı (ad-adres-telefon) kontrolü',
          'İlk fotoğraf yüklemesi',
          'Yorum yanıt şablonları',
        ],
      },
      {
        ad: 'Aylık bakım',
        kapsam: [
          'Düzenli işletme gönderileri',
          'Aylık fotoğraf yüklemesi',
          'Yorum yanıtlarının yazılması',
          'Soru-cevap bölümünün güncellenmesi',
          'Aylık görünüm raporu',
        ],
      },
      {
        ad: 'Çok şubeli',
        kapsam: [
          'Birden fazla şube profilinin yönetimi',
          'Şubeler arası bilgi tutarlılığı',
          'Şube bazlı gönderi ve fotoğraf planı',
          'Yorum yönetiminin merkezi takibi',
          'Şube karşılaştırmalı rapor',
        ],
      },
    ],
    sss: [
      { soru: 'Profilim yok, nasıl açılıyor?', cevap: 'İşletme adı, kategori ve adresle başvuru yapılıyor; Google sahipliği doğrulamak için genelde adrese kod gönderiyor ve bu süreç birkaç haftayı alabiliyor. Doğrulama size ait bir adım, biz hazırlığı ve sonrasını yürütüyoruz.' },
      { soru: 'Haritada ilk sırada çıkmayı garanti ediyor musunuz?', cevap: 'Hayır. Harita sıralaması aramanın yapıldığı konuma, aranan kelimeye, profilin eksiksizliğine ve yorumlara göre değişiyor; kimse sabit bir sıra garanti edemez. Bizim işimiz kontrol edilebilir alanları en iyi hâle getirmek.' },
      { soru: 'Olumsuz yorumu silebiliyor musunuz?', cevap: 'Yorum silme yetkisi Google’da. Politika ihlali içeren yorumları (küfür, alakasız içerik, rakip saldırısı) bildiriyoruz ama sonucu garanti edemiyoruz. Asıl etkili yol olumsuz yoruma sakin, çözüm öneren bir yanıt yazmak; bunu okuyan yeni müşteri yorumdan çok yanıta bakıyor.' },
      { soru: 'Yorum karşılığında indirim verebilir miyiz?', cevap: 'Önermiyoruz. Yorum teşviki Google politikalarına aykırı ve tüketici mevzuatı açısından da sorunlu. Memnun müşteriden yorum istemek serbest; karşılığında bir şey vaat etmek değil.' },
      { soru: 'Sitedeki bilgiyle profildeki bilgi neden aynı olmalı?', cevap: 'Google aynı işletmeye ait bilgileri karşılaştırıyor; adres veya telefon farklı yazıldığında güven sinyali zayıflıyor. Bu yüzden sitede, profilde ve sosyal medyada aynı yazımı kullanıyoruz.' },
    ],
    anahtarKelimeler: ['Google İşletme Profili yönetimi', 'Google Haritalar’da üst sıraya çıkma', 'yerel SEO', 'Google Benim İşletmem'],
    metaBaslik: 'Google İşletme Profili Yönetimi | Ajans Flow',
    metaAciklama: 'Haritalarda doğru bilgi, güncel fotoğraf, düzenli gönderi ve yanıtlanmış yorumlar. Gerçek müşteriden yorum toplama akışı kuruyoruz.',
    simge: '📍',
    ilgiliHizmetler: ['google-ads', 'web-sitesi', 'qr-menu', 'veri-analizi'],
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'web-sitesi',
    slug: 'web-sitesi-tasarimi',
    ad: 'Web Sitesi Tasarımı ve Yazılımı',
    kisaAd: 'Web sitesi',
    ozet: 'Hazır şablon değil; işinizin akışına göre kurgulanmış, hızlı açılan ve form dolduran bir site yazıyoruz.',
    aciklama: [
      'Çoğu kurumsal site birbirinin kopyası: anasayfa, hakkımızda, hizmetler, iletişim. Oysa işletmelerin ihtiyacı farklı. Bir go kart pistinin sitesinde seans takvimi, bir oto galerinin sitesinde araç değerleme formu, bir kafenin sitesinde menü ve rezervasyon, bir hukuk bürosunun sitesinde KVKK uyumlu randevu formu olmalı. Biz siteyi bu akışın üzerine kuruyoruz.',
      'Önce maket, sonra kod. Yazılıma başlamadan önce tıklanabilir bir maket hazırlıyoruz; ekranları gezip "burası böyle olmasın" diyebiliyorsunuz. Onay sonrası geliştirmeye geçiyoruz. Bu yöntem hem sürprizleri hem de yazıldıktan sonra yapılan pahalı değişiklikleri önlüyor.',
      'Teknik tarafı ciddiye alıyoruz çünkü hız ve mobil deneyim doğrudan satışı etkiliyor. Site mobil öncelikli yazılıyor; WhatsApp ve Instagram uygulama içi tarayıcılarında kusursuz açılmalı, zayıf bağlantıda da hızlı yüklenmeli. Her sayfanın kendine ait başlığı, açıklaması ve yapısal verisi oluyor; sitemap ve robots dosyaları yayına hazır geliyor.',
      'Formlar yalnızca e-posta göndermiyor. Gelen talebi yönetim panelinize aday olarak düşürüyor, KVKK aydınlatma onayını kayda alıyor ve sahte gönderime karşı koruma kuruyoruz. Böylece "form çalışıyor mu" diye tedirgin olmuyorsunuz.',
    ],
    neleriKapsar: [
      'İçerik ve sayfa haritası planlaması',
      'Tıklanabilir maket (prototip) ve onay turu',
      'Mobil öncelikli arayüz tasarımı',
      'Sektöre özel modüller: randevu, rezervasyon, portföy, ilan, galeri, değerleme formu',
      'KVKK aydınlatma onaylı iletişim formu, spam koruması ve taleplerin yönetim paneline düşmesi',
      'Çoklu dil desteği (gereken projelerde)',
      'Teknik SEO: sayfa başına başlık ve açıklama, canonical, sitemap, robots, yapısal veri',
      'Hız optimizasyonu ve mobil uyum testleri',
      'Yayına alma, alan adı ve e-posta yönlendirmeleri',
      'Yayın sonrası düzeltme ve bakım dönemi',
    ],
    kimeGore: [
      'Sitesi olmayan ya da yıllardır güncellenmeyen işletmeler',
      'Siteye girip hiç form doldurulmayan, telefonun çalmadığı işletmeler',
      'Sektöre özel bir akışa (rezervasyon, randevu, portföy, ilan) ihtiyaç duyanlar',
      'Reklam vermeye başlayacak ve düzgün bir açılış sayfası gereken markalar',
      'Kendi iç işini de yazılımla düzene sokmak isteyen işletmeler',
    ],
    surec: [
      { adim: 1, baslik: 'İhtiyaç ve kapsam', aciklama: 'Siteye gelen ziyaretçinin hangi adımı atmasını istiyorsunuz? Kapsamı ve sayfa haritasını buna göre yazıyoruz.' },
      { adim: 2, baslik: 'Maket', aciklama: 'Tıklanabilir maketi hazırlıyoruz. Ekranları gezerek yorum yapıyorsunuz; kod yazılmadan değişiklik ücretsiz.' },
      { adim: 3, baslik: 'Geliştirme', aciklama: 'Onaylı maketi koda döküyoruz. İçerik ve görselleri yerleştirip modülleri çalışır hâle getiriyoruz.' },
      { adim: 4, baslik: 'Test', aciklama: 'Mobil, tablet ve masaüstünde; WhatsApp ve Instagram içi tarayıcılarda test ediyoruz. Formların uçtan uca çalıştığını doğruluyoruz.' },
      { adim: 5, baslik: 'Yayın ve bakım', aciklama: 'Alan adına bağlayıp yayına alıyoruz. Arama konsolu kurulumunu yapıyor, ilk dönemde düzeltmeleri karşılıyoruz.' },
    ],
    paket: [
      {
        ad: 'Vitrin',
        kapsam: [
          'Tek sayfalık veya az sayfalı tanıtım sitesi',
          'Mobil öncelikli tasarım',
          'KVKK onaylı iletişim formu',
          'WhatsApp ve harita bağlantıları',
          'Temel teknik SEO ve yayına alma',
        ],
      },
      {
        ad: 'Kurumsal',
        kapsam: [
          'Çok sayfalı site: hizmet, sektör, çalışmalar, blog',
          'Tıklanabilir maket ve onay turu',
          'Sektöre özel bir modül (randevu, portföy veya rezervasyon talebi)',
          'Yönetim panelinden içerik güncelleme',
          'Yapısal veri ve sayfa başına özgün meta bilgiler',
          'Hız ve mobil uyum optimizasyonu',
        ],
      },
      {
        ad: 'Entegrasyonlu',
        kapsam: [
          'İşletmeye özel yazılım geliştirme',
          'Çoklu modül: ilan akışı, değerleme formu, seans takvimi, sipariş',
          'Yönetim paneli ve yetkilendirme',
          'Çok dilli yapı',
          'Reklam ölçümü ve dönüşüm takibi kurulumu',
          'Yayın sonrası bakım ve geliştirme dönemi',
        ],
      },
    ],
    sss: [
      { soru: 'Site ne kadar sürede teslim ediliyor?', cevap: 'Süreyi kapsam ve içeriğin hazır olması belirliyor. En çok bekleyen kalem genelde metin ve görsel; bunlar hazırsa süreç belirgin şekilde kısalıyor. Teklif aşamasında takvimi adım adım yazıyoruz.' },
      { soru: 'İçerik metinlerini kim yazıyor?', cevap: 'İsterseniz biz yazıyoruz. Hizmetlerinizi ve sık gelen müşteri sorularını anlatmanız yeterli; metinleri arama niyetine uygun şekilde kurup onayınıza sunuyoruz.' },
      { soru: 'Siteyi kendim güncelleyebilecek miyim?', cevap: 'Evet. Düzenli değişen bölümler (ilan, galeri, menü, blog) için yönetim paneli kuruyoruz. Sabit sayfalarda değişiklik gerektiğinde bakım kapsamında biz yapıyoruz.' },
      { soru: 'Alan adı ve barındırma dahil mi?', cevap: 'Alan adı ve barındırma kalemlerini teklifte ayrı gösteriyoruz, çünkü bunlar üçüncü taraf hizmetleri ve yıllık yenilenmesi gerekiyor. Alan adının sahipliğinin sizde olmasını öneriyoruz; biz kurulumu ve yönlendirmeleri yapıyoruz.' },
      { soru: 'Hazır şablon kullanıyor musunuz?', cevap: 'Tasarımı projeye göre kuruyoruz. İhtiyaç tek sayfalık bir vitrinse gereksiz karmaşıklık üretmiyoruz; ama sektöre özel bir akış varsa onu şablona sıkıştırmak yerine yazıyoruz.' },
      { soru: 'Formdan gelen talepler nereye düşüyor?', cevap: 'Hem e-postanıza hem yönetim panelinize. Panelde aday kaydı olarak görünüyor; kimin ne zaman hangi hizmet için yazdığını kaybetmiyorsunuz. KVKK aydınlatma onayı da kayıtla birlikte saklanıyor.' },
    ],
    anahtarKelimeler: ['web sitesi tasarımı', 'kurumsal web sitesi', 'web tasarım ajansı İstanbul', 'web sitesi yaptırma', 'işletmeye özel yazılım'],
    metaBaslik: 'Web Sitesi Tasarımı ve Yazılımı | Ajans Flow',
    metaAciklama: 'Önce maket, sonra kod: mobil öncelikli, hızlı ve sektöre özel modüllerle çalışan web siteleri. KVKK onaylı form, panele düşen talepler, teknik SEO.',
    simge: '💻',
    ilgiliHizmetler: ['qr-menu', 'kurumsal-kimlik', 'google-ads', 'veri-analizi'],
    medya: 'foto/maymotors-web-mobil-form.jpg',
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'qr-menu',
    slug: 'qr-dijital-menu',
    ad: 'QR Dijital Menü',
    kisaAd: 'QR dijital menü',
    ozet: 'Menüyü siz doldurmuyorsunuz: yemek fotoğraflarını mekânınızda biz çekiyor, ürün adlarını ve açıklamalarını biz yazıyor, menüyü kurup teslim ediyoruz.',
    aciklama: [
      'QR menü satan firmaların çoğu size bir panel verip "ürünleri girin, fotoğraflarını yükleyin, açıklamalarını yazın" der. Yazılımı onlar satar, işin tamamı sizde kalır; menü de telefonla alelacele çekilmiş kareler ve tek satırlık açıklamalarla yayına girer. Biz bunu tersine çeviriyoruz. Sosyal medya ajansı olduğumuz için yemek çekimi ve metin yazımı zaten günlük işimiz: mekânınıza gelip ürünlerin fotoğrafını profesyonel ekipmanla çekiyor, ürün adlarını ve menü açıklamalarını kendi elimizle yazıyoruz. Sizden yalnızca ürün listesi ve fiyatlar yeterli.',
      'Menüyü de şablona sıkıştırmıyoruz: kategori sıralaması sizin satış mantığınıza göre kuruluyor, renk ve yazı tipi markanızdan geliyor, arama ve filtreler ihtiyacınıza göre açılıyor. Misafir uygulama indirmiyor, kayıt olmuyor; kodu okutuyor ve menü açılıyor.',
      'Kule İstanbul Cafe için kurduğumuz menü bu işin bizdeki en net örneği: Türkçe, İngilizce, Almanca ve Arapça olmak üzere dört dilde, yüzlerce ürün, kategori gezinme, menü içinde anlık arama ve alerjen listesinden hesaplanan vegan, glutensiz, kuruyemişsiz filtreleri. Turist yoğun bir hatta çalışan bir mekân için dil farkı doğrudan sipariş farkı oluyor.',
      'Menünün altına dönüşüm de kuruyoruz: haritada konum, tıklanabilir telefon, Instagram bağlantısı ve Google’da değerlendirme çağrısı. İsteğe bağlı modüller olarak QR üzerinden sipariş ve rezervasyon talebi menüyle birlikte ya da sonradan eklenebiliyor. Mevzuat tarafını da baştan doğru kuruyoruz; detayları kaynaklarıyla QR menü mevzuatı bölümünde yazdık.',
    ],
    neleriKapsar: [
      'Mekânınızda profesyonel yemek ve ürün fotoğrafı çekimi',
      'Ürün adlarının ve menü açıklamalarının bizim tarafımızdan yazılması',
      'Kategori kurgusu: menünün gruplanması ve satış mantığına göre sıralanması',
      'Alerjen, alkol ve diyet (vegan, glutensiz, kuruyemişsiz) etiketlerinin tek tek işlenmesi',
      'Fiyat girişinin yapılması ve fiyatların tek yerden güncellenebilir hâle getirilmesi',
      'Çok dilli menü yapısı (Türkçe esas, ek diller isteğe bağlı)',
      'Menü içinde anlık arama ve hızlı kategori gezinme',
      'Markanıza göre tasarım, uygulama indirmeden açılan hafif yapı, menü altında harita ve Google değerlendirme bağlantıları',
      'Masa kartı, baskıya hazır QR görselleri ve giriş kapısı için basılabilir fiyat listesi çıktısı',
      'Yayın sonrası güncelleme desteği: yeni ürün, fiyat değişikliği, sezon menüsü',
    ],
    kimeGore: [
      'Menüye koyacak düzgün ürün fotoğrafı ve açıklama metni olmayan işletmeler',
      'Basılı menüsünü her fiyat değişiminde yeniden bastıran kafe ve restoranlar',
      'Turist yoğun bölgelerde çalışan, dil derdi olan mekânlar',
      'Alerjen ve içerik bilgisini düzenli sunması gereken işletmeler',
      'Nargile mekânı, pastane, plaj işletmesi ve otel oda servisi',
      'Hazır QR menü uygulamalarının şablonundan memnun olmayan markalar',
    ],
    surec: [
      { adim: 1, baslik: 'Ürün listesi ve fiyatlar alınır', aciklama: 'Sizden tek istediğimiz bu: menüdeki ürünlerin listesi ve fiyatları. Hangi ürünlerin öne çıkacağını, hangilerinin menüden kalkacağını da bu görüşmede konuşuyoruz.' },
      { adim: 2, baslik: 'Mekânda yemek çekimi', aciklama: 'Çekim gününü servisin yoğun olmadığı saate planlıyoruz. Mutfakla birlikte çalışıp ürünleri servise çıkacak hâliyle, profesyonel ekipman ve ışıkla çekiyoruz. Kare listesi önceden hazır olduğu için menünün tamamı tek günde bitiyor.' },
      { adim: 3, baslik: 'İçerik ve açıklamalar yazılır', aciklama: 'Ürün adlarını ve menü açıklamalarını biz yazıyoruz; kategori kurgusunu kuruyor, alerjen ve diyet etiketlerini tek tek işliyoruz. Çok dilli menüde Türkçe metin esas alınıp diğer diller üzerine ekleniyor. Metinler yayına girmeden onayınıza geliyor.' },
      { adim: 4, baslik: 'Menü kurulur, QR teslim edilir', aciklama: 'Fiyatlar girilir, menü markanızın tasarımıyla yayına alınır. Masa kartı, baskıya hazır QR görselleri ve giriş kapısı için basılabilir fiyat listesi teslim edilir.' },
      { adim: 5, baslik: 'Güncellemeler', aciklama: 'Yeni ürün, fiyat değişikliği veya sezon menüsü geldiğinde panelden siz güncelleyebiliyorsunuz. Güncellemeyi bizim sürdürmemizi isterseniz bakım kapsamına alıyoruz; yeni ürünlerin çekimi de aynı akışla yapılıyor.' },
    ],
    paket: [
      {
        ad: 'Menü kurulumu',
        kapsam: [
          'Türkçe menü kurulumu, kategori gezinme ve menü içi arama',
          'Elinizdeki fotoğraf ve metinlerin düzenlenip menüye işlenmesi',
          'Alerjen ve diyet etiketlerinin girilmesi',
          'Masa kartı, QR görselleri ve basılabilir fiyat listesi',
          'Fiyat güncelleme eğitimi',
          'Yemek çekimi ve menü metinlerinin yazımı bu pakette yoktur',
        ],
      },
      {
        ad: 'Çekim ve içerik dahil',
        kapsam: [
          'Mekânda profesyonel yemek ve ürün çekimi',
          'Ürün adlarının ve menü açıklamalarının yazımı',
          'Kategori kurgusu ve alerjen etiketlerinin işlenmesi',
          'Çok dilli menü (örneğin İngilizce, Almanca, Arapça)',
          'Markaya özel tasarım, harita ve Google değerlendirme bağlantıları',
          'Teslimden sonra bir tur içerik düzeltmesi',
        ],
      },
      {
        ad: 'Çekim, içerik ve modüller',
        kapsam: [
          'Çekim ve içerik dahil paketin tamamı',
          'QR üzerinden sipariş modülü',
          'Rezervasyon talebi modülü',
          'Yönetim panelinden ürün, fiyat ve görsel yönetimi',
          'Kampanya ve günün menüsü alanları',
          'Düzenli menü bakımı; yeni ürünlerin çekimi ve metni dahil',
        ],
      },
    ],
    sss: [
      { soru: 'Fotoğrafları ve açıklamaları biz mi hazırlayacağız?', cevap: 'Hayır. Yemek fotoğraflarını mekânınızda biz çekiyoruz, ürün adlarını ve menü açıklamalarını biz yazıyoruz. Sizden yalnızca ürün listesi ve fiyatlar yeterli. Metinler yayına girmeden onayınıza geliyor; düzeltmek istediğiniz bir ifade olursa birlikte değiştiriyoruz.' },
      { soru: 'Karekodlu menü yasal bir zorunluluk mu?', cevap: 'Hayır. Fiyat Etiketi Yönetmeliği, masalardaki fiyat listesinin karekod ile de gösterilmesine 11 Ekim 2025’ten itibaren izin veriyor; bu bir zorunluluk değil, izin verilen ek bir yöntem. Ayrıntıları ve kaynaklarını QR menü mevzuatı bölümünde yazdık.' },
      { soru: 'QR menü kurduğumda basılı fiyat listesini kaldırabilir miyim?', cevap: 'Kaldırmamanız gerekiyor. İşyerinin giriş kapısı önündeki fiyat listesi yükümlülüğü devam ediyor ve müşteri talep ettiğinde fiyat listesinin ayrıca verilmesi gerekiyor. Bu yüzden menü sistemine basılabilir fiyat listesi çıktısı da ekliyoruz.' },
      { soru: 'Fiyatları kim güncelliyor?', cevap: 'Panelden siz güncelleyebiliyorsunuz; tek yerden değiştirince menünün tamamına yansıyor. Güncellemeyi bizim sürdürmemizi isterseniz bakım kapsamına alıyoruz. Menüdeki fiyatın kasadaki fiyatla aynı olması önemli, bu yüzden güncellemeyi kolay tutuyoruz.' },
      { soru: 'Hazır QR menü uygulamalarından farkı ne?', cevap: 'İki fark var. Birincisi içerik: hazır uygulama size boş bir panel verir, fotoğrafı ve metni siz hazırlarsınız; bizde çekim ve yazım işin içinde. İkincisi esneklik: şablona uymak zorunda değilsiniz, menü sizin markanızla ve sizin kategori mantığınızla açılıyor. Dört dilli bir menü ya da alerjenden hesaplanan diyet filtresi gibi istekler hazır şablonlarda genelde mümkün olmuyor. Her iki durumda da misafir uygulama indirmiyor; menü telefonun tarayıcısında açılıyor.' },
      { soru: 'Sipariş modülü mutfakla nasıl çalışıyor?', cevap: 'Sipariş modülü, masadan geçilen siparişi panele düşürüyor; mutfak veya kasa ekranından takip ediliyor. Yazar kasa ve fiş yazıcı entegrasyonu gibi ihtiyaçlar varsa kapsamı ayrıca değerlendiriyoruz, mevcut kurgumuzda bu bağlantılar standart değil.' },
    ],
    anahtarKelimeler: ['QR menü', 'dijital menü', 'QR kod menü sistemi', 'menü fotoğraf çekimi', 'çok dilli QR menü', 'restoran sipariş sistemi'],
    metaBaslik: 'QR Dijital Menü | Çekim ve İçerik Dahil',
    metaAciklama: 'Yemek fotoğraflarını mekânda biz çekiyor, menü metinlerini biz yazıyoruz. Çok dilli, aranabilir ve alerjen filtreli QR menü kuruyoruz.',
    simge: '🍽️',
    ilgiliHizmetler: ['fotograf', 'web-sitesi', 'google-isletme', 'kurumsal-kimlik'],
    medya: 'foto/kule-istanbul-qr-menu-mobil.jpg',
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'kurumsal-kimlik',
    slug: 'kurumsal-kimlik-tasarim',
    ad: 'Grafik Tasarım ve Kurumsal Kimlik',
    kisaAd: 'Kurumsal kimlik',
    ozet: 'Logodan menüye, katalogdan sosyal medya şablonlarına kadar her yerde aynı dili konuşan bir marka kimliği kuruyoruz.',
    aciklama: [
      'Marka kimliği bir logo dosyası değil; müşterinin sizi her gördüğü yerde aynı markayı tanıması. Tabelada bir renk, menüde başka bir yazı tipi, Instagram’da üçüncü bir düzen varsa müşteri markanızı hatırlamıyor. Kimlik çalışmasında işi tersten kuruyoruz: önce markanın nerede göründüğünü listeliyor, sonra o yerlerin hepsinde çalışan bir sistem tasarlıyoruz.',
      'Teslim edilen şey kullanılabilir bir set oluyor: logonun yatay, dikey, tek renk ve amblem sürümleri; baskı ve ekran için ayrı dosyalar; renk kodları; yazı tipi düzeni; sosyal medya şablonları ve basılı malzeme tasarımları. Yeni bir kampanya çıktığında sıfırdan tasarım beklemeniz gerekmiyor, şablonu kullanıyorsunuz.',
      'Logosu olan markalarla da çalışıyoruz. Bu durumda logoyu değiştirmek yerine çevresini düzene sokuyoruz: kullanım kuralları, renk düzeltmesi, eksik dosya formatlarının üretilmesi ve tutarlı bir şablon seti.',
    ],
    neleriKapsar: [
      'Logo tasarımı veya mevcut logonun düzenlenmesi',
      'Logo sürümleri: yatay, dikey, amblem, tek renk, negatif',
      'Vektörel ve raster dosya teslimi (baskı ve ekran için ayrı)',
      'Renk paleti ve yazı tipi düzeni',
      'Kullanım kuralları: boşluk, en küçük boyut, yapılmaması gerekenler',
      'Sosyal medya gönderi ve hikâye şablonları',
      'Menü, fiyat listesi ve katalog tasarımı',
      'Kartvizit, antetli kâğıt, etiket ve ambalaj tasarımı',
      'Tabela ve araç giydirme görselleri',
      'Sunum ve teklif şablonları',
    ],
    kimeGore: [
      'Yeni açılan ve sıfırdan kimlik kurması gereken işletmeler',
      'Logosu var ama her yerde farklı görünen markalar',
      'Menü, katalog veya fiyat listesi yenileyen işletmeler',
      'Şube açan ve şubeler arası tutarlılık arayan markalar',
      'Her kampanyada tasarımcı arayan, hazır şablona ihtiyaç duyan ekipler',
    ],
    surec: [
      { adim: 1, baslik: 'Marka brifingi', aciklama: 'Kime hitap ediyorsunuz, hangi hissi vermek istiyorsunuz, rakipler nasıl görünüyor? Markanın nerelerde göründüğünü listeliyoruz.' },
      { adim: 2, baslik: 'Yön çalışması', aciklama: 'Birkaç farklı tasarım yönü sunuyoruz. Tek bir öneriyle gelip "beğendiniz mi" diye sormuyoruz.' },
      { adim: 3, baslik: 'Geliştirme', aciklama: 'Seçilen yönü detaylandırıyor, logonun tüm sürümlerini ve renk-yazı tipi düzenini kuruyoruz.' },
      { adim: 4, baslik: 'Uygulama', aciklama: 'Kimliği gerçek malzemelere uyguluyoruz: menü, şablon, kartvizit, tabela görseli.' },
      { adim: 5, baslik: 'Teslim ve devir', aciklama: 'Tüm dosyaları düzenli klasörlerde, kullanım kurallarıyla birlikte teslim ediyoruz. Baskıya giderken matbaa dosyalarını kontrol ediyoruz.' },
    ],
    paket: [
      {
        ad: 'Logo',
        kapsam: [
          'Logo tasarımı ve temel sürümleri',
          'Renk kodları ve yazı tipi bilgisi',
          'Vektörel ve raster dosya teslimi',
          'Sosyal medya profil görselleri',
        ],
      },
      {
        ad: 'Kurumsal kimlik',
        kapsam: [
          'Logo ve tüm sürümleri',
          'Renk paleti, yazı tipi düzeni ve kullanım kuralları',
          'Sosyal medya gönderi ve hikâye şablonları',
          'Kartvizit ve antetli kâğıt tasarımı',
          'Bir basılı malzeme (menü veya katalog) tasarımı',
        ],
      },
      {
        ad: 'Kimlik ve uygulama',
        kapsam: [
          'Kurumsal kimlik setinin tamamı',
          'Menü, fiyat listesi ve katalog tasarımı',
          'Tabela, araç giydirme ve mekân içi yönlendirme görselleri',
          'Ambalaj ve etiket tasarımı',
          'Sunum ve teklif şablonları',
          'Matbaa dosyası hazırlığı ve baskı kontrolü',
        ],
      },
    ],
    sss: [
      { soru: 'Kaç logo seçeneği sunuyorsunuz?', cevap: 'Farklı yönlerden birkaç öneri sunuyoruz; sayı yerine yön çeşitliliğine bakıyoruz. Seçilen yön üzerinde revizyon turlarıyla ilerliyoruz. Kaç revizyon turu olduğunu teklifte yazıyoruz.' },
      { soru: 'Logonun kullanım hakkı kimde olacak?', cevap: 'Teslimden sonra logo size ait oluyor; her yerde serbestçe kullanabiliyorsunuz. Marka tescili ayrı bir hukuki süreç ve bunu Türk Patent üzerinden yürütmeniz gerekiyor; tasarım tescili garanti etmez.' },
      { soru: 'Hangi dosya formatlarını alıyorum?', cevap: 'Vektörel (sonsuz büyütülebilen) dosyalar ve ekran için hazır görseller. Tabela, matbaa ve araç giydirme için ihtiyaç duyulan formatlar da sette bulunuyor; matbaanın istediği özel bir format varsa onu da hazırlıyoruz.' },
      { soru: 'Mevcut logomu koruyarak çalışır mısınız?', cevap: 'Evet, sık yaptığımız bir iş. Logonuzu değiştirmeden eksik sürümlerini üretiyor, renk ve yazı tipi düzenini kuruyor ve şablon setini hazırlıyoruz. Bu, kimliği sıfırlamadan düzene sokmanın en hızlı yolu.' },
      { soru: 'Baskı işini de siz yapıyor musunuz?', cevap: 'Baskıyı matbaa yapıyor, biz dosyayı baskıya uygun hazırlıyor ve provayı kontrol ediyoruz. Çalıştığınız matbaa yoksa yönlendirebiliriz; baskı bedeli tasarım bedelinden ayrıdır.' },
    ],
    anahtarKelimeler: ['kurumsal kimlik tasarımı', 'logo tasarımı İstanbul', 'marka kimliği', 'grafik tasarım ajansı', 'menü tasarımı'],
    metaBaslik: 'Grafik Tasarım ve Kurumsal Kimlik | Ajans Flow',
    metaAciklama: 'Logo, renk paleti, yazı tipi düzeni, sosyal medya şablonları, menü ve katalog tasarımı. Markanız her yerde aynı dili konuşsun.',
    simge: '🎨',
    ilgiliHizmetler: ['web-sitesi', 'sosyal-medya', 'qr-menu', 'fotograf'],
    medya: 'logo/kule-istanbul-cafe-logo.png',
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'buyume',
    slug: 'etkilesim-takipci-buyutme',
    ad: 'Etkileşim ve Takipçi Büyütme',
    kisaAd: 'Etkileşim ve büyüme',
    ozet: 'Hesabınızı satın alınmış takipçiyle değil, size müşteri olabilecek gerçek kitleyle büyütüyoruz.',
    aciklama: [
      'Takipçi satın almak kolay, ama işe yaramıyor. Sahte hesapların gönderinize tepki vermemesi etkileşim oranını düşürüyor; algoritma gönderiyi daha az kişiye gösteriyor ve hesap görünürde büyürken gerçekte küçülüyor. Dahası, yanlış ülke ve yanlış ilgiden gelen bir kitle reklam hedeflemenizi de bozuyor.',
      'Biz büyümeye üç koldan bakıyoruz: içeriğin keşfedilebilirliği, topluluk yönetimi ve iş birlikleri. Keşfedilebilirlik tarafında Reels, arama ve konum odaklı içeriği güçlendiriyoruz. Topluluk yönetimi tarafında yorum ve mesajları zamanında yanıtlıyor, hikâyede etkileşim kuran formatlar kullanıyoruz. İş birliği tarafında bölgenizdeki ilgili hesaplarla karşılıklı çalışmalar kuruyoruz.',
      'Size söz verdiğimiz şey sayı değil, yöntem. Belirli bir takipçi rakamı garanti eden teklifleri ciddiye almamanızı öneririz; bu sözü tutmanın tek yolu genelde sahte hesap. Biz hangi içerik ne getirdi sorusunu aylık raporda açıkça gösteriyoruz.',
    ],
    neleriKapsar: [
      'Hesap sağlığı incelemesi: takipçi kalitesi, etkileşim oranı, erişim kaynakları',
      'Keşfet ve Reels odaklı içerik kurgusu',
      'Profilin arama görünürlüğü: ad, biyografi ve kategori düzeni',
      'Konum ve mekân etiketleri düzeni',
      'Yorum ve DM yönetimi, yanıt süresinin kısaltılması',
      'Hikâyede etkileşim formatları: anket, soru, geri sayım',
      'Topluluk kuralları ve kriz anında yanıt yönergesi',
      'Bölgesel iş birlikleri ve karşılıklı paylaşım planı',
      'Takipçi kaynaklarının aylık raporlanması',
    ],
    kimeGore: [
      'Düzenli paylaşan ama hesabı büyümeyen işletmeler',
      'Takipçisi olan ama hiç mesaj veya rezervasyon almayan hesaplar',
      'Geçmişte takipçi satın alıp etkileşimi düşen markalar',
      'Yeni açılan ve ilk gerçek kitlesini kurması gereken işletmeler',
    ],
    surec: [
      { adim: 1, baslik: 'Hesap sağlığı', aciklama: 'Takipçi kalitesini, etkileşim oranını ve erişimin nereden geldiğini inceliyoruz. Sorun içerikte mi, kitlede mi, profilde mi?' },
      { adim: 2, baslik: 'Profil düzeni', aciklama: 'Ad, biyografi, kategori, öne çıkanlar ve iletişim düğmelerini aramada bulunacak şekilde düzenliyoruz.' },
      { adim: 3, baslik: 'Keşfedilebilir içerik', aciklama: 'Reels ve konum odaklı içeriği güçlendiriyor, hangi formatın yeni kişilere ulaştığını ölçüyoruz.' },
      { adim: 4, baslik: 'Topluluk yönetimi', aciklama: 'Yorum ve mesajlara hızlı yanıt veriyor, hikâyede etkileşim kuran formatları düzenli kullanıyoruz.' },
      { adim: 5, baslik: 'İş birliği ve ölçüm', aciklama: 'Bölgenizdeki ilgili hesaplarla karşılıklı çalışmalar kuruyor, büyümenin kaynağını aylık raporda gösteriyoruz.' },
    ],
    paket: [
      {
        ad: 'Hesap sağlığı',
        kapsam: [
          'Hesap ve takipçi kalitesi incelemesi',
          'Profil düzeni ve arama görünürlüğü',
          'İçerik formatı önerileri',
          'Yazılı yol haritası',
        ],
      },
      {
        ad: 'Büyüme yönetimi',
        kapsam: [
          'Keşfet ve Reels odaklı içerik kurgusu',
          'Yorum ve DM yönetimi',
          'Hikâye etkileşim formatları',
          'Konum ve etiket düzeni',
          'Aylık büyüme raporu',
        ],
      },
      {
        ad: 'Büyüme ve iş birliği',
        kapsam: [
          'Büyüme yönetiminin tamamı',
          'Bölgesel iş birlikleri ve karşılıklı paylaşımlar',
          'İçerik üreticisi (mikro) iş birliği kurgusu',
          'Reklamla desteklenmiş erişim kampanyaları',
          'Aylık rapor ve strateji görüşmesi',
        ],
      },
    ],
    sss: [
      { soru: 'Takipçi satın alıyor musunuz?', cevap: 'Hayır, hiçbir koşulda. Satın alınmış takipçi etkileşim oranını düşürüyor, erişimi azaltıyor ve reklam hedeflemenizi bozuyor. Üstelik geri dönüşü olmayan bir hasar; sahte hesapları ayıklamak çok zahmetli oluyor.' },
      { soru: 'Kaç takipçi kazanacağımı söyleyebilir misiniz?', cevap: 'Dürüst cevap: hayır. Belirli bir sayıyı garanti etmenin güvenilir bir yolu yok. Bunun yerine neyi yapacağımızı, neyi ölçeceğimizi ve ayda hangi sonuçlara bakacağımızı net yazıyoruz.' },
      { soru: 'Önceden takipçi satın almıştım, ne yapmalıyım?', cevap: 'Hesabı silmenize gerek yok. Sahte hesapları kademeli temizliyor ve gerçek kitleye ulaşan içeriğe odaklanıyoruz. Etkileşim oranı toparlanana kadar sabır gerekiyor ama hesap kurtarılabiliyor.' },
      { soru: 'Etkileşim grupları veya karşılıklı beğeni çalışıyor mu?', cevap: 'Kısa vadede sayıyı şişiriyor, uzun vadede zarar veriyor. Alakasız hesaplardan gelen etkileşim, içeriğinizin kime gösterileceği konusunda algoritmayı yanlış yönlendiriyor. Bu yöntemleri kullanmıyoruz.' },
      { soru: 'Takipçi sayısı mı önemli, mesaj sayısı mı?', cevap: 'İşletmeler için mesaj, rezervasyon ve yol tarifi talebi daha önemli. Bin takipçiyle düzenli mesaj alan bir hesap, on bin takipçiyle sessiz bir hesaptan iyi iş yapıyor. Raporda bu yüzden sonuç rakamlarına da yer veriyoruz.' },
    ],
    anahtarKelimeler: ['Instagram takipçi artırma', 'organik takipçi büyütme', 'etkileşim artırma', 'topluluk yönetimi'],
    metaBaslik: 'Etkileşim ve Takipçi Büyütme | Ajans Flow',
    metaAciklama: 'Satın alınmış takipçi değil, gerçek kitle: keşfedilebilir içerik, topluluk yönetimi ve bölgesel iş birlikleriyle sürdürülebilir hesap büyümesi.',
    simge: '📈',
    ilgiliHizmetler: ['sosyal-medya', 'tiktok', 'icerik-stratejisi', 'meta-reklam'],
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'veri-analizi',
    slug: 'veri-analizi-raporlama',
    ad: 'Veri Analizi ve Performans Raporlama',
    kisaAd: 'Veri ve raporlama',
    ozet: 'Harcadığınız paranın karşılığını gösteren, okunabilir ve kararı kolaylaştıran raporlar kuruyoruz.',
    aciklama: [
      'Ajans raporlarının çoğu okunmuyor çünkü doğru soruya cevap vermiyor. Erişim, gösterim ve beğeni sayıları iyi görünüyor ama işletme sahibinin sorusu tek: "Bu ay reklama ve içeriğe verdiğim paradan bana ne döndü?" Raporlamayı bu sorunun etrafında kuruyoruz.',
      'İşe ölçümü düzeltmekle başlıyoruz. Formdan gelen talep, telefon tıklaması, WhatsApp mesajı, rezervasyon ve harita yol tarifi talebi ayrı ayrı sayılabilir hâle getiriliyor. Ölçüm düzgün kurulmadan çıkan hiçbir rapor güvenilir değil; bu yüzden kurulum aşamasını atlamıyoruz.',
      'Rapor tek sayfada başlıyor: bu ay ne harcandı, kaç talep geldi, talep başına maliyet ne oldu, hangi içerik ve hangi kampanya işe yaradı. Detay isteyen için arkada kırılımlar duruyor. Raporu bir de birlikte konuşuyoruz; çünkü asıl değer tabloyu okumakta değil, gelecek ayın kararını vermekte.',
      'Kişisel veri tarafında temkinliyiz. Ölçümü mümkün olduğunca sayı düzeyinde tutuyor, gerekmeyen kişisel veriyi toplamıyoruz. Analiz araçlarının kurulumunda KVKK aydınlatması ve çerez bilgilendirmesini birlikte planlıyoruz.',
    ],
    neleriKapsar: [
      'Ölçüm kurulumu: web sitesi analitiği, dönüşüm olayları, reklam pikselleri',
      'Form, telefon, WhatsApp ve rezervasyon taleplerinin ayrı ayrı sayılması',
      'Sosyal medya hesap ve içerik performansının izlenmesi',
      'Google İşletme Profili arama, görüntüleme ve yol tarifi verileri',
      'Reklam harcaması ve talep başına maliyet hesabı',
      'Hangi içerik ve kampanyanın sonuç getirdiğinin ayrıştırılması',
      'Tek sayfalık yönetici özeti ve arkasında detay kırılımlar',
      'Aylık değerlendirme görüşmesi ve sonraki ay kararları',
      'Çerez bilgilendirmesi ve KVKK uyumlu ölçüm kurgusu',
    ],
    kimeGore: [
      'Reklam veren ama geri dönüşü rakamla göremeyen işletmeler',
      'Birden fazla kanalı birlikte yürüten ve hangisinin çalıştığını bilmek isteyenler',
      'Ajans raporu alan ama rapordan karar çıkaramayan yöneticiler',
      'Web sitesine trafik gelen ama form dolmayan işletmeler',
    ],
    surec: [
      { adim: 1, baslik: 'Ölçüm denetimi', aciklama: 'Mevcut analitik, piksel ve dönüşüm kurulumunu kontrol ediyoruz. Yanlış veya mükerrer sayan olayları tespit ediyoruz.' },
      { adim: 2, baslik: 'Kurulum ve doğrulama', aciklama: 'Eksik olayları kuruyor, her birini test ederek gerçekten saydığını doğruluyoruz.' },
      { adim: 3, baslik: 'Rapor tasarımı', aciklama: 'Hangi rakamın yönetici özetinde, hangisinin detayda olacağını belirliyoruz. Gereksiz metrikleri rapordan çıkarıyoruz.' },
      { adim: 4, baslik: 'Aylık rapor', aciklama: 'Harcama, talep ve maliyet kalemlerini tek sayfada veriyor; arkasında kanal ve içerik kırılımlarını sunuyoruz.' },
      { adim: 5, baslik: 'Karar görüşmesi', aciklama: 'Raporu birlikte okuyup gelecek ayın bütçe ve içerik kararlarını alıyoruz.' },
    ],
    paket: [
      {
        ad: 'Ölçüm kurulumu',
        kapsam: [
          'Web sitesi analitiği kurulumu',
          'Form, telefon ve WhatsApp dönüşüm olayları',
          'Reklam pikseli kurulumu ve doğrulaması',
          'Çerez bilgilendirmesi ve KVKK uyumlu kurgu',
          'Kurulum raporu',
        ],
      },
      {
        ad: 'Aylık raporlama',
        kapsam: [
          'Tek sayfalık yönetici özeti',
          'Kanal bazlı kırılım: sosyal medya, reklam, arama, harita',
          'Talep başına maliyet hesabı',
          'İçerik performans listesi',
          'Aylık değerlendirme görüşmesi',
        ],
      },
      {
        ad: 'Karar panosu',
        kapsam: [
          'İşletmeye özel rapor panosu geliştirilmesi',
          'Kanalların tek ekranda birleştirilmesi',
          'Hedef takibi ve sapma uyarıları',
          'Sezon ve kampanya karşılaştırmaları',
          'Aylık rapor sunumu',
        ],
      },
    ],
    sss: [
      { soru: 'Rapor ne sıklıkla geliyor?', cevap: 'Standart olarak aylık. Reklam kampanyası aktifse ara durumu haftalık kısa bir notla paylaşıyoruz; her hafta tam rapor üretmek zaman kaybı oluyor çünkü haftalık veri sağlıklı karar için yeterli değil.' },
      { soru: 'Hangi araçları kullanıyorsunuz?', cevap: 'Platformların kendi panelleri (Meta, Google Ads, Google İşletme Profili, Instagram) ve web sitesi analitiği. Gereksiz üçüncü taraf araç eklemiyoruz; her ek araç siteyi yavaşlatıyor ve kişisel veri sorumluluğu getiriyor.' },
      { soru: 'Rapordaki rakamlar ajansın kendi beyanı mı?', cevap: 'Hayır. Rakamlar platform panellerinden geliyor ve siz de aynı panellere erişebiliyorsunuz. Rapordaki her rakamın hangi panelden ve hangi tarih aralığından alındığını yazıyoruz.' },
      { soru: 'Telefonla gelen müşteriyi nasıl ölçüyorsunuz?', cevap: 'Web sitesindeki telefon düğmesine yapılan tıklamaları ölçebiliyoruz; ama tabelayı görüp arayan kişiyi ölçemiyoruz. Bu yüzden gelen müşteriye "bizi nereden duydunuz" sorusunu sormanızı öneriyoruz; o veriyi de rapora ekliyoruz.' },
      { soru: 'KVKK açısından nelere dikkat ediyorsunuz?', cevap: 'Ölçümü sayı düzeyinde tutuyor, gerekmeyen kişisel veriyi toplamıyoruz. Form üzerinden gelen veriler için aydınlatma metni ve açık rıza akışı kuruyoruz; çerez bilgilendirmesini de siteyle birlikte planlıyoruz.' },
    ],
    anahtarKelimeler: ['performans raporlama', 'dijital pazarlama analizi', 'reklam getirisi ölçümü', 'dönüşüm takibi kurulumu'],
    metaBaslik: 'Veri Analizi ve Performans Raporlama | Ajans Flow',
    metaAciklama: 'Ölçüm kurulumundan aylık rapora: form, telefon ve WhatsApp taleplerinin ayrı sayımı, talep başına maliyet ve karar odaklı yönetici özeti.',
    simge: '📊',
    ilgiliHizmetler: ['meta-reklam', 'google-ads', 'web-sitesi', 'icerik-stratejisi'],
  },
];

/* ================================================================== */
/* 2. Sektörler (12 sayfa)                                             */
/* ================================================================== */

export const SEKTORLER: Sektor[] = [
  /* ---------------------------------------------------------------- */
  {
    anahtar: 'go-kart',
    slug: 'go-kart-eglence-merkezi',
    ad: 'Go Kart ve Eğlence Merkezi',
    baslik: 'Go kart pistleri ve eğlence merkezleri için dijital kurgu',
    giris:
      'Eğlence merkezlerinin derdi müşteri bulmak değil, seansı doldurmak. Cuma akşamı pist tıklım tıklım, salı öğleden sonra bomboş. Telefon sürekli çalıyor ama konuşmaların yarısı "bugün yer var mı, kaç kişi girebiliyor, yaş sınırı kaç" sorularından ibaret ve her biri personelin zamanını yiyor. Üstelik gelen müşteri de kararını, mekânı hiç görmeden, Instagram’daki birkaç videoya bakarak veriyor.',
    webTarafi: {
      baslik: 'Web sitesinde ne yapıyoruz',
      maddeler: [
        'Online rezervasyon ve seans takvimi: hangi gün hangi saatte kaç kişilik yer var, canlı görünür',
        'Seans süresi, kart sayısı ve kapasiteye göre otomatik dolu-boş gösterimi',
        'Grup ve kurumsal etkinlik için ayrı talep formu',
        'Doğum günü ve özel organizasyon paketlerinin ayrı sayfaları',
        'Yaş, boy ve güvenlik kurallarının tek sayfada net anlatımı — telefonda tekrar tekrar anlatılmasın',
        'Turnuva ve lig duyuru sayfası, katılım formu ve sonuç tablosu',
        'Havadan çekilmiş pist videosuyla açılan, tesisin ölçeğini anlatan tanıtım bölümü',
        'Yol tarifi, otopark ve ulaşım bilgisi; haritada tek dokunuşla yönlendirme',
        'WhatsApp üzerinden hızlı rezervasyon talebi',
      ],
    },
    sosyalTarafi: {
      baslik: 'Sosyal medyada ne yapıyoruz',
      maddeler: [
        'Gece çekimleriyle pistin atmosferini öne çıkaran kısa videolar',
        'Onboard (araç içi) kamera görüntüleriyle hız hissi veren Reels',
        'Tur rekorları, haftanın en hızlı pilotu ve sıralama paylaşımları',
        'Drone ile çekilmiş pist planları ve damalı bayrak finiş kareleri',
        'Boş seansları dolduran, saat bazlı kampanya hikâyeleri',
        'Kurumsal etkinlik ve doğum günü organizasyonlarından içerik üretimi',
        'Bölge hedefli Meta reklamlarıyla hafta içi seanslarına talep yaratma',
      ],
    },
    ornekIs: {
      marka: 'MAS Go Kart',
      ozet:
        'Pistin gece atmosferini, onboard çekimleri ve drone planlarını içeren bir video arşivi kurduk; sosyal medya tasarımlarını ve tanıtım içeriklerini ürettik.',
      vakaSlug: 'mas-go-kart',
    },
    sss: [
      { soru: 'Rezervasyon sistemiyle mevcut kasa programımız birlikte çalışır mı?', cevap: 'Kasa veya bilet programınızın dışa açık bir bağlantısı varsa birlikte çalışabilir; yoksa rezervasyonu ayrı bir panelde tutup gün başında personele liste olarak veriyoruz. Teklif öncesinde mevcut sisteminizi inceleyip hangi yolun sizin için uygun olduğunu söylüyoruz.' },
      { soru: 'Online rezervasyonda ön ödeme alabilir miyiz?', cevap: 'Ödeme almak isterseniz bir ödeme sağlayıcısıyla anlaşmanız gerekiyor; teknik bağlantıyı biz kuruyoruz. Birçok tesis ön ödeme yerine "rezervasyon talebi + onay" akışını tercih ediyor, çünkü iptal yönetimi daha kolay oluyor.' },
      { soru: 'Pist videolarını siz mi çekiyorsunuz?', cevap: 'Evet. Gece çekimi, onboard kamera ve drone planları bizim ürettiğimiz işler. Hava ve pist programına göre çekim gününü birlikte planlıyoruz; yarış trafiğini bozmadan çalışıyoruz.' },
      { soru: 'Hafta içi boş seansları nasıl doldurabiliriz?', cevap: 'İki şey birlikte çalışıyor: sitede o saatlerin açıkça boş görünmesi ve sosyal medyada o saate özel çağrı. Bölge ve saat hedefli reklamlarla okul çıkışı, öğle arası ve kurumsal grup gibi dilimlere ayrı mesaj veriyoruz.' },
      { soru: 'Turnuva düzenliyoruz, siteye nasıl yansıtılır?', cevap: 'Turnuva için ayrı bir sayfa kuruyoruz: duyuru, kurallar, katılım formu ve sonuç tablosu. Sonuçlar güncellenince katılımcılar siteye geri dönüyor; bu da tekrar ziyaret ve paylaşım getiriyor.' },
    ],
    anahtarKelimeler: ['go kart rezervasyon sistemi', 'eğlence merkezi web sitesi', 'go kart pisti dijital pazarlama', 'seans takvimi yazılımı'],
    metaBaslik: 'Go Kart ve Eğlence Merkezi Dijital Pazarlama',
    metaAciklama: 'Go kart pistleri için seans takvimli rezervasyon sitesi, turnuva sayfaları ve gece-onboard-drone çekimleriyle sosyal medya içeriği.',
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'oto-galeri',
    slug: 'oto-galeri',
    ad: 'Oto Galeri ve Otomotiv',
    baslik: 'Oto galeriler için web sitesi, ilan akışı ve sosyal medya',
    giris:
      'Oto galerinin iki ayrı derdi var. Birincisi araç almak: aracını satmak isteyen kişi galeriye gelmeden fiyat fikri edinmek istiyor, galeri de aracı kaça alacağına deneyimle karar veriyor. İkincisi araç satmak: aynı araç onlarca ilan arasında kayboluyor, ilan açıklaması aceleyle yazılıyor, fotoğraflar birbirinden farklı çıkıyor. Bir de üçüncü bir dert var: hangi reklamın hangi aracı sattığı hiç bilinmiyor.',
    webTarafi: {
      baslik: 'Web sitesinde ne yapıyoruz',
      maddeler: [
        'Araç değerleme formu: marka, model, yıl, kilometre, kaporta durumu ve hasar bilgisiyle adım adım ilerleyen bir akış',
        '"Aracını sat" sayfası ve randevu talebi; sahte gönderimi engelleyen doğrulama',
        'Satılık ve kiralık araç vitrini; filtreli liste ve araç detay sayfaları',
        'Kaporta parça haritası: hangi parça orijinal, boyalı, değişen — görsel şema olarak',
        'İlan açıklaması ve ilan görseli hazırlama akışı; tek veri girişinden baskıya ve sosyal medyaya hazır araç kartı',
        'Galerinin kendi ilan yönetim paneli: araç ekleme, fotoğraf yükleme, satıldı işaretleme',
        'Fiyat araştırması için ilan ve piyasa bilgisinin düzenli tutulduğu bir çalışma alanı',
        'Reklamdan gelen talebin plaka üzerinden alınan araca ve kâra bağlandığı ölçüm zinciri',
        'Galeri muhasebesi tarafında araç bazlı maliyet, ortak kasası ve taksit takibi',
      ],
    },
    sosyalTarafi: {
      baslik: 'Sosyal medyada ne yapıyoruz',
      maddeler: [
        'Araç tanıtım kartları ve tek veriden üretilen Instagram gönderileri',
        'Araç detay videoları: dış, iç, motor ve yol çekimi',
        '"Aracının değerini öğren" çağrısını merkeze alan Reels kurgusu',
        'Yeni gelen araç duyuruları ve satıldı paylaşımları',
        'Kiralık araç kampanyalarının ayrı içerik akışı',
        'Bölge ve araç ilgisi hedefli Meta reklamları',
        'Google Ads tarafında "aracımı satmak istiyorum" niyetli aramalara yönelik kampanyalar',
      ],
    },
    ornekIs: {
      marka: 'May Motors',
      ozet:
        'Galerinin dijital tarafını uçtan uca kurduk: araç değerleme akışı, ilan hazırlama ve yönetim akışı, galeri muhasebesi ve reklamdan kâra uzanan ölçüm zinciri.',
      vakaSlug: 'may-motors',
    },
    sss: [
      { soru: 'İlanlarım sahibinden.com’a otomatik aktarılıyor mu?', cevap: 'Böyle bir bağlantı iddia etmiyoruz. Yaptığımız iş ilan açıklamasının ve ilan görselinin hazırlanması, ilanların galeri panelinden düzenli yönetilmesi ve fiyat araştırmasının derli toplu tutulması. İlan sitelerinin kendi kuralları ve kullanım koşulları bağlayıcı; o yüzden veri aktarımı konusunda söz vermiyoruz.' },
      { soru: 'Değerleme formu müşteriye kesin fiyat veriyor mu?', cevap: 'Hayır, ön fiyat fikri veriyor ve bunun müşterinin beyanına dayandığını açıkça yazıyoruz. Yeterli veri yoksa rakam göstermeyip "ekibimiz sizinle iletişime geçecek" diyen bir akış kuruyoruz; uydurma rakam üretmeyen bir kurgu hem müşteri hem galeri için daha güvenli.' },
      { soru: 'Galeri muhasebesi tarafında neler yapıyorsunuz?', cevap: 'Araç bazlı alış-satış ve masraf takibi, ortaklı işletmelerde ortak kasası, taksitli satış tahsilatı, sigorta ve vergi tarihleri, dönemsel analiz ve Excel alışverişi. Ortaklı galerilerde en çok işe yarayan kısım, hangi aracın kârının nasıl bölüneceğini tabloya çevirmesi oluyor.' },
      { soru: 'Reklamdan gelen müşteriyi nasıl takip ediyoruz?', cevap: 'Reklamdan gelen talebi forma, formu plakaya, plakayı muhasebedeki alınan araca bağlıyoruz. Böylece "bu ay reklama şu kadar verdim, şu araçlar geldi" sorusunun cevabı tabloda görünüyor. Elle işaretleme gerekmiyor.' },
      { soru: 'Araç fotoğraflarını siz mi çekiyorsunuz?', cevap: 'Evet, galeride araç çekimi yapıyoruz. Ayrıca tek veri girişinden markalı araç kartı ve Instagram gönderisi üreten bir akış kurduğumuz için, her araç için tasarımcı beklemeniz gerekmiyor.' },
    ],
    anahtarKelimeler: ['oto galeri web sitesi', 'araç değerleme yazılımı', 'oto galeri dijital pazarlama', 'galeri muhasebe programı', 'araç ilanı hazırlama'],
    metaBaslik: 'Oto Galeri Dijital Pazarlama ve Yazılım',
    metaAciklama: 'Oto galeriler için değerleme formu, araç vitrini, ilan hazırlama akışı, galeri muhasebesi ve reklamdan kâra uzanan ölçüm. Gerçek örnek: May Motors.',
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'kafe-restoran',
    slug: 'kafe-restoran',
    ad: 'Kafe ve Restoran',
    baslik: 'Kafe ve restoranlar için menü, sosyal medya ve harita görünürlüğü',
    giris:
      'Kafe ve restoranda karar çoğu zaman kapıda değil, telefonda veriliyor. Misafir Instagram’a bakıyor, Google yorumlarını okuyor, menüyü arıyor. Menü bulunamıyorsa ya da fiyat belirsizse başka mekâna geçiyor. İçeride ise başka bir yük var: fiyat değişti, menüyü yeniden bastırmak gerekiyor; turist geldi, menüyü anlatmak zaman alıyor; alerjen sorusu geldi, garson emin değil.',
    webTarafi: {
      baslik: 'Web sitesinde ve menüde ne yapıyoruz',
      maddeler: [
        'Menüyü biz dolduruyoruz: yemek çekimi mekânda bizden, ürün adları ve açıklamalar bizden; sizden ürün listesi ve fiyatlar',
        'QR dijital menü: uygulama indirmeden açılan, kategorili ve aranabilir menü',
        'Çok dilli menü yapısı; Türkçe esas, ek diller üzerine eklenir',
        'Her ürün için alerjen ve alkol işaretleri; alerjen listesinden hesaplanan diyet filtreleri',
        'Fiyatın tek yerden güncellenmesi ve basılabilir fiyat listesi çıktısı',
        'İsteğe bağlı QR üzerinden sipariş modülü',
        'İsteğe bağlı rezervasyon talebi modülü ve masa bilgisi formu',
        'Menü içinde günün önerisi, kampanya ve mevsim menüsü alanları',
        'Google’da değerlendirme çağrısı, haritada konum ve tıklanabilir telefon',
        'Mevzuata uygun kurgu: fiyat listesi, içerik ve alerjen bilgilendirmesi doğru çerçevede',
      ],
    },
    sosyalTarafi: {
      baslik: 'Sosyal medyada ne yapıyoruz',
      maddeler: [
        'Yemek fotoğrafçılığı: tabak, sunum ve detay kareleri',
        'Mutfak ve hazırlık videoları; alev, buhar ve servis anı Reels’leri',
        'Mekân atmosferi çekimleri: gündüz ve akşam ışığı',
        'Menüye yeni giren ürünlerin duyuru içerikleri',
        'Haftanın günlerine göre kampanya hikâyeleri',
        'Google İşletme Profili gönderileri ve yorum yanıtları',
        'Yakın çevre hedefli Meta reklamlarıyla öğle ve akşam trafiği yönetimi',
      ],
    },
    ornekIs: {
      marka: 'Kule İstanbul Cafe',
      ozet:
        'Dört dilli (Türkçe, İngilizce, Almanca, Arapça) QR dijital menü kurduk: kategori gezinme, menü içi arama, alerjen bilgisi ve diyet filtreleri. Yemek içeriklerini de biz ürettik.',
      vakaSlug: 'kule-istanbul-cafe',
    },
    sss: [
      { soru: 'QR menüye geçersem basılı menüyü tamamen bırakabilir miyim?', cevap: 'Masadaki menüyü karekodla gösterebiliyorsunuz, ancak işyerinin giriş kapısı önündeki fiyat listesi yükümlülüğü devam ediyor ve müşteri talep ettiğinde fiyat listesini ayrıca vermeniz gerekiyor. Bu yüzden menü sisteminize basılabilir bir fiyat listesi çıktısı ekliyoruz.' },
      { soru: 'Menüde kalori bilgisi vermem gerekiyor mu?', cevap: 'Yükümlülüğün takvimi işletmenizin ölçeğine göre değişiyor; ulusal zincirler için uyum süresi 1 Temmuz 2026’da doldu, diğer işletmeler için tarihler farklı. Ayrıntıları ve kaynaklarını QR menü mevzuatı bölümünde yazdık. Menü yapısını, bu bilgileri sonradan eklemek kolay olacak şekilde kuruyoruz.' },
      { soru: 'Menüye servis veya kuver ücreti satırı ekleyebilir miyiz?', cevap: 'Yiyecek içecek işletmelerinde tüketiciden servis, masa veya kuver ücreti adı altında ilave ödeme talep edilemiyor. Menü sistemimiz bu tür bir satırın eklenmesine uygun kurulmuyor; gönüllü bahşiş ise ayrı bir konu.' },
      { soru: 'Yemek çekimi için mekânı kapatmak gerekiyor mu?', cevap: 'Hayır. Servisin yoğun olmadığı saatlerde, mutfakla birlikte çalışıyoruz. Tabaklar servise çıkacak hâliyle çekiliyor; yenmeyen malzemeyle süsleme yapmıyoruz çünkü misafir sipariş ettiğinde aynısını görmeli.' },
      { soru: 'Google yorumlarını nasıl artırabiliriz?', cevap: 'Yorum satın almıyor, karşılığında indirim vaat eden kampanya kurmuyoruz. Bunun yerine memnun müşterinin yorum bırakmasını kolaylaştırıyoruz: QR menünün içine ve fişe değerlendirme bağlantısı koyuyoruz, mevcut yorumlara da düzenli yanıt yazıyoruz.' },
    ],
    anahtarKelimeler: ['restoran sosyal medya yönetimi', 'kafe Instagram yönetimi', 'kafe QR menü', 'restoran dijital pazarlama', 'yemek fotoğrafı çekimi'],
    metaBaslik: 'Kafe ve Restoran Dijital Pazarlama | QR Menü',
    metaAciklama: 'Kafe ve restoranlar için çok dilli QR menü, sipariş ve rezervasyon modülleri, yemek çekimi, Reels ve Google İşletme Profili yönetimi.',
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'avukat-hukuk',
    slug: 'avukat-hukuk',
    ad: 'Avukat ve Hukuk Bürosu',
    baslik: 'Hukuk büroları için güven veren web sitesi ve randevu akışı',
    giris:
      'Hukuki destek arayan kişi tedirgin ve aceleci. Önce internette araştırıyor, sonra bir büroya ulaşmaya çalışıyor. Bu yolda iki şey onu geri çeviriyor: sitede ne iş yapıldığının anlaşılmaması ve ulaşmanın zor olması. Bir de hukuk mesleğinin reklam konusundaki sınırları var; abartılı vaat ve sonuç garantisi içeren bir anlatım hem meslek kurallarına hem itibara zarar veriyor. Doğru yol, ölçülü ve bilgilendirici bir dijital duruş.',
    webTarafi: {
      baslik: 'Web sitesinde ne yapıyoruz',
      maddeler: [
        'Uzmanlık alanlarının ayrı ayrı, anlaşılır dille anlatıldığı sayfalar',
        'Randevu talebi formu: konu başlığı, tercih edilen gün ve iletişim bilgisi',
        'KVKK aydınlatma metni onaylı iletişim formu; verinin nerede, ne kadar tutulduğunun yazılı olması',
        'Form verilerinin şifreli iletimi ve yetkisiz erişime kapalı yönetim paneli',
        'Sık sorulan hukuki soruların bilgilendirme amaçlı yanıtlandığı rehber bölümü',
        'Ölçülü ve mesleki sınırlara uygun dil; sonuç veya kazanç vaadi içermeyen metinler',
        'Büro konumu, ulaşım bilgisi ve görüşme saatleri',
        'Telefon ve WhatsApp’a tek dokunuşla erişim',
      ],
    },
    sosyalTarafi: {
      baslik: 'Sosyal medyada ne yapıyoruz',
      maddeler: [
        'Mevzuat değişikliklerini sade dille anlatan bilgilendirme içerikleri',
        '"Şu durumda ne yapmalı" formatında kısa açıklama videoları',
        'Kurumsal ve ölçülü görsel dil; dava sonucu veya müvekkil bilgisi paylaşılmaz',
        'Yayın öncesi mesleki sınırların gözden geçirilmesi',
        'LinkedIn tarafında kurumsal görünürlük ve makale paylaşımı',
        'Google İşletme Profili düzeni ve yorum yanıtları',
      ],
    },
    sss: [
      { soru: 'Avukatlık reklam yasağı kapsamında neler yapılabiliyor?', cevap: 'Mesleki düzenlemeler tanıtım dilini sınırlıyor; iş çekmeye yönelik abartılı vaat, sonuç garantisi ve karşılaştırmalı iddia uygun değil. Bilgilendirici içerik, uzmanlık alanlarının tanıtımı ve ulaşılabilirlik bilgileri genelde sorun olmuyor. Yine de metinleri yayına almadan önce baro düzenlemeleri açısından sizin veya meslek kuruluşunuzun onayına sunmanızı öneriyoruz.' },
      { soru: 'Müvekkil bilgisi veya dava örneği paylaşabilir miyiz?', cevap: 'Paylaşmıyoruz. Müvekkil adı, dava detayı ve sonuç bilgisi hem sır saklama yükümlülüğü hem kişisel veri açısından paylaşıma uygun değil. İçerikleri genel bilgilendirme çerçevesinde, somut dosyaya atıf yapmadan kuruyoruz.' },
      { soru: 'Formdan gelen bilgiler nerede saklanıyor?', cevap: 'Talepler yönetim panelinize düşüyor ve yetkisiz erişime kapalı tutuluyor. Aydınlatma metninde hangi verinin hangi amaçla ve ne kadar süre işlendiğini yazıyoruz. Hassas bilgi içeren ayrıntıların forma yazılmaması için formda uyarı gösteriyoruz.' },
      { soru: 'Google Ads ile avukatlık hizmeti tanıtabilir miyiz?', cevap: 'Reklam platformlarının hukuk hizmetleri için kendi politikaları var ve mesleki düzenlemeler de devam ediyor. Bu alanda reklam yerine genelde içerik ve yerel görünürlük daha güvenli bir yol. Reklam gerekiyorsa kapsamı ve metni meslek kurallarıyla birlikte değerlendirip karar veriyoruz.' },
      { soru: 'Rehber yazıları hukuki görüş sayılır mı?', cevap: 'Hayır ve bunu açıkça yazıyoruz. Her bilgilendirme içeriğinin sonunda "bu içerik genel bilgilendirme amaçlıdır, hukuki görüş niteliği taşımaz" notu bulunuyor. Bu not hem okuyucuyu doğru yönlendiriyor hem büronuzu koruyor.' },
    ],
    anahtarKelimeler: ['avukat web sitesi', 'hukuk bürosu web sitesi', 'hukuk bürosu dijital tanıtım', 'avukat randevu formu'],
    metaBaslik: 'Avukat ve Hukuk Bürosu Web Sitesi | Ajans Flow',
    metaAciklama: 'Hukuk büroları için ölçülü dille yazılmış uzmanlık sayfaları, KVKK uyumlu randevu formu ve mesleki sınırlara uygun bilgilendirme içeriği.',
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'mimar',
    slug: 'mimar-ic-mimar',
    ad: 'Mimar ve İç Mimar',
    baslik: 'Mimar ve iç mimarlar için proje vitrini ve içerik üretimi',
    giris:
      'Mimarlık ve iç mimarlıkta müşteri kararını gözüyle veriyor. Teklif istemeden önce yapılmış işlere bakıyor, kendi evini o işlerin arasında hayal ediyor. Ama projeler çoğu zaman mimarın telefonunda ve bilgisayarında dağınık duruyor; görsellerin bir kısmı render, bir kısmı şantiye fotoğrafı, bir kısmı teslim sonrası çekim. Dışarıdan bakan kişi hangi işin ne olduğunu anlamıyor. İkinci dert: iyi bir iş teslim ediliyor, hiç içerik üretilmiyor ve o iş kimse tarafından görülmüyor.',
    webTarafi: {
      baslik: 'Web sitesinde ne yapıyoruz',
      maddeler: [
        'Proje galerisi: kategoriye göre (konut, ofis, ticari, tadilat) filtrelenebilen liste',
        'Her proje için ayrı sayfa: metrekare, konum, kapsam, süreç ve görsel seti',
        'Öncesi-sonrası karşılaştırma kaydırıcısı',
        'Render, teknik çizim ve teslim fotoğraflarının ayrı ayrı etiketlenmesi',
        '360 derece görsel ve sanal tur gömme desteği',
        'Çalışma süreci anlatımı: ilk görüşme, konsept, uygulama, teslim',
        'Teklif talep formu: proje tipi, metrekare, bütçe aralığı ve tarih beklentisi',
        'Hızlı açılan, büyük görselleri kademeli yükleyen mobil uyumlu yapı',
      ],
    },
    sosyalTarafi: {
      baslik: 'Sosyal medyada ne yapıyoruz',
      maddeler: [
        'Teslim edilen projelerin profesyonel mekân çekimi',
        'Şantiyeden teslime uzanan süreç videoları ve zaman akışlı kurgular',
        'Öncesi-sonrası Reels formatı',
        'Malzeme, renk ve detay odaklı yakın plan kareleri',
        'Dış mekân ve çevre ilişkisini gösteren drone planları',
        'Tasarım tercihlerinin kısa anlatıldığı bilgilendirme içerikleri',
        'Proje tipine göre hedeflenmiş Meta reklamları',
      ],
    },
    ornekIs: {
      marka: 'Mimar Elif Kara',
      ozet:
        'Projelerin dijitalde düzenli görünmesi için içerik ve tanıtım çalışmalarını yürüttük; proje görsellerini tutarlı bir akışa oturttuk.',
      vakaSlug: 'mimar-elif-kara',
    },
    sss: [
      { soru: 'Render görsellerimi de siteye koyabilir miyiz?', cevap: 'Evet, ama etiketleyerek. Render ile gerçekleşmiş iş fotoğrafını ayırmak hem dürüstlük hem beklenti yönetimi açısından önemli. Müşteri "bu yapıldı mı, yapılacak mı" sorusunu sormak zorunda kalmamalı.' },
      { soru: 'Proje sahiplerinin izni gerekiyor mu?', cevap: 'Konut projelerinde kesinlikle öneriyoruz. Mal sahibinin evinin iç görselleri kişisel alanı ilgilendiriyor; yazılı izin almadan yayınlamıyoruz. Ticari projelerde de marka izni istiyoruz.' },
      { soru: '360 derece sanal tur yapıyor musunuz?', cevap: 'Sanal tur görsellerinin üretimini çalıştığınız ekip yapıyorsa siteye gömme ve mobil uyumlu çalıştırma tarafını biz kuruyoruz. Üretimi de dahil bir çözüm isterseniz kapsamı ayrı değerlendiriyoruz.' },
      { soru: 'Çok sayıda büyük görselim var, site yavaşlar mı?', cevap: 'Yavaşlamaması için görselleri boyutlandırıp kademeli yüklüyoruz: ilk ekran hemen açılıyor, kalan görseller aşağı kaydırdıkça geliyor. Mimari sitelerde en sık görülen hata tüm galeriyi tek seferde yüklemek; bunu yapmıyoruz.' },
      { soru: 'Şantiye aşamasındaki projeyi paylaşmak doğru mu?', cevap: 'Doğru kurgulandığında çok işe yarıyor. Süreç içeriği güven veriyor ve işin nasıl yürüdüğünü gösteriyor. İş sahibinin izni, iş güvenliği kuralları ve ticari bilgilerin görünmemesi şartıyla planlıyoruz.' },
    ],
    anahtarKelimeler: ['mimar web sitesi', 'iç mimar portfolyo sitesi', 'mimarlık ofisi dijital tanıtım', 'proje galerisi web sitesi'],
    metaBaslik: 'Mimar ve İç Mimar Web Sitesi ve Sosyal Medya',
    metaAciklama: 'Mimar ve iç mimarlar için filtrelenebilir proje galerisi, öncesi-sonrası karşılaştırma, 360 görsel gömme ve teslim projelerinin içerik üretimi.',
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'saglik',
    slug: 'dis-klinigi-saglik',
    ad: 'Diş Kliniği ve Sağlık',
    baslik: 'Klinikler için mevzuata uygun tanıtım ve randevu akışı',
    giris:
      'Klinik seçiminde belirleyici olan şey fiyat değil güven. Hasta önce kliniğin sitesine bakıyor, hekimin kim olduğunu arıyor, yorumları okuyor ve ulaşmanın kolay olup olmadığına bakıyor. Sağlık alanında ayrıca ciddi bir sınır var: sağlık hizmeti tanıtımı Türkiye’de düzenlemelere tabi; tedavi vaadi, karşılaştırmalı iddia ve hastayı yönlendiren bazı görsel kullanımları uygun değil. Bu yüzden sağlık işlerinde önce "ne söylemeyeceğimizi" belirliyoruz.',
    webTarafi: {
      baslik: 'Web sitesinde ne yapıyoruz',
      maddeler: [
        'Online randevu talebi formu: bölüm, tercih edilen gün ve iletişim bilgisi',
        'Hekim tanıtım sayfaları: eğitim ve uzmanlık bilgisi, ölçülü dil',
        'Tedavi ve hizmet sayfalarının bilgilendirme çerçevesinde yazılması',
        'KVKK aydınlatma metni onaylı form; sağlık verisinin forma yazılmaması için uyarı',
        'Formdan gelen taleplerin yetkisiz erişime kapalı panelde tutulması',
        'Klinik mekân görselleri, cihaz ve hijyen anlatımı',
        'Ulaşım, otopark ve çalışma saatleri bilgisi',
        'Çok dilli yapı (yurt dışından hasta kabul eden klinikler için)',
        'Tanıtım metinlerinin yayın öncesi mevzuat açısından gözden geçirilmesi',
      ],
    },
    sosyalTarafi: {
      baslik: 'Sosyal medyada ne yapıyoruz',
      maddeler: [
        'Bilgilendirme odaklı içerik: ağız sağlığı, bakım önerileri, sık sorulan sorular',
        'Klinik ve ekip tanıtımı; mekânın temizliği ve düzeni ön planda',
        'Hekimin anlattığı kısa açıklama videoları',
        'Hasta mahremiyetini koruyan görsel seçimi',
        'Öncesi-sonrası görsellerinin kullanımında mevzuat sınırlarına uyum',
        'Yorum ve mesajların bilgilendirme sınırında yanıtlanması; tanı veya tedavi önerisi verilmemesi',
        'Google İşletme Profili düzeni ve yorum yönetimi',
      ],
    },
    sss: [
      { soru: 'Öncesi-sonrası görseli paylaşabilir miyiz?', cevap: 'Sağlık hizmeti tanıtımında bu görsellerin kullanımı sınırlı ve riskli. Hem hasta onayı hem mevzuat açısından değerlendirme gerekiyor. Biz bu tür içerikleri varsayılan olarak planlamıyoruz; kullanılacaksa kliniğin hukuk danışmanı veya meslek kuruluşundan teyit alınması gerektiğini söylüyoruz.' },
      { soru: 'Hasta yorumlarını siteye koyabilir miyiz?', cevap: 'Sağlık alanında hasta deneyimi paylaşımı tanıtım sayılabiliyor ve kısıtlamaya tabi. Sitede yorum bölümü kurmak yerine Google profilindeki gerçek yorumların doğal akışını ve kliniğin yanıtlarını önemsemenizi öneriyoruz. Uydurma yorum hiçbir koşulda yazmıyoruz.' },
      { soru: 'Reklam verebilir miyiz?', cevap: 'Sağlık hizmeti reklamı düzenlemeye tabi ve reklam platformlarının da ayrı politikaları var. Bu alanda genelde bilgilendirme içeriği, yerel görünürlük ve randevu akışının iyileştirilmesi daha güvenli sonuç veriyor. Reklam gerekiyorsa kapsamı mevzuat teyidiyle birlikte belirliyoruz.' },
      { soru: 'Randevu formunda hastalık bilgisi isteyebilir miyiz?', cevap: 'İstemenizi önermiyoruz. Sağlık verisi özel nitelikli kişisel veri ve ek yükümlülükler getiriyor. Formu bölüm seçimi ve iletişim bilgisiyle sınırlı tutuyor, ayrıntıyı klinikte veya telefonda alıyoruz; forma da bu yönde uyarı koyuyoruz.' },
      { soru: 'Metinleri kim onaylıyor?', cevap: 'Taslak metinleri biz yazıyoruz, ama sağlık tanıtımına dair son kontrolü kliniğin kendi hukuk danışmanının veya sorumlu hekimin yapmasını istiyoruz. Bu alanda içeriği teyit almadan yayına almıyoruz.' },
    ],
    anahtarKelimeler: ['diş kliniği web sitesi', 'klinik randevu sistemi', 'sağlık kuruluşu dijital tanıtım', 'klinik sosyal medya yönetimi'],
    metaBaslik: 'Diş Kliniği ve Sağlık Kuruluşu Dijital Tanıtım',
    metaAciklama: 'Klinikler için randevu talebi akışı, hekim tanıtım sayfaları, KVKK uyumlu form ve sağlık tanıtım mevzuatına uygun ölçülü içerik üretimi.',
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'spor',
    slug: 'spor-salonu',
    ad: 'Spor Salonu ve Spor Okulu',
    baslik: 'Spor salonları, akademiler ve ligler için üyelik ve kayıt akışı',
    giris:
      'Spor işletmelerinde en zor adım ilk adım. İnsan üye olmaya karar vermiş olsa bile salona girip fiyat sormaya çekiniyor; veli çocuğunu bir spor okuluna yazdırmak isterken antrenörü, sahayı ve programı görmek istiyor. İkinci zorluk dönemsellik: kayıtlar belirli haftalarda yoğunlaşıyor ve o haftaları kaçıran işletme bütün sezonu kaybediyor. Üçüncüsü ise bırakma: üye geliyor, iki ay sonra kayboluyor ve kimse sebebini sormuyor.',
    webTarafi: {
      baslik: 'Web sitesinde ne yapıyoruz',
      maddeler: [
        'Deneme dersi ve ücretsiz ilk seans talep formu — en düşük eşikli ilk adım',
        'Üyelik ve kayıt formu; yaş grubu, branş ve tercih edilen gün seçimi',
        'Ders ve antrenman programı tablosu; hangi gün hangi saatte hangi branş',
        'Antrenör ve eğitmen tanıtım sayfaları',
        'Kayıt dönemi için geri sayım ve son başvuru tarihi gösterimi',
        'Branş ve yaş kategorisine göre ayrı sayfalar',
        'Turnuva, lig ve etkinlik duyuruları; sonuç ve fikstür tabloları',
        'WhatsApp üzerinden hazır mesajla gelen hızlı kayıt akışı',
        'Veli ve üye bilgilendirme bölümü: kurallar, sözleşme ve sıkça sorulanlar',
      ],
    },
    sosyalTarafi: {
      baslik: 'Sosyal medyada ne yapıyoruz',
      maddeler: [
        'Antrenman ve maç anı çekimleri; hareket odaklı Reels',
        'Haftanın oyuncusu, gelişim hikâyesi ve başarı paylaşımları',
        'Antrenörün anlattığı kısa teknik ve motivasyon içerikleri',
        'Kayıt dönemi kampanyası: geri sayımlı hikâye serisi',
        'Veli ve üye güvenini kuran tesis ve güvenlik içerikleri',
        'Etkinlik ve turnuva günlerinden canlı aktarım ve özet videolar',
        'Yakın bölge ve yaş hedefli Meta reklamlarıyla kayıt talebi toplama',
      ],
    },
    ornekIs: {
      marka: 'Minik Starlar Ligi',
      ozet:
        'U10-U12 çocuk futbol ligi için medya partnerliği yürüttük: tanıtım sitesi kurgusu, geri sayımlı kayıt akışı, maç içerikleri ve ligin dijital tanıtımı.',
      vakaSlug: 'minik-starlar-ligi',
    },
    sss: [
      { soru: 'Deneme dersi formu gerçekten işe yarıyor mu?', cevap: 'Spor işletmelerinde en çok dönüşen form bu oluyor, çünkü karar vermeyi gerektirmiyor. Kişi "üye olayım mı" sorusuna değil "bir kez geleyim mi" sorusuna cevap veriyor. Formu kısa tutmak kritik: isim, telefon ve tercih edilen gün genelde yeterli.' },
      { soru: 'Üyelik ve ödeme takibini de yapabiliyor musunuz?', cevap: 'Site tarafında kayıt ve talep toplama akışını kuruyoruz. Üyelik aidatı, yoklama ve ödeme takibi gibi işletme içi bir sistem gerekiyorsa bunu ayrı bir yazılım kapsamı olarak değerlendiriyoruz; mevcut bir programınız varsa onunla birlikte nasıl çalışacağına bakıyoruz.' },
      { soru: 'Çocukların fotoğraf ve videosunu paylaşabilir miyiz?', cevap: 'Veli izni olmadan paylaşmıyoruz. Kayıt formuna açık bir görsel kullanım izni alanı ekliyor, izin vermeyen velilerin çocuklarının görünmediği kareleri seçiyoruz. Çekim gününde hangi çocukların izinli olduğunu listeyle çalışıyoruz.' },
      { soru: 'Kayıt dönemini nasıl yoğunlaştırabiliriz?', cevap: 'Son başvuru tarihini sitede görünür kılıp geri sayım gösteriyoruz; sosyal medyada o tarihe doğru artan bir hikâye serisi kuruyoruz. Reklam bütçesini de sezon boyunca eşit dağıtmak yerine kayıt haftalarında yoğunlaştırıyoruz.' },
      { soru: 'Üye kaybını azaltmak için ne yapabiliriz?', cevap: 'Dijital tarafta iki şey işe yarıyor: üyenin gelişimini gösteren içerik ve düzenli hatırlatma. Haftanın programı, kişisel gelişim paylaşımları ve topluluk hissi veren içerikler devamlılığı destekliyor. Bunu bir içerik takvimine bağlayıp sürdürülebilir hâle getiriyoruz.' },
    ],
    anahtarKelimeler: ['spor salonu sosyal medya', 'spor okulu web sitesi', 'futbol akademisi kayıt sitesi', 'deneme dersi formu'],
    metaBaslik: 'Spor Salonu ve Spor Okulu Dijital Pazarlama',
    metaAciklama: 'Spor salonları ve akademiler için deneme dersi formu, ders programı, geri sayımlı kayıt akışı ve antrenman-maç içerikleriyle sosyal medya.',
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'anaokulu',
    slug: 'anaokulu-egitim',
    ad: 'Anaokulu ve Eğitim',
    baslik: 'Anaokulu ve eğitim kurumları için veli güveni kuran dijital düzen',
    giris:
      'Anaokulu seçimi bir satın alma kararı değil, bir güven kararı. Veli kurumun sitesine bakarken fiyata değil şu üçüne bakıyor: çocuk burada güvende mi, öğretmenler kim, gün içinde ne yapılıyor. Bu sorular cevaplanmazsa veli ya telefon ediyor ya da vazgeçiyor. Bir de dönemsellik var: kayıtlar belirli aylarda toplanıyor ve o dönemde kurumun dijitalde görünür olması bütün yılı belirliyor. Üstüne hassas bir sınır ekleniyor: çocuk görselleri izinsiz paylaşılamaz.',
    webTarafi: {
      baslik: 'Web sitesinde ne yapıyoruz',
      maddeler: [
        'Ön kayıt formu: yaş grubu, başlangıç dönemi, iletişim bilgisi ve görsel kullanım izni alanı',
        'Kurum gezisi (yerinde görüşme) randevu talebi',
        'Günlük akış anlatımı: sabah kabulü, etkinlikler, beslenme, dinlenme, çıkış',
        'Öğretmen ve eğitim kadrosu tanıtımı',
        'Eğitim programı ve yaş gruplarına göre ayrı sayfalar',
        'Güvenlik ve hijyen anlatımı: giriş-çıkış düzeni, kamera, sağlık uygulamaları',
        'Mekân galerisi: sınıflar, bahçe, yemekhane — çocuk görünmeyen kareler',
        'Veli bilgilendirme bölümü: kayıt belgeleri, ücret dönemleri, sıkça sorulanlar',
        'KVKK aydınlatma metni ve çocuk verisine ilişkin ayrı bilgilendirme',
      ],
    },
    sosyalTarafi: {
      baslik: 'Sosyal medyada ne yapıyoruz',
      maddeler: [
        'Mekân ve etkinlik alanı çekimleri; sıcak ve düzenli bir görsel dil',
        'Etkinlik içerikleri: çocuk yüzü görünmeyen, eli-işi gösteren kareler',
        'Öğretmenin anlattığı kısa gelişim ve eğitim içerikleri',
        'Veli sorularına yanıt veren bilgilendirme serileri',
        'Dönemsel etkinlik duyuruları: bayram, kermes, mezuniyet',
        'Kayıt dönemine özel hikâye serisi ve ön kayıt çağrısı',
        'Yakın mahalle hedefli Meta reklamlarıyla ön kayıt talebi toplama',
      ],
    },
    sss: [
      { soru: 'Çocuk fotoğraflarını paylaşmak zorunda mıyız?', cevap: 'Hayır ve zorunda değilsiniz diye zayıf içerik üretmek de gerekmiyor. El, malzeme, etkinlik masası, bahçe ve mekân kareleriyle güçlü bir akış kurulabiliyor. Yüz görünen kareler yalnızca velinin yazılı izniyle ve izin verilen çocuklarla kullanılıyor.' },
      { soru: 'Görsel kullanım izni nasıl alınıyor?', cevap: 'Kayıt sırasında imzalanan bir izin metniyle. Siteye de ön kayıt formuna bir izin alanı ekliyoruz. Çekim günü hangi çocukların izinli olduğunu listeden kontrol ediyoruz; şüpheli durumda o kareyi kullanmıyoruz.' },
      { soru: 'Kayıt dönemi dışında da paylaşım yapmalı mıyız?', cevap: 'Evet. Veli kayıt döneminde karar verirken geçmiş aylara bakıyor; yıl boyunca sessiz kalıp sadece kayıt haftasında paylaşan bir hesap güven vermiyor. Yıl boyu düzenli, kayıt döneminde yoğunlaşan bir takvim kuruyoruz.' },
      { soru: 'Ücret bilgisini siteye yazalım mı?', cevap: 'Çoğu kurum yazmıyor ve bunun makul sebepleri var: dönem, yaş grubu ve servis-yemek kalemlerine göre değişiyor. Bizim önerimiz ücret yerine neyin dahil olduğunu açık yazmak ve ön kayıt formuna yönlendirmek. Böylece veli boşa aramıyor, siz de doğru adayla konuşuyorsunuz.' },
      { soru: 'Veli yorumlarını kullanabilir miyiz?', cevap: 'Velinin yazılı onayıyla ve kendi ifadesiyle kullanılabiliyor. Uydurma yorum yazmıyoruz. En güvenilir yol Google İşletme Profilindeki gerçek yorumlar; o akışı düzenli hâle getirip yanıtlarını yazıyoruz.' },
    ],
    anahtarKelimeler: ['anaokulu web sitesi', 'kreş dijital tanıtım', 'eğitim kurumu sosyal medya', 'anaokulu kayıt formu'],
    metaBaslik: 'Anaokulu ve Eğitim Kurumu Dijital Tanıtım',
    metaAciklama: 'Anaokulları için ön kayıt formu, günlük akış ve güvenlik anlatımı, veli bilgilendirmesi ve izin sınırlarına uygun sosyal medya içeriği.',
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'guzellik',
    slug: 'guzellik-kuafor',
    ad: 'Güzellik Salonu ve Kuaför',
    baslik: 'Güzellik salonları ve kuaförler için randevu ve iş vitrini',
    giris:
      'Bu işte müşteri önce yapılan işe bakıyor, sonra randevu alıyor. Instagram akışı pratikte bir portföy; akış dağınıksa ya da son paylaşım iki ay öncesindeyse müşteri başka salona gidiyor. İkinci dert randevu trafiği: gün içinde telefon ve DM’ye cevap vermek koltuktaki işi aksatıyor, cevapsız kalan mesaj ise doğrudan kayıp müşteri demek. Üçüncüsü ise boş saatler; sabah ve hafta başı genelde sessiz geçiyor.',
    webTarafi: {
      baslik: 'Web sitesinde ne yapıyoruz',
      maddeler: [
        'Online randevu talebi: hizmet, tercih edilen gün-saat ve uzman seçimi',
        'Hizmet listesi ve her hizmetin ne kadar sürdüğü bilgisi',
        'Uzman ve stilist tanıtım kartları; kimin hangi işte uzman olduğu',
        'İş vitrini galerisi: hizmete göre filtrelenebilen öncesi-sonrası kareler',
        'Instagram akışının siteye gömülmesi',
        'Kampanya ve paket sayfaları (fiyat yerine kapsam anlatımı)',
        'Hediye çeki ve özel gün paketleri için talep formu',
        'Konum, ulaşım, otopark ve çalışma saatleri',
        'WhatsApp üzerinden hazır mesajla randevu talebi',
      ],
    },
    sosyalTarafi: {
      baslik: 'Sosyal medyada ne yapıyoruz',
      maddeler: [
        'İş çekimleri: doğru ışıkta, tutarlı açılarda öncesi-sonrası kareleri',
        'İşlem sırasındaki kısa süreç videoları ve dönüşüm Reels’leri',
        'Uzman tanıtımı ve bakım önerisi içerikleri',
        'Mekân ve atmosfer kareleri; temizlik ve düzen vurgusu',
        'Boş saatlere yönelik günün fırsatı hikâyeleri',
        'DM ve yorum yönetimi; randevu sorularının hızlı yanıtlanması',
        'Yakın bölge hedefli Meta reklamlarıyla randevu talebi toplama',
      ],
    },
    sss: [
      { soru: 'Müşterinin fotoğrafını paylaşmak için izin gerekiyor mu?', cevap: 'Evet, yüzü görünen her kare için izin alıyoruz. Pratik yol: salonda kısa bir izin metni bulundurmak ve çekim öncesi sormak. İzin yoksa saç, tırnak veya işlem detayına odaklanan kareler kullanıyoruz; bunlar da çok iyi çalışıyor.' },
      { soru: 'Randevu sistemi ücretli bir programa ihtiyaç duyar mı?', cevap: 'Hayır. Site üzerinden randevu talebi toplayıp panele düşürebiliyoruz; siz onaylıyor ya da arayıp teyit ediyorsunuz. Takvim senkronizasyonu ve otomatik onay isteyen salonlar için kapsamı ayrı planlıyoruz.' },
      { soru: 'Boş saatleri doldurmak için ne öneriyorsunuz?', cevap: 'Sabit indirim yerine zamanı belirli, sayısı sınırlı hikâye kampanyaları işe yarıyor: "bugün 11.00 ve 12.00 boş" gibi. Bu hem dolu saatlerin değerini düşürmüyor hem acil müşteriyi yakalıyor.' },
      { soru: 'DM’lere biz mi cevap veriyoruz, siz mi?', cevap: 'Paketinize göre. Topluluk yönetimi dahilse mesajları biz yanıtlıyoruz ve randevu taleplerini size liste olarak iletiyoruz. Fiyat ve uygunluk gibi sizin bilmeniz gereken sorularda hazır yanıt seti kurup yönlendiriyoruz.' },
      { soru: 'Fiyat listesini siteye koymalı mıyız?', cevap: 'Karar sizin. Saç boyası gibi uzunluğa ve ürüne göre değişen hizmetlerde net rakam yazmak sorun yaratıyor; bunun yerine "neye göre değişir" anlatımı ve randevuda net fiyat teyidi daha iyi çalışıyor. Sabit süreli hizmetlerde fiyat yazmak randevuyu hızlandırıyor.' },
    ],
    anahtarKelimeler: ['güzellik salonu sosyal medya', 'kuaför web sitesi', 'online randevu sistemi', 'güzellik salonu Instagram yönetimi'],
    metaBaslik: 'Güzellik Salonu ve Kuaför Sosyal Medya Yönetimi',
    metaAciklama: 'Güzellik salonları ve kuaförler için online randevu talebi, hizmet listesi, iş vitrini galerisi ve boş saatleri dolduran içerik kurgusu.',
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'otel',
    slug: 'otel-turizm',
    ad: 'Otel ve Turizm',
    baslik: 'Otel ve turizm işletmeleri için rezervasyon talebi ve çok dilli site',
    giris:
      'Konaklama işinde misafir kararını ekranda veriyor ve çoğu zaman aracı platformlar üzerinden. Bu platformlar rezervasyon getiriyor ama komisyon alıyor ve misafirle doğrudan bağınızı kesiyor. İşletmenin kendi sitesi varsa bile çoğu zaman tek dilli, yavaş ve rezervasyon akışı belirsiz oluyor; yurt dışından gelen misafir vazgeçiyor. Bir de görsel sorunu var: odaların fotoğrafı eski, manzara hiç görünmüyor ve mekânın ölçeği anlaşılmıyor.',
    webTarafi: {
      baslik: 'Web sitesinde ne yapıyoruz',
      maddeler: [
        'Rezervasyon talebi formu: tarih aralığı, kişi sayısı, oda tipi ve not alanı',
        'Oda ve suit vitrini: her oda tipi için ayrı sayfa, donanım listesi ve görsel seti',
        'Çok dilli site yapısı; menü, oda açıklamaları ve formların tamamı çevrilir',
        'Tesis olanakları sayfaları: restoran, havuz, plaj, toplantı salonu, spa',
        'Konum ve çevre bilgisi: havalimanı mesafesi, ulaşım, gezilecek yerler',
        'Doğrudan rezervasyonu teşvik eden avantaj anlatımı',
        'Düğün, toplantı ve grup organizasyonu için ayrı talep formları',
        'Havadan çekilmiş tesis ve çevre görüntüleriyle açılan tanıtım bölümü',
        'Mobilde hızlı açılan, büyük görselleri kademeli yükleyen yapı',
      ],
    },
    sosyalTarafi: {
      baslik: 'Sosyal medyada ne yapıyoruz',
      maddeler: [
        'Oda, manzara ve tesis çekimleri; gün içi ışık değişimini kullanan kareler',
        'Drone ile çekilmiş tesis ve çevre planları',
        'Kahvaltı, restoran ve ikram içerikleri',
        'Misafir deneyimi anlatan kısa videolar (izinli çekim)',
        'Sezon öncesi erken rezervasyon kampanyaları',
        'Çok dilli gönderi metinleri ve yurt dışı hedefli reklamlar',
        'Google İşletme Profili fotoğraf ve yorum yönetimi',
      ],
    },
    sss: [
      { soru: 'Siteden doğrudan ödeme alabiliyor muyuz?', cevap: 'Ödeme almak için bir ödeme sağlayıcısı ya da rezervasyon motoru anlaşması gerekiyor; teknik bağlantıyı biz kuruyoruz. Birçok butik işletme önce "rezervasyon talebi + onay + kapora" akışıyla başlıyor; bu akış daha az maliyetli ve iptal yönetimi kolay oluyor.' },
      { soru: 'Aracı platformlara göre kendi sitemizin avantajı ne?', cevap: 'Komisyon ödemiyorsunuz ve misafirin iletişim bilgisi sizde kalıyor; bu, tekrar konaklama ve doğrudan kampanya için değerli. Platformları bırakmanızı önermiyoruz; ama doğrudan rezervasyonu teşvik eden bir siteniz olduğunda toplam maliyetiniz düşüyor.' },
      { soru: 'Kaç dil desteği gerekiyor?', cevap: 'Misafir profilinize bağlı. Yurt dışından gelen misafirin hangi ülkelerden olduğuna bakıp karar veriyoruz; genelde İngilizce ilk, sonra ağırlıklı pazarınızın dili geliyor. Her dili makine çevirisiyle eklemek yerine az sayıda dili doğru çevirmek daha iyi sonuç veriyor.' },
      { soru: 'Oda fotoğraflarını siz mi çekiyorsunuz?', cevap: 'Evet, oda ve tesis çekimi yapıyoruz. Odaların doğal ışıkta, toplu ve gerçek hâliyle çekilmesine dikkat ediyoruz; geniş açı abartısıyla odayı olduğundan büyük gösteren çekimler misafir geldiğinde hayal kırıklığı ve olumsuz yorum üretiyor.' },
      { soru: 'Düğün ve toplantı organizasyonu için ayrı sayfa gerekli mi?', cevap: 'Gerekli, çünkü bu aramalar konaklama aramasından tamamen farklı. Kapasite, salon ölçüleri, menü seçenekleri ve geçmiş organizasyon görselleriyle ayrı bir sayfa kurmak bu talepleri doğrudan yakalıyor.' },
    ],
    anahtarKelimeler: ['otel web sitesi', 'otel rezervasyon sistemi', 'turizm dijital pazarlama', 'çok dilli otel sitesi'],
    metaBaslik: 'Otel ve Turizm İşletmesi Dijital Pazarlama',
    metaAciklama: 'Oteller için rezervasyon talebi akışı, oda vitrini, çok dilli site, drone ile tesis çekimi ve doğrudan rezervasyonu artıran içerik kurgusu.',
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'emlak',
    slug: 'emlak-insaat',
    ad: 'Emlak ve İnşaat',
    baslik: 'Emlak ofisleri ve inşaat firmaları için portföy ve proje tanıtımı',
    giris:
      'Emlakta rekabet portföyde değil, portföyün nasıl göründüğünde. Aynı daire onlarca ilanda aynı kötü fotoğraflarla duruyor; alıcı hangi ofisin ciddi olduğunu ayırt edemiyor. İnşaat tarafında ise sorun farklı: proje henüz bitmemiş, gösterilecek bina yok, alıcıya konumu ve ölçeği anlatmak gerekiyor. İki tarafın ortak derdi de şu: gelen talebin hangisi ciddi, hangisi vakit kaybı belli olmuyor.',
    webTarafi: {
      baslik: 'Web sitesinde ne yapıyoruz',
      maddeler: [
        'Portföy listesi: tip, bölge, oda sayısı ve fiyat aralığına göre filtreleme',
        'Her portföy için ayrı sayfa: ölçüler, kat planı, özellikler ve görsel seti',
        'Satıldı ve kiralandı durumlarının otomatik işaretlenmesi',
        'Proje sayfaları: inşaat projeleri için ayrı yapı, etap bilgisi ve teslim takvimi',
        'Portföy ekleme ve güncelleme paneli; ofis çalışanının kolayca kullanabileceği düzen',
        'Niyeti ölçen talep formu: bütçe aralığı, kredi durumu ve zaman beklentisi',
        'Danışman tanıtım kartları ve danışmana doğrudan ulaşım',
        'Havadan çekimle konum, çevre ve ulaşım ilişkisinin gösterilmesi',
        'Bölge rehberi sayfaları: okul, ulaşım, çarşı ve yaşam bilgisi',
      ],
    },
    sosyalTarafi: {
      baslik: 'Sosyal medyada ne yapıyoruz',
      maddeler: [
        'Portföy çekimi: geniş, aydınlık ve gerçeği yansıtan mekân kareleri',
        'Daire ve ofis gezinti videoları (yürüyüş çekimi)',
        'Drone ile konum, manzara ve çevre planları',
        'İnşaat ilerleme videoları ve dönemsel karşılaştırmalar',
        'Bölge tanıtım içerikleri: semtte yaşam, ulaşım, fiyat eğilimi anlatımı',
        'Danışman tanıtımı ve müşteri süreci anlatan içerikler',
        'Bütçe ve bölge hedefli Meta ve Google reklamları',
      ],
    },
    sss: [
      { soru: 'Portföyümü kendim güncelleyebilecek miyim?', cevap: 'Evet. Portföy ekleme, fotoğraf yükleme, fiyat güncelleme ve satıldı işaretleme panelden yapılıyor. Panel ofis çalışanının eğitim almadan kullanabileceği sadelikte kuruluyor.' },
      { soru: 'İlanlarım portallara otomatik aktarılıyor mu?', cevap: 'Portalların kendi kuralları ve teknik şartları var; otomatik aktarım sözü vermiyoruz. Yaptığımız iş kendi sitenizde düzenli bir portföy vitrini kurmak, ilan metni ve görsellerini hazırlamak ve portföy bilgilerini tek yerden yönetilebilir hâle getirmek.' },
      { soru: 'Henüz bitmemiş projeyi nasıl tanıtıyoruz?', cevap: 'Konum, çevre ve ölçek üzerinden. Drone ile arazinin ulaşıma, denize veya merkeze göre konumunu gösteriyoruz; kat planı ve etap bilgisiyle teslim takvimini netleştiriyoruz. Render kullanılıyorsa görselin render olduğunu açıkça etiketliyoruz.' },
      { soru: 'Ciddi alıcıyı nasıl ayırt ediyoruz?', cevap: 'Formla. Bütçe aralığı, kredi durumu ve "ne zaman taşınmayı planlıyorsunuz" sorularını ekliyoruz. Formu uzatmadan bu üç bilgiyi almak, danışmanın gününü boş görüşmelerden kurtarıyor.' },
      { soru: 'Mal sahibinin evini çekmek için izin gerekiyor mu?', cevap: 'Evet, çekim ve yayın için mal sahibinin izni gerekiyor. Ayrıca kişisel eşya, fotoğraf ve belgelerin karede görünmemesine dikkat ediyoruz; bunlar hem mahremiyet hem satış açısından sorun yaratıyor.' },
    ],
    anahtarKelimeler: ['emlak ofisi web sitesi', 'emlak sosyal medya yönetimi', 'inşaat firması tanıtım filmi', 'proje drone çekimi', 'portföy yönetim paneli'],
    metaBaslik: 'Emlak ve İnşaat Dijital Pazarlama | Drone Çekimi',
    metaAciklama: 'Emlak ofisleri ve inşaat firmaları için filtreli portföy sitesi, proje sayfaları, niyeti ölçen talep formu ve drone ile konum tanıtımı.',
  },

  /* ---------------------------------------------------------------- */
  {
    anahtar: 'magaza',
    slug: 'magaza-eticaret',
    ad: 'Mağaza ve E-Ticaret',
    baslik: 'Mağazalar ve e-ticaret işletmeleri için ürün vitrini ve satış akışı',
    giris:
      'Küçük ve orta ölçekli mağazaların çoğu satışı Instagram üzerinden yapıyor ve süreç DM’de yürüyor: "fiyat?", "stok var mı?", "kargo kaç gün?". Bu akış çalışıyor ama ölçeklenmiyor; günde elli mesaj geldiğinde sipariş kaçıyor, stok karışıyor ve hangi ürünün ne kadar sattığı bilinmiyor. Diğer taraftan tam donanımlı bir e-ticaret kurmak her işletme için gerekli değil; asıl ihtiyaç net bir ürün vitrini ve sipariş akışının düzene girmesi.',
    webTarafi: {
      baslik: 'Web sitesinde ne yapıyoruz',
      maddeler: [
        'Ürün vitrini: kategori, filtre ve arama ile ürüne hızlı erişim',
        'Ürün sayfaları: fotoğraf seti, ölçü-beden tablosu, malzeme ve bakım bilgisi',
        'WhatsApp sipariş akışı: ürün bilgisi hazır mesaj olarak gelir, müşteri sadece gönderir',
        'Stok durumu gösterimi ve tükenen ürünlerin işaretlenmesi',
        'Kampanya ve sezon sayfaları; reklam için ayrı açılış sayfaları',
        'Ürün yönetim paneli: ürün ekleme, fiyat ve stok güncelleme, sıralama',
        'Mesafeli satış yapılacaksa yasal metinlerin ve iade sürecinin kurulması',
        'Mağaza bilgileri: konum, çalışma saatleri, haritada yönlendirme',
        'Reklam ölçümü: hangi üründen, hangi kampanyadan talep geldiği',
      ],
    },
    sosyalTarafi: {
      baslik: 'Sosyal medyada ne yapıyoruz',
      maddeler: [
        'Ürün fotoğrafı çekimi: tek ürün, grup ve kullanım kareleri',
        'Ürün tanıtım videoları ve detay yakın planları',
        'Yeni gelen ürün duyuruları ve stok hatırlatmaları',
        'Kullanım ve kombin önerisi içerikleri',
        'Kampanya dönemlerine özel hikâye serileri ve geri sayım',
        'DM sipariş akışının hazır yanıtlarla hızlandırılması',
        'Ürün ilgisi ve bölge hedefli Meta reklamları, satış kampanyaları',
      ],
    },
    sss: [
      { soru: 'Tam bir e-ticaret sitesi mi kurmalıyız, vitrin mi yeterli?', cevap: 'Sipariş hacminize bağlı. Günde birkaç sipariş alıyorsanız vitrin ve WhatsApp akışı hem hızlı hem düşük maliyetli. Sipariş sayısı arttığında sepet, ödeme ve kargo takibi gerekli hâle geliyor; o aşamada kapsamı büyütüyoruz. Baştan ihtiyacınız olmayan bir altyapı kurmak gereksiz masraf.' },
      { soru: 'WhatsApp sipariş akışı nasıl çalışıyor?', cevap: 'Müşteri ürün sayfasındaki düğmeye bastığında ürün adı, varsa beden ve ürün bağlantısı hazır mesaj olarak geliyor. Müşteri sadece gönderiyor. Böylece "hangi ürün" diye sormak zorunda kalmıyorsunuz ve konuşma doğrudan sipariş aşamasına geçiyor.' },
      { soru: 'Ürün fotoğraflarını biz mi çekeceğiz?', cevap: 'İsterseniz biz çekiyoruz. Ürün çekiminde tutarlılık satışı doğrudan etkiliyor: aynı fon, aynı ışık, aynı açı. Dağınık fotoğraf seti, ürünler iyi olsa bile vitrini zayıf gösteriyor. Kendiniz çekecekseniz basit bir çekim düzeni kurup anlatıyoruz.' },
      { soru: 'Satış yapacaksak hangi yasal metinler gerekiyor?', cevap: 'Site üzerinden mesafeli satış yapacaksanız mesafeli satış sözleşmesi, ön bilgilendirme formu, iade ve cayma süreci, gizlilik ve KVKK metinleri gerekiyor. Metinlerin içeriğini hukuk danışmanınızla teyit etmenizi öneriyoruz; teknik kurulumu ve akışı biz yapıyoruz.' },
      { soru: 'Hangi ürünün ne kadar sattığını görebilir miyiz?', cevap: 'Panelden ürün bazlı talep ve görüntülenme takibi kurabiliyoruz; reklam tarafında da hangi kampanyadan hangi ürüne talep geldiğini ölçüyoruz. Bu veri sezon planlamasında ve stok kararında en çok işe yarayan bilgi oluyor.' },
    ],
    anahtarKelimeler: ['e-ticaret ürün fotoğrafı', 'ürün vitrini web sitesi', 'WhatsApp sipariş sistemi', 'mağaza dijital pazarlama'],
    metaBaslik: 'Mağaza ve E-Ticaret Ürün Çekimi ve Reklam',
    metaAciklama: 'Mağazalar için ürün vitrini, WhatsApp sipariş akışı, stok ve ürün yönetim paneli, ürün çekimi ve satış odaklı reklam kurgusu.',
  },
];

/* ================================================================== */
/* 3. Vakalar (yalnızca gerçek işler)                                  */
/* ================================================================== */

export const VAKALAR: Vaka[] = [
  /* ---------------------------------------------------------------- */
  {
    slug: 'mas-go-kart',
    marka: 'MAS Go Kart',
    sektor: 'Go kart ve eğlence merkezi',
    baslik: 'Pistin enerjisini ekrana taşıyan video arşivi',
    ozet:
      'Go kart pisti için gece çekimleri, araç içi kamera görüntüleri ve drone planlarından oluşan bir tanıtım arşivi kurduk; sosyal medya tasarımlarını da biz ürettik.',
    zorluk:
      'Go kart, anlatılması değil gösterilmesi gereken bir deneyim. Pistin uzunluğu, gece ışıkları ve hız hissi fotoğrafla aktarılamıyordu; mekânı hiç görmemiş bir kişi "burada ne kadar sürer, ne kadar hızlı" sorusunun cevabını bulamıyordu. Üstelik mevcut görseller dağınıktı ve markanın tutarlı bir görsel dili yoktu.',
    yaptiklarimiz: [
      'Gece pist sürüşü, viraj çıkışı ve damalı bayrak finişi gibi anları ayrı ayrı planlayıp çektik',
      'Araç içi (onboard) kamera çekimiyle sürücünün gözünden hız hissi veren görüntüler ürettik',
      'Drone ile pistin tamamını ve tesisin ölçeğini gösteren havadan planlar çektik',
      'Kurgu, renk ve ses düzenlemesini yaparak sosyal medyaya hazır kısa videolar teslim ettik',
      'Pilot ve yarış tulumu gibi marka detaylarını içeren fotoğraf setini oluşturduk',
      'Sosyal medya gönderi tasarımlarını markanın görsel diline göre hazırladık',
      'Marka kapanış planıyla biten, tanıtımda kullanılabilir bir video seti kurduk',
    ],
    sonuc:
      'Tesisin farklı anlarını kapsayan, sitede ve sosyal medyada tekrar tekrar kullanılabilen bir video ve fotoğraf arşivi teslim ettik. Arşiv, yeni içerik üretmeye gerek kalmadan kampanya ve duyuru paylaşımlarında kullanılabiliyor.',
    hizmetler: ['video', 'drone', 'fotograf', 'sosyal-medya', 'kurumsal-kimlik'],
    medya: {
      video: 'video/mas-gokart-gece-pist-surusu.mp4',
      poster: 'poster/mas-gokart-gece-pist-surusu.jpg',
      foto: [
        'foto/mas-gokart-pist-drone-01.jpg',
        'foto/mas-gokart-pist-drone-02.jpg',
        'foto/mas-gokart-start-cizgisi.jpg',
        'foto/mas-gokart-pilot-yaris-tulumu.jpg',
        'foto/mas-gokart-sosyal-medya-tasarimi.jpg',
      ],
      logo: 'logo/masgokart-logo.png',
    },
  },

  /* ---------------------------------------------------------------- */
  {
    slug: 'may-motors',
    marka: 'May Motors',
    sektor: 'Oto galeri ve otomotiv',
    baslik: 'Bir oto galerinin dijital tarafını uçtan uca kurduk',
    ozet:
      'Araç değerleme akışı, ilan hazırlama ve yönetim akışı, galeri muhasebesi ve reklamdan kâra uzanan ölçüm zinciri; hepsini aynı işin parçası olarak yazdık.',
    zorluk:
      'Galeride iki karar sezgiyle veriliyordu: araç kaça alınacak ve reklama ne kadar verilecek. Aracını satmak isteyen kişi fiyat fikri edinmek için galeriye gelmek zorundaydı, galeri de alım fiyatını deneyimle belirliyordu. Reklam tarafında ise harcama yapılıyor ama hangi reklamın hangi aracı getirdiği bilinmiyordu. Ortaklı yapıda kasa takibi de tartışma konusuydu.',
    yaptiklarimiz: [
      'Adım adım ilerleyen bir araç değerleme akışı kurduk: marka, model, yıl, kilometre, kaporta parça durumu, hasar kaydı ve donanım bilgisi',
      'Değerleme sonucunu müşterinin beyanına dayandığı açıkça yazılı şekilde sunduk; yeterli veri olmadığında rakam göstermeyip ekibin iletişime geçtiği bir akış tasarladık',
      'Sahte form gönderimini kesmek için telefon doğrulaması kurduk',
      'Kaporta parça haritasını görsel şema olarak kurguladık; her parçanın orijinal, boyalı, değişen veya lokal boyalı durumu tek bakışta görünüyor',
      'İlan açıklaması ve ilan görseli hazırlama akışını kurduk: tek veri girişinden markalı araç kartı ve sosyal medya gönderisi çıkıyor',
      'Galerinin kendi ilan yönetim panelini yazdık: araç ekleme, fotoğraf yükleme, satıldı işaretleme',
      'Çok ortaklı galeri muhasebesini kurduk: araç bazlı alış-satış ve masraf takibi, ortak kasaları, taksitli satış tahsilatı, sigorta ve vergi tarihleri, dönemsel analiz ve Excel alışverişi',
      'Kasa tutarsızlıklarını yakalayan salt okunur bir denetim aracı ekledik; yanlış alarm üretmemesi için istisnaları tanımladık',
      'Reklamdan gelen talebi plaka üzerinden muhasebedeki araca ve kâra bağlayan ölçüm zincirini kurduk; elle işaretleme gerekmiyor',
      'Ziyaretçi hunisini kişisel veri toplamadan, yalnızca sayı düzeyinde ölçecek şekilde kurduk',
      'Web sitesinin yanında sosyal medya içeriklerini ve Reels çekimlerini de ürettik',
    ],
    sonuc:
      'Galerinin alım, satış, ilan, muhasebe ve reklam ölçümü tek bir dijital akışta birleşti. "Aracının değerini öğren" adımı galeriye gelmeden tamamlanabiliyor; reklamdan gelen talebin hangi araca dönüştüğü tabloda görünüyor ve ortaklı kasa takibi tartışma yerine rapora bağlandı.',
    hizmetler: ['web-sitesi', 'sosyal-medya', 'video', 'fotograf', 'google-ads', 'veri-analizi'],
    medya: {
      foto: [
        'foto/maymotors-web-mobil-form.jpg',
        'foto/maymotors-reels-web-tanitimi.jpg',
        'foto/maymotors-reels-tasarimi.jpg',
      ],
      logo: 'logo/maymotors-logo-yatay.svg',
    },
  },

  /* ---------------------------------------------------------------- */
  {
    slug: 'kule-istanbul-cafe',
    marka: 'Kule İstanbul Cafe',
    sektor: 'Kafe ve restoran',
    baslik: 'Dört dilli QR dijital menü',
    ozet:
      'Türkçe, İngilizce, Almanca ve Arapça olarak okunabilen; aranabilir, alerjen bilgili ve diyet filtreli bir QR menü kurduk.',
    zorluk:
      'Mekân turist yoğun bir hatta çalışıyor ve menü her masada yeniden anlatılıyordu. Yabancı misafire ürünleri tarif etmek servisi yavaşlatıyor, alerjen sorusu geldiğinde garson her zaman emin olamıyordu. Basılı menü ise her değişiklikte yeniden bastırılmak zorundaydı.',
    yaptiklarimiz: [
      'Menünün tamamını kategori ve ürün düzeyinde yeniden düzenledik',
      'Ürün adı, açıklama, içindekiler ve alerjen bilgisini dört dilde (Türkçe, İngilizce, Almanca, Arapça) ayrı alanlarda kurduk',
      'Arayüz metinlerinin de dört dilde çalıştığı, sağdan sola yazıma uyumlu bir menü tasarladık',
      'Menü içinde anlık arama kurduk: misafir yazdıkça sonuçlar filtreleniyor',
      'Vegan, glutensiz ve kuruyemişsiz filtrelerini rozet olarak değil ürünün alerjen listesinden hesaplanacak şekilde kurguladık; böylece veri tek kaynaktan geliyor ve çelişki çıkmıyor',
      'Ürüne dokunulduğunda açılan detay penceresinde içindekiler ve alerjen uyarısını gösterdik',
      'Yapışkan kategori menüsü ve hızlı gezinme ile uzun menüde kaybolmayı engelledik',
      'Menüyü uygulama indirmeden, kayıt istemeden açılan ve zayıf bağlantıda da hızlı yüklenen hafif bir yapıda kurduk',
      'Menünün altına haritada konum, tıklanabilir telefon, Instagram ve Google’da değerlendirme bağlantılarını ekledik',
      'Mekânın yemek fotoğraflarını çektik ve menü görsellerini bu arşivden kurduk',
    ],
    sonuc:
      'Misafir QR kodu okutup menüyü kendi dilinde okuyabiliyor, alerjen bilgisini garsona sormadan görebiliyor ve diyet filtresiyle kendine uygun ürünleri tek dokunuşta süzebiliyor. Menü güncellemesi baskıya gitmeden tek yerden yapılıyor.',
    hizmetler: ['qr-menu', 'fotograf', 'web-sitesi', 'google-isletme'],
    medya: {
      foto: [
        'foto/kule-istanbul-qr-menu-mobil.jpg',
        'foto/kule-istanbul-qr-menu-masaustu.jpg',
        'foto/kule-istanbul-kofte-tahta-tabak.jpg',
        'foto/kule-istanbul-fajita.jpg',
        'foto/kule-istanbul-cajun-salata.jpg',
        'foto/kule-istanbul-tiramisu.jpg',
      ],
      logo: 'logo/kule-istanbul-cafe-logo.png',
    },
  },

  /* ---------------------------------------------------------------- */
  {
    slug: 'kok-cafe-lounge',
    marka: 'Kök Cafe Lounge',
    sektor: 'Kafe ve restoran',
    baslik: 'Yemek fotoğrafçılığı ve mutfak videoları',
    ozet:
      'Mekânın lezzetlerini iştah açan karelere ve kısa mutfak videolarına dönüştürdük; havadan çekimle çevreyi de arşive ekledik.',
    zorluk:
      'Menüde güçlü ürünler vardı ama dijitalde görünmüyordu. Mevcut fotoğraflar telefonla, farklı ışıklarda ve farklı açılarla çekilmişti; akışa yan yana geldiğinde mekân olduğundan zayıf görünüyordu. Hazırlık sürecinin heyecanı ise hiç kullanılmamıştı.',
    yaptiklarimiz: [
      'Menüden öne çıkacak ürünleri belirleyip kare kare bir çekim listesi hazırladık',
      'Burger, pide, pizza, salata, ızgara ve kahvaltı ürünlerini aynı ışık ve aynı sunum diliyle çektik',
      'Mutfakta hazırlık anlarını çektik: alev, buhar ve hareket içeren kısa videolar',
      'Burger hazırlama ve sunum akışını baştan sona izlenen bir Reels formatına kurguladık',
      'Drone ile mekânın İstinye manzarasını ve çevresini havadan çektik',
      'Reels kapak karelerini ayrı ayrı hazırladık',
      'Ürün kareleri için sosyal medya ve menü kullanımına uygun ayrı kırpımlar hazırladık',
      'Teslimi düzenli bir arşiv klasörü hâlinde, isimlendirilmiş dosyalarla yaptık',
    ],
    sonuc:
      'Mekân, tek bir çekim arşiviyle hem sosyal medyada hem menü ve tanıtım malzemelerinde tutarlı görünen bir görsel dile kavuştu. Paylaşımlar için her hafta yeniden çekim yapma ihtiyacı ortadan kalktı.',
    hizmetler: ['fotograf', 'video', 'drone', 'sosyal-medya'],
    medya: {
      video: 'video/kok-cafe-burger-sunumu.mp4',
      poster: 'poster/kok-cafe-burger-sunumu.jpg',
      foto: [
        'foto/kok-cafe-cheese-burger.jpg',
        'foto/kok-cafe-izgara-pirzola.jpg',
        'foto/kok-cafe-kahvalti-tabagi.jpg',
        'foto/kok-cafe-karisik-pide.jpg',
        'foto/kok-cafe-pizza-milano.jpg',
        'foto/kok-cafe-sezar-salata.jpg',
        'foto/kok-cafe-drone-istinye-manzara.jpg',
        'foto/kok-cafe-reels-burger-sunumu.jpg',
        'foto/kok-cafe-reels-mutfak-alevi.jpg',
      ],
      logo: 'logo/kok-cafe-lounge-logo.png',
    },
  },

  /* ---------------------------------------------------------------- */
  {
    slug: 'minik-starlar-ligi',
    marka: 'Minik Starlar Ligi',
    sektor: 'Spor organizasyonu',
    baslik: 'Çocuk futbol ligi için medya partnerliği',
    ozet:
      'U10, U11 ve U12 kategorilerinde düzenlenen bir çocuk futbol ligi için tanıtım sitesi kurgusunu, kayıt akışını ve maç içeriklerini üstlendik.',
    zorluk:
      'Lig belirli bir tarihte başlayacaktı ve kayıtların o tarihe kadar toplanması gerekiyordu. Velinin karar vermesi için ligi, kuralları, kategorileri ve sahayı görmesi şarttı; ama bütün bilgi dağınık mesajlarda duruyordu. Kayıt almak da form doldurma yorgunluğuna takılıyordu.',
    yaptiklarimiz: [
      'Ligi tek sayfada anlatan bir tanıtım kurgusu hazırladık: hakkında, kategoriler, kurallar, sözleşme ve iletişim bölümleriyle',
      'Son başvuru tarihine kadar sayan canlı bir geri sayım kurduk; aciliyet uydurmadan gerçek tarihi gösterdik',
      'Kaydı WhatsApp üzerinden, hazır mesaj metniyle açılan tek dokunuşluk bir akışa bağladık',
      'Maç günlerinden içerik ürettik: maçın adamı, haftanın kareleri ve lig anları',
      'Sitenin tüm metinlerini tek bir içerik dosyasından yönetilecek şekilde kurduk; organizatör metni kod bilmeden güncelleyebiliyor',
      'Etkinlik için yapısal veri kurduk: lig adı, tarih, saha konumu ve organizatör bilgisi arama sonuçlarında doğru görünüyor',
      'Paylaşım kartı görsellerini hazırladık; bağlantı WhatsApp’ta paylaşıldığında düzgün bir önizleme çıkıyor',
      'Ligin Instagram akışını siteyle birlikte kurguladık',
    ],
    sonuc:
      'Ligin bütün bilgisi tek adreste toplandı ve kayıt, veliyi form doldurmaya zorlamayan bir WhatsApp akışına bağlandı. Maç içerikleri düzenli üretildiği için organizasyon sezon boyunca dijitalde görünür kaldı.',
    hizmetler: ['web-sitesi', 'sosyal-medya', 'video', 'fotograf', 'kurumsal-kimlik'],
    medya: {
      foto: [
        'foto/minik-starlar-tanitim-afisi.jpg',
        'foto/minik-starlar-turnuva-detaylari.jpg',
        'foto/minik-starlar-turnuva-odulleri.jpg',
        'foto/minik-starlar-iletisim-afisi.jpg',
      ],
      logo: 'logo/minik-starlar-ligi-amblem.png',
    },
  },

  /* ---------------------------------------------------------------- */
  {
    slug: 'mimar-elif-kara',
    marka: 'Mimar Elif Kara',
    sektor: 'Mimarlık ve iç mimarlık',
    baslik: 'Projelerin dijitalde düzenli görünmesi',
    ozet:
      'Mimarlık projelerinin dijital tanıtımını ve içerik akışını yürüttük; dağınık proje görsellerini tutarlı bir görsel dile oturttuk.',
    zorluk:
      'Projeler iyiydi ama dijitalde dağınık görünüyordu. Bazı görseller render, bazıları şantiye fotoğrafı, bazıları teslim sonrası çekimdi ve hepsi aynı akışta yan yana duruyordu. Dışarıdan bakan kişi hangi işin tamamlandığını, hangisinin tasarım aşamasında olduğunu anlayamıyordu.',
    yaptiklarimiz: [
      'Mevcut proje arşivini gözden geçirip hangi görselin hangi aşamaya ait olduğunu ayırdık',
      'Proje bazlı bir anlatım düzeni kurduk: her proje kendi kapsamı, konumu ve süreciyle anlatılıyor',
      'Render ve gerçekleşmiş iş görsellerinin karışmaması için ayrı etiketleme mantığı önerdik',
      'Sosyal medya akışı için tutarlı bir görsel dil ve paylaşım düzeni kurguladık',
      'Öncesi-sonrası anlatımına uygun içerik formatları hazırladık',
      'Malzeme ve detay odaklı yakın plan içerikleriyle akışı çeşitlendirdik',
    ],
    sonuc:
      'Projeler, aşamalarına göre ayrılmış ve tutarlı bir görsel dille sunulan bir akışa kavuştu. Yeni bir proje tesliminde içeriğin nasıl yayınlanacağı belli olduğu için üretim her seferinde sıfırdan başlamıyor.',
    hizmetler: ['sosyal-medya', 'icerik-stratejisi', 'fotograf', 'kurumsal-kimlik'],
    medya: {},
  },
];

/* ================================================================== */
/* 4. Çalışma süreci                                                   */
/* ================================================================== */

export const SUREC_BOLUMU = {
  ustEtiket: 'Nasıl çalışıyoruz',
  baslik: 'Beş adım; sürpriz yok.',
  aciklama:
    'Her işi aynı sırayla yürütüyoruz. Hangi adımda olduğunuzu, bir sonraki adımda ne olacağını ve sizden ne isteyeceğimizi baştan biliyorsunuz.',
} as const;

export const SUREC: { no: number; baslik: string; aciklama: string; ciktilar: string[] }[] = [
  {
    no: 1,
    baslik: 'Ücretsiz analiz',
    aciklama:
      'Instagram hesabınıza, web sitenize ve Google İşletme Profilinize bakıyoruz. Neyin eksik olduğunu, neyin hızlıca düzelebileceğini ve neye hiç gerek olmadığını açıkça yazıyoruz. Bu adım ücretsiz ve sizi hiçbir şeye bağlamıyor.',
    ciktilar: [
      'Yazılı eksik ve fırsat listesi',
      'Hızlı kazanım önerileri',
      'Hangi hizmetin işinize gerçekten yarayacağı',
      'Kapsam ve takvim taslağı',
    ],
  },
  {
    no: 2,
    baslik: 'Strateji ve plan',
    aciklama:
      'Analizden çıkan maddeleri bir plana çeviriyoruz: hangi içerik sütunlarında ilerleyeceğiz, hangi görsel dili kullanacağız, reklam nereye gidecek ve neyi ölçeceğiz. Web veya yazılım işi varsa tıklanabilir maketi bu aşamada hazırlıyoruz.',
    ciktilar: [
      'İçerik takvimi ve format dağılımı',
      'Görsel dil ve şablon düzeni',
      'Reklam planı ve hedef kitleler',
      'Web ve yazılım işlerinde tıklanabilir maket',
      'Onayladığınız kapsam belgesi',
    ],
  },
  {
    no: 3,
    baslik: 'Çekim ve üretim',
    aciklama:
      'Plandaki içerikleri üretiyoruz. Mekânınızda planlı çekim günleri yapıyor, fotoğraf ve video kurgusunu tamamlıyoruz. Web veya menü işi varsa geliştirme bu aşamada ilerliyor ve ara sürümleri görüyorsunuz.',
    ciktilar: [
      'Çekilmiş ve kurgulanmış içerik seti',
      'Tasarlanmış gönderi ve hikâye şablonları',
      'Geliştirilen site, menü veya modül',
      'Onay turu ve düzeltmeler',
    ],
  },
  {
    no: 4,
    baslik: 'Yayın ve reklam',
    aciklama:
      'İçerikleri planlı saatlerde yayınlıyor, kampanyaları kuruyoruz. Ölçümün gerçekten çalıştığını test ediyoruz: form gidiyor mu, telefon tıklaması sayılıyor mu, WhatsApp mesajı kayda geçiyor mu. Ölçüm doğrulanmadan kampanyayı büyütmüyoruz.',
    ciktilar: [
      'Yayına alınmış içerik akışı',
      'Kurulmuş Meta ve Google kampanyaları',
      'Doğrulanmış dönüşüm ölçümü',
      'Yayına alınmış site, menü veya panel',
      'Kullanım eğitimi',
    ],
  },
  {
    no: 5,
    baslik: 'Raporlama ve büyüme',
    aciklama:
      'Ay sonunda ne harcandı, kaç talep geldi, talep başına maliyet ne oldu ve hangi içerik işe yaradı sorularını tek sayfada yanıtlıyoruz. Sonra birlikte karar veriyoruz: neyi artıracağız, neyi durduracağız.',
    ciktilar: [
      'Tek sayfalık yönetici özeti',
      'Kanal ve içerik bazlı kırılım',
      'Talep başına maliyet hesabı',
      'Gelecek ay için karar listesi',
    ],
  },
];

/* ================================================================== */
/* 5. Siteye genel sık sorulan sorular                                 */
/* ================================================================== */

export const SSS_GENEL_BOLUMU = {
  ustEtiket: 'Sık sorulan sorular',
  baslik: 'Önce merak edilenler.',
  aciklama: 'Burada cevabını bulamadığınız her şeyi bize doğrudan sorabilirsiniz; aynı gün dönüyoruz.',
} as const;

export const SSS_GENEL: Sss[] = [
  {
    soru: 'Fiyatlarınız ne kadar?',
    cevap:
      'Fiyat, paket kapsamına göre değişiyor: kaç platform yönetilecek, ayda kaç içerik üretilecek, çekim günü var mı, web veya menü işi dahil mi? Bu yüzden sitede rakam yazmıyoruz; yazsak da sizin işinize uymayan bir rakam olurdu. Ücretsiz analizden sonra kapsamı netleştirip net bir teklif gönderiyoruz. Reklam bütçesi her durumda hizmet bedelinden ayrıdır.',
  },
  {
    soru: 'Ücretsiz dijital analiz tam olarak nedir?',
    cevap:
      'Instagram hesabınızı, varsa web sitenizi ve Google İşletme Profilinizi inceliyoruz. Profil düzeni, içerik akışı, mobil deneyim, haritada görünürlük ve iletişim yollarına bakıp eksikleri ve hızlı kazanımları yazılı bir listeyle paylaşıyoruz. Ücretsizdir, sizi hiçbir şeye bağlamaz ve listeyi kendiniz uygulamak isterseniz de elinizde kalır.',
  },
  {
    soru: 'Sözleşme süresi ne kadar, erken bitirebilir miyim?',
    cevap:
      'Uzun taahhüt istemiyoruz. Kapsamı ve süreyi analizden sonra birlikte belirliyoruz. Devam etmek istemezseniz erişimleri kapatıyor, ürettiğimiz dosyaları ve içerik arşivini teslim ediyoruz. Yarım kalan bir işin dosyasını rehin tutmak gibi bir çalışma biçimimiz yok.',
  },
  {
    soru: 'Çekimler nerede yapılıyor, hangi şehirlerde çalışıyorsunuz?',
    cevap:
      'Çekimleri çoğunlukla sizin mekânınızda yapıyoruz; çünkü mekânın kendi atmosferi satışın parçası. Merkezimiz İstanbul 4.Levent’te ve çekim gerektiren işlerde İstanbul genelinde geliyoruz; İstanbul dışı işlerde ulaşım kalemlerini teklifte ayrı gösteriyoruz. Sosyal medya yönetimi, reklam yönetimi, web sitesi ve QR menü gibi çekim gerektirmeyen işleri ise şehir sınırı olmadan yürütüyor, görüşmeleri çevrimiçi yapıyoruz.',
  },
  {
    soru: 'Reklam bütçesi hizmet bedeline dahil mi?',
    cevap:
      'Hayır. Reklam bütçesi doğrudan Meta, Google veya TikTok’a ödenir; kart sizin reklam hesabınıza tanımlı olur ve harcamayı canlı olarak panelden görürsünüz. Bize ödediğiniz bedel kampanyanın kurulumu, kreatifi, testi ve optimizasyonu karşılığıdır. Bütçe üzerinden komisyon almıyoruz.',
  },
  {
    soru: 'Ne zaman başlarız, ilk sonuçlar ne zaman görünür?',
    cevap:
      'Analiz ve kapsam onayından sonra genelde ilk çekim gününü ve içerik takvimini hızlıca planlıyoruz. Sosyal medyada düzenin kendini göstermesi birkaç haftayı alıyor; reklamda ise ilk günlerde hareket başlıyor ama anlamlı değerlendirme için iki-üç haftalık veri gerekiyor. Belirli bir tarihte belirli bir sonuç garantisi vermiyoruz.',
  },
  {
    soru: 'Yalnızca tek bir hizmet alabilir miyim?',
    cevap:
      'Elbette. Yalnızca QR menü, yalnızca web sitesi, yalnızca drone çekimi ya da yalnızca reklam yönetimi şeklinde çalışabiliyoruz. Tek çatı altında olmanın avantajı mecbur bırakmak değil, ihtiyacınız büyüdüğünde yeni bir firma aramak zorunda kalmamanız.',
  },
  {
    soru: 'Hesaplarımın ve ürettiğiniz dosyaların sahibi kim olacak?',
    cevap:
      'Hepsi sizin. Instagram ve Facebook tarafında şifre yerine Meta Business üzerinden iş ortağı erişimi, Google tarafında yönetici erişimi veriyorsunuz; yetki sizde kalıyor ve çalışma biterse erişim kapanıyor, geçmiş veriniz sizde duruyor. Teslim ettiğimiz fotoğraf, video, tasarım ve kodu da süresiz kullanabiliyorsunuz. Biz yalnızca kendi portföyümüzde gösterebilmek için izin istiyoruz; izin vermezseniz göstermiyoruz.',
  },
  {
    soru: 'Raporlama nasıl oluyor?',
    cevap:
      'Aylık. Tek sayfada şu soruları yanıtlıyoruz: ne harcandı, kaç talep geldi, talep başına maliyet ne oldu, hangi içerik ve kampanya işe yaradı. Arkasında detay kırılımlar duruyor. Rakamlar platformların kendi panellerinden geliyor ve hangi panelden alındığını yazıyoruz. Raporu ayrıca birlikte konuşuyoruz, çünkü asıl değer tabloyu okumakta değil gelecek ayın kararını vermekte.',
  },
  {
    soru: 'Garantili sonuç veya ilk sıra sözü veriyor musunuz?',
    cevap:
      'Vermiyoruz. Belirli bir takipçi sayısı, belirli bir satış artışı veya Google’da ilk sıra garantisi veren teklifler teknik olarak tutulamaz; bu sözü tutmanın yolu genelde sahte hesap ya da yanlış ölçüm oluyor. Biz ne yapacağımızı, neyi ölçeceğimizi ve hangi sonuçlara bakacağımızı yazılı veriyoruz.',
  },
];

/* ================================================================== */
/* 7. Ana sayfa                                                        */
/* ================================================================== */

export const ANA_SAYFA = {
  /* --- Kahraman bölüm --- */
  kahraman: {
    ustEtiket: 'Sosyal medya ve yazılım ajansı · İstanbul / 4.Levent',
    /** Sayfada bir tanesi kullanılır; kalanlar A/B denemesi ve kampanya sayfaları için. */
    baslikVaryantlari: [
      'İşletmenizin görünen yüzünü de, arkadaki yazılımını da biz kuruyoruz.',
      'Çekimden reklama, web sitesinden QR menüye: tek ekip, tek plan.',
      'Dijitalde dağınık görünmek zorunda değilsiniz.',
      'Fikirler hareket kazanır.',
    ],
    altMetin:
      'Sosyal medya ve TikTok yönetimi, fotoğraf ve video prodüksiyonu, kurgu ve edit, Meta-Google-TikTok reklamları, web sitesi yazılımı ve QR dijital menü. Beş farklı firmayla uğraşmak yerine tek muhatapla çalışırsınız.',
    birincilCagri: 'Ücretsiz analiz iste',
    ikincilCagri: 'Çalışmalarımızı görün',
    ucuncuCagri: 'WhatsApp’tan yazın',
    kaydirIpucu: 'Aşağı kaydırın',
  },

  /* --- Güven şeridi: yalnızca doğrulanmış veriler --- */
  guven: {
    ustEtiket: 'Birlikte çalıştığımız markalar',
    maddeler: [
      { deger: '12+', etiket: 'marka ile çalıştık' },
      { deger: '244+', etiket: 'Instagram gönderisi ürettik' },
      { deger: '15', etiket: 'hizmet alanı, tek çatı altında' },
      { deger: '4.Levent', etiket: 'İstanbul’daki merkezimiz' },
    ],
    notlar: [
      'Instagram’da @ajansflow olarak doğrulanmış (mavi tikli) hesapla çalışıyoruz.',
      'Sitede uydurma müşteri yorumu, ödül veya sertifika iddiası bulunmaz.',
      'Rakam vaadi vermiyoruz; ne yapacağımızı ve neyi ölçeceğimizi yazıyoruz.',
    ],
  },

  /* --- Bölüm başlıkları ve girişleri --- */
  hizmetler: {
    ustEtiket: 'Hizmetler',
    baslik: 'Markanızın dijitalde ihtiyacı olan her şey, aynı ekipte.',
    giris:
      'Strateji, üretim, kurgu, reklam ve yazılım aynı masada durduğunda iş hızlanıyor: çekim planı içerik takvimine, içerik takvimi Instagram ve TikTok kurgusuna, reklam da web sitesindeki forma bağlanıyor. İster tamamını alın, ister yalnızca ihtiyacınız olanı.',
    cagri: 'Tüm hizmetleri görün',
  },
  sektorler: {
    ustEtiket: 'Sektörler',
    baslik: 'Sizin işinizde ne yaptığımızı okuyun.',
    giris:
      'Bir go kart pistiyle bir hukuk bürosunun dijital ihtiyacı aynı değil. Sektör sayfalarında her iş için hem web sitesinde hem sosyal medyada neyi nasıl kurduğumuzu, hangi entegrasyonların işe yaradığını ve varsa gerçek örneğimizi anlatıyoruz.',
    cagri: 'Sektörünüzü seçin',
  },
  vakalar: {
    ustEtiket: 'Çalışmalar',
    baslik: 'Gerçek markalar, gerçek işler.',
    giris:
      'Kafeden otomotive, go kart pistinden çocuk futbol ligine. Her işte müşterinin sorunu neydi, biz ne yaptık ve ne teslim ettik sorularını açıkça yazdık. Elimizde ölçülebilir rakam yoksa rakam uydurmuyoruz.',
    cagri: 'Tüm çalışmaları görün',
  },
  qrMenu: {
    ustEtiket: 'QR dijital menü',
    baslik: 'Menüyü siz doldurmuyorsunuz.',
    giris:
      'QR menü satan firmalar size boş bir panel verir; fotoğrafı da metni de siz hazırlarsınız. Biz sosyal medya ajansı olduğumuz için bu işi zaten yapıyoruz: yemek çekimini mekânınızda biz yapıyor, ürün adlarını ve açıklamaları biz yazıyoruz. Sizden ürün listesi ve fiyatlar yeterli.',
    maddeler: [
      'Mekânda profesyonel yemek çekimi',
      'Ürün adı ve açıklama metinlerinin yazımı',
      'Alerjen ve diyet filtreleri, çok dilli menü',
      'Sipariş ve rezervasyon modülleri isteğe bağlı',
    ],
    ornekNotu: 'Kule İstanbul Cafe için kurduğumuz menü dört dilde çalışıyor.',
    cagri: 'QR menü hizmetini inceleyin',
  },
  surec: {
    ustEtiket: 'Nasıl çalışıyoruz',
    baslik: 'Ücretsiz analizle başlar, raporla döner.',
    giris:
      'Her işi aynı beş adımda yürütüyoruz. Web ve yazılım işlerinde kod yazmadan önce tıklanabilir maket hazırlıyoruz; böylece ekranları onaylamadan geliştirmeye geçmiyoruz.',
    cagri: 'Süreci inceleyin',
  },
  nedenBiz: {
    ustEtiket: 'Neden Ajans Flow',
    baslik: 'Hem içerik üretiyor hem yazılım yazıyoruz.',
    giris:
      'Çoğu ajans ya içerik üretir ya yazılım yazar. Biz ikisini birlikte yaptığımız için reklamın bağlandığı sayfayı da, menünün çalıştığı sistemi de kendimiz kuruyoruz. Arada "o bizim işimiz değil" diyen bir taraf olmuyor.',
    maddeler: [
      {
        baslik: 'Tek çatı altında',
        aciklama:
          'Çekim, kurgu, tasarım, üç platformda reklam, web sitesi ve QR menü aynı ekipte. Beş firmayla ayrı ayrı uğraşmıyorsunuz; tek plan, tek muhatap, tek takvim.',
      },
      {
        baslik: 'Yazılımı kendimiz yazıyoruz',
        aciklama:
          'Hazır şablon yetmediğinde kodu biz yazıyoruz: değerleme formu, seans takvimi, ilan akışı, QR menü, yönetim paneli. Kendi işimizi de kendi yazdığımız yazılımla yürütüyoruz.',
      },
      {
        baslik: 'Önce maket, sonra kod',
        aciklama:
          'Web ve yazılım işlerinde tıklanabilir bir maket hazırlıyoruz. Ekranları gezip değişiklik istiyorsunuz; kod yazıldıktan sonra pahalıya gelen sürprizler çıkmıyor.',
      },
      {
        baslik: 'Ölçmeden büyütmüyoruz',
        aciklama:
          'Form gidiyor mu, telefon tıklaması sayılıyor mu, WhatsApp mesajı kayda geçiyor mu? Ölçümü test edip doğrulamadan reklam bütçesini artırmıyoruz.',
      },
      {
        baslik: 'Abartısız dil',
        aciklama:
          'Uydurma müşteri yorumu, sahte rakam, garantili sıra sözü ve korkutarak satış yok. Mevzuat konularında yazdığımız her maddenin kaynağını veriyoruz.',
      },
      {
        baslik: 'Hızlı iletişim',
        aciklama:
          'WhatsApp ve Instagram üzerinden doğrudan işi yapan ekiple konuşuyorsunuz. Arada hesap yöneticisi katmanı ve bekleme sırası yok.',
      },
    ],
    konum: {
      baslik: 'İstanbul / 4.Levent',
      aciklama: `Merkezimiz ${ILETISIM.adres}. Yüz yüze görüşmek isterseniz ofiste buluşuyoruz; çekimler için İstanbul genelinde geliyoruz.`,
    },
  },
  rehber: {
    ustEtiket: 'Rehber',
    baslik: 'Satın alma kararınızı kolaylaştıran yazılar.',
    giris:
      'QR menü mevzuatından reklam bütçesi hesabına, web sitesi teklifini okumaktan Google İşletme Profili kurulumuna kadar; işletme sahibinin gerçekten sorduğu soruları kaynak göstererek yanıtlıyoruz. Mevzuat yazılarında son kontrol tarihini görünür tutuyoruz.',
    cagri: 'Rehbere göz atın',
  },
  iletisim: {
    ustEtiket: 'İletişim',
    baslik: 'Önce bir bakalım, sonra konuşalım.',
    giris:
      'Instagram hesabınıza, web sitenize ve Google profilinize bakıp eksikleri açıkça söyleyelim. Ücretsiz, bağlayıcı değil ve listeyi kendiniz uygulamak isterseniz de elinizde kalır.',
    formBaslik: 'Ücretsiz analiz formu',
    formAciklama: 'Birkaç satır yeterli; aynı gün dönüyoruz.',
    kvkkNotu:
      'Formu gönderdiğinizde yalnızca size dönüş yapmak için gerekli bilgileri işliyoruz. Ayrıntılar KVKK aydınlatma metninde yazılı.',
    whatsappCagri: 'WhatsApp’tan yazın',
    instagramCagri: 'Instagram’dan DM gönderin',
    telefonCagri: 'Telefonla arayın',
  },
  sonCagri: {
    ustEtiket: 'Ücretsiz analiz',
    baslik: 'Dijitalde nerede durduğunuzu öğrenmek bedava.',
    aciklama:
      'Hesabınıza ve sitenize bakıp ne işe yaradığını, neyin boşa gittiğini ve nereden başlanması gerektiğini yazalım. Karar sizin.',
    maddeler: ['Instagram profili ve içerik akışı', 'Web sitesi ve mobil deneyim', 'Google İşletme Profili ve harita görünürlüğü'],
    cagri: 'Ücretsiz analizimi iste',
  },

  /* --- Hazır mesajlar --- */
  hazirMesajlar: {
    whatsappGenel: 'Merhaba, Ajans Flow hizmetleri hakkında bilgi almak istiyorum.',
    whatsappAnaliz: 'Merhaba, işletmem için ücretsiz dijital analiz talep etmek istiyorum.',
    whatsappQrMenu: 'Merhaba, işletmem için QR dijital menü hakkında bilgi almak istiyorum.',
    whatsappWeb: 'Merhaba, web sitesi ve yazılım konusunda teklif almak istiyorum.',
    whatsappTiktok: 'Merhaba, TikTok hesap yönetimi ve içerik üretimi hakkında bilgi almak istiyorum.',
    whatsappKurgu: 'Merhaba, elimdeki çekimler için kurgu ve edit hizmeti almak istiyorum.',
  },

  /* --- Meta bilgileri --- */
  metaBaslik: 'Sosyal Medya ve Yazılım Ajansı | İstanbul Levent',
  metaAciklama:
    'İstanbul 4.Levent’te sosyal medya ve TikTok yönetimi, video prodüksiyon ve kurgu, Meta-Google-TikTok reklamları, web sitesi ve QR menü. Ücretsiz analiz.',
  anahtarKelimeler: ['dijital ajans İstanbul', 'sosyal medya ajansı İstanbul', 'reklam ajansı Levent', 'tiktok ajansı', 'sosyal medya ve yazılım ajansı'],
} as const;

/* ================================================================== */
/* 8. Hakkımızda                                                       */
/* ================================================================== */

export const HAKKIMIZDA = {
  ustEtiket: 'Hakkımızda',
  baslik: 'İçeriği de, arkasındaki yazılımı da aynı masada yapıyoruz.',
  ozet:
    'Ajans Flow, İstanbul 4.Levent merkezli bir sosyal medya ve yazılım ajansı. Bir işletmenin dijitalde görünen yüzünü de, o yüzün arkasında çalışan sistemi de kuruyoruz.',

  hikaye: [
    'İşe sosyal medya tarafından başladık: kafelerin, kliniklerin, otomotiv firmalarının ve eğlence merkezlerinin içeriğini üretiyor, hesaplarını yönetiyorduk. Çekim yapıyor, kurgulamayı öğreniyor, reklam kuruyorduk. Bir süre sonra aynı cümleyi farklı müşterilerden duymaya başladık: "İçerik güzel oldu ama insanlar siteme geliyor, hiçbir şey yapmadan çıkıyor."',
    'O cümle bizi yazılıma itti. Çünkü sorun içerikte değildi; içeriğin bağlandığı yerdeydi. Bir kafenin menüsü telefonda açılmıyordu, bir galerinin sitesinde aracını satmak isteyen kişiye gösterilecek hiçbir şey yoktu, bir pistin rezervasyonu hâlâ telefonla alınıyordu. Reklamı iyileştirmek bu sorunları çözmüyordu.',
    'Bu yüzden yazılımı dışarıya vermek yerine kendimiz yazmaya başladık. Araç değerleme akışı, galeri muhasebesi, ilan hazırlama akışı, dört dilli QR menü, seans ve kayıt akışları, yönetim panelleri. Bugün bir işi alırken "bu kısım bizim işimiz değil" demek zorunda kalmıyoruz; reklamın bağlandığı sayfayı da, menünün çalıştığı sistemi de aynı ekip kuruyor.',
    'Kendi iç işimizi de kendi yazdığımız yazılımla yürütüyoruz: müşteriler, görevler, kasa, hedefler ve raporlar aynı panelde. Bir sistemi müşteriye satmadan önce kendimizde kullanıyor olmak, neyin işe yaradığını anlatmayı kolaylaştırıyor.',
  ],

  felsefeBaslik: 'Çalışma felsefemiz',
  felsefe: [
    {
      baslik: 'Uydurmuyoruz',
      aciklama:
        'Sitede uydurma müşteri yorumu, olmayan bir ödül, doğrulanmamış bir rakam veya "%X artış" vaadi bulamazsınız. Elimizde ölçülebilir bir sonuç yoksa ne teslim ettiğimizi anlatıyoruz. Mevzuat konularında yazdığımız her maddenin kaynağını veriyoruz.',
    },
    {
      baslik: 'Korkutarak satmıyoruz',
      aciklama:
        '"Zorunlu oldu, ceza yersiniz" diyerek satış yapmıyoruz. QR menü gibi mevzuatla ilişkili konularda doğru olanı, kaynağıyla ve ölçülü bir dille anlatıyoruz. Yanlış bilgiyle satılan bir hizmet hem müşteriyi hem bizi riske atıyor.',
    },
    {
      baslik: 'Önce maket, sonra kod',
      aciklama:
        'Web ve yazılım işlerinde ekranları önce tıklanabilir bir maket olarak hazırlıyoruz. Onay almadan geliştirmeye geçmiyoruz; çünkü yazıldıktan sonra yapılan değişiklik hem pahalı hem yorucu oluyor.',
    },
    {
      baslik: 'Ölçmeden büyütmüyoruz',
      aciklama:
        'Formun gerçekten gittiğini, telefon tıklamasının gerçekten sayıldığını test ediyoruz. Ölçüm doğrulanmadan reklam bütçesi artırmak, karanlıkta harcama yapmak demek.',
    },
    {
      baslik: 'Yetki sizde kalır',
      aciklama:
        'Hesapların, reklam verilerinin, alan adının ve ürettiğimiz dosyaların sahibi siz oluyorsunuz. Çalışmayı bitirmek istediğinizde erişim kapanıyor, arşiv sizde kalıyor. Kimseyi dosyasıyla bağlamıyoruz.',
    },
    {
      baslik: 'Tek muhatap',
      aciklama:
        'Doğrudan işi yapan ekiple konuşuyorsunuz. Arada mesajı aktaran bir katman olmadığı için karar hızlı çıkıyor ve ne söylediğiniz kaybolmuyor.',
    },
  ],

  tekCatiBaslik: 'Tek çatı altında ne anlama geliyor',
  tekCati: {
    aciklama:
      'Tek çatı altında olmak, her hizmeti almaya mecbur olmanız demek değil. Şu demek: çekim planı içerik takvimine, içerik takvimi reklam kurgusuna, reklam kurgusu da web sitesindeki forma bağlanıyor. Zincirin hiçbir halkasında "o bizim işimiz değil" cevabı çıkmıyor.',
    maddeler: [
      'Çekim, tasarım, reklam, web sitesi ve QR menü aynı ekipte',
      'Tek plan, tek takvim, tek muhatap',
      'Reklamın bağlandığı sayfayı da biz kuruyoruz',
      'İhtiyacınız büyüdüğünde yeni firma aramanız gerekmiyor',
      'İsterseniz yalnızca tek bir hizmetle çalışabiliyorsunuz',
    ],
  },

  konumBaslik: 'Merkezimiz',
  konum: {
    baslik: `İstanbul / 4.Levent`,
    aciklama: `Ofisimiz ${ILETISIM.adres}. Yüz yüze görüşmek isteyen müşterilerimizle ofiste buluşuyoruz; çekimler için İstanbul genelinde geliyoruz. Çekim gerektirmeyen işleri şehir sınırı olmadan yürütüyoruz.`,
    maddeler: [
      'Yüz yüze toplantı için merkezi ve ulaşımı kolay bir konum',
      'İstanbul genelinde çekim',
      'Çevrimiçi görüşme imkânı',
    ],
  },

  /** Dürüstlük notu: doğrulanmamış bilgi sitede yazılmaz. */
  dogrulanmamisBilgiNotu:
    'Bu sayfada kuruluş yılı, ekip sayısı, ödül veya sertifika iddiası bulunmuyor; çünkü sitede yalnızca doğrulanabilir bilgi yazıyoruz.',

  cagri: 'Ücretsiz analiz iste',
  metaBaslik: 'Hakkımızda | Ajans Flow — İstanbul 4.Levent',
  metaAciklama:
    'Ajans Flow, İstanbul 4.Levent merkezli sosyal medya ve yazılım ajansı. İçerik üretimini ve arkasındaki yazılımı aynı ekipte kuruyoruz. Çalışma felsefemiz.',
  anahtarKelimeler: ['Ajans Flow hakkında', 'İstanbul 4.Levent dijital ajans', 'sosyal medya ve yazılım ajansı'],
} as const;

/* ================================================================== */
/* 9. QR menü ve fiyat gösterimi mevzuatı                              */
/*                                                                     */
/* Kaynak: arastirma/02-qr-menu-mevzuati.md                            */
/* DİL KURALI: "Zorunlu oldu, ceza yersiniz" denmez. Doğru çerçeve     */
/* "mevzuata uygun kurgu" ve "denetime hazırlık". Aşağıdaki maddelerde */
/* geçmeyen hiçbir madde numarası veya tarih sitede yazılmaz.          */
/* ================================================================== */

/** Ticaret Bakanlığı ve Tarım ve Orman Bakanlığı tarafı ASLA tek başlıkta birleştirilmez. */
export const QR_MENU_MEVZUAT_BOLUMLERI: {
  anahtar: string;
  baslik: string;
  kurum: string;
  aciklama: string;
  maddeler: MevzuatMaddesi[];
}[] = [
  {
    anahtar: 'fiyat-listesi',
    baslik: 'Fiyat listesi ve karekod',
    kurum: 'Ticaret Bakanlığı — Fiyat Etiketi Yönetmeliği',
    aciklama:
      'Bu taraf fiyatın nasıl gösterileceğini düzenliyor: nerede asılacak, hangi para biriminde ve hangi dilde yazılacak, karekodun yeri ne. Karekoda izin veren değişiklik 11 Ekim 2025’te yayımı tarihinde yürürlüğe girdi; geçiş süresi yok.',
    maddeler: [
      {
        baslik: 'Karekodlu menü bir zorunluluk değil, izin verilen ek bir yöntem',
        metin:
          'Yönetmelik, yiyecek ve içecek hizmeti sunulan işyerlerindeki masalarda fiyat listelerinin tüketicilere karekod ile de gösterilebileceğini söylüyor. Yani karekod, fiyat listesinin yerine geçen bir yöntem değil; onu tamamlayan bir araç. "Karekodlu menü zorunlu oldu" cümlesi mevzuatta karşılığı olmayan bir ifade.',
        kaynak: {
          mevzuat: 'Fiyat Etiketi Yönetmeliği',
          madde: 'm.8/2 (Değişik)',
          resmiGazete: 'RG 11/10/2025 - 33044 (ana yönetmelik: RG 28/6/2014 - 29044)',
          baglanti: 'https://www.resmigazete.gov.tr/eskiler/2025/10/20251011-6.htm',
        },
      },
      {
        baslik: 'Karekodun yönetmelikteki tanımı',
        metin:
          'Yönetmelik karekodu "fiyat listesine erişimi sağlayan görsel" olarak tanımlıyor. Yani karekod bir menü uygulaması değil, fiyat listesine ulaşmanın bir yolu olarak tanımlanmış durumda.',
        kaynak: {
          mevzuat: 'Fiyat Etiketi Yönetmeliği',
          madde: 'm.4/1-(ö)',
          resmiGazete: 'RG 28/6/2014 - 29044 (konsolide metin)',
          baglanti: 'https://www.mevzuat.gov.tr/MevzuatMetin/yonetmelik/7.5.19819.pdf',
        },
      },
      {
        baslik: 'Giriş kapısı önündeki ve masalardaki fiyat listesi yükümlülüğü sürüyor',
        metin:
          'Fiyat listesinin işyerinin giriş kapısının önüne, kapı birden fazlaysa her kapı için ayrı ayrı asılması ve hizmet sunulan masaların üstüne konulması yükümlülüğü devam ediyor. Karekoda geçmek bu yükümlülüğü ortadan kaldırmıyor. Bu yüzden kurduğumuz menü sistemine basılabilir fiyat listesi çıktısı da ekliyoruz.',
        kaynak: {
          mevzuat: 'Fiyat Etiketi Yönetmeliği',
          madde: 'm.8/1',
          resmiGazete: 'RG 28/6/2014 - 29044 (konsolide metin)',
          baglanti: 'https://www.mevzuat.gov.tr/MevzuatMetin/yonetmelik/7.5.19819.pdf',
        },
      },
      {
        baslik: 'Müşteri talep ettiğinde fiyat listesi ayrıca verilir',
        metin:
          'Karekod kullanılsa bile tüketici talep ettiğinde fiyat listesinin ayrıca verilmesi gerekiyor. Yani telefonu olmayan, karekod okutamayan veya basılı menü isteyen misafire liste sunulabilmeli. Menüyü kurarken buna uygun bir çıktı ve işletme içi bir pratik birlikte planlanıyor.',
        kaynak: {
          mevzuat: 'Fiyat Etiketi Yönetmeliği',
          madde: 'm.8/2',
          resmiGazete: 'RG 11/10/2025 - 33044',
          baglanti: 'https://www.resmigazete.gov.tr/eskiler/2025/10/20251011-6.htm',
        },
      },
      {
        baslik: 'Hizmete sunulan tüm ürünler fiyat listesinde yer almalı',
        metin:
          'Yönetmelik, hizmete sunulan tüm ürünlerin tarife ve fiyat listelerinde bulunmasını istiyor. Ayrıca aykırılık sayısı belirlenirken fiyat listelerinde eksik veya hatalı belirtilen ürün sayısı dikkate alınıyor; yani fiyatı girilmemiş her ürün ayrı değerlendiriliyor. Bu, menü yazılımında somut bir gereksinime dönüşüyor: fiyatı boş kalan ürün için uyarı.',
        kaynak: {
          mevzuat: 'Fiyat Etiketi Yönetmeliği',
          madde: 'm.8/3 ve m.8/4',
          resmiGazete: 'RG 28/6/2014 - 29044 (konsolide metin)',
          baglanti: 'https://www.mevzuat.gov.tr/MevzuatMetin/yonetmelik/7.5.19819.pdf',
        },
      },
      {
        baslik: 'Menüdeki fiyat ile kasadaki fiyat farklıysa tüketici lehine olan uygulanır',
        metin:
          'Malın satış fiyatı ile kasa fiyatı arasında fark olması durumunda tüketici lehine olan fiyat uygulanıyor. Pratikte bu, menü ile kasanın aynı fiyat kaynağından beslenmesinin neden önemli olduğunu gösteriyor. Karekodlu menünün asıl değeri de burada: fiyat değişikliği aynı anda masaya, kapıya ve kasaya yansıyor.',
        kaynak: {
          mevzuat: 'Fiyat Etiketi Yönetmeliği',
          madde: 'm.10/1',
          resmiGazete: 'RG 28/6/2014 - 29044 (konsolide metin)',
          baglanti: 'https://www.mevzuat.gov.tr/MevzuatMetin/yonetmelik/7.5.19819.pdf',
        },
      },
      {
        baslik: 'Fiyatlar Türk Lirası cinsinden ve etiket ile listeler Türkçe olmalı',
        metin:
          'Etiket ve listelerde satış fiyatlarının "Türk Lirası", "TL" veya ₺ simgesiyle yazılması gerekiyor; rakam ve harflerin okunabilir, eksiksiz, gerçeğe uygun ve yeterli büyüklükte olması, yanıltıcı bilgi içermemesi isteniyor. Etiket ve listelerin Türkçe yazılması da aynı yönetmelikten geliyor. Çok dilli menü yasak değil; Türkçe’nin bulunması şart.',
        kaynak: {
          mevzuat: 'Fiyat Etiketi Yönetmeliği',
          madde: 'm.5/2, m.9/1 ve m.9/4',
          resmiGazete: 'RG 28/6/2014 - 29044 (konsolide metin)',
          baglanti: 'https://www.mevzuat.gov.tr/MevzuatMetin/yonetmelik/7.5.19819.pdf',
        },
      },
      {
        baslik: 'Servis, masa ve kuver ücreti talep edilemiyor',
        metin:
          'Lokanta, kafe, restoran, pastane ve benzeri yiyecek içecek hizmeti sunulan işyerlerinde tüketiciden servis ücreti, masa ücreti, kuver ücreti ve benzeri herhangi bir isim altında ilave ödeme talep edilemiyor. Tarife ve fiyat listesinde gösterilen fiyatların dışında alınacak bir ücret varsa bunun listede gösterilmesi gerekiyor. Menü sistemini bu tür bir satır eklenemeyecek şekilde kuruyoruz; tüketicinin gönüllü bahşişi ayrı bir konu.',
        kaynak: {
          mevzuat: 'Fiyat Etiketi Yönetmeliği',
          madde: 'm.8/6 (Değişik)',
          resmiGazete: 'RG 30/1/2026 - 33153',
          baglanti: 'https://www.resmigazete.gov.tr/eskiler/2026/01/20260130-2.htm',
        },
      },
      {
        baslik: 'Fiyat listesi verilerinin aktarılacağı sistem: kriterler Bakanlıkça belirlenecek',
        metin:
          'Yönetmelik, yiyecek içecek hizmeti sunulan işyerlerinin fiyat listesi verilerini kurulacak bir sisteme aktarmakla yükümlü olduğunu söylüyor. Ancak yükümlülük tüm işletmelere değil, kriterleri Bakanlıkça belirlenen işyerlerine ait; usul ve esaslar Bakanlığın resmî internet sitesinde ilan edildikten sonra üç ay içinde aktarım yapılması gerekiyor. Bu notun son kontrol tarihinde ilan edilmiş bir usul ve esas metnine ulaşamadık; konuyu takip ediyoruz.',
        kaynak: {
          mevzuat: 'Fiyat Etiketi Yönetmeliği',
          madde: 'm.8/5 (Ek)',
          resmiGazete: 'RG 11/10/2025 - 33044',
          baglanti: 'https://www.resmigazete.gov.tr/eskiler/2025/10/20251011-6.htm',
        },
      },
      {
        baslik: 'Denetim yetkisi',
        metin:
          'Yönetmeliğe uygunluk denetimi Bakanlık, belediyeler ve ilgili odalar tarafından yapılıyor. Bu yüzden menü ve fiyat listesi düzenini "denetime hazır" tutmak, sonradan düzeltmekten kolay oluyor.',
        kaynak: {
          mevzuat: 'Fiyat Etiketi Yönetmeliği',
          madde: 'm.13',
          resmiGazete: 'RG 28/6/2014 - 29044 (konsolide metin)',
          baglanti: 'https://www.mevzuat.gov.tr/MevzuatMetin/yonetmelik/7.5.19819.pdf',
        },
      },
    ],
  },
  {
    anahtar: 'icerik-alerjen-kalori',
    baslik: 'Menüde içerik, alerjen ve kalori bilgisi',
    kurum: 'Tarım ve Orman Bakanlığı — TGK Gıda Etiketleme ve Tüketicileri Bilgilendirme Yönetmeliği ve Kılavuzu',
    aciklama:
      'Bu taraf fiyatı değil, ürün hakkındaki bilgiyi düzenliyor: içindekiler, alerjen, enerji (kalori) değeri ve bunların hangi araçla sunulacağı. Çokça karıştırılan "1 Temmuz" tarihi buradan geliyor ve karekodla ilgili değil.',
    maddeler: [
      {
        baslik: 'Alerjen bildirimi 1 Ocak 2020’den beri yapılıyor',
        metin:
          'Toplu tüketim yerlerinde son tüketiciye sunulan hazır ambalajlı olmayan gıdalar için gıdanın adı, alerjiye veya intoleransa neden olan maddeler, etil alkol ve alkollü içki içerenler ile domuzdan elde edilen madde içerenler hakkındaki bilgilerin kolayca görülebilecek ve açıkça okunabilecek şekilde sunulması gerekiyor. Yönetmelikte 14 alerjen sayılı: gluten içeren tahıllar, kabuklular, yumurta, balık, yer fıstığı, soya fasulyesi, süt, sert kabuklu meyveler, kereviz, hardal, susam tohumu, kükürt dioksit ve sülfitler, acı bakla, yumuşakçalar. Yani alerjen bildirimi 2026’da gelen yeni bir şey değil.',
        kaynak: {
          mevzuat: 'TGK Gıda Etiketleme ve Tüketicileri Bilgilendirme Yönetmeliği',
          madde: 'm.15/5',
          resmiGazete: 'RG 26/01/2017',
          baglanti: 'https://resmigazete.gov.tr/eskiler/2017/01/20170126M1-6.htm',
        },
      },
      {
        baslik: 'Menüde içerik ve enerji (kalori) bilgisi: uyum takvimi ölçeğe göre değişiyor',
        metin:
          'Toplu tüketim yerlerinde sunulan gıdaların içerik (bileşen) bilgisi ve enerji değerinin tüketiciye sunulması, Yönetmeliğe bağlı Kılavuz’un 13 Mart 2026 güncellemesiyle düzenlendi. Uyum takvimi işletmenin ölçeğine göre farklı: ulusal zincir işletmeler için süre 1 Temmuz 2026’da doldu. Aynı ilde üç ve üzeri şubesi olan işletmeler ile diğer toplu tüketim yerleri için tarihler daha ileride. Yani bağımsız bir kafe için 1 Temmuz 2026 tarihi geçerli değil.',
        kaynak: {
          mevzuat: 'TGK Gıda Etiketleme ve Tüketicileri Bilgilendirme Yönetmeliği Kılavuzu (13/03/2026 güncellemesi)',
          madde: 'Kılavuz md. 41.3-41.5 ve geçiş süreleri için md. 47',
          baglanti: 'https://kms.kaysis.gov.tr/Home/Goster/204259',
        },
      },
      {
        baslik: 'Bilgiyi hangi araçla sunacağınız size bırakılmış',
        metin:
          'İçerik ve enerji bilgisi menü, yazı tahtası, broşür, dijital ekran veya karekod yoluyla sunulabiliyor. Düzenleme karekodu zorunlu kılmıyor; yalnızca bilginin tüketiciye ulaşmasını istiyor. Karekodu tercih etmenin avantajı, bu bilgiyi her ürün için tek yerden güncelleyip menüyle birlikte taşıyabilmek.',
        kaynak: {
          mevzuat: 'TGK Gıda Etiketleme ve Tüketicileri Bilgilendirme Yönetmeliği Kılavuzu',
          madde: 'Kılavuz md. 41.3-41.5',
          baglanti: 'https://kms.kaysis.gov.tr/Home/Goster/204259',
        },
      },
      {
        baslik: 'Karekod kullanıyorsanız, okuyamayan müşteriye bilginin ayrıca sağlanacağını bildirmek gerekiyor',
        metin:
          'Kılavuz’un 13 Mart 2026 güncellemesiyle, toplu tüketim yerlerinde karekod kullanılan durumlarda karekodu kullanamayan tüketicilere bilginin ayrıca sağlanacağına dair bilgilendirme yapılması gerekiyor. Bu, Ticaret Bakanlığı tarafındaki "talep halinde fiyat listesi verilir" hükmüne benziyor ama ayrı bir yükümlülük: biri fiyat listesi, diğeri içerik ve enerji bilgisi için. Kurduğumuz menülerde bu ibare masa kartında ve menünün içinde yer alıyor.',
        kaynak: {
          mevzuat: 'TGK Gıda Etiketleme ve Tüketicileri Bilgilendirme Yönetmeliği Kılavuzu (13/03/2026 güncellemesi)',
          baglanti: 'https://kms.kaysis.gov.tr/Home/Goster/204259',
        },
      },
      {
        baslik: 'Zorunlu gıda bilgilendirmesi Türkçe yapılır; ek diller serbest',
        metin:
          'Gıda hakkında zorunlu bilgilendirme Türkçe olarak yapılıyor ve Türkçe’ye ilave olarak diğer ülkelerin resmî dillerinde de yapılabiliyor. Yani çok dilli menü kurmak mümkün; ama "yalnızca İngilizce menü" uygun değil. Dört dilli menüleri de bu yüzden Türkçe’yi esas alıp üzerine ekleyerek kuruyoruz.',
        kaynak: {
          mevzuat: 'TGK Gıda Etiketleme ve Tüketicileri Bilgilendirme Yönetmeliği',
          madde: 'm.18 (Dil gereklilikleri)',
          resmiGazete: 'RG 26/01/2017',
          baglanti: 'https://resmigazete.gov.tr/eskiler/2017/01/20170126M1-6.htm',
        },
      },
      {
        baslik: 'Kılavuz hükümlerine uyum da bağlayıcı',
        metin:
          'Menüdeki içerik ve enerji yükümlülüğü doğrudan Yönetmelik maddesinde değil, Yönetmeliğe bağlı Kılavuz’da düzenlenmiş durumda. Bağlayıcılığı, 6 Nisan 2024 tarihli Yönetmelik değişikliğiyle gıda işletmecilerine kılavuz hükümlerine de uyma zorunluluğu getirilmiş olmasından geliyor. Bu yüzden doğru ifade "Yönetmelik ve ona bağlı Kılavuz uyarınca" şeklinde kurulmalı.',
        kaynak: {
          mevzuat: 'TGK Gıda Etiketleme ve Tüketicileri Bilgilendirme Yönetmeliği ve ona bağlı Kılavuz',
          baglanti: 'https://kms.kaysis.gov.tr/Home/Goster/204259',
        },
      },
      {
        baslik: 'Online siparişte bilgi satın alma aşamasında verilmeli',
        metin:
          'Mesafeli satışta, yani online sipariş akışında bileşen ve enerji bilgilerinin satın alma aşamasında tüketiciye sunulması gerekiyor. QR üzerinden sipariş modülü kurarken bu yüzden ürün detayını sipariş ekranının içinde tutuyoruz; müşteri bilgiyi görmek için akıştan çıkmak zorunda kalmıyor.',
        kaynak: {
          mevzuat: 'TGK Gıda Etiketleme ve Tüketicileri Bilgilendirme Yönetmeliği Kılavuzu',
          baglanti: 'https://kms.kaysis.gov.tr/Home/Goster/204259',
        },
      },
    ],
  },
];

export const QR_MENU_BILGI = {
  ustEtiket: 'QR menü ve mevzuat',
  baslik: 'Karekodlu menüde doğru bilgi: ne zorunlu, ne değil?',
  kisaCevap:
    'Kısa cevap: karekodlu menü zorunlu değil. Zorunlu olan, fiyat listesinin eksiksiz ve doğru gösterilmesi ile ürün bilgisinin tüketiciye ulaşması. Karekod, bunu yapmanın izin verilen yollarından biri.',
  giris: [
    'Piyasada dolaşan "QR Menü Yasası çıktı, artık her masada karekod zorunlu" başlıklarının mevzuatta karşılığı yok. Türkiye’de kafe ve restoran menüsünü iki ayrı bakanlığın iki ayrı düzenlemesi ilgilendiriyor ve bu ikisi birbirine karıştırıldığı için yanlış bilgi yayılıyor.',
    'Birincisi Ticaret Bakanlığı tarafı: fiyatın nerede, hangi dilde ve hangi para biriminde gösterileceğini düzenliyor. Karekoda izin veren değişiklik burada ve 11 Ekim 2025’te yürürlüğe girdi. İkincisi Tarım ve Orman Bakanlığı tarafı: ürünün içeriği, alerjen bilgisi ve enerji değerini düzenliyor. Sıkça duyulan "1 Temmuz" tarihi buradan geliyor ve karekodla ilgili değil; ulusal zincir işletmeler için uyum süresinin dolduğu tarih.',
    'Biz menüyü bu iki tarafı ayrı ayrı karşılayacak şekilde kuruyoruz. Satış argümanımız korkutmak değil: karekodun gerçek değeri, fiyat ve ürün bilgisini tek yerden güncelleyip masaya, kapıya ve kasaya aynı anda yansıtması.',
    'Aşağıdaki maddelerin her birinde dayanağı olan yönetmelik, madde numarası ve Resmî Gazete bilgisi yazılı. Listede olmayan bir madde numarasını veya tarihi sitemizde kullanmıyoruz.',
  ],

  sonKontrolEtiketi: 'Son mevzuat kontrolü',
  sonKontrolTarihi: '6 Ekim 2026',

  bolumler: QR_MENU_MEVZUAT_BOLUMLERI,

  gecisTakvimiBaslik: 'İçerik ve kalori bilgisi için uyum takvimi',
  gecisTakvimiNotu:
    'Takvim, Yönetmeliğe bağlı Kılavuz’un geçiş süreleri bölümünden alınmıştır. İşletmenizin hangi grupta olduğundan emin değilseniz bağlı olduğunuz meslek odasına veya il tarım ve orman müdürlüğüne teyit ettirmenizi öneririz.',
  gecisTakvimi: [
    { kim: 'Ulusal zincir işletmeler', tarih: '1 Temmuz 2026', konu: 'Menüde içerik (bileşen) ve enerji (kalori) bilgisi — uyum süresi doldu' },
    { kim: 'Aynı ilde üç ve üzeri şubesi olan işletmeler', tarih: '31 Aralık 2026', konu: 'Menüde içerik ve enerji bilgisi' },
    { kim: 'Diğer toplu tüketim yerleri', tarih: '31 Aralık 2026', konu: 'Menüde içerik (bileşen) bilgisi' },
    { kim: 'Diğer toplu tüketim yerleri', tarih: '31 Aralık 2027', konu: 'Menüde enerji (kalori) bilgisi' },
  ],

  yanlisBilinenlerBaslik: 'Sıkça rastlanan yanlış bilgiler',
  yanlisBilinenler: [
    {
      iddia: '"QR Menü Yasası çıktı."',
      dogrusu: 'Böyle bir yasa yok. Karekod, Fiyat Etiketi Yönetmeliği’nde masalardaki fiyat listesi için izin verilen bir gösterim yöntemi olarak tanımlı.',
    },
    {
      iddia: '"1 Temmuz’da yürürlüğe giren yönetmelikle karekodlu menü zorunlu oldu."',
      dogrusu: '1 Temmuz 2026, ulusal zincir işletmeler için menüde içerik ve kalori bilgisi verme uyum süresinin dolduğu tarih. Karekodla ilgisi yok ve o tarihte Resmî Gazete’de yayımlanmış bir menü düzenlemesi bulunmuyor.',
    },
    {
      iddia: '"Alerjen bildirimi zorunluluğu 2026’da geldi."',
      dogrusu: 'Alerjen bilgisinin son tüketiciye sunulması 1 Ocak 2020’den beri yapılıyor. 2026’da düzenlenen konu içerik (bileşen) detayı ve enerji değeri.',
    },
    {
      iddia: '"Karekoda geçince basılı fiyat listesine gerek kalmıyor."',
      dogrusu: 'Giriş kapısı önündeki fiyat listesi yükümlülüğü sürüyor ve müşteri talep ettiğinde liste ayrıca verilmek durumunda.',
    },
    {
      iddia: '"Menüde servis veya kuver ücreti satırı olabilir."',
      dogrusu: 'Yiyecek içecek hizmeti sunulan işyerlerinde tüketiciden servis, masa veya kuver ücreti adı altında ilave ödeme talep edilemiyor.',
    },
  ],

  denetimeHazirlikBaslik: 'Menüyü kurarken yaptığımız işler',
  denetimeHazirlikNotu:
    'Aşağıdaki maddeler mevzuatın teknik şartı değil, bizim kalite ve denetime hazırlık tercihimiz. Mevzuatta QR menünün nasıl yazılacağına dair teknik bir şart bulunmuyor; sonuç odaklı ölçütler var: bilginin kolayca görülebilir, açıkça okunabilir, gerçeğe uygun ve yanıltıcı olmaması.',
  denetimeHazirlik: [
    'Uygulama indirmeden, kayıt istemeden açılan ve zayıf bağlantıda da yüklenen menü',
    'Fiyatın tek kaynaktan beslenmesi; menü ile kasa arasında fark oluşmasını önleyen düzen',
    'Fiyatı boş bırakılmış ürün için panelde uyarı',
    'Hizmete sunulan tüm ürünlerin listede bulunduğunu kontrol eden yayın öncesi liste',
    'Türkçe esas, ek diller üzerine eklenen çok dilli menü yapısı',
    'Alerjen, alkol ve domuz kaynaklı bileşen işaretleme alanları',
    'İçerik (bileşen) ve enerji değeri için hazır alanlar; işletme verdiği bilgiyle doldurur',
    '"Karekodu okuyamayan misafirlerimize bilgi ayrıca sunulur" ibaresinin masa kartında ve menüde yer alması',
    'Giriş kapısı için basılabilir fiyat listesi çıktısı',
    'Menüye servis, masa veya kuver ücreti satırı eklenmesini engelleyen kurgu',
    'Online sipariş modülünde ürün bilgisinin sipariş akışının içinde gösterilmesi',
  ],

  yaptirimBaslik: 'Yaptırım tarafı',
  yaptirim: [
    {
      taraf: 'Ticaret Bakanlığı (Fiyat Etiketi Yönetmeliği)',
      metin:
        'Yönetmeliğe aykırılığın yaptırımı 6502 sayılı Tüketicinin Korunması Hakkında Kanun’un 77. maddesinden geliyor. Etiket, tarife ve fiyat listesi aykırılığı için idari para cezası 2026 yılı için aykırılık başına 3.973 TL olarak uygulanıyor; bu tutar her yıl yeniden değerleme oranında artırılıyor. Aykırılık sayısı eksik veya hatalı ürün sayısına göre belirlendiği için tutar ürün başına katlanabiliyor.',
      kaynak: '6502 sayılı Kanun m.77; 2026 tutarları 27/11/2025 tarihli ve 33090 sayılı Resmî Gazete’de yayımlanan VUK Genel Tebliği (Sıra No: 585) ile güncellendi.',
    },
    {
      taraf: 'Tarım ve Orman Bakanlığı (gıda bilgilendirmesi)',
      metin:
        'Menüde içerik, alerjen ve enerji bilgilendirmesine aykırılığın yaptırımı 5996 sayılı Veteriner Hizmetleri, Bitki Sağlığı, Gıda ve Yem Kanunu kapsamında idari para cezası olarak uygulanıyor; denetimi Bakanlığın il ve ilçe müdürlükleri yapıyor. Bu taraf için güncel bir tutarı birincil kaynaktan doğrulayamadığımız için rakam yazmıyoruz.',
      kaynak: '5996 sayılı Veteriner Hizmetleri, Bitki Sağlığı, Gıda ve Yem Kanunu.',
    },
  ],

  sorumlulukNotu:
    'Bu içerik bilgilendirme amaçlıdır, hukuki görüş niteliği taşımaz. Mevzuat değişebilir; yukarıdaki bilgiler sayfada yazılı son kontrol tarihi itibarıyla derlenmiştir. İşletmenizin durumuna özgü değerlendirme için bağlı olduğunuz meslek odasına veya hukuk danışmanınıza başvurun.',

  kaynaklarBaslik: 'Birincil kaynaklar',
  kaynaklar: [
    { ad: 'Fiyat Etiketi Yönetmeliği (konsolide metin)', baglanti: 'https://www.mevzuat.gov.tr/MevzuatMetin/yonetmelik/7.5.19819.pdf' },
    { ad: 'Fiyat Etiketi Yönetmeliğinde Değişiklik — RG 11/10/2025 - 33044 (karekod)', baglanti: 'https://www.resmigazete.gov.tr/eskiler/2025/10/20251011-6.htm' },
    { ad: 'Fiyat Etiketi Yönetmeliğinde Değişiklik — RG 30/1/2026 - 33153 (servis ve kuver ücreti)', baglanti: 'https://www.resmigazete.gov.tr/eskiler/2026/01/20260130-2.htm' },
    { ad: 'TGK Gıda Etiketleme ve Tüketicileri Bilgilendirme Yönetmeliği — RG 26/01/2017', baglanti: 'https://resmigazete.gov.tr/eskiler/2017/01/20170126M1-6.htm' },
    { ad: 'TGK Gıda Etiketleme ve Tüketicileri Bilgilendirme Yönetmeliği Kılavuzu (KAYSIS)', baglanti: 'https://kms.kaysis.gov.tr/Home/Goster/204259' },
    { ad: 'Ticaret Bakanlığı — Fiyat etiketleri hakkında tüketici bilgilendirmesi', baglanti: 'https://tuketici.ticaret.gov.tr/yayinlar/tuketici-bilgi-rehberi/fiyat-etiketleri-hakkinda-bilgilendirme' },
    { ad: 'Tarım ve Orman Bakanlığı — Toplu tüketim yerlerinde alerjen bildirimi', baglanti: 'https://www.tarimorman.gov.tr/Konu/2023/Toplu_Tuketim_Yerlerinde_Alerjen_Bildirimi' },
  ],

  cagri: 'Menümüzü mevzuata uygun kurgulayın',
  cagriAciklama:
    'Mevcut menünüzü ve fiyat listesi düzeninizi birlikte gözden geçirelim; eksikleri ve yapılması gerekenleri yazılı bir listeyle paylaşalım.',

  metaBaslik: 'QR Menü Zorunlu mu? Mevzuat Rehberi | Ajans Flow',
  metaAciklama:
    'Karekodlu menü zorunlu değil. Fiyat listesi, alerjen, içerik ve kalori yükümlülükleri ile uyum takvimi — madde ve Resmî Gazete kaynaklarıyla açıklıyoruz.',
  anahtarKelimeler: ['QR menü zorunlu mu', 'karekodlu menü mevzuat', 'fiyat etiketi yönetmeliği karekod', 'menüde kalori zorunluluğu', 'servis ücreti yasağı'],
} as const;

/* ================================================================== */
/* Yardımcılar                                                         */
/* ================================================================== */

/** `anahtar` ile hizmet bulur. */
export function hizmetBul(anahtar: string): Hizmet | undefined {
  return HIZMETLER.find((h) => h.anahtar === anahtar);
}

/** `slug` ile hizmet bulur (sayfa rotaları için). */
export function hizmetSlugBul(slug: string): Hizmet | undefined {
  return HIZMETLER.find((h) => h.slug === slug);
}

/** `slug` ile sektör bulur. */
export function sektorBul(slug: string): Sektor | undefined {
  return SEKTORLER.find((s) => s.slug === slug);
}

/** `slug` ile vaka bulur. */
export function vakaBul(slug: string): Vaka | undefined {
  return VAKALAR.find((v) => v.slug === slug);
}

/** Bir hizmetin `ilgiliHizmetler` listesini gerçek hizmet nesnelerine çevirir. */
export function ilgiliHizmetleri(hizmet: Hizmet): Hizmet[] {
  return hizmet.ilgiliHizmetler
    .map((anahtar) => hizmetBul(anahtar))
    .filter((h): h is Hizmet => Boolean(h));
}

/** Bir vakada kullanılan hizmetleri döndürür. */
export function vakaHizmetleri(vaka: Vaka): Hizmet[] {
  return vaka.hizmetler.map((anahtar) => hizmetBul(anahtar)).filter((h): h is Hizmet => Boolean(h));
}

/** Bir sektörün örnek işini döndürür (varsa). */
export function sektorVakasi(sektor: Sektor): Vaka | undefined {
  return sektor.ornekIs ? vakaBul(sektor.ornekIs.vakaSlug) : undefined;
}

/** Belirli bir hizmeti kapsayan vakalar. */
export function hizmetVakalari(anahtar: string): Vaka[] {
  return VAKALAR.filter((v) => v.hizmetler.includes(anahtar));
}

/** Hizmet sayfasının tam yolu. */
export function hizmetYolu(hizmet: Hizmet): string {
  return siteYolu(`/hizmetler/${hizmet.slug}`);
}

/** Sektör sayfasının tam yolu. */
export function sektorYolu(sektor: Sektor): string {
  return siteYolu(`/sektorler/${sektor.slug}`);
}

/** Vaka sayfasının tam yolu. */
export function vakaYolu(vaka: Vaka): string {
  return siteYolu(`/calismalar/${vaka.slug}`);
}
