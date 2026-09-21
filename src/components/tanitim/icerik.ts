/**
 * Tanıtım sitesinin TÜM metinleri ve verileri bu dosyada.
 * Metni değiştirmek için yalnızca burayı düzenlemeniz yeterli.
 *
 * Kural: Yalnızca gerçek bilgiler. Uydurma rakam, yorum, ödül ya da
 * fiyat eklemeyin. Kullanılabilecek rakamlar: 12+ marka, 12 hizmet alanı,
 * 244+ paylaşım, 1 çatı altında tüm hizmetler, merkez İstanbul / 4.Levent.
 */

/* ------------------------------------------------------------------ */
/* Marka                                                               */
/* ------------------------------------------------------------------ */

export const MARKA = {
  ad: 'Ajans Flow',
  slogan: 'Fikirler hareket kazanır.',
  konum: 'İstanbul / 4.Levent',
  unvan: 'Sosyal Medya Ajansı · Dijital İçerik Üreticisi',
  alt: 'İçerik • Reklam • Yönetim',
} as const;

/* ------------------------------------------------------------------ */
/* Menü                                                                */
/* ------------------------------------------------------------------ */

export type NavBaglanti = { href: string; etiket: string };

export const NAV: NavBaglanti[] = [
  { href: '#hizmetler', etiket: 'Hizmetler' },
  { href: '#calismalar', etiket: 'Çalışmalar' },
  { href: '#surec', etiket: 'Süreç' },
  { href: '#sss', etiket: 'SSS' },
  { href: '#iletisim', etiket: 'İletişim' },
];

/** Kişiye özel sayfada menünün başına eklenir. */
export const NAV_ONERILER: NavBaglanti = { href: '#oneriler', etiket: 'Öneriler' };

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const HERO = {
  ustEtiket: 'Sosyal Medya Ajansı · İstanbul / 4.Levent',
  baslik: ['Fikirler', 'hareket', 'kazanır.'],
  donenOnEk: 'Tek çatı altında',
  donenKelimeler: ['İçerik', 'Reklam', 'Yönetim', 'Prodüksiyon'],
  aciklama:
    'Sosyal medya yönetiminden Reels ve drone çekimlerine, Meta & Google reklamlarından web sitesi ve QR menüye kadar markanızın dijitalde ihtiyaç duyduğu her şeyi tek ekipten alın.',
  birincilCta: 'Ücretsiz analiz iste',
  ikincilCta: 'Çalışmalarımızı görün',
  kaydir: 'Keşfet',
  // Kişiye özel sürüm
  kisiselCip: 'Sizin için hazırladık',
  kisiselSelam: 'Merhaba',
  // Ekip adayda fırsat işaretlemediyse "inceledik" denmez: yapılmamış bir
  // analizi vaat etmeyelim.
  kisiselAciklama: (ad: string, firsatVar: boolean) =>
    firsatVar
      ? `${ad} için dijital görünümünüzü inceledik; markanızı büyütecek fırsatları bu sayfada topladık.`
      : `${ad} için bu sayfayı hazırladık. Dijital görünümünüzü ücretsiz inceleyip markanızı büyütecek fırsatları sizinle paylaşmak isteriz.`,
  kisiselBirincilCta: 'Görüşme ayarlayalım',
  kisiselIkincilCta: (firsatVar: boolean) => (firsatVar ? 'Önerileri inceleyin' : 'Analizde neye bakıyoruz?'),
} as const;

/**
 * Sektöre göre tek cümlelik ton ayarı. Anahtar kelimelerden biri sektör
 * etiketinde geçiyorsa o cümle kullanılır; yoksa genel şablon.
 */
export const SEKTOR_CUMLELERI: { anahtarlar: string[]; cumle: string }[] = [
  {
    anahtarlar: ['kafe', 'cafe', 'restoran', 'büfe', 'lokanta', 'yemek', 'kahve', 'pastane', 'fırın'],
    cumle:
      'Misafirler çoğu zaman gelmeden önce Instagram’a ve menüye bakıyor; iştah açan içerikler ve dijital menü bu kararı kolaylaştırır.',
  },
  {
    anahtarlar: ['diş', 'klinik', 'dent', 'sağlık', 'hastane', 'poliklinik', 'estetik', 'doktor'],
    cumle:
      'Klinik seçiminde güven her şeydir; düzenli, bilgilendirici ve profesyonel içerik bu güveni ilk bakışta kurar.',
  },
  {
    anahtarlar: ['spor', 'gym', 'fitness', 'pilates', 'crossfit', 'yoga'],
    cumle:
      'Spor salonlarında motivasyon görselle başlar; enerjik Reels ve düzenli paylaşımlar yeni üyeleri kapınıza getirir.',
  },
  {
    anahtarlar: ['anaokul', 'kreş', 'okul', 'eğitim', 'kurs', 'etüt'],
    cumle:
      'Veliler karar vermeden önce Instagram’da güven arar; sıcak, düzenli ve şeffaf içerik bu güveni oluşturur.',
  },
  {
    anahtarlar: ['avukat', 'hukuk', 'danışman', 'müşavir'],
    cumle:
      'Hukuk ve danışmanlık hizmetinde itibar önemlidir; sade, bilgilendirici ve güven veren bir dijital duruş sizi öne çıkarır.',
  },
  {
    anahtarlar: ['güzellik', 'kuaför', 'berber', 'bakım', 'salon'],
    cumle:
      'Güzellik ve bakımda müşteri önce Instagram’daki işlere bakar; düzenli, kaliteli paylaşımlar randevu kararını kolaylaştırır.',
  },
  {
    anahtarlar: ['otel', 'turizm', 'pansiyon', 'tatil'],
    cumle:
      'Misafirler rezervasyondan önce Instagram’a ve Google yorumlarına bakıyor; güçlü görseller bu kararı kolaylaştırır.',
  },
  {
    anahtarlar: ['oto', 'araç', 'araba', 'motor', 'galeri', 'kiralama', 'lastik'],
    cumle:
      'Araç alan ya da hizmet arayan müşteri önce internete bakar; güçlü görseller, net bir web sitesi ve güncel Google profili fark yaratır.',
  },
];

export const sektorCumlesi = (sektor: string): string => {
  const kucuk = sektor.toLocaleLowerCase('tr-TR');
  const bulunan = SEKTOR_CUMLELERI.find((s) => s.anahtarlar.some((a) => kucuk.includes(a)));
  // Genel cümlede sektör adı geçmez: "Diğer alanında…" gibi bozuk cümle çıkmasın.
  return (
    bulunan?.cumle ??
    'Müşterileriniz karar vermeden önce Instagram’a ve Google’a bakıyor; biz bu ilk izlenimi güçlendiriyoruz.'
  );
};

/* ------------------------------------------------------------------ */
/* Kişiye özel öneriler                                                */
/* ------------------------------------------------------------------ */

export const ONERILER = {
  ustEtiket: 'Size özel',
  baslik: (ad: string, firsatVar: boolean) =>
    firsatVar ? `${ad} için hazırladığımız öneriler` : `${ad} için ücretsiz dijital analiz`,
  aciklama: (adet: number) =>
    `Dijital görünümünüzü inceledik. Hızlıca fark yaratabilecek ${adet} fırsat tespit ettik:`,
  cozumEtiketi: 'Çözüm',
  cta: 'Bu önerileri birlikte konuşalım',
  // Fırsat listesi boşsa gösterilen blok
  bosBaslik: 'Ücretsiz dijital analiz',
  bosAciklama:
    'Markanızın dijital görünümünü birlikte inceleyelim. Instagram hesabınıza, web sitenize ve Google İşletme Profilinize bakıp neyin eksik olduğunu, neyin hızlıca iyileşebileceğini açıkça paylaşalım.',
  bosMaddeler: ['Instagram profili ve içerik düzeni', 'Web sitesi ve mobil deneyim', 'Google İşletme Profili ve harita görünümü'],
  bosCta: 'Ücretsiz analizimi iste',
} as const;

/* ------------------------------------------------------------------ */
/* Markalar (Instagram öne çıkanlarından)                              */
/* ------------------------------------------------------------------ */

export type MarkaStili = 'serif' | 'kalin' | 'genis' | 'mono' | 'yuvarlak' | 'cerceve';

/** dil: 'en' → büyük harfe çevirirken İngilizce kural ("Clinic" → "CLINIC", "CLİNİC" değil). */
export const MARKALAR: { ad: string; stil: MarkaStili; dil?: 'en' }[] = [
  { ad: 'Kule İstanbul Cafe', stil: 'serif' },
  { ad: 'Mas Go Kart', stil: 'kalin' },
  { ad: 'Mançurya Büfe', stil: 'yuvarlak' },
  { ad: 'Dent 50 Clinic', stil: 'genis', dil: 'en' },
  { ad: 'Baraka Kanat', stil: 'kalin' },
  { ad: 'Kök Cafe Lounge', stil: 'serif' },
  { ad: 'Lityum Servis', stil: 'mono' },
  { ad: 'May Motors', stil: 'genis' },
  { ad: 'Coin Coffee', stil: 'cerceve', dil: 'en' },
  { ad: 'Teras Kilyos', stil: 'serif' },
  { ad: 'Neo Vista Coffee', stil: 'yuvarlak', dil: 'en' },
  { ad: 'Minik Starlar Ligi', stil: 'cerceve' },
];

export const MARKA_BANDI = {
  ustEtiket: 'Birlikte çalıştığımız markalar',
} as const;

/* ------------------------------------------------------------------ */
/* Hizmetler                                                           */
/* ------------------------------------------------------------------ */

export type HizmetIkonu =
  | 'sosyal'
  | 'strateji'
  | 'fotograf'
  | 'video'
  | 'drone'
  | 'reklam'
  | 'buyume'
  | 'analiz'
  | 'web'
  | 'qr'
  | 'tasarim'
  | 'google';

export const HIZMETLER_BOLUMU = {
  ustEtiket: 'Hizmetlerimiz',
  baslik: 'Markanızın dijitalde ihtiyacı olan her şey, tek çatı altında.',
  aciklama:
    'Strateji · Yaratıcılık · Prodüksiyon · Sonuç. Tek bir ekip; tek plan, tek muhatap. İster tamamını, ister yalnızca ihtiyacınız olanı alın.',
} as const;

export const HIZMETLER: {
  ikon: HizmetIkonu;
  baslik: string;
  /** "Neden Ajans Flow" kartındaki kısa etiket */
  kisa: string;
  aciklama: string;
  grup: string;
}[] = [
  {
    ikon: 'sosyal',
    baslik: 'Sosyal Medya Yönetimi',
    kisa: 'Sosyal medya',
    aciklama: 'Hesaplarınızı düzenli, tutarlı ve markanıza yakışır şekilde yönetiriz; siz işinize odaklanırsınız.',
    grup: 'Sosyal',
  },
  {
    ikon: 'strateji',
    baslik: 'İçerik Stratejisi & Planlama',
    kisa: 'İçerik planı',
    aciklama: 'Ne zaman, neyi ve hangi kitleye yönelik paylaşacağınızı planlarız. Rastgele paylaşım yerine hedefi olan bir içerik takvimi.',
    grup: 'Strateji',
  },
  {
    ikon: 'fotograf',
    baslik: 'Profesyonel Fotoğraf Çekimi',
    kisa: 'Fotoğraf',
    aciklama: 'Ürünlerinizi, mekânınızı ve ekibinizi profesyonel ekipmanla; iştah açan, güven veren karelerle çekeriz.',
    grup: 'Prodüksiyon',
  },
  {
    ikon: 'video',
    baslik: 'Video & Reels Prodüksiyon',
    kisa: 'Reels & video',
    aciklama: 'Fikirden kurguya kadar kısa, dikkat çeken ve paylaşılmak için tasarlanmış videolar üretiriz.',
    grup: 'Prodüksiyon',
  },
  {
    ikon: 'drone',
    baslik: 'Drone Çekimleri',
    kisa: 'Drone',
    aciklama: 'Mekânınızı, etkinliklerinizi ve çevrenizi havadan, sinematik açılarla gösteririz.',
    grup: 'Prodüksiyon',
  },
  {
    ikon: 'reklam',
    baslik: 'Reklam Yönetimi (Meta & Google)',
    kisa: 'Meta & Google Ads',
    aciklama: 'Bütçenizi doğru kitleye harcayan kampanyaları kurar, takip eder ve sürekli iyileştiririz.',
    grup: 'Reklam',
  },
  {
    ikon: 'buyume',
    baslik: 'Etkileşim & Takipçi Büyütme',
    kisa: 'Büyüme',
    aciklama: 'Doğru içerik ve topluluk yönetimiyle hesabınızı gerçek ve ilgili bir kitleyle büyütürüz.',
    grup: 'Sosyal',
  },
  {
    ikon: 'analiz',
    baslik: 'Veri Analizi & Performans Optimizasyonu',
    kisa: 'Veri analizi',
    aciklama: 'Neyin işe yaradığını verilerle görür, planı sonuçlara göre güncelleriz. Tahmin değil, ölçüm.',
    grup: 'Strateji',
  },
  {
    ikon: 'web',
    baslik: 'Web Sitesi Tasarımı & Yazılım',
    kisa: 'Web sitesi',
    aciklama: 'Hızlı, mobil uyumlu ve ziyaretçiyi müşteriye dönüştürmek için tasarlanmış web siteleri geliştiririz.',
    grup: 'Web',
  },
  {
    ikon: 'qr',
    baslik: 'QR / Dijital Menü',
    kisa: 'QR menü',
    aciklama: 'Çok dilli, aranabilir ve baskıya gerek kalmadan güncellenebilen dijital menülerle modern bir deneyim.',
    grup: 'Web',
  },
  {
    ikon: 'tasarim',
    baslik: 'Grafik Tasarım & Kurumsal Kimlik',
    kisa: 'Kurumsal kimlik',
    aciklama: 'Logo, menü ve katalogdan tüm dijital materyallere kadar tutarlı, akılda kalan bir marka kimliği.',
    grup: 'Tasarım',
  },
  {
    ikon: 'google',
    baslik: 'Google İşletme Profili',
    kisa: 'Google profili',
    aciklama: 'Haritalarda ve aramalarda doğru bilgiler, güncel fotoğraflar ve eksiksiz bir profille görünün.',
    grup: 'Web',
  },
];

/* ------------------------------------------------------------------ */
/* Rakamlar (yalnızca gerçek olanlar)                                  */
/* ------------------------------------------------------------------ */

export const RAKAMLAR: { deger: number; ek: string; etiket: string }[] = [
  { deger: 12, ek: '+', etiket: 'Marka ile çalıştık' },
  { deger: 12, ek: '', etiket: 'Hizmet alanı' },
  { deger: 244, ek: '+', etiket: 'Instagram paylaşımı' },
  { deger: 1, ek: '', etiket: 'Çatı altında tüm dijital hizmetler' },
];

export const RAKAM_BANDI = {
  konumEtiket: 'Merkezimiz',
  konum: 'İstanbul / 4.Levent',
} as const;

/* ------------------------------------------------------------------ */
/* Önce / Sonra                                                        */
/* ------------------------------------------------------------------ */

export const ONCE_SONRA = {
  ustEtiket: 'Önce / Sonra',
  baslik: 'Profiliniz ilk bakışta ne anlatıyor?',
  aciklama:
    'Müşteri profilinize birkaç saniye bakar ve karar verir. Rastgele renkler ve tutarsız görseller güven kaybettirir; planlı, tutarlı bir akış ise markanızı akılda kalıcı kılar.',
  maddeler: [
    'Tutarlı renk paleti ve tipografi',
    'Planlı içerik akışı ve düzenli paylaşım',
    'Profesyonel fotoğraf ve Reels',
    'Net, anlaşılır marka mesajı',
  ],
  onceEtiket: 'Önce',
  sonraEtiket: 'Sonra',
  ipucu: 'Karşılaştırmak için sürükleyin',
  kaydiriciEtiket: 'Önce ve sonra profil karşılaştırması',
  srAciklama:
    'Önce: renkleri ve yazı stilleri birbirini tutmayan, dağınık bir Instagram ızgarası. Sonra: aynı renk paleti ve düzenli şablonlarla hazırlanmış, tutarlı bir marka ızgarası.',
} as const;

/* ------------------------------------------------------------------ */
/* QR menü vitrini (Kule İstanbul Cafe)                                */
/* ------------------------------------------------------------------ */

export const QR_BOLUMU = {
  ustEtiket: 'Vaka · Kule İstanbul Cafe',
  baslik: 'Menünüz artık 4 dil konuşuyor.',
  aciklama:
    'Kule İstanbul Cafe için hazırladığımız QR dijital menü misafirin kendi telefonunda açılıyor; Türkçe, İngilizce, Almanca ve Arapça olarak okunabiliyor.',
  maddeler: [
    '4 dil: Türkçe, English, Deutsch, العربية',
    'Menüde anlık arama',
    'Vegan, glutensiz ve kuruyemişsiz filtreleri',
    'Kategoriler arasında hızlı gezinme',
  ],
  demoNotu: 'Canlı demo (örnek ürünlerle): dil seçin, arayın, filtreleyin.',
  cta: 'İşletmem için QR menü istiyorum',
  tara: 'QR kodu okutuluyor…',
  bulundu: 'Menü açılıyor',
  tekrar: 'Tekrar okut',
} as const;

export type MenuDili = 'tr' | 'en' | 'de' | 'ar';
export type MenuEtiketi = 'vegan' | 'glutensiz' | 'kuruyemissiz';
export type MenuKategori = 'kahvalti' | 'icecek' | 'tatli';

export const MENU_DILLERI: { kod: MenuDili; kisa: string; ad: string }[] = [
  { kod: 'tr', kisa: 'TR', ad: 'Türkçe' },
  { kod: 'en', kisa: 'EN', ad: 'English' },
  { kod: 'de', kisa: 'DE', ad: 'Deutsch' },
  { kod: 'ar', kisa: 'AR', ad: 'العربية' },
];

export const MENU_ARAYUZ: Record<
  MenuDili,
  {
    selam: string;
    ara: string;
    bos: string;
    kategoriler: Record<MenuKategori, string>;
    etiketler: Record<MenuEtiketi, string>;
  }
> = {
  tr: {
    selam: 'Hoş geldiniz',
    ara: 'Menüde ara…',
    bos: 'Sonuç bulunamadı',
    kategoriler: { kahvalti: 'Kahvaltı', icecek: 'İçecekler', tatli: 'Tatlılar' },
    etiketler: { vegan: 'Vegan', glutensiz: 'Glutensiz', kuruyemissiz: 'Kuruyemişsiz' },
  },
  en: {
    selam: 'Welcome',
    ara: 'Search the menu…',
    bos: 'No results',
    kategoriler: { kahvalti: 'Breakfast', icecek: 'Drinks', tatli: 'Desserts' },
    etiketler: { vegan: 'Vegan', glutensiz: 'Gluten-free', kuruyemissiz: 'Nut-free' },
  },
  de: {
    selam: 'Willkommen',
    ara: 'Menü durchsuchen…',
    bos: 'Keine Ergebnisse',
    kategoriler: { kahvalti: 'Frühstück', icecek: 'Getränke', tatli: 'Desserts' },
    etiketler: { vegan: 'Vegan', glutensiz: 'Glutenfrei', kuruyemissiz: 'Nussfrei' },
  },
  ar: {
    selam: 'أهلاً وسهلاً',
    ara: 'ابحث في القائمة…',
    bos: 'لا توجد نتائج',
    kategoriler: { kahvalti: 'الفطور', icecek: 'المشروبات', tatli: 'الحلويات' },
    etiketler: { vegan: 'نباتي', glutensiz: 'خالٍ من الغلوتين', kuruyemissiz: 'بدون مكسرات' },
  },
};

/** Demo menü öğeleri (fiyatsız; yalnızca arayüzü göstermek için). */
export const MENU_OGELERI: {
  kategori: MenuKategori;
  etiketler: MenuEtiketi[];
  simge: string;
  metin: Record<MenuDili, [ad: string, aciklama: string]>;
}[] = [
  {
    kategori: 'kahvalti',
    etiketler: [],
    simge: '🍳',
    metin: {
      tr: ['Serpme Kahvaltı', 'Peynir çeşitleri, zeytin, reçel, bal-kaymak ve sıcaklar'],
      en: ['Turkish Breakfast Spread', 'Cheese selection, olives, jams, honey & clotted cream, hot dishes'],
      de: ['Türkisches Frühstück', 'Käseauswahl, Oliven, Marmelade, Honig & Kaymak, warme Speisen'],
      ar: ['فطور تركي مشكّل', 'تشكيلة أجبان، زيتون، مربى، عسل وقشطة، وأطباق ساخنة'],
    },
  },
  {
    kategori: 'kahvalti',
    etiketler: ['vegan', 'kuruyemissiz'],
    simge: '🥑',
    metin: {
      tr: ['Avokadolu Tost', 'Ekşi mayalı ekmek, avokado, çeri domates'],
      en: ['Avocado Toast', 'Sourdough, avocado, cherry tomatoes'],
      de: ['Avocado-Toast', 'Sauerteigbrot, Avocado, Kirschtomaten'],
      ar: ['توست الأفوكادو', 'خبز العجين المخمّر، أفوكادو، طماطم كرزية'],
    },
  },
  {
    kategori: 'kahvalti',
    etiketler: ['glutensiz', 'kuruyemissiz'],
    simge: '🍅',
    metin: {
      tr: ['Menemen', 'Domates, biber ve yumurta; sıcak servis'],
      en: ['Menemen', 'Tomatoes, peppers and eggs, served hot'],
      de: ['Menemen', 'Tomaten, Paprika und Eier, heiß serviert'],
      ar: ['منمن', 'طماطم وفلفل وبيض، يقدّم ساخناً'],
    },
  },
  {
    kategori: 'icecek',
    etiketler: ['vegan', 'glutensiz'],
    simge: '☕',
    metin: {
      tr: ['Türk Kahvesi', 'Geleneksel, lokum eşliğinde'],
      en: ['Turkish Coffee', 'Traditional, served with Turkish delight'],
      de: ['Türkischer Mokka', 'Traditionell, mit Lokum serviert'],
      ar: ['قهوة تركية', 'تقليدية، تقدّم مع الحلقوم'],
    },
  },
  {
    kategori: 'icecek',
    etiketler: ['vegan', 'kuruyemissiz'],
    simge: '🥛',
    metin: {
      tr: ['Yulaf Sütlü Latte', 'Espresso ve yulaf sütü'],
      en: ['Oat Milk Latte', 'Espresso with oat milk'],
      de: ['Hafermilch-Latte', 'Espresso mit Hafermilch'],
      ar: ['لاتيه بحليب الشوفان', 'إسبريسو مع حليب الشوفان'],
    },
  },
  {
    kategori: 'icecek',
    etiketler: ['vegan', 'glutensiz', 'kuruyemissiz'],
    simge: '🍊',
    metin: {
      tr: ['Taze Portakal Suyu', 'Günlük sıkım'],
      en: ['Fresh Orange Juice', 'Freshly squeezed daily'],
      de: ['Frischer Orangensaft', 'Täglich frisch gepresst'],
      ar: ['عصير برتقال طازج', 'معصور يومياً'],
    },
  },
  {
    kategori: 'tatli',
    etiketler: [],
    simge: '🥮',
    metin: {
      tr: ['Fıstıklı Baklava', 'Antep fıstığı, çıtır yufka'],
      en: ['Pistachio Baklava', 'Antep pistachios, crispy filo'],
      de: ['Pistazien-Baklava', 'Antep-Pistazien, knuspriger Yufka-Teig'],
      ar: ['بقلاوة بالفستق', 'فستق عنتاب وعجينة مقرمشة'],
    },
  },
  {
    kategori: 'tatli',
    etiketler: ['glutensiz', 'kuruyemissiz'],
    simge: '🍫',
    metin: {
      tr: ['Glutensiz Brownie', 'Bitter çikolatalı'],
      en: ['Gluten-Free Brownie', 'Dark chocolate'],
      de: ['Glutenfreier Brownie', 'Mit Zartbitterschokolade'],
      ar: ['براوني خالٍ من الغلوتين', 'بالشوكولاتة الداكنة'],
    },
  },
  {
    kategori: 'tatli',
    etiketler: ['vegan', 'glutensiz', 'kuruyemissiz'],
    simge: '🍓',
    metin: {
      tr: ['Meyve Tabağı', 'Mevsim meyveleri'],
      en: ['Fruit Plate', 'Seasonal fruits'],
      de: ['Obstteller', 'Früchte der Saison'],
      ar: ['طبق فواكه', 'فواكه الموسم'],
    },
  },
];

/* ------------------------------------------------------------------ */
/* Süreç                                                               */
/* ------------------------------------------------------------------ */

export const SUREC_BOLUMU = {
  ustEtiket: 'Nasıl çalışıyoruz?',
  baslik: 'Analizden büyümeye, beş net adım.',
  aciklama:
    'Her iş birliği ücretsiz bir analizle başlar. Sonrasında ne yapacağımızı, ne zaman yapacağımızı ve neyi ölçeceğimizi en baştan birlikte netleştiririz.',
} as const;

export const SUREC: { baslik: string; aciklama: string; cip: string }[] = [
  {
    baslik: 'Ücretsiz Analiz',
    aciklama:
      'Instagram, web sitesi ve Google profilinizi inceler; eksikleri ve hızlı kazanımları net bir listeyle paylaşırız.',
    cip: 'Ücretsiz',
  },
  {
    baslik: 'Strateji & Plan',
    aciklama: 'Hedeflerinize göre içerik takvimi, görsel dil ve reklam planı hazırlarız.',
    cip: 'Takvim & görsel dil',
  },
  {
    baslik: 'Çekim & Prodüksiyon',
    aciklama: 'Fotoğraf, video, Reels ve gerekirse drone çekimlerini planlar, profesyonelce üretiriz.',
    cip: 'Fotoğraf · Video · Drone',
  },
  {
    baslik: 'Yayın & Reklam',
    aciklama: 'İçerikleri planlı şekilde yayınlar, Meta ve Google reklamlarıyla doğru kitleye ulaştırırız.',
    cip: 'Meta & Google',
  },
  {
    baslik: 'Raporlama & Büyüme',
    aciklama: 'Sonuçları düzenli raporlar, veriye bakarak neyi artıracağımıza birlikte karar veririz.',
    cip: 'Veriyle yönetim',
  },
];

/* ------------------------------------------------------------------ */
/* Çalışmalar (yalnızca gerçek işler, yalnızca belirtilen kapsam)      */
/* ------------------------------------------------------------------ */

export type VakaGorseli = 'kule' | 'may' | 'minik' | 'kok' | 'mas' | 'lityum';

export const CALISMALAR_BOLUMU = {
  ustEtiket: 'Çalışmalarımız',
  baslik: 'Gerçek markalar, gerçek işler.',
  aciklama: 'Kafeden otomotive, çocuk futbol liginden servis firmasına; farklı sektörlerde ürettiğimiz işlerden bazıları.',
  kaydirIpucu: 'Kaydırın',
} as const;

export const CALISMALAR: {
  gorsel: VakaGorseli;
  marka: string;
  baslik: string;
  aciklama: string;
  alinti?: string;
  etiketler: string[];
}[] = [
  {
    gorsel: 'kule',
    marka: 'Kule İstanbul Cafe',
    baslik: '4 dilli QR dijital menü',
    aciklama:
      'Türkçe, İngilizce, Almanca ve Arapça QR menü: menüde arama, vegan / glutensiz / kuruyemişsiz filtreleri ve kategori gezinme. Menünün yanında yemek içerikleri de ürettik.',
    alinti: 'İyi yemek, güzel anlar.',
    etiketler: ['QR Menü', '4 Dil', 'Yemek İçeriği'],
  },
  {
    gorsel: 'may',
    marka: 'May Motors',
    baslik: 'Otomotiv için web sitesi ve sosyal medya',
    aciklama:
      'Otomotiv firması için, aracını satmak isteyen ziyaretçiye odaklanan bir web sitesi; yanında sosyal medya içerikleri ve Reels.',
    alinti: 'Aracının değerini öğren, hemen sat.',
    etiketler: ['Web Sitesi', 'Sosyal Medya', 'Reels'],
  },
  {
    gorsel: 'minik',
    marka: 'Minik Starlar Ligi',
    baslik: 'Medya partnerliği',
    aciklama:
      'U10–U12 çocuk futbol ligi için web sitesi, maç içerikleri ve tanıtım çalışmaları. Ligin dijitaldeki sesi olduk.',
    etiketler: ['Medya Partneri', 'Web Sitesi', 'Maç İçerikleri'],
  },
  {
    gorsel: 'kok',
    marka: 'Kök Cafe Lounge',
    baslik: 'Yemek fotoğrafçılığı ve Reels',
    aciklama: 'Mekânın lezzetlerini iştah açan karelere ve kısa videolara dönüştürdük.',
    alinti: 'İyi lezzetler, daima iyi hikayeler anlatır.',
    etiketler: ['Fotoğraf', 'Reels'],
  },
  {
    gorsel: 'mas',
    marka: 'Mas Go Kart',
    baslik: 'Dinamik tanıtım videoları',
    aciklama: 'Pistin enerjisini hızlı kurgulu, dinamik tanıtım videolarıyla ekrana taşıdık.',
    alinti: 'Hız · Eğlence · Adrenalin',
    etiketler: ['Tanıtım Videosu', 'Reels'],
  },
  {
    gorsel: 'lityum',
    marka: 'Lityum Servis',
    baslik: 'Hizmet tanıtım içerikleri',
    aciklama: 'Firmanın hizmetlerini anlaşılır ve güven veren tanıtım içerikleriyle anlattık.',
    alinti: 'Daha güçlü yarınlar için',
    etiketler: ['Hizmet Tanıtımı', 'İçerik'],
  },
];

/* ------------------------------------------------------------------ */
/* Video & Drone                                                       */
/* ------------------------------------------------------------------ */

export const VIDEO_BOLUMU = {
  ustEtiket: 'Video · Drone',
  baslik: 'Yerden ve havadan; hikâyenizi hareketle anlatıyoruz.',
  aciklama:
    'Profesyonel çekimler, Reels ve drone görüntüleriyle markanızı en iyi açısından gösteriyoruz. Çünkü iyi içerik sadece izlenmez, iz bırakır.',
  maddeler: ['Reels ve kısa video prodüksiyonu', 'Drone ile havadan çekim', 'Ürün, mekân ve ekip çekimleri', 'Kurgu ve paylaşıma hazır teslim'],
  vizorAltyazi: 'Profesyonel çekimler, reklam ve strateji ile büyüyün',
  etiketler: ['Video', 'Social', 'Design', 'Drone', 'Ads'],
} as const;

/* ------------------------------------------------------------------ */
/* Neden Ajans Flow                                                    */
/* ------------------------------------------------------------------ */

export const NEDEN_BOLUMU = {
  ustEtiket: 'Neden Ajans Flow?',
  baslik: 'Yaratıcı fikirler, gerçek sonuçlar.',
  alinti: 'Çünkü iyi içerik sadece izlenmez, iz bırakır.',
} as const;

export const NEDENLER: { baslik: string; aciklama: string }[] = [
  {
    baslik: 'Tek çatı altında',
    aciklama:
      'Çekim, tasarım, reklam, web sitesi ve QR menü aynı ekipte. Beş farklı firmayla uğraşmazsınız; tek plan, tek muhatap.',
  },
  {
    baslik: 'Profesyonel ekipman & drone',
    aciklama: 'Profesyonel kamera ve drone ile çekim yapar, markanızı en iyi açısından gösteririz.',
  },
  {
    baslik: 'Veriyle yönetim',
    aciklama: 'Neyin işe yaradığına düzenli olarak bakar, planı tahmine değil verilere göre güncelleriz.',
  },
  {
    baslik: 'Hızlı iletişim',
    aciklama: 'Instagram ve WhatsApp üzerinden doğrudan ekiple konuşursunuz; aracı yok, bekleme yok.',
  },
];

/** Sitede WhatsApp numarası yoksa "Hızlı iletişim" kartında bu yazar. */
export const HIZLI_ILETISIM_YALNIZ_INSTAGRAM =
  'Instagram DM’den doğrudan ekiple konuşursunuz; aracı yok, bekleme yok.';

export const NEDEN_KONUM = {
  baslik: 'İstanbul / 4.Levent',
  aciklama: 'Merkezimiz 4.Levent’te; çekimler için İstanbul genelinde yanınızdayız.',
} as const;

/* ------------------------------------------------------------------ */
/* Sık sorulan sorular                                                 */
/* ------------------------------------------------------------------ */

export const SSS_BOLUMU = {
  ustEtiket: 'Sık sorulan sorular',
  baslik: 'Aklınızdaki sorular.',
  aciklama: 'Burada cevabını bulamadığınız her şeyi bize doğrudan sorabilirsiniz.',
  cta: 'Bize sorun',
} as const;

export const SSS: { soru: string; cevap: string }[] = [
  {
    soru: 'Ücretsiz dijital analiz nedir?',
    cevap:
      'Instagram hesabınıza, web sitenize ve Google İşletme Profilinize bakıyoruz. Neyin eksik olduğunu ve neyin hızlıca iyileşebileceğini net bir listeyle paylaşıyoruz. Ücretsizdir ve sizi hiçbir şeye bağlamaz.',
  },
  {
    soru: 'Sözleşme süresi ne kadar?',
    cevap:
      'Sabit bir kalıbımız yok; ihtiyaca göre esnek paketler hazırlıyoruz. Kapsamı ve süreyi analizden sonra sizinle birlikte belirliyoruz.',
  },
  {
    soru: 'Çekimler nerede yapılıyor?',
    cevap:
      'İstanbul genelinde, çoğunlukla sizin mekânınızda çekim yapıyoruz. Merkezimiz 4.Levent’te.',
  },
  {
    soru: 'Reklam bütçesi fiyata dahil mi?',
    cevap:
      'Hayır, reklam bütçesi ayrıdır ve doğrudan reklam platformuna ödenir. Kampanyaların kurulumunu, takibini ve optimizasyonunu biz yapıyoruz.',
  },
  {
    soru: 'Ne zaman başlarız?',
    cevap:
      'Analizden sonra hızlıca bir plan çıkarıyor ve onayınızla birlikte çalışmaya başlıyoruz.',
  },
  {
    soru: 'Yalnızca tek bir hizmet alabilir miyim?',
    cevap:
      'Elbette. Yalnızca QR menü, yalnızca web sitesi ya da yalnızca çekim gibi tek bir hizmetle de çalışabiliriz.',
  },
  {
    soru: 'Hangi sektörlerle çalışıyorsunuz?',
    cevap:
      'Kafe ve restoranlardan diş kliniğine, otomotivden go-kart pistine ve çocuk futbol ligine kadar farklı sektörlerden markalarla çalıştık. Her sektörün diline göre içerik üretiyoruz.',
  },
];

/* ------------------------------------------------------------------ */
/* Son çağrı & alt bilgi                                               */
/* ------------------------------------------------------------------ */

export const SON_CTA = {
  ustEtiket: 'Ücretsiz analiz için DM',
  baslik: 'Markanızı büyütmeye hazır mısınız?',
  aciklama:
    'Instagram hesabınıza, web sitenize ve Google profilinize bakalım; neyin eksik olduğunu açıkça söyleyelim. Ücretsiz ve bağlayıcı değil.',
  instagramCta: 'Instagram’dan DM gönder',
  whatsappCta: 'WhatsApp’tan yaz',
  analizCta: 'Ücretsiz analiz iste',
  rozet: 'Ücretsiz analiz • Hızlı dönüş • ',
  maddeler: ['Instagram profili', 'Web sitesi', 'Google İşletme Profili'],
} as const;

export const ALT_BILGI = {
  slogan: 'Fikirler hareket kazanır.',
  aciklama: 'Sosyal medya yönetimi, içerik prodüksiyonu, reklam, web ve QR menü; tek çatı altında.',
} as const;

export const ALT_CTA_BAR = {
  instagram: 'Instagram DM',
  instagramTek: 'Ücretsiz analiz için DM',
  whatsapp: 'WhatsApp',
} as const;

/* ------------------------------------------------------------------ */
/* Hazır mesajlar                                                      */
/* ------------------------------------------------------------------ */

export const WHATSAPP_MESAJI = {
  kisisel: (ad: string) => `Merhaba, ${ad} için hazırladığınız sunumu inceledim, görüşmek isterim.`,
  genel: 'Merhaba, Ajans Flow hizmetleri hakkında bilgi almak istiyorum.',
} as const;
