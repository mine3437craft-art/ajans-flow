/**
 * /demo/qr-menu — ÖRNEK menü verisi.
 *
 * Bu dosyadaki işletme, ürün, fiyat ve kalori değerlerinin hiçbiri gerçek
 * değildir; hiçbir müşterimize ait veri içermez. Demo, kurduğumuz menü
 * sisteminin nasıl çalıştığını göstermek için vardır.
 *
 * Veri düzeni gerçek kurulumlardaki düzenin aynısı:
 *   - metin alanları dil başına ayrı tutulur (Türkçe esas, diğerleri üzerine eklenir),
 *   - diyet filtreleri elle işaretlenmez; alerjen ve hayvansal kaynak
 *     listesinden HESAPLANIR (bkz. diyetleri()),
 *   - alerjen anahtarları TGK Gıda Etiketleme Yönetmeliği'ndeki 14 başlıkla aynı.
 */

/* ================================================================== */
/* Diller                                                              */
/* ================================================================== */

export type DemoDil = 'tr' | 'en' | 'de' | 'ar';

export const DILLER: readonly { kod: DemoDil; ad: string; kisa: string; rtl: boolean }[] = [
  { kod: 'tr', ad: 'Türkçe', kisa: 'TR', rtl: false },
  { kod: 'en', ad: 'English', kisa: 'EN', rtl: false },
  { kod: 'de', ad: 'Deutsch', kisa: 'DE', rtl: false },
  { kod: 'ar', ad: 'العربية', kisa: 'AR', rtl: true },
];

/** Bir metnin dört dildeki karşılığı. */
export type Cok = Record<DemoDil, string>;

export function rtlMi(dil: DemoDil): boolean {
  return DILLER.find((d) => d.kod === dil)?.rtl ?? false;
}

/* ================================================================== */
/* Alerjenler — TGK Yönetmeliği m.15/5'teki 14 başlık                  */
/* ================================================================== */

export type Alerjen =
  | 'gluten'
  | 'kabuklu'
  | 'yumurta'
  | 'balik'
  | 'yer_fistigi'
  | 'soya'
  | 'sut'
  | 'kuruyemis'
  | 'kereviz'
  | 'hardal'
  | 'susam'
  | 'sulfit'
  | 'acibakla'
  | 'yumusakca';

export const ALERJEN_ADLARI: Record<Alerjen, Cok> = {
  gluten: { tr: 'Gluten içeren tahıllar', en: 'Cereals containing gluten', de: 'Glutenhaltiges Getreide', ar: 'حبوب تحتوي على الغلوتين' },
  kabuklu: { tr: 'Kabuklular', en: 'Crustaceans', de: 'Krebstiere', ar: 'القشريات' },
  yumurta: { tr: 'Yumurta', en: 'Eggs', de: 'Eier', ar: 'البيض' },
  balik: { tr: 'Balık', en: 'Fish', de: 'Fisch', ar: 'الأسماك' },
  yer_fistigi: { tr: 'Yer fıstığı', en: 'Peanuts', de: 'Erdnüsse', ar: 'الفول السوداني' },
  soya: { tr: 'Soya fasulyesi', en: 'Soybeans', de: 'Sojabohnen', ar: 'الصويا' },
  sut: { tr: 'Süt', en: 'Milk', de: 'Milch', ar: 'الحليب' },
  kuruyemis: { tr: 'Sert kabuklu meyveler', en: 'Tree nuts', de: 'Schalenfrüchte', ar: 'المكسرات' },
  kereviz: { tr: 'Kereviz', en: 'Celery', de: 'Sellerie', ar: 'الكرفس' },
  hardal: { tr: 'Hardal', en: 'Mustard', de: 'Senf', ar: 'الخردل' },
  susam: { tr: 'Susam tohumu', en: 'Sesame seeds', de: 'Sesamsamen', ar: 'بذور السمسم' },
  sulfit: { tr: 'Kükürt dioksit ve sülfitler', en: 'Sulphur dioxide and sulphites', de: 'Schwefeldioxid und Sulfite', ar: 'ثاني أكسيد الكبريت والسلفيت' },
  acibakla: { tr: 'Acı bakla', en: 'Lupin', de: 'Lupinen', ar: 'الترمس' },
  yumusakca: { tr: 'Yumuşakçalar', en: 'Molluscs', de: 'Weichtiere', ar: 'الرخويات' },
};

/** Vegan hesabı için hayvansal kaynak işaretleri. */
export type HayvansalKaynak = 'et' | 'sut' | 'yumurta' | 'balik' | 'bal';

/* ================================================================== */
/* Malzeme sözlüğü — çeviri tek yerde durur, ürünler anahtarla bağlanır */
/* ================================================================== */

export const MALZEMELER = {
  avokado: { tr: 'avokado', en: 'avocado', de: 'Avocado', ar: 'أفوكادو' },
  bal: { tr: 'bal', en: 'honey', de: 'Honig', ar: 'عسل' },
  baharat: { tr: 'baharat karışımı', en: 'spice mix', de: 'Gewürzmischung', ar: 'خلطة بهارات' },
  beyaz_peynir: { tr: 'beyaz peynir', en: 'white cheese', de: 'Weißkäse', ar: 'جبنة بيضاء' },
  biber: { tr: 'biber', en: 'pepper', de: 'Paprika', ar: 'فلفل' },
  bugday_unu: { tr: 'buğday unu', en: 'wheat flour', de: 'Weizenmehl', ar: 'دقيق القمح' },
  burger_ekmegi: { tr: 'burger ekmeği', en: 'burger bun', de: 'Burgerbrötchen', ar: 'خبز البرغر' },
  ceviz: { tr: 'ceviz', en: 'walnut', de: 'Walnuss', ar: 'جوز' },
  cheddar: { tr: 'cheddar peyniri', en: 'cheddar cheese', de: 'Cheddar-Käse', ar: 'جبنة شيدر' },
  cikolata: { tr: 'çikolata', en: 'chocolate', de: 'Schokolade', ar: 'شوكولاتة' },
  dana_kiyma: { tr: 'dana kıyma', en: 'minced beef', de: 'Rinderhackfleisch', ar: 'لحم بقري مفروم' },
  domates: { tr: 'domates', en: 'tomato', de: 'Tomate', ar: 'طماطم' },
  ekmek: { tr: 'ekmek', en: 'bread', de: 'Brot', ar: 'خبز' },
  eksi_maya_ekmegi: { tr: 'ekşi maya ekmeği', en: 'sourdough bread', de: 'Sauerteigbrot', ar: 'خبز بالخميرة الطبيعية' },
  findik: { tr: 'fındık', en: 'hazelnut', de: 'Haselnuss', ar: 'بندق' },
  galeta_unu: { tr: 'galeta unu', en: 'breadcrumbs', de: 'Semmelbrösel', ar: 'بقسماط' },
  hardal: { tr: 'hardal', en: 'mustard', de: 'Senf', ar: 'خردل' },
  havuc: { tr: 'havuç', en: 'carrot', de: 'Karotte', ar: 'جزر' },
  kabak: { tr: 'kabak', en: 'courgette', de: 'Zucchini', ar: 'كوسا' },
  kahve: { tr: 'kahve', en: 'coffee', de: 'Kaffee', ar: 'قهوة' },
  kakao: { tr: 'kakao', en: 'cocoa', de: 'Kakao', ar: 'كاكاو' },
  kasar: { tr: 'kaşar peyniri', en: 'kasar cheese', de: 'Kaşar-Käse', ar: 'جبنة قشقوان' },
  keci_peyniri: { tr: 'keçi peyniri', en: 'goat cheese', de: 'Ziegenkäse', ar: 'جبنة ماعز' },
  kedidili: { tr: 'kedidili bisküvi', en: 'ladyfinger biscuit', de: 'Löffelbiskuit', ar: 'بسكويت الأصابع' },
  kirmizi_mercimek: { tr: 'kırmızı mercimek', en: 'red lentils', de: 'rote Linsen', ar: 'عدس أحمر' },
  kruton: { tr: 'kruton', en: 'croutons', de: 'Croutons', ar: 'خبز محمص' },
  levrek: { tr: 'levrek', en: 'sea bass', de: 'Wolfsbarsch', ar: 'سمك القاروص' },
  limon: { tr: 'limon', en: 'lemon', de: 'Zitrone', ar: 'ليمون' },
  mantar: { tr: 'mantar', en: 'mushroom', de: 'Pilze', ar: 'مشروم' },
  marul: { tr: 'marul', en: 'lettuce', de: 'Römersalat', ar: 'خس' },
  mascarpone: { tr: 'mascarpone', en: 'mascarpone', de: 'Mascarpone', ar: 'ماسكربوني' },
  maydanoz: { tr: 'maydanoz', en: 'parsley', de: 'Petersilie', ar: 'بقدونس' },
  nane: { tr: 'nane', en: 'mint', de: 'Minze', ar: 'نعنع' },
  nar_eksisi: { tr: 'nar ekşisi', en: 'pomegranate molasses', de: 'Granatapfelsirup', ar: 'دبس الرمان' },
  nohut: { tr: 'nohut', en: 'chickpeas', de: 'Kichererbsen', ar: 'حمص' },
  parmesan: { tr: 'parmesan', en: 'parmesan', de: 'Parmesan', ar: 'بارميزان' },
  patlican: { tr: 'patlıcan', en: 'aubergine', de: 'Aubergine', ar: 'باذنجان' },
  pirinc: { tr: 'pirinç', en: 'rice', de: 'Reis', ar: 'أرز' },
  pul_biber: { tr: 'pul biber', en: 'chilli flakes', de: 'Chiliflocken', ar: 'فلفل أحمر مجروش' },
  recel: { tr: 'reçel', en: 'jam', de: 'Marmelade', ar: 'مربى' },
  roka: { tr: 'roka', en: 'rocket', de: 'Rucola', ar: 'جرجير' },
  salatalik: { tr: 'salatalık', en: 'cucumber', de: 'Gurke', ar: 'خيار' },
  sarimsak: { tr: 'sarımsak', en: 'garlic', de: 'Knoblauch', ar: 'ثوم' },
  seker: { tr: 'şeker', en: 'sugar', de: 'Zucker', ar: 'سكر' },
  sogan: { tr: 'soğan', en: 'onion', de: 'Zwiebel', ar: 'بصل' },
  su: { tr: 'su', en: 'water', de: 'Wasser', ar: 'ماء' },
  susam: { tr: 'susam', en: 'sesame', de: 'Sesam', ar: 'سمسم' },
  sut: { tr: 'süt', en: 'milk', de: 'Milch', ar: 'حليب' },
  tahin: { tr: 'tahin', en: 'tahini', de: 'Tahini', ar: 'طحينة' },
  tavuk: { tr: 'tavuk', en: 'chicken', de: 'Hähnchen', ar: 'دجاج' },
  tereyagi: { tr: 'tereyağı', en: 'butter', de: 'Butter', ar: 'زبدة' },
  tortilla: { tr: 'tortilla', en: 'tortilla', de: 'Tortilla', ar: 'خبز التورتيلا' },
  tursu: { tr: 'turşu', en: 'pickles', de: 'Essiggurken', ar: 'مخلل' },
  vanilya: { tr: 'vanilya', en: 'vanilla', de: 'Vanille', ar: 'فانيلا' },
  yumurta: { tr: 'yumurta', en: 'egg', de: 'Ei', ar: 'بيض' },
  zeytin: { tr: 'zeytin', en: 'olives', de: 'Oliven', ar: 'زيتون' },
  zeytinyagi: { tr: 'zeytinyağı', en: 'olive oil', de: 'Olivenöl', ar: 'زيت زيتون' },
} satisfies Record<string, Cok>;

export type MalzemeAnahtari = keyof typeof MALZEMELER;

/* ================================================================== */
/* Kategoriler ve ürünler                                              */
/* ================================================================== */

export type KategoriAnahtari = 'kahvalti' | 'baslangic' | 'ana' | 'tatli' | 'icecek';

export const KATEGORILER: readonly { anahtar: KategoriAnahtari; ad: Cok }[] = [
  { anahtar: 'kahvalti', ad: { tr: 'Kahvaltı', en: 'Breakfast', de: 'Frühstück', ar: 'الفطور' } },
  { anahtar: 'baslangic', ad: { tr: 'Başlangıçlar', en: 'Starters', de: 'Vorspeisen', ar: 'المقبلات' } },
  { anahtar: 'ana', ad: { tr: 'Ana yemekler', en: 'Main courses', de: 'Hauptgerichte', ar: 'الأطباق الرئيسية' } },
  { anahtar: 'tatli', ad: { tr: 'Tatlılar', en: 'Desserts', de: 'Desserts', ar: 'الحلويات' } },
  { anahtar: 'icecek', ad: { tr: 'İçecekler', en: 'Drinks', de: 'Getränke', ar: 'المشروبات' } },
];

export type DemoUrun = {
  id: string;
  kategori: KategoriAnahtari;
  ad: Cok;
  aciklama: Cok;
  /** ÖRNEK fiyat, Türk Lirası. Gerçek bir işletmenin fiyatı değildir. */
  fiyat: number;
  /** ÖRNEK enerji değeri, kcal. */
  enerji: number;
  icindekiler: readonly MalzemeAnahtari[];
  alerjenler: readonly Alerjen[];
  hayvansal: readonly HayvansalKaynak[];
};

export const URUNLER: readonly DemoUrun[] = [
  /* ---------------- Kahvaltı ---------------- */
  {
    id: 'serpme-kahvalti',
    kategori: 'kahvalti',
    ad: { tr: 'Serpme kahvaltı', en: 'Turkish breakfast platter', de: 'Türkische Frühstücksplatte', ar: 'فطور تركي مشكّل' },
    aciklama: {
      tr: 'Peynir çeşitleri, zeytin, bal, reçel, domates ve salatalıkla gelen tabak; sıcak ekmekle servis edilir.',
      en: 'A platter of cheeses, olives, honey, jam, tomato and cucumber, served with warm bread.',
      de: 'Platte mit Käsesorten, Oliven, Honig, Marmelade, Tomate und Gurke, serviert mit warmem Brot.',
      ar: 'طبق يضم أنواع الجبن والزيتون والعسل والمربى والطماطم والخيار، يُقدّم مع خبز ساخن.',
    },
    fiyat: 320,
    enerji: 720,
    icindekiler: ['beyaz_peynir', 'kasar', 'zeytin', 'bal', 'recel', 'domates', 'salatalik', 'ekmek'],
    alerjenler: ['gluten', 'sut'],
    hayvansal: ['sut', 'bal'],
  },
  {
    id: 'menemen',
    kategori: 'kahvalti',
    ad: { tr: 'Menemen', en: 'Menemen — eggs with tomato and pepper', de: 'Menemen — Eier mit Tomate und Paprika', ar: 'منمن — بيض بالطماطم والفلفل' },
    aciklama: {
      tr: 'Tavada domates ve biberle pişirilen yumurta; yanında ekmek.',
      en: 'Eggs cooked in a pan with tomato and pepper, served with bread.',
      de: 'In der Pfanne mit Tomate und Paprika gegarte Eier, mit Brot serviert.',
      ar: 'بيض مطهو في المقلاة مع الطماطم والفلفل، يُقدّم مع الخبز.',
    },
    fiyat: 190,
    enerji: 430,
    icindekiler: ['yumurta', 'domates', 'biber', 'tereyagi', 'zeytinyagi', 'ekmek'],
    alerjenler: ['yumurta', 'sut', 'gluten'],
    hayvansal: ['yumurta', 'sut'],
  },
  {
    id: 'avokadolu-tost',
    kategori: 'kahvalti',
    ad: { tr: 'Avokadolu tost', en: 'Avocado toast', de: 'Avocado-Toast', ar: 'توست بالأفوكادو' },
    aciklama: {
      tr: 'Ekşi maya ekmeği üzerinde limonlu avokado, susam ve pul biber.',
      en: 'Lemony avocado on sourdough bread with sesame and chilli flakes.',
      de: 'Zitronige Avocado auf Sauerteigbrot mit Sesam und Chiliflocken.',
      ar: 'أفوكادو بالليمون على خبز الخميرة الطبيعية مع السمسم والفلفل المجروش.',
    },
    fiyat: 180,
    enerji: 380,
    icindekiler: ['eksi_maya_ekmegi', 'avokado', 'limon', 'susam', 'pul_biber', 'zeytinyagi'],
    alerjenler: ['gluten', 'susam'],
    hayvansal: [],
  },

  /* ---------------- Başlangıçlar ---------------- */
  {
    id: 'mercimek-corbasi',
    kategori: 'baslangic',
    ad: { tr: 'Mercimek çorbası', en: 'Red lentil soup', de: 'Rote Linsensuppe', ar: 'شوربة العدس الأحمر' },
    aciklama: {
      tr: 'Kırmızı mercimek, soğan ve havuçla pişirilen çorba; limonla servis edilir.',
      en: 'A soup of red lentils, onion and carrot, served with lemon.',
      de: 'Suppe aus roten Linsen, Zwiebel und Karotte, mit Zitrone serviert.',
      ar: 'شوربة من العدس الأحمر والبصل والجزر، تُقدّم مع الليمون.',
    },
    fiyat: 95,
    enerji: 240,
    icindekiler: ['kirmizi_mercimek', 'sogan', 'havuc', 'zeytinyagi', 'limon'],
    alerjenler: [],
    hayvansal: [],
  },
  {
    id: 'humus',
    kategori: 'baslangic',
    ad: { tr: 'Humus', en: 'Hummus', de: 'Hummus', ar: 'حمص بالطحينة' },
    aciklama: {
      tr: 'Nohut ve tahinden yapılan, zeytinyağı ve limonla sunulan meze.',
      en: 'A chickpea and tahini dip served with olive oil and lemon.',
      de: 'Dip aus Kichererbsen und Tahini, serviert mit Olivenöl und Zitrone.',
      ar: 'مقبّلات من الحمص والطحينة تُقدّم مع زيت الزيتون والليمون.',
    },
    fiyat: 120,
    enerji: 290,
    icindekiler: ['nohut', 'tahin', 'limon', 'sarimsak', 'zeytinyagi'],
    alerjenler: ['susam'],
    hayvansal: [],
  },
  {
    id: 'sezar-salata',
    kategori: 'baslangic',
    ad: { tr: 'Sezar salata', en: 'Caesar salad', de: 'Caesar Salat', ar: 'سلطة سيزر' },
    aciklama: {
      tr: 'Marul, ızgara tavuk, parmesan ve kruton; hardallı sezar sosuyla.',
      en: 'Lettuce, grilled chicken, parmesan and croutons with a mustard Caesar dressing.',
      de: 'Römersalat, gegrilltes Hähnchen, Parmesan und Croutons mit Senf-Caesar-Dressing.',
      ar: 'خس ودجاج مشوي وبارميزان وخبز محمص مع صوص سيزر بالخردل.',
    },
    fiyat: 215,
    enerji: 520,
    icindekiler: ['marul', 'tavuk', 'parmesan', 'kruton', 'yumurta', 'hardal', 'limon'],
    alerjenler: ['gluten', 'sut', 'yumurta', 'hardal'],
    hayvansal: ['et', 'sut', 'yumurta'],
  },
  {
    id: 'cevizli-roka-salatasi',
    kategori: 'baslangic',
    ad: { tr: 'Cevizli roka salatası', en: 'Rocket salad with walnuts', de: 'Rucolasalat mit Walnüssen', ar: 'سلطة الجرجير بالجوز' },
    aciklama: {
      tr: 'Roka, ceviz ve keçi peyniri; nar ekşisi ve zeytinyağıyla.',
      en: 'Rocket, walnuts and goat cheese with pomegranate molasses and olive oil.',
      de: 'Rucola, Walnüsse und Ziegenkäse mit Granatapfelsirup und Olivenöl.',
      ar: 'جرجير وجوز وجبنة ماعز مع دبس الرمان وزيت الزيتون.',
    },
    fiyat: 165,
    enerji: 350,
    icindekiler: ['roka', 'ceviz', 'keci_peyniri', 'nar_eksisi', 'zeytinyagi'],
    alerjenler: ['kuruyemis', 'sut'],
    hayvansal: ['sut'],
  },

  /* ---------------- Ana yemekler ---------------- */
  {
    id: 'izgara-kofte',
    kategori: 'ana',
    ad: { tr: 'Izgara köfte', en: 'Grilled meatballs', de: 'Gegrillte Hackbällchen', ar: 'كفتة مشوية' },
    aciklama: {
      tr: 'Dana kıymasından yapılan köfte; pirinç pilavı ve ızgara biberle.',
      en: 'Beef meatballs served with rice pilaf and grilled pepper.',
      de: 'Rindfleischbällchen mit Reispilaw und gegrillter Paprika.',
      ar: 'كفتة من اللحم البقري تُقدّم مع الأرز والفلفل المشوي.',
    },
    fiyat: 285,
    enerji: 680,
    icindekiler: ['dana_kiyma', 'sogan', 'maydanoz', 'galeta_unu', 'pirinc', 'biber'],
    alerjenler: ['gluten'],
    hayvansal: ['et'],
  },
  {
    id: 'tavuk-fajita',
    kategori: 'ana',
    ad: { tr: 'Tavuk fajita', en: 'Chicken fajita', de: 'Hähnchen-Fajita', ar: 'فاهيتا الدجاج' },
    aciklama: {
      tr: 'Baharatlı tavuk, soğan ve renkli biberler; sıcak tortilla ile.',
      en: 'Spiced chicken, onion and peppers with warm tortillas.',
      de: 'Gewürztes Hähnchen, Zwiebel und Paprika mit warmen Tortillas.',
      ar: 'دجاج بالبهارات مع البصل والفلفل، يُقدّم مع خبز التورتيلا الساخن.',
    },
    fiyat: 295,
    enerji: 640,
    icindekiler: ['tavuk', 'sogan', 'biber', 'tortilla', 'baharat', 'zeytinyagi'],
    alerjenler: ['gluten'],
    hayvansal: ['et'],
  },
  {
    id: 'izgara-levrek',
    kategori: 'ana',
    ad: { tr: 'Izgara levrek', en: 'Grilled sea bass', de: 'Gegrillter Wolfsbarsch', ar: 'سمك القاروص المشوي' },
    aciklama: {
      tr: 'Izgarada pişen levrek; limon ve roka ile.',
      en: 'Sea bass from the grill with lemon and rocket.',
      de: 'Wolfsbarsch vom Grill mit Zitrone und Rucola.',
      ar: 'سمك القاروص المشوي مع الليمون والجرجير.',
    },
    fiyat: 390,
    enerji: 410,
    icindekiler: ['levrek', 'limon', 'zeytinyagi', 'roka'],
    alerjenler: ['balik'],
    hayvansal: ['balik'],
  },
  {
    id: 'mantarli-risotto',
    kategori: 'ana',
    ad: { tr: 'Mantarlı risotto', en: 'Mushroom risotto', de: 'Pilzrisotto', ar: 'ريزوتو المشروم' },
    aciklama: {
      tr: 'Tereyağı ve parmesanla pişirilen pirinç; sotelenmiş mantarla.',
      en: 'Rice cooked with butter and parmesan, with sautéed mushrooms.',
      de: 'Mit Butter und Parmesan gekochter Reis mit sautierten Pilzen.',
      ar: 'أرز مطهو بالزبدة والبارميزان مع المشروم السوتيه.',
    },
    fiyat: 265,
    enerji: 560,
    icindekiler: ['pirinc', 'mantar', 'sogan', 'tereyagi', 'parmesan'],
    alerjenler: ['sut'],
    hayvansal: ['sut'],
  },
  {
    id: 'nohutlu-sebze-guvec',
    kategori: 'ana',
    ad: { tr: 'Nohutlu sebze güveç', en: 'Vegetable and chickpea casserole', de: 'Gemüse-Kichererbsen-Auflauf', ar: 'يخنة الخضار بالحمص' },
    aciklama: {
      tr: 'Patlıcan, kabak ve domatesle fırında pişen nohutlu güveç.',
      en: 'Aubergine, courgette and tomato baked in the oven with chickpeas.',
      de: 'Aubergine, Zucchini und Tomate mit Kichererbsen im Ofen gegart.',
      ar: 'باذنجان وكوسا وطماطم مع الحمص في الفرن.',
    },
    fiyat: 215,
    enerji: 390,
    icindekiler: ['nohut', 'patlican', 'kabak', 'domates', 'sarimsak', 'zeytinyagi'],
    alerjenler: [],
    hayvansal: [],
  },
  {
    id: 'cheese-burger',
    kategori: 'ana',
    ad: { tr: 'Cheese burger', en: 'Cheeseburger', de: 'Cheeseburger', ar: 'تشيز برغر' },
    aciklama: {
      tr: 'Dana köftesi, cheddar, turşu ve hardal sosu; susamlı ekmekte.',
      en: 'Beef patty, cheddar, pickles and mustard sauce in a sesame bun.',
      de: 'Rindfleisch-Patty, Cheddar, Essiggurken und Senfsauce im Sesambrötchen.',
      ar: 'قرص لحم بقري وشيدر ومخلل وصوص الخردل في خبز بالسمسم.',
    },
    fiyat: 275,
    enerji: 820,
    icindekiler: ['dana_kiyma', 'cheddar', 'tursu', 'hardal', 'burger_ekmegi', 'susam'],
    alerjenler: ['gluten', 'sut', 'hardal', 'susam'],
    hayvansal: ['et', 'sut'],
  },

  /* ---------------- Tatlılar ---------------- */
  {
    id: 'tiramisu',
    kategori: 'tatli',
    ad: { tr: 'Tiramisu', en: 'Tiramisu', de: 'Tiramisu', ar: 'تيراميسو' },
    aciklama: {
      tr: 'Kahveye batırılmış kedidili bisküvi, mascarpone kreması ve kakao.',
      en: 'Coffee-soaked ladyfingers with mascarpone cream and cocoa.',
      de: 'In Kaffee getränkte Löffelbiskuits mit Mascarponecreme und Kakao.',
      ar: 'بسكويت الأصابع المنقوع بالقهوة مع كريمة الماسكربوني والكاكاو.',
    },
    fiyat: 150,
    enerji: 450,
    icindekiler: ['kedidili', 'mascarpone', 'yumurta', 'kahve', 'kakao', 'seker'],
    alerjenler: ['gluten', 'sut', 'yumurta'],
    hayvansal: ['sut', 'yumurta'],
  },
  {
    id: 'findikli-brownie',
    kategori: 'tatli',
    ad: { tr: 'Fındıklı brownie', en: 'Hazelnut brownie', de: 'Haselnuss-Brownie', ar: 'براوني بالبندق' },
    aciklama: {
      tr: 'Yoğun çikolatalı kek ve fındık parçaları.',
      en: 'A dense chocolate cake with pieces of hazelnut.',
      de: 'Dichter Schokoladenkuchen mit Haselnussstückchen.',
      ar: 'كيكة شوكولاتة كثيفة مع قطع البندق.',
    },
    fiyat: 140,
    enerji: 510,
    icindekiler: ['cikolata', 'findik', 'yumurta', 'tereyagi', 'bugday_unu', 'seker'],
    alerjenler: ['gluten', 'sut', 'yumurta', 'kuruyemis'],
    hayvansal: ['sut', 'yumurta'],
  },
  {
    id: 'sutlac',
    kategori: 'tatli',
    ad: { tr: 'Sütlaç', en: 'Baked rice pudding', de: 'Gebackener Milchreis', ar: 'أرز بالحليب' },
    aciklama: {
      tr: 'Fırınlanmış pirinç sütlacı; vanilyalı.',
      en: 'Baked rice pudding with vanilla.',
      de: 'Gebackener Milchreis mit Vanille.',
      ar: 'أرز بالحليب مخبوز بالفانيلا.',
    },
    fiyat: 110,
    enerji: 330,
    icindekiler: ['pirinc', 'sut', 'seker', 'vanilya'],
    alerjenler: ['sut'],
    hayvansal: ['sut'],
  },

  /* ---------------- İçecekler ---------------- */
  {
    id: 'turk-kahvesi',
    kategori: 'icecek',
    ad: { tr: 'Türk kahvesi', en: 'Turkish coffee', de: 'Türkischer Kaffee', ar: 'قهوة تركية' },
    aciklama: {
      tr: 'Cezvede pişirilen kahve; şekerli ya da şekersiz.',
      en: 'Coffee brewed in a cezve, with or without sugar.',
      de: 'Im Cezve gebrühter Kaffee, mit oder ohne Zucker.',
      ar: 'قهوة محضّرة في الرَكوة، مع السكر أو بدونه.',
    },
    fiyat: 70,
    enerji: 15,
    icindekiler: ['kahve', 'su', 'seker'],
    alerjenler: [],
    hayvansal: [],
  },
  {
    id: 'frozen-limonata',
    kategori: 'icecek',
    ad: { tr: 'Frozen limonata', en: 'Frozen lemonade', de: 'Frozen-Limonade', ar: 'ليموناضة مثلجة' },
    aciklama: {
      tr: 'Limon, nane ve buzla hazırlanan soğuk içecek.',
      en: 'A cold drink made with lemon, mint and ice.',
      de: 'Kaltes Getränk aus Zitrone, Minze und Eis.',
      ar: 'مشروب بارد من الليمون والنعنع والثلج.',
    },
    fiyat: 85,
    enerji: 160,
    icindekiler: ['limon', 'nane', 'seker', 'su'],
    alerjenler: [],
    hayvansal: [],
  },
];

/* ================================================================== */
/* Diyet filtreleri — rozet DEĞİL, veriden hesaplanır                  */
/* ================================================================== */

export type DiyetFiltre = 'vegan' | 'glutensiz' | 'kuruyemissiz';

export const DIYET_FILTRELERI: readonly DiyetFiltre[] = ['vegan', 'glutensiz', 'kuruyemissiz'];

/** Ürünün hangi diyet filtrelerine uyduğunu alerjen ve kaynak listesinden çıkarır. */
export function diyetleri(u: DemoUrun): DiyetFiltre[] {
  const sonuc: DiyetFiltre[] = [];
  if (u.hayvansal.length === 0) sonuc.push('vegan');
  if (!u.alerjenler.includes('gluten')) sonuc.push('glutensiz');
  if (!u.alerjenler.includes('kuruyemis') && !u.alerjenler.includes('yer_fistigi')) sonuc.push('kuruyemissiz');
  return sonuc;
}

/* ================================================================== */
/* Arama — Türkçe büyük/küçük ve aksan farkını yok sayar               */
/* ================================================================== */

export function sadelestir(metin: string): string {
  return metin
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** Ürün, seçilen kategori + arama metni + diyet filtrelerinden geçiyor mu? */
export function urunGecer(
  u: DemoUrun,
  dil: DemoDil,
  kategori: KategoriAnahtari | 'tumu',
  arama: string,
  filtreler: readonly DiyetFiltre[],
): boolean {
  if (kategori !== 'tumu' && u.kategori !== kategori) return false;

  if (filtreler.length) {
    const sahip = diyetleri(u);
    if (!filtreler.every((f) => sahip.includes(f))) return false;
  }

  const q = sadelestir(arama.trim());
  if (!q) return true;

  const havuz = [
    u.ad[dil],
    u.aciklama[dil],
    ...u.icindekiler.map((m) => MALZEMELER[m][dil]),
    ...u.alerjenler.map((a) => ALERJEN_ADLARI[a][dil]),
  ].map(sadelestir);

  return havuz.some((h) => h.includes(q));
}

/** Örnek fiyatı Türk Lirası biçiminde yazar (mevzuat: TL / ₺ zorunlu). */
export function fiyatYaz(tutar: number): string {
  return `${tutar.toLocaleString('tr-TR')} ₺`;
}

/* ================================================================== */
/* Arayüz metinleri                                                    */
/* ================================================================== */

const TR = {
  marka: 'Örnek Kafe',
  markaNot: 'Demo menü · Ajans Flow',
  demoSerit: 'Demo — sipariş iletilmez, fiyatlar örnektir.',
  dilSecimi: 'Dil',
  aramaEtiketi: 'Menüde ara',
  aramaYerTutucu: 'Ürün, içindekiler, alerjen…',
  aramaTemizle: 'Aramayı temizle',
  kategoriler: 'Kategoriler',
  tumu: 'Tümü',
  filtreBaslik: 'Diyet filtreleri',
  vegan: 'Vegan',
  glutensiz: 'Glutensiz',
  kuruyemissiz: 'Kuruyemişsiz',
  filtreTemizle: 'Filtreleri temizle',
  urunSayisi: 'ürün',
  sonucYok: 'Aramanıza ve filtrenize uygun ürün bulunamadı.',
  detayAc: 'İçindekiler ve alerjen',
  detayKapat: 'Detayı kapat',
  icindekiler: 'İçindekiler',
  alerjenler: 'Alerjen bilgisi',
  alerjenYok: 'Listelenen alerjenlerden hiçbirini içermiyor.',
  enerji: 'Enerji',
  ornek: 'örnek',
  fiyatNotu: 'Fiyatlar ve enerji değerleri örnektir; gerçek bir işletmeye ait değildir.',
  karekodNotu: 'Karekodu okuyamayan misafirlerimize bilgi ayrıca sunulur.',
  sekmeMenu: 'Menü',
  sekmeSiparis: 'Sipariş',
  sekmeRezervasyon: 'Rezervasyon',
  ekle: 'Ekle',
  artir: 'Bir adet artır',
  azalt: 'Bir adet azalt',
  adet: 'Adet',
  siparisBos: 'Sipariş listesi boş. Menüden ürün ekleyin.',
  toplam: 'Toplam',
  masaNo: 'Masa numarası',
  siparisNotu: 'Sipariş notu',
  siparisNotuYer: 'Örn. soğansız olsun',
  siparisGonder: 'Siparişi gönder',
  siparisSonuc: 'Demo: sipariş iletilmedi, hiçbir veri kaydedilmedi.',
  rezervasyonGiris: 'Masa talebinizi iletin; onay işletmeden gelir.',
  tarih: 'Tarih',
  saat: 'Saat',
  kisi: 'Kişi sayısı',
  isim: 'Ad soyad',
  telefon: 'Telefon',
  onay: 'Kişisel verilerimin rezervasyon talebi için işlenmesini kabul ediyorum.',
  rezGonder: 'Rezervasyon talebi gönder',
  rezSonuc: 'Demo: talep iletilmedi, hiçbir veri kaydedilmedi.',
  menuyeDon: 'Menüye dön',
  fotoNotu: 'Demo menüde ürün fotoğrafı yok; gerçek kurulumda fotoğraflar çekimden gelir.',
} as const;

export type MetinAnahtari = keyof typeof TR;

export const METINLER: Record<DemoDil, Record<MetinAnahtari, string>> = {
  tr: TR,
  en: {
    marka: 'Sample Café',
    markaNot: 'Demo menu · Ajans Flow',
    demoSerit: 'Demo — no order is sent, prices are samples.',
    dilSecimi: 'Language',
    aramaEtiketi: 'Search the menu',
    aramaYerTutucu: 'Dish, ingredient, allergen…',
    aramaTemizle: 'Clear search',
    kategoriler: 'Categories',
    tumu: 'All',
    filtreBaslik: 'Dietary filters',
    vegan: 'Vegan',
    glutensiz: 'Gluten-free',
    kuruyemissiz: 'Nut-free',
    filtreTemizle: 'Clear filters',
    urunSayisi: 'items',
    sonucYok: 'No dishes match your search and filters.',
    detayAc: 'Ingredients and allergens',
    detayKapat: 'Close details',
    icindekiler: 'Ingredients',
    alerjenler: 'Allergen information',
    alerjenYok: 'Contains none of the listed allergens.',
    enerji: 'Energy',
    ornek: 'sample',
    fiyatNotu: 'Prices and energy values are samples and do not belong to a real business.',
    karekodNotu: 'Guests who cannot read the QR code are given this information separately.',
    sekmeMenu: 'Menu',
    sekmeSiparis: 'Order',
    sekmeRezervasyon: 'Reservation',
    ekle: 'Add',
    artir: 'Add one',
    azalt: 'Remove one',
    adet: 'Qty',
    siparisBos: 'Your order is empty. Add dishes from the menu.',
    toplam: 'Total',
    masaNo: 'Table number',
    siparisNotu: 'Order note',
    siparisNotuYer: 'e.g. no onion, please',
    siparisGonder: 'Place order',
    siparisSonuc: 'Demo: no order was sent and no data was stored.',
    rezervasyonGiris: 'Send your table request; the venue confirms it.',
    tarih: 'Date',
    saat: 'Time',
    kisi: 'Number of guests',
    isim: 'Full name',
    telefon: 'Phone',
    onay: 'I agree to my personal data being processed for this reservation request.',
    rezGonder: 'Send reservation request',
    rezSonuc: 'Demo: no request was sent and no data was stored.',
    menuyeDon: 'Back to the menu',
    fotoNotu: 'This demo has no dish photos; in a real setup the photos come from the shoot.',
  },
  de: {
    marka: 'Beispiel-Café',
    markaNot: 'Demo-Menü · Ajans Flow',
    demoSerit: 'Demo — es wird keine Bestellung gesendet, Preise sind Beispiele.',
    dilSecimi: 'Sprache',
    aramaEtiketi: 'Menü durchsuchen',
    aramaYerTutucu: 'Gericht, Zutat, Allergen…',
    aramaTemizle: 'Suche löschen',
    kategoriler: 'Kategorien',
    tumu: 'Alle',
    filtreBaslik: 'Ernährungsfilter',
    vegan: 'Vegan',
    glutensiz: 'Glutenfrei',
    kuruyemissiz: 'Nussfrei',
    filtreTemizle: 'Filter löschen',
    urunSayisi: 'Gerichte',
    sonucYok: 'Keine Gerichte für diese Suche und diese Filter.',
    detayAc: 'Zutaten und Allergene',
    detayKapat: 'Details schließen',
    icindekiler: 'Zutaten',
    alerjenler: 'Allergeninformation',
    alerjenYok: 'Enthält keines der aufgeführten Allergene.',
    enerji: 'Energie',
    ornek: 'Beispiel',
    fiyatNotu: 'Preise und Energiewerte sind Beispiele und gehören zu keinem echten Betrieb.',
    karekodNotu: 'Gästen, die den QR-Code nicht lesen können, werden diese Angaben gesondert mitgeteilt.',
    sekmeMenu: 'Menü',
    sekmeSiparis: 'Bestellung',
    sekmeRezervasyon: 'Reservierung',
    ekle: 'Hinzufügen',
    artir: 'Eins mehr',
    azalt: 'Eins weniger',
    adet: 'Anzahl',
    siparisBos: 'Ihre Bestellung ist leer. Fügen Sie Gerichte aus dem Menü hinzu.',
    toplam: 'Gesamt',
    masaNo: 'Tischnummer',
    siparisNotu: 'Hinweis zur Bestellung',
    siparisNotuYer: 'z. B. bitte ohne Zwiebel',
    siparisGonder: 'Bestellung senden',
    siparisSonuc: 'Demo: Es wurde keine Bestellung gesendet und keine Daten gespeichert.',
    rezervasyonGiris: 'Senden Sie Ihre Tischanfrage; die Bestätigung kommt vom Betrieb.',
    tarih: 'Datum',
    saat: 'Uhrzeit',
    kisi: 'Personenanzahl',
    isim: 'Name',
    telefon: 'Telefon',
    onay: 'Ich stimme der Verarbeitung meiner Daten für diese Reservierungsanfrage zu.',
    rezGonder: 'Reservierungsanfrage senden',
    rezSonuc: 'Demo: Es wurde keine Anfrage gesendet und keine Daten gespeichert.',
    menuyeDon: 'Zurück zum Menü',
    fotoNotu: 'Diese Demo hat keine Gerichtsfotos; in einem echten Aufbau kommen sie vom Shooting.',
  },
  ar: {
    marka: 'مقهى نموذجي',
    markaNot: 'قائمة توضيحية · Ajans Flow',
    demoSerit: 'عرض توضيحي — لا يُرسل أي طلب، والأسعار نموذجية.',
    dilSecimi: 'اللغة',
    aramaEtiketi: 'ابحث في القائمة',
    aramaYerTutucu: 'طبق أو مكوّن أو مسبب حساسية…',
    aramaTemizle: 'مسح البحث',
    kategoriler: 'الفئات',
    tumu: 'الكل',
    filtreBaslik: 'مرشحات الحمية',
    vegan: 'نباتي صرف',
    glutensiz: 'خالٍ من الغلوتين',
    kuruyemissiz: 'خالٍ من المكسرات',
    filtreTemizle: 'مسح المرشحات',
    urunSayisi: 'طبق',
    sonucYok: 'لا توجد أطباق مطابقة لبحثك ومرشحاتك.',
    detayAc: 'المكونات ومعلومات الحساسية',
    detayKapat: 'إغلاق التفاصيل',
    icindekiler: 'المكونات',
    alerjenler: 'معلومات الحساسية',
    alerjenYok: 'لا يحتوي على أي من مسببات الحساسية المذكورة.',
    enerji: 'الطاقة',
    ornek: 'نموذجي',
    fiyatNotu: 'الأسعار وقيم الطاقة نموذجية ولا تتبع أي منشأة حقيقية.',
    karekodNotu: 'تُقدَّم هذه المعلومات بشكل منفصل للضيوف الذين لا يستطيعون قراءة رمز الاستجابة السريعة.',
    sekmeMenu: 'القائمة',
    sekmeSiparis: 'الطلب',
    sekmeRezervasyon: 'الحجز',
    ekle: 'أضف',
    artir: 'زيادة واحدة',
    azalt: 'إنقاص واحدة',
    adet: 'الكمية',
    siparisBos: 'طلبك فارغ. أضف أطباقًا من القائمة.',
    toplam: 'المجموع',
    masaNo: 'رقم الطاولة',
    siparisNotu: 'ملاحظة على الطلب',
    siparisNotuYer: 'مثال: بدون بصل',
    siparisGonder: 'إرسال الطلب',
    siparisSonuc: 'عرض توضيحي: لم يُرسل أي طلب ولم تُحفظ أي بيانات.',
    rezervasyonGiris: 'أرسل طلب الطاولة؛ التأكيد يأتي من المنشأة.',
    tarih: 'التاريخ',
    saat: 'الوقت',
    kisi: 'عدد الأشخاص',
    isim: 'الاسم الكامل',
    telefon: 'الهاتف',
    onay: 'أوافق على معالجة بياناتي الشخصية من أجل طلب الحجز هذا.',
    rezGonder: 'إرسال طلب الحجز',
    rezSonuc: 'عرض توضيحي: لم يُرسل أي طلب ولم تُحفظ أي بيانات.',
    menuyeDon: 'العودة إلى القائمة',
    fotoNotu: 'لا توجد صور للأطباق في هذا العرض؛ في التركيب الحقيقي تأتي الصور من التصوير.',
  },
};

/** Diyet filtresinin o dildeki adı. */
export function diyetAdi(f: DiyetFiltre, dil: DemoDil): string {
  return METINLER[dil][f];
}
