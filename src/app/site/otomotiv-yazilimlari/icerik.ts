/**
 * /otomotiv-yazilimlari sayfa ağacının metinleri.
 *
 * Sitenin ortak içeriği `src/lib/site-icerik.ts` içinde durur ve o dosya
 * otomotiv ajanının değil. Burada YALNIZCA bu dört sayfaya özel, başka
 * yerde geçmeyen metinler var; ton ve kurallar aynı:
 *   - "yaptığımız iş" dili (ürün/lisans satışı dili yok)
 *   - fiyat yazılmaz
 *   - sahibinden.com için temkinli dil: senkronizasyon/otomatik veri çekme
 *     İDDİA EDİLMEZ
 *   - demodaki her rakam "örnek" damgalı ve uydurma
 */

import type { Sss } from '@/lib/site-icerik';

/* ================================================================== */
/* Zincir — dört halka                                                 */
/* ================================================================== */

export type Durak = {
  no: string;
  ad: string;
  /** SVG şemasında iki satır; her satır en çok 30 karakter olmalı. */
  satirlar: [string, string];
  /** Kahraman şeridindeki tek satırlık not (şema satırlarından bağımsız). */
  kisaNot: string;
};

export const ZINCIR: Durak[] = [
  {
    no: '01',
    ad: 'Talep',
    kisaNot: 'doğrulamalı site formu',
    satirlar: ['Aracını satmak isteyen kişi', 'adım adım formu dolduruyor'],
  },
  {
    no: '02',
    ad: 'Değerleme',
    kisaNot: 'kırıcılar ve alış aralığı',
    satirlar: ['Beyana dayalı bir fiyat bandı', 've galerinin alış aralığı'],
  },
  {
    no: '03',
    ad: 'İlan',
    kisaNot: 'metin, kart ve gönderi',
    satirlar: ['Alınan araç yapılandırılmış', 'veriye, veri de metne dönüyor'],
  },
  {
    no: '04',
    ad: 'Muhasebe',
    kisaNot: 'araç bazlı kâr ve kasa',
    satirlar: ['Araç bazlı kâr, ortak kasası,', 'masraf ve taksit takibi'],
  },
];

/* ================================================================== */
/* Kök sayfa                                                           */
/* ================================================================== */

export const KOK = {
  ustEtiket: 'Yazılım · May Motors için yaptığımız iş',
  h1: 'Bir galerinin dijital zincirini uçtan uca yazdık.',
  giris:
    'Oto galeride dört iş aynı aracın etrafında dönüyor: gelen talep, aracın değerlemesi, ilanın hazırlanması ve paranın takibi. Bunlar ayrı programlarda durduğunda her halkada bilgi yeniden yazılıyor. May Motors için dördünü tek zincir olarak kurguladık.',
  semaBaslik: 'Zincir nasıl işliyor',
  semaGiris:
    'Aşağıdaki şema dört halkayı sırayla gösteriyor. Aynı aracın bilgisi bir kez giriliyor; sonraki halkalar o bilgiyi yeniden yazmak yerine devralıyor. Kaydırdıkça turuncu nokta zincirde ilerliyor.',
  semaErisim:
    'Şema dört duraklı bir akış: talep, değerleme, ilan ve muhasebe. Her durağın açıklaması şemanın içinde yazılı.',

  halkalarBaslik: 'Dört halka, üç ayrı sayfa',
  halkalarGiris:
    'Talep halkası galerinin web sitesinde yaşıyor; kalan üç halkanın her birini ayrı ayrı anlattık. Hangisi sizin derdinize benziyorsa oradan başlayın.',

  olcumUstEtiket: 'Zinciri kapatan halka',
  olcumBaslik: 'Reklamdan gelen talep, hangi araca dönüştü?',
  olcumParagraflar: [
    'Galerinin en pahalı belirsizliği reklam tarafında: para harcanıyor ama gelen talebin hangi araca ve hangi kâra dönüştüğü bilinmiyor. Bu soruyu cevaplamak için zinciri başa bağladık. Reklam etiketiyle gelen talep forma, form plakaya, plaka da muhasebedeki alınan araca ve o aracın kârına bağlanıyor.',
    'Eşleştirme plaka üzerinden kendiliğinden kuruluyor; kimsenin tabloya elle "bu araç şu reklamdan geldi" yazması gerekmiyor. Kâr hesabı da muhasebe tarafındakiyle birebir aynı formülden geliyor ve bu eşitlik otomatik bir testle kilitli — iki ekranda iki farklı kâr görmeniz mümkün değil.',
  ],
  olcumMaddeler: [
    'Reklam etiketi → talep → plaka → alınan araç → kâr',
    'Ziyaretçi hunisi yalnızca sayı düzeyinde tutulur: kaç kişi girdi, kaç kişi akışı açtı, kaç kişi sonucu gördü',
    'Hunide ham IP ve kişisel veri saklanmaz; ölçüm, ölçtüğü işi yavaşlatmayacak biçimde seyrek yazar',
  ],

  vakaUstEtiket: 'Nereden biliyoruz',
  vakaBaslik: 'Bu zincir bir sunum değil, çalışan bir iş.',
  vakaParagraf:
    'Yukarıdaki dört halkanın tamamını May Motors için yazdık; galerinin web sitesi, değerleme akışı, ilan tarafı ve muhasebesi aynı ekipten çıktı. İçerik tarafını da aynı ekip yürüttü: araç çekimleri, Reels kurgusu ve sosyal medya tasarımları da bizde.',

  sonCagriUstEtiket: 'Ücretsiz analiz',
  sonCagriBaslik: 'Galerinizde zincir nerede kopuyor?',
  sonCagriMetin:
    'Sitenize, ilanlarınıza ve Google profilinize bakıp hangi halkanın eksik olduğunu yazılı söyleyelim. Ücretsiz, bağlayıcı değil; listeyi kendiniz uygulamak isterseniz de elinizde kalır.',

  sssBaslik: 'Otomotiv tarafında en çok sorulanlar',
  sss: [
    {
      soru: 'Bu yazılımları satın alabiliyor muyuz?',
      cevap:
        'Raftan bir program satmıyoruz, lisans da vermiyoruz. Anlattığımız iş May Motors için yazılmış özel bir zincir. Başka bir galeride çalışırken aynı mantığı ve aynı deneyimi kullanıyoruz ama ekranları işin kendi akışına göre yeniden kuruyoruz: sizde kiralama varsa kiralama, ortak yoksa ortak kasası olmayan bir kurgu çıkıyor.',
    },
    {
      soru: 'Dört halkanın hepsini birlikte almak zorunda mıyız?',
      cevap:
        'Değilsiniz. Çoğu galeri tek bir halkayla başlıyor; en sık başlangıç noktası web sitesi ve değerleme formu oluyor, çünkü talebi getiren halka o. Zincirin kalanı sonradan eklenebilecek biçimde kurguluyoruz; ikinci halkayı eklerken birinciyi baştan yazmak gerekmiyor.',
    },
    {
      soru: 'Verilerimiz kimde duruyor?',
      cevap:
        'Veri işletmenin kendi hesabında duruyor; biz yalnızca işi yürütmek için gereken erişimi kullanıyoruz. Çalışma bittiğinde erişimler kapanıyor, veri ve ürettiğimiz dosyalar sizde kalıyor. Araç, müşteri ve kasa verisini kendi tanıtımımızda göstermiyoruz: bu sayfalardaki bütün rakamlar uydurma örneklerdir ve "örnek" damgasıyla işaretlidir.',
    },
    {
      soru: 'Mevcut muhasebe programımızı veya sitemizi bırakmamız gerekiyor mu?',
      cevap:
        'Gerekmiyor. Önce ne kullandığınıza bakıp hangi kısmın gerçekten derdinizi çözdüğünü konuşuyoruz. Çalışan bir parçayı değiştirmek için sebep yoksa dokunmuyor, eksik halkayı onun yanına kuruyoruz. Veri aktarımı gerekiyorsa Excel üzerinden iki yönlü alışverişle çalışıyoruz.',
    },
    {
      soru: 'İşe başlamadan ekranları görebiliyor muyuz?',
      cevap:
        'Evet, çalışma biçimimiz bunun üzerine kurulu. Kod yazmadan önce tıklanabilir bir maket hazırlıyoruz: ekranları gezip "burası böyle olmasın" diyorsunuz, değişiklikler makette yapılıyor. Kapsam onaylandıktan sonra geliştirmeye geçiyoruz, böylece kod yazıldıktan sonra çıkan pahalı sürprizler olmuyor.',
    },
  ] satisfies Sss[],

  metaBaslik: 'Otomotiv ve Oto Galeri Yazılımları',
  metaAciklama:
    'Oto galerinin dijital zinciri: talep, araç değerleme, ilan hazırlama ve galeri muhasebesi. May Motors için uçtan uca yazdığımız iş.',
} as const;

/* ================================================================== */
/* Alt sayfalar                                                        */
/* ================================================================== */

export type UrunSlug = 'arac-degerleme' | 'ilan-hazirlama' | 'galeri-muhasebe';

export type Urun = {
  slug: UrunSlug;
  /** Zincirdeki sıra numarası. */
  no: string;
  /** Menü ve kart adı. */
  kisaAd: string;
  /** Sayfa içi tam ad. */
  ad: string;
  /** Kartlarda görünen tek cümle. */
  ozet: string;
  h1: string;
  giris: string;
  /** Kart ikonu (Ikonlar.tsx içindeki ad). */
  simge: 'grafik' | 'kalem' | 'kutu';

  sorun: { baslik: string; paragraflar: string[] };
  yaptik: { baslik: string; giris: string; maddeler: { baslik: string; metin: string }[] };
  demo: { ustEtiket: string; baslik: string; giris: string; not: string };
  ilkeler: { baslik: string; metin: string }[];
  sss: Sss[];
  anahtarKelimeler: string[];
  metaBaslik: string;
  metaAciklama: string;
};

export const URUNLER: Urun[] = [
  /* ---------------------------------------------------------------- */
  {
    slug: 'arac-degerleme',
    no: '02',
    kisaAd: 'Araç değerleme',
    ad: 'Araç değerleme akışı',
    ozet:
      'Beyan edilen bilgiden bir fiyat bandı ve galerinin alış aralığı; her kırıcının kaç puan götürdüğü ekranda yazılı.',
    h1: 'Değerlemede rakamın nereden geldiği görünür olsun.',
    giris:
      'Aracını satmak isteyen kişi galeriye gelmeden bir fiyat fikri edinmek istiyor; galeri de "kafadan" değil dayanağı olan bir rakamla almak istiyor. May Motors için kurduğumuz değerleme akışı bu iki ihtiyacı aynı ekranda karşılıyor.',
    simge: 'grafik',
    sorun: {
      baslik: 'Neden gerekti',
      paragraflar: [
        'Galeride alım fiyatı çoğunlukla deneyimle belirleniyor. Deneyim değerli ama aktarılamıyor: usta "bu araç şu kadar eder" diyebiliyor, neden şu kadar ettiğini tabloya çeviremiyor. Araç sahibi tarafında beklenti daha da dağınık; komşunun ilanı, forumdaki yorum ve bir yıl önceki fiyat aynı cümlede geçiyor.',
        'Bu yüzden değerlemeyi tek bir rakam olarak değil görünür bir hesap olarak kurguladık. Önce aracın bulunduğu bant, sonra o bandı aşağı çeken kırıcılar, en sonunda galerinin alış aralığı. Hangi kalemin ne kadar götürdüğü ekranda yazılı olduğu için konuşma "az verdiniz" tartışmasından çıkıp kalem kalem gözden geçirmeye dönüyor.',
      ],
    },
    yaptik: {
      baslik: 'Ne yaptık',
      giris:
        'Akışı müşterinin dolduracağı adımlardan, galerinin kullanacağı ekrandan ve ikisini besleyen hesap mantığından oluşan tek bir iş olarak yazdık.',
      maddeler: [
        {
          baslik: 'Adım adım ilerleyen beş bölümlü akış',
          metin:
            'Marka, model ve motor seçimi; il, renk, kasa, vites, yakıt; kaporta parça durumu; tramer; donanım listesi. Her adım tek ekran, geri dönmek serbest; yarıda kalan akış kaybolmuyor.',
        },
        {
          baslik: 'Kaporta parça haritası',
          metin:
            'Araç şeması üzerinde parça parça işaretleme: orijinal, boyalı, değişen, lokal boyalı. "Değişen var" demekle "ön tampon değişen" demek arasındaki fark hesaba giriyor.',
        },
        {
          baslik: 'Kırıcıların görünür olduğu sonuç ekranı',
          metin:
            'Sonuç tek rakam değil: önce piyasa bandı, sonra hangi kırıcının kaç puan götürdüğü, en sonunda galerinin alış aralığı. Teklifin dayanağı müşterinin beyanı olduğu açıkça yazılı.',
        },
        {
          baslik: 'Sahte gönderimi kesen doğrulama',
          metin:
            'Telefon numarası WhatsApp üzerinden altı haneli kodla doğrulanıyor; kod kısa süre geçerli ve tek kullanımlık. Aynı yerden saniye saniye tekrarlanan denemeler hız sınırına takılıyor.',
        },
        {
          baslik: 'Oranlar kodun içine gömülü değil',
          metin:
            'Kırıcı oranları, yaş ve kilometre varsayımları ayrı bir ayar dosyasında duruyor. Galeriyle birlikte "boyalı parçayı biz daha az kırıyoruz" diyebiliyoruz; bunun için kod değiştirmek gerekmiyor.',
        },
        {
          baslik: 'Dükkandaki ekranla sitedeki ekran aynı hesabı kullanır',
          metin:
            'Müşterinin gördüğü sonuçla galerinin içeride baktığı sonuç aynı mantıktan çıkıyor. Böylece müşteri geldiğinde "sitede başka yazıyordu" cümlesi kurulmuyor.',
        },
      ],
    },
    demo: {
      ustEtiket: 'Çalışan örnek',
      baslik: 'Kırıcılara dokunun, bant kaysın.',
      giris:
        'Aşağıdaki bant gerçek bir araca ait değil; piyasa göstergesi 100 puan kabul edilmiş bir örnek. Çipleri açıp kapatarak kırıcıların bandı nasıl çektiğini ve galerinin alış aralığının nasıl oluştuğunu görebilirsiniz.',
      not:
        'Gerçek bir araç için rakam vermiyoruz: burada yalnızca hesabın mantığı var. Katsayılar May Motors ayar dosyasındaki yapıyla aynı biçimde çalışıyor, değerleri her galeri için ayrıca belirleniyor.',
    },
    ilkeler: [
      {
        baslik: 'Veri yoksa rakam yok',
        metin:
          'Yeterli yakın kayıt bulunmazsa akış rakam göstermiyor, "ekibimiz sizinle iletişime geçecek" diyor. Uydurma bir fiyat üretmek müşteriyi de galeriyi de zor duruma düşürdüğü için bunu bilinçli bir kural olarak kurduk.',
      },
      {
        baslik: 'Sonuç kesin fiyat değil, ön fiyat fikri',
        metin:
          'Ekranda görünen rakam müşterinin beyanına dayanır: kaporta ve boya durumu, mekanik, hasar kaydı, kilometre ve belgeler. Aracın yerinde görülmesi bu rakamı değiştirebilir ve bu, sonucun yanında yazılı durur.',
      },
      {
        baslik: 'Kurallara saygılı veri',
        metin:
          'Fiyat modellemesi herkese açık piyasa bilgisinden kuruluyor ve bu toplama işletmenin kendi cihazlarında, insan temposunda yürüyor. Bot doğrulamasını aşmaya çalışan bir kurgu yok; doğrulama çıkarsa sistem durup haber veriyor.',
      },
    ],
    sss: [
      {
        soru: 'Kırıcı oranlarını kim belirliyor?',
        cevap:
          'Başlangıç değerlerini galerinin kendi alım alışkanlığından çıkarıyoruz, sonra birlikte oturup ayarlıyoruz. Oranlar ayrı bir ayar dosyasında durduğu için "biz lokal boyayı bu kadar kırmıyoruz" dediğinizde değişiklik dakikalar içinde yapılıyor ve bütün ekranlara aynı anda yansıyor.',
      },
      {
        soru: 'Fiyat verisini nereden alıyorsunuz?',
        cevap:
          'Herkese açık piyasa bilgisinden. Hangi ilan sitesinden hangi veriyi çektiğimize dair bir söz vermiyoruz, çünkü ilan sitelerinin kullanım koşulları ve robots kuralları bağlayıcı. Modelleme, işletmenin kendi cihazlarında kurallara saygılı biçimde toplanan açık bilgiden kuruluyor ve toplanan veri işletmenin mülkiyetinde kalıyor.',
      },
      {
        soru: 'Müşteri abartılı bir beyan verirse ne oluyor?',
        cevap:
          'Sonucun müşterinin beyanına dayandığı ekranda yazılı ve teklifin şartı bu beyan. Araç yerinde görüldüğünde beyanla durum uyuşmuyorsa rakam da değişiyor. Bu lafızı avukat onayıyla kurduğumuz için galeri sonradan "ama siz şu rakamı yazmıştınız" cümlesiyle sıkışmıyor.',
      },
      {
        soru: 'Değerleme sonucu müşteriye anında mı gösteriliyor?',
        cevap:
          'Yeterli veri varsa evet, akışın sonunda görünüyor. Yoksa rakam yerine iletişim adımı çıkıyor. İki durumda da talep galerinin paneline düşüyor; yani "veri yoksa rakam yok" kuralı talebi kaybetmek anlamına gelmiyor.',
      },
      {
        soru: 'Aynı akış ikinci el dışında da kurulabilir mi?',
        cevap:
          'Mantık taşınabilir: "elindeki varlığın bugünkü karşılığını öğren" ihtiyacı iş makinesi, ticari araç ve tekne tarafında da aynı. Kırıcılar ve bant mantığı değişir, akışın iskeleti değişmez. Hangi kalemlerin fiyatı belirlediğini sizinle birlikte çıkarıyoruz.',
      },
    ],
    anahtarKelimeler: [
      'araç değerleme yazılımı',
      'araç değerleme sitesi',
      'aracımın değeri ne kadar formu',
      'oto galeri değerleme formu',
      'kaporta parça haritası',
    ],
    metaBaslik: 'Araç Değerleme Yazılımı',
    metaAciklama:
      'Oto galeri için araç değerleme akışı: kaporta parça haritası, kırıcı katsayıları, alış aralığı ve "veri yoksa rakam yok" kuralı. May Motors örneği.',
  },

  /* ---------------------------------------------------------------- */
  {
    slug: 'ilan-hazirlama',
    no: '03',
    kisaAd: 'İlan hazırlama',
    ad: 'İlan hazırlama ve yönetim akışı',
    ozet:
      'Bir kez girilen araç bilgisinden ilan metni, baskıya hazır araç kartı ve sosyal medya gönderisi birlikte çıkıyor.',
    h1: 'Aracı bir kez girin; ilan metni satır satır kurulsun.',
    giris:
      'Aynı araç için ilan açıklaması, araç kartı ve sosyal medya gönderisi ayrı ayrı hazırlanıyordu: üç kere aynı bilgi, üç farklı üslup, üç farklı hata. May Motors için tek veri girişinden üç çıktının birlikte üretildiği bir akış kurduk.',
    simge: 'kalem',
    sorun: {
      baslik: 'Neden gerekti',
      paragraflar: [
        'İlan açıklaması galeride en acele yazılan metin. Araç geldiği gün satışa çıkması gerekiyor, metni kim boşsa o yazıyor; bir ilanda tramer bilgisi var, diğerinde yok, birinde donanım listesi eksik. Alıcı tarafında ise bu dağınıklık doğrudan güven kaybı: aynı galerinin iki ilanı iki ayrı firmadan gibi görünüyor.',
        'Görsel tarafı daha da zor. Her araç için tasarımcıya iş açmak ya da hazır bir şablonda elle uğraşmak gerekiyor; sonuçta ilan sitesindeki fotoğrafla Instagram gönderisi birbirini tutmuyor. Oysa her ikisinin de beslendiği bilgi aynı: aracın yapılandırılmış kaydı.',
      ],
    },
    yaptik: {
      baslik: 'Ne yaptık',
      giris:
        'Aracı bir kez yapılandırılmış veri olarak kaydeden, sonra o kayıttan metni ve görselleri üreten bir akış yazdık. Ekranlar galeri çalışanının sırasına göre dizildi: önce araç, sonra hasar, sonra donanım, en son fotoğraf ve yayın.',
      maddeler: [
        {
          baslik: 'Altı bölümlü ilan sihirbazı',
          metin:
            'Araç kimliği, teknik bilgi, hasar ve ekspertiz, donanım ve rozetler, fotoğraflar, yayın. Her bölümün yanında canlı önizleme duruyor; alan doldukça ilan büyüyor.',
        },
        {
          baslik: 'Kaporta haritası ilana da yansıyor',
          metin:
            'Parça parça işaretlenen durum ilanın içinde görsel şema olarak çıkıyor. Alıcı "boyalı var mı" diye yazmak zorunda kalmıyor; parçanın üstünde yazıyor.',
        },
        {
          baslik: 'Kırk üstü alandan kurulan metin',
          metin:
            'Yıl, kasa, vites, yakıt, kilometre, motor hacmi, güç, muayene, donanım. Cümle kalıpları galeriyle birlikte belirleniyor; metin bu kalıplara veriyi yerleştirerek kuruluyor, her ilan aynı sırada okunuyor.',
        },
        {
          baslik: 'Tek veriden üç çıktı',
          metin:
            'İlan metni, baskıya ve vitrine uygun vektörel araç kartı, bir de dikey sosyal medya gönderisi. Kiralık araçlar için ayrı bir gönderi kalıbı var.',
        },
        {
          baslik: 'Galerinin kendi ilan yönetim paneli',
          metin:
            'Araç ekleme, fotoğraf yükleme, sıralama, satıldı işaretleme. Satılan araç vitrinden çıkıp "satılanlar" tarafına geçiyor; kayıt silinmediği için muhasebe tarafındaki araçla bağı kopmuyor.',
        },
        {
          baslik: 'Logo bir kez, her çıktıda aynı',
          metin:
            'Galerinin kurumsal dosyasından alınan logo karta vektörel olarak basılıyor. Her araç için yeniden logo hazırlama ya da bulanık bir PNG kullanma derdi kalmıyor.',
        },
      ],
    },
    demo: {
      ustEtiket: 'Çalışan örnek',
      baslik: 'Soldaki kayıt, sağdaki metin.',
      giris:
        'Soldaki alanlar yapılandırılmış araç kaydı; sağdaki metin o kayıttan kuruluyor. Aşağıdaki araç ve bütün değerleri uydurma bir örnektir — gerçek bir araca, plakaya veya ilana ait değildir.',
      not:
        'Cümle kalıpları sabit, veriyi galeri giriyor. Fiyat alanını yazılım belirlemiyor: ilan fiyatını galeri kendisi giriyor, metin de o alanı olduğu gibi aktarıyor.',
    },
    ilkeler: [
      {
        baslik: 'Senkronizasyon sözü vermiyoruz',
        metin:
          'Yaptığımız iş ilan açıklamasının ve ilan görselinin hazırlanması, ilanların galeri panelinden düzenli yönetilmesi ve fiyat araştırmasının derli toplu tutulmasıdır. "İlanlarınız sahibinden.com’a otomatik akıyor" ya da "veriyi oradan otomatik çekiyoruz" demiyoruz; ilan sitelerinin kendi kuralları ve kullanım koşulları bağlayıcı.',
      },
      {
        baslik: 'Fiyat araştırması bir çalışma alanı, otomat değil',
        metin:
          'Benzer araçların piyasada nerede durduğunu derli toplu görebileceğiniz bir alan kuruyoruz: not alınır, karşılaştırılır, karar insanda kalır. Fiyatı yazılımın sizin yerinize koyduğu bir kurgu önermiyoruz.',
      },
      {
        baslik: 'Metin kalıbı sizin, dil sizin',
        metin:
          'Kalıpları galerinin kendi diline göre yazıyoruz. Abartılı sıfat, "kaçırılmayacak fırsat" türü ifade ve asılsız rozet kullanmıyoruz; bir araçta "hatasız" yazıyorsa kaporta haritası da onu söylüyor.',
      },
    ],
    sss: [
      {
        soru: 'İlanlarımız ilan sitelerine otomatik aktarılıyor mu?',
        cevap:
          'Böyle bir bağlantı kurduğumuzu söylemiyoruz. İlan metnini ve görselini hazırlıyoruz, ilanları galeri panelinden düzenli yönetilebilir hâle getiriyoruz; ilan sitesine yükleme işini galeri kendi hesabından yapıyor. Bu sınırı baştan çizmemizin sebebi ilan sitelerinin kullanım koşulları ve teknik kuralları: tutulamayacak bir sözü vermemeyi tercih ediyoruz.',
      },
      {
        soru: 'Araç fotoğraflarını siz mi çekiyorsunuz?',
        cevap:
          'İsterseniz evet, galeride araç çekimi yapıyoruz: dış tur, iç detay, motor ve yol çekimi. Çekim almasanız da akış çalışıyor; kendi fotoğraflarınızı yükleyip aynı kart ve gönderi çıktılarını alabiliyorsunuz. Işık ve kadraj için kısa bir çekim rehberi hazırlıyoruz.',
      },
      {
        soru: 'İlan metni her araçta birbirine benzemeye başlar mı?',
        cevap:
          'Kalıp kullandığımız için yapı benziyor, içerik benzemiyor: metni kuran şey aracın kendi verisi. Benzerliğin faydalı tarafı da var — alıcı ikinci ilanınızda bilgiyi nerede bulacağını biliyor. Yine de serbest bir "araç hakkında" alanı bırakıyoruz; galerinin o araca dair söyleyeceği şey oraya giriyor.',
      },
      {
        soru: 'Sosyal medya gönderisi doğrudan paylaşıma hazır mı?',
        cevap:
          'Görsel hazır çıkıyor; dikey gönderi ölçüsünde, galerinin logosu ve vurgu rengiyle. Açıklama metni de öneri olarak üretiliyor ama onu olduğu gibi paylaşmanızı beklemiyoruz: hesabın sesi markanın kendi sesi olmalı. Sosyal medya yönetimini biz yürütüyorsak bu adımı da biz üstleniyoruz.',
      },
      {
        soru: 'Aynı akış emlak veya iş makinesi için kurulabilir mi?',
        cevap:
          'Evet, kalıp birebir taşınıyor: yapılandırılmış kayıt, kalıpla kurulan metin, tek veriden çoklu görsel çıktı. Alanlar değişiyor — araçta kaporta haritası neyse dairede kat planı ve cephe o. Hangi alanların ilanı sattığını sizin sektörünüzde birlikte çıkarıyoruz.',
      },
    ],
    anahtarKelimeler: [
      'araç ilanı hazırlama',
      'ilan açıklaması yazma',
      'araç tanıtım kartı',
      'oto galeri ilan yönetimi',
      'araç ilanı görseli',
    ],
    metaBaslik: 'Araç İlanı Hazırlama Akışı',
    metaAciklama:
      'Tek veri girişinden ilan metni, vektörel araç kartı ve sosyal medya gönderisi. İlan yönetim akışı ve fiyat araştırması; senkronizasyon iddiası yok.',
  },

  /* ---------------------------------------------------------------- */
  {
    slug: 'galeri-muhasebe',
    no: '04',
    kisaAd: 'Galeri muhasebe',
    ad: 'Galeri muhasebesi ve kasa takibi',
    ozet:
      'Araç bazlı kârlılık, ortak kasaları, masraf ve taksit takibi; kasayı salt okunur denetleyen bir tarama aracıyla.',
    h1: 'Bu aracın kârı kimin kasasına yazılıyor?',
    giris:
      'Ortaklı bir galeride en çok tartışılan iki şey var: hangi aracın kârı ne kadar ve kimin kasasında ne var. May Motors için bu iki soruyu tartışma yerine tabloya bağlayan muhasebe tarafını yazdık.',
    simge: 'kutu',
    sorun: {
      baslik: 'Neden gerekti',
      paragraflar: [
        'Galeri muhasebesi hazır programlara zor sığıyor. Çünkü satılan şey stoktan düşen bir ürün değil, kendine ait bir dosyası olan bir varlık: alış bedeli, noter ve plaka masrafı, kaporta gideri, lastik, bakım, sigorta, MTV, sonra satış ve belki taksitli tahsilat. Bunların hepsi tek araca yazılmadığında "bu araç kâr etti mi" sorusu cevapsız kalıyor.',
        'Ortaklı yapıda iş bir kat daha karışıyor. Araç bir ortağın kasasından alınıyor, masrafı başkası ödüyor, satış parası üçüncü kasaya giriyor. Defterde her şey doğru görünse de ay sonunda kimin kime ne verdiği belirsizleşiyor. Asıl dert muhasebe değil, bu belirsizliğin ortaklar arasında yarattığı gerilim.',
      ],
    },
    yaptik: {
      baslik: 'Ne yaptık',
      giris:
        'Her aracı kendi dosyası olan bir kayıt olarak kurguladık ve paranın hareketini ortak kasalarına bağladık. Ekranlar galerinin gerçek sorularına göre bölündü.',
      maddeler: [
        {
          baslik: 'Araç bazlı kâr dosyası',
          metin:
            'Alış, masraf kalemleri, kira geliri varsa o da dâhil, satış ve kâr tek kartta. Araç satıldığında kâr hesabı kapanıp ortak paylarına dağılıyor; dağıtımın hangi orana göre yapıldığı kartın üstünde yazılı.',
        },
        {
          baslik: 'Ortak kasaları',
          metin:
            'Her ortağın kendi kasası, kasa hareketleri ve bakiyesi ayrı duruyor. "Ortaklardan araç gideri düş" gibi gerçek hayatta sık yapılan işlemler tek adıma indirildi.',
        },
        {
          baslik: 'Taksit ve vadeli satış takibi',
          metin:
            'Taksit planı, kim hangi tarihte ne ödeyecek ve ödenen taksitler. Vadeli satışta kârın tahsilat gelmeden tam yazılmaması önemli bir ayrıntı; bu tarafı bilerek sıkı kurduk.',
        },
        {
          baslik: 'Evrak ve tarih takibi',
          metin:
            'Sigorta, trafik sigortası, MTV ve muayene tarihleri araçla birlikte duruyor. Yaklaşan tarihler listede öne çıkıyor, böylece ceza ya da eksik poliçe sürprizi azalıyor.',
        },
        {
          baslik: 'Haftalık ve aylık analiz',
          metin:
            'Dönem içinde ne alındı, ne satıldı, hangi masraf kalemi büyüdü, kâr nereden geldi. Rapor ekranı filtreli; istenen dönem ve kategori seçilip tablo olarak alınıyor.',
        },
        {
          baslik: 'Excel ile iki yönlü alışveriş',
          metin:
            'Tek tuşla dışa aktarma, dosya seçip içe aktarma. Mali müşavirle çalışan galerilerde bu, programı değiştirmeden birlikte çalışmanın en pratik yolu oluyor.',
        },
        {
          baslik: 'Yetki, kilit ve günlük',
          metin:
            'Kullanıcı bazlı yetkilendirme, ekran kilidi ve işlem günlüğü. Kimin neyi ne zaman değiştirdiği kayıtlı; ortaklı yapıda bu kaydın kendisi tartışmayı bitiriyor.',
        },
        {
          baslik: 'İnternet kesilse de çalışır',
          metin:
            'Dükkanda bağlantı gidince ekran kapanmıyor; girilen kayıtlar cihazda bekliyor ve bağlantı gelince eşitleniyor. Galeri ortamında bu küçük görünen ayrıntı günü kurtarıyor.',
        },
      ],
    },
    demo: {
      ustEtiket: 'Panel maketi',
      baslik: 'Ekran böyle duruyor.',
      giris:
        'Aşağıdaki panel maketindeki bütün araçlar, ortaklar ve tutarlar uydurmadır; gerçek bir galerinin verisi değildir. Maket, ekranın hangi soruyu hangi sırayla cevapladığını göstermek için duruyor.',
      not:
        'Gerçek müşteri verisi tanıtımda kullanılmaz. Araç kodları, ortak adları ve tutarlar bu maket için üretildi; biçimler ve sütun düzeni gerçek ekranla aynıdır.',
    },
    ilkeler: [
      {
        baslik: 'Kasayı salt okunur denetleyen bir tarama',
        metin:
          'Kasa ile araç kayıtları arasındaki tutarsızlıkları arayan, hiçbir şeyi değiştirmeyen bir denetim aracı var: alış bedeliyle kasa hareketinin uyuşmaması, dağıtılmamış satış parası, yüzde yüz etmeyen pay toplamı, mükerrer kayıt, açılış bakiyesinden önce tarihli hareket. Yanlış alarm üretmemesi için ortaklık devri olan araçlar ve borçlu ortaklar gibi istisnalar tanımlı.',
      },
      {
        baslik: 'Para hataları bulunup teste kilitlendi',
        metin:
          'Geliştirme sırasında kârı iki kez sayan ve silme işleminde çift iade üreten gerçek hatalar çıktı. İkisi de düzeltildi ve bir daha geri gelemeyecek şekilde otomatik testle kilitlendi. Muhasebe yazılımında asıl mesele özellik sayısı değil, bu tür hataların bir daha dönmemesi.',
      },
      {
        baslik: 'Tek kâr formülü',
        metin:
          'Kâr hesabı muhasebe ekranında, araç kartında ve reklam ölçümünde aynı tek formülden geliyor. Bu eşitlik bir testle sabitlendi; iki ekranda iki farklı kâr görmeniz mümkün değil.',
      },
    ],
    sss: [
      {
        soru: 'Bu bir resmî muhasebe programı mı, mali müşavirin yerini alıyor mu?',
        cevap:
          'Almıyor ve böyle bir iddiamız yok. Yaptığımız iş galerinin işletme takibi: hangi araç kaça alındı, ne masraf gördü, kaça satıldı, kârı kimin kasasına yazıldı. Resmî defter, beyan ve vergi işleri mali müşavirinizin alanında kalıyor; Excel alışverişiyle onunla aynı veriyi konuşabiliyorsunuz.',
      },
      {
        soru: 'Kaç ortakla çalışabiliyor?',
        cevap:
          'May Motors tarafında dört ortaklı bir yapı için kurduk. Ortak sayısı ve pay oranları veriden geliyor, koda gömülü değil; tek kişilik galeride ortak kasası bölümü hiç açılmıyor. Pay oranı araç bazında da farklı olabiliyor, çünkü gerçek hayatta her araca aynı ortaklar aynı oranla girmiyor.',
      },
      {
        soru: 'Kiralama tarafı da takip edilebiliyor mu?',
        cevap:
          'Evet, kiralama ayrı bir bölüm olarak duruyor: hangi araç kime, hangi tarihler arasında kiralandı, tahsilat ne oldu. Kira geliri aracın kâr dosyasına da yazıldığı için, bir aracın "satıştan mı kiradan mı para getirdiği" sorusu cevaplanabiliyor.',
      },
      {
        soru: 'Verilerimizin yedeği alınıyor mu?',
        cevap:
          'Alınıyor; May Motors tarafında yedek günde iki kez kendiliğinden çıkıyor ve elle bir şey yapılması gerekmiyor. Yedeğin nereye alındığı ve kimin erişebildiği kurulumda yazılı olarak belirlenir. Veri işletmenin kendi hesabında durur; çalışma biterse erişimler kapanır, veri sizde kalır.',
      },
      {
        soru: 'Mevcut kayıtlarımızı taşıyabilir miyiz?',
        cevap:
          'Çoğu galeri Excel’den geliyor ve içe aktarma bunun için var. Taşımadan önce kısa bir temizlik turu yapıyoruz: aynı araç iki kere yazılmış mı, açılış bakiyeleri doğru mu, pay oranları toplamı tutuyor mu. Hatalı veriyi olduğu gibi taşımak, yeni programı ilk günden tartışmalı hâle getiriyor.',
      },
    ],
    anahtarKelimeler: [
      'galeri muhasebe programı',
      'oto galeri muhasebesi',
      'ortaklı galeri kasa takibi',
      'araç bazlı kârlılık',
      'taksitli araç satış takibi',
    ],
    metaBaslik: 'Galeri Muhasebe ve Kasa Takibi',
    metaAciklama:
      'Oto galeri için araç bazlı kârlılık, ortak kasaları, masraf, taksit ve evrak takibi; kasayı salt okunur denetleyen tarama. May Motors örneği.',
  },
];

/** Alt sayfayı slug ile bulur. */
export function urunBul(slug: string): Urun | undefined {
  return URUNLER.find((u) => u.slug === slug);
}

/* ================================================================== */
/* Değerleme simülasyonu — kırıcı çipleri                              */
/* ================================================================== */

export type Kirici = {
  anahtar: string;
  ad: string;
  /** Örnek çarpan (1 = etkisiz). */
  oran: number;
  /** Çipin altında görünen kural açıklaması. */
  kural: string;
};

/**
 * Oranlar May Motors ayar dosyasındaki yapıyla aynı biçimde çalışır.
 * Tramer ve kilometre tarafı gerçekte "en çok şu kadar" biçiminde bir üst
 * sınır olduğu için, burada o sınırın içinden temsilî bir değer kullanıldı.
 */
export const KIRICILAR: Kirici[] = [
  { anahtar: 'agir-hasar', ad: 'Ağır hasar', oran: 0.85, kural: 'Tek kalemde en sert kırıcı' },
  { anahtar: 'degisen', ad: 'Değişen parça', oran: 0.94, kural: 'Hangi parça değiştiyse ona göre' },
  { anahtar: 'boyali', ad: 'Boyalı parça', oran: 0.97, kural: 'Parça sayısıyla birlikte artar' },
  { anahtar: 'lokal', ad: 'Lokal boyalı', oran: 0.985, kural: 'En hafif kaporta kalemi' },
  { anahtar: 'tramer', ad: 'Tramer kaydı', oran: 0.9, kural: 'Üst sınır en çok %15' },
  { anahtar: 'yuksek-km', ad: 'Yaşına göre yüksek km', oran: 0.94, kural: 'Üst sınır en çok %8' },
];

/** Galerinin alış aralığı: düzeltilmiş göstergenin yüzdesi. */
export const ALIS_ARALIGI = { alt: 0.85, ust: 0.9 } as const;

/* ================================================================== */
/* İlan hazırlama — sabit örnek kayıt ve üretilen metin                */
/* ================================================================== */

/** Uydurma örnek araç: marka/model adı, plaka ve fiyat BİLEREK yok. */
export const ORNEK_KAYIT: { alan: string; deger: string }[] = [
  { alan: 'Kasa tipi', deger: 'Hatchback' },
  { alan: 'Model yılı', deger: '2019' },
  { alan: 'Vites', deger: 'Otomatik' },
  { alan: 'Yakıt', deger: 'Dizel' },
  { alan: 'Kilometre', deger: '92.000' },
  { alan: 'Kaporta', deger: '1 parça lokal boyalı' },
  { alan: 'Tramer', deger: 'Kayıt bulunmuyor' },
  { alan: 'Donanım', deger: 'Geri görüş kamerası, koltuk ısıtma, şerit takip' },
  { alan: 'Muayene', deger: 'Yeni yapıldı' },
];

/** Üretilen ilan metni. Her satır en çok 30 karakter (daktilo animasyonu). */
export const ORNEK_ILAN_SATIRLARI: string[] = [
  '2019 model, hatchback kasa.',
  'Otomatik vites, dizel motor.',
  'Kilometre: 92.000.',
  'Kaporta: 1 parça lokal boyalı,',
  'kalan parçalar orijinal.',
  'Tramer kaydı bulunmuyor.',
  'Muayenesi yeni yapıldı.',
  'Donanım: geri görüş kamerası,',
  'koltuk ısıtma, şerit takip.',
  'Randevuyla görülebilir.',
];

/** Tek kayıttan çıkan üç çıktı. */
export const ILAN_CIKTILARI: { baslik: string; metin: string }[] = [
  {
    baslik: 'İlan açıklaması',
    metin:
      'Kalıpla kurulmuş, her ilanda aynı sırayla okunan metin. Serbest bir "araç hakkında" alanı galerinin kendi cümlesi için ayrı duruyor.',
  },
  {
    baslik: 'Vektörel araç kartı',
    metin:
      'Baskıya ve vitrine uygun, galerinin logosu ve vurgu rengiyle hazırlanan kart. Kaporta şeması kartın içinde görsel olarak çıkıyor.',
  },
  {
    baslik: 'Sosyal medya gönderisi',
    metin:
      'Dikey gönderi ölçüsünde görsel ve öneri açıklama metni. Kiralık araçlar için ayrı bir kalıp var.',
  },
];

/* ================================================================== */
/* Muhasebe paneli maketi — hepsi uydurma, "örnek" damgalı             */
/* ================================================================== */

export const PANEL_SEKMELER = [
  'Genel bakış',
  'Araç al-sat',
  'Kasa analizleri',
  'Taksit takibi',
  'Sigorta ve MTV',
] as const;

export const PANEL_OZET: { etiket: string; deger: string; not: string }[] = [
  { etiket: 'Stokta araç', deger: '7', not: '2 tanesi kiralamada' },
  { etiket: 'Açık taksit planı', deger: '4', not: 'bu ay 3 tahsilat' },
  { etiket: 'Ortak kasası', deger: '4', not: 'pay oranları araç bazında' },
  { etiket: 'Yaklaşan evrak', deger: '2', not: 'sigorta ve muayene' },
];

export const PANEL_ARACLAR: {
  kod: string;
  alis: string;
  masraf: string;
  satis: string;
  kar: string;
  durum: 'satildi' | 'stokta' | 'kiralamada';
}[] = [
  { kod: 'A-18', alis: '740.000', masraf: '26.500', satis: '845.000', kar: '78.500', durum: 'satildi' },
  { kod: 'B-04', alis: '512.000', masraf: '41.200', satis: '598.000', kar: '44.800', durum: 'satildi' },
  { kod: 'C-27', alis: '1.180.000', masraf: '12.000', satis: '—', kar: '—', durum: 'stokta' },
  { kod: 'D-09', alis: '655.000', masraf: '9.400', satis: '—', kar: '—', durum: 'kiralamada' },
];

export const PANEL_DURUM_ADI: Record<'satildi' | 'stokta' | 'kiralamada', string> = {
  satildi: 'Satıldı',
  stokta: 'Stokta',
  kiralamada: 'Kiralamada',
};

export const PANEL_KASALAR: { ad: string; pay: number; not: string }[] = [
  { ad: 'Ortak 1', pay: 34, not: 'A-18 · B-04' },
  { ad: 'Ortak 2', pay: 28, not: 'A-18 · C-27' },
  { ad: 'Ortak 3', pay: 22, not: 'B-04 · D-09' },
  { ad: 'Ortak 4', pay: 16, not: 'C-27' },
];

export const PANEL_UYARILAR: string[] = [
  'B-04 · alış bedeli ile kasa hareketi 1.200 fark veriyor',
  'C-27 · pay toplamı %98, %2 dağıtılmamış',
  'D-09 · sigorta bitiş tarihi 11 gün sonra',
];
