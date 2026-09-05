#!/usr/bin/env node
/**
 * "Düzenlenmiş Notlar" bölümünü Beyza'nın ham notlarından derlenmiş
 * anlatımlarla doldurur.
 *
 *   npm run rehber:seed
 *
 * Tekrar çalıştırmak güvenlidir: kayıtlar `slug` üzerinden eklenir,
 * zaten varsa DOKUNULMAZ (ON CONFLICT DO NOTHING). Böylece uygulama
 * içinden yapılan düzenlemeler betik yeniden çalışınca ezilmez.
 */
import pg from 'pg';

if (!process.env.DATABASE_URL) {
  console.error('HATA: DATABASE_URL tanımlı değil. .env.local dosyasını kontrol edin.');
  process.exit(1);
}

function baglanti(url) {
  const u = new URL(
    url.trim().replace(/^DATABASE_URL\s*=\s*/i, '').replace(/^['"]+|['"]+$/g, ''),
  );
  const mod = u.searchParams.get('sslmode');
  u.searchParams.delete('sslmode');
  u.searchParams.delete('uselibpqcompat');
  if (u.hostname.endsWith('.pooler.supabase.com') && u.port === '5432') u.port = '6543';
  const yerel = u.hostname === 'localhost' || u.hostname === '127.0.0.1';
  return {
    connectionString: u.toString(),
    ssl: yerel || mod === 'disable' ? false : { rejectUnauthorized: false },
  };
}

const KAYITLAR = [
  {
    slug: 'calisma-alani-paneller',
    sort: 10,
    icon: '🧰',
    title: 'Çalışma Alanı: Paneller Nerede, Kaybolunca Ne Yapılır',
    summary: 'Sağdaki kutuların hepsi Window menüsünde. Ekran karışırsa tek tıkla eski hâline döner.',
    body: `Photoshop'ta ekranın sağında duran kutulara panel denir: Layers, Properties, Color, History... Bunlar sabit değil, sen açıp kapatırsın.

Aradığın panel ekranda yoksa kaybolmuş değildir — hepsinin tam listesi üstteki Window menüsündedir. Menüde adının yanında tik varsa panel açık demektir.

Panelleri sürükleyerek yerlerini değiştirebilir, hatta bir panelin başlık sekmesinden tutup boşluğa bırakarak onu tek başına yüzen bir pencere hâline getirebilirsin. Ekranı kendine göre kurmak serbest.

Panelleri karıştırıp içinden çıkamazsan Window > Workspace > Reset Essentials fabrika ayarına döndürür.`,
    steps: [
      'Bir panel ekranda yoksa: Window menüsünü aç, listeden panelin adına tıkla.',
      'Paneli ayırmak için: panelin adının yazdığı sekmeden tut, ekranın ortasına sürükle.',
      'Ekran karıştıysa: Window > Workspace > Reset Essentials.',
    ],
    tips: [
      'Reset Essentials sonrasında senin eklediğin fazladan paneller kapanır — kaybolmazlar, Window menüsünden yine açılırlar.',
      'Kendi düzenini beğendiysen Window > Workspace > New Workspace ile kaydet, bir daha kurmak zorunda kalmazsın.',
    ],
    visual: null,
    kaynak: [3, 4, 5],
  },
  {
    slug: 'yeni-belge-cozunurluk',
    sort: 20,
    icon: '📐',
    title: 'Yeni Belge Açarken Çözünürlük Kaç Olmalı?',
    summary: 'Ekran işi 72, baskı işi en az 300. Yanlış seçersen baskıda görüntü bulanık çıkar.',
    body: `Çözünürlük (resolution), bir inç'e kaç piksel sığdığını söyler; birimi ppi'dir. Ekranda bakılacak bir görselle matbaaya gidecek bir görselin ihtiyacı aynı değildir.

Ekranda gösterilecek işlerde (Instagram, web sitesi, sunum) 72 ppi yeterlidir. Burada asıl önemli olan piksel ölçüsüdür: Instagram gönderisi için 1080 x 1350 piksel gibi.

Baskıya gidecek işlerde 300 ppi'nin altına düşme. 150 ppi ancak uzaktan bakılacak büyük afişlerde veya taslak çıktıda idare eder. 72 ppi ile baskıya verirsen görüntü net çıkmaz, kenarlar bulanıklaşır.

Önemli nokta: çözünürlüğü sonradan yükseltmek kaybolan detayı geri getirmez. Baştan doğru seçmek gerekir.`,
    steps: [
      'File > New (Ctrl+N).',
      'Baskı işiyse Print sekmesindeki hazır boyutlardan başla — çözünürlüğü zaten 300 gelir.',
      'Ekran işiyse Web / Art & Illustration sekmesini seç, boyutu piksel cinsinden gir.',
      'Resolution kutusunu kontrol et: ekran 72, baskı 300.',
    ],
    tips: [
      'Emin değilsen yüksek çözünürlükte çalış, sonra küçültürsün. Tersi olmuyor.',
      'Mevcut bir dosyanın çözünürlüğünü görmek için: Image > Image Size.',
    ],
    visual: 'cozunurluk',
    kaynak: [6],
  },
  {
    slug: 'rgb-cmyk',
    sort: 30,
    icon: '🎨',
    title: 'RGB mi CMYK mi? Ekran ile Baskının Rengi Aynı Değil',
    summary: 'Ekran ışıkla renk üretir (RGB), matbaa mürekkeple (CMYK). Baskıya vermeden önce mutlaka çevir ve bak.',
    body: `RGB ışık karışımıdır: kırmızı, yeşil ve mavi ışık üst üste binince beyaz olur. Telefon, bilgisayar, televizyon hep böyle çalışır. Dolayısıyla ekranda kalacak her iş RGB olmalıdır.

CMYK mürekkep karışımıdır: camgöbeği, macenta, sarı ve siyah. Mürekkepler üst üste bindikçe koyulaşır. Matbaa baskısı böyle çalıştığı için baskıya gidecek işler CMYK olmalıdır.

Aradaki fark sadece teknik değil, gözle görülür: RGB'de gördüğün parlak neon yeşil, canlı turuncu gibi renklerin bir kısmının CMYK'de karşılığı yoktur. Çevirdiğinde o renkler sönükleşir. Bunu matbaada değil, kendi ekranında görmek istersin.

Bu yüzden kural şu: baskı işini bitirdikten sonra CMYK'ye çevir, renkler bozulduysa daha teslim etmeden düzelt.`,
    steps: [
      'Renk modunu görmek/değiştirmek için: Image > Mode.',
      'Ekran işi ise RGB Color, baskı işi ise CMYK Color.',
      'CMYK\'ye çevirdikten sonra görsele bir daha bak — sönükleşen renk varsa düzelt.',
    ],
    tips: [
      'Çevirmeden önce PSD\'nin bir kopyasını al; RGB\'ye geri döndüğünde eski canlı renkler kendiliğinden geri gelmez.',
      'Matbaadan hangi renk profilini istediğini sormak her zaman en garantisidir.',
    ],
    visual: 'renk-modu',
    kaynak: [7],
  },
  {
    slug: 'dosya-acma-sayfa-boyutu',
    sort: 40,
    icon: '📂',
    title: 'Dosyayı Nasıl Açtığın Sayfa Boyutunu Belirler',
    summary: 'Açık bir belgenin içine sürüklersen sayfa boyutu değişmez; boş alana sürüklersen görselin kendi boyutunda yeni belge açılır.',
    body: `Beyza'nın fark ettiği ayrım şu: dosyayı Photoshop'a nasıl soktuğun, sonucu değiştiriyor.

Zaten açık bir belgenin üstüne sürükleyip bırakırsan (ya da File > Place Embedded dersen), görsel o belgenin içine bir katman olarak girer. Sayfanın boyutu değişmez, görsel sayfaya sığdırılır. Bir tasarımın içine fotoğraf yerleştirirken istediğin budur.

Photoshop'un boş gri alanına sürüklersen (ya da File > Open dersen), görsel kendi piksel ölçüsünde yepyeni bir belge olarak açılır. Bir fotoğrafı olduğu gibi düzenleyeceksen istediğin budur.

Yani "sayfa boyutunda açılmıyor" dediğin durum bir hata değil, hangi yolu kullandığının sonucudur.`,
    steps: [
      'Tasarımın içine görsel koyacaksan: belgeyi aç, sonra dosyayı belgenin üstüne sürükle.',
      'Görselin kendi boyutunda çalışacaksan: File > Open, ya da dosyayı Photoshop\'un boş alanına bırak.',
      'Yerleştirdiğin görselin boyutunu Ctrl+T (Free Transform) ile ayarla, köşeden çekerken oran korunur.',
    ],
    tips: [
      'Place Embedded ile gelen katman Smart Object olur: küçültüp sonra büyütsen bile netliği bozulmaz.',
      'Sayfa boyutunu sonradan değiştirmek için: Image > Canvas Size (sayfa büyür/küçülür), Image > Image Size (içerikle birlikte ölçeklenir).',
    ],
    visual: null,
    kaynak: [8],
  },
  {
    slug: 'kayit-formatlari',
    sort: 50,
    icon: '💾',
    title: 'PSD, JPEG, PNG — Hangisiyle Kaydetmeli?',
    summary: 'PSD çalışma dosyan, JPEG teslim dosyan, PNG şeffaf zemin gerektiğinde. Üçünü de kaydetmek en doğrusu.',
    body: `PSD Photoshop'un kendi formatıdır. Katmanları, maskeleri, metinleri düzenlenebilir hâlde saklar. Asıl çalışma dosyan budur; müşteri "şurayı değiştirelim" dediğinde açıp devam edebilmen buna bağlıdır.

JPEG fotoğraf formatıdır. Katmanları düzleştirir, dosyayı sıkıştırarak küçültür. Sıkıştırma kayıplıdır: her kaydedişte biraz daha bozulur. Şeffaf zemin desteklemez, şeffaf yerler beyaz olur.

PNG kayıpsız sıkıştırır ve şeffaflığı korur. Logo, ikon, zemini olmayan görseller için doğru seçimdir. Karşılığında dosya boyutu JPEG'den büyüktür.

Pratik kural: her işte PSD'yi sakla, teslim için JPEG ver, şeffaflık gerekiyorsa PNG ver.`,
    steps: [
      'Çalışma dosyası: File > Save As > Photoshop (PSD).',
      'Teslim için: File > Save a Copy (veya Save As) > JPEG, kalite 10-12.',
      'Hızlı PNG: Katmanlar panelinde katmana sağ tıkla > Quick Export as PNG. Yalnızca o katmanı dışa aktarır.',
      'Tüm belgeyi PNG olarak vermek için: File > Export > Export As.',
    ],
    tips: [
      'Teslim ettiğin JPEG\'i açıp üstüne tekrar tekrar kaydetme — her seferinde kalite düşer. Düzeltmeyi hep PSD üzerinden yap.',
      'Quick Export\'un varsayılan formatını değiştirmek için: File > Export > Export Preferences.',
    ],
    visual: 'dosya-turleri',
    kaynak: [9, 10, 13],
  },
  {
    slug: 'katman-turleri',
    sort: 60,
    icon: '🗂️',
    title: 'Katmanlar (Layer) Nedir, Hangi Türleri Var?',
    summary: 'Üst üste konmuş şeffaf asetatlar gibi düşün. İçerik katmanları görüntüyü taşır, ayarlama katmanları rengi/tonu değiştirir.',
    body: `Katman, üzerine bir şey çizilmiş şeffaf bir asetat gibidir. Üst üste dizilirler ve üstteki, altındakinin gördüğün kısmını kapatır. Sıralarını değiştirdiğinde sonuç da değişir.

İçerik katmanları görüntünün kendisini taşır: fotoğraflar, metinler, şekiller, getirdiğin grafikler. Bunları taşıyabilir, boyutlandırabilir, silebilirsin.

Ayarlama katmanları (Adjustment Layer) kendi başına bir görüntü içermez; altındaki katmanların rengini ve tonunu değiştirir. Brightness/Contrast, Levels, Curves, Hue/Saturation bunlardandır. Güzel tarafı: fotoğrafın piksellerine dokunmazlar, istediğin an kapatır veya silersin.

Küçük bir düzeltme: ayarlama katmanı "efekt" değildir. Efekt dediğimiz gölge, kontur, parlama gibi şeyler Layer Style'dır (katmana çift tıklayınca açılır); bulanıklaştırma gibi şeyler ise Filter menüsündedir. Üçü ayrı şeydir.`,
    steps: [
      'Katmanlar panelini aç: Window > Layers (F7).',
      'Yeni boş katman: panelin altındaki + simgesi (Ctrl+Shift+N).',
      'Ayarlama katmanı: panelin altındaki yarısı siyah yarısı beyaz daire simgesi.',
      'Sırayı değiştirmek için katmanı listede yukarı/aşağı sürükle.',
    ],
    tips: [
      'Katmanlara isim ver. Üç katmanda gerek yok gibi görünür, otuz katmanda hayat kurtarır.',
      'Göz simgesine tıklayarak katmanı geçici olarak gizleyebilirsin — silmeye gerek yok.',
    ],
    visual: 'katman-yigini',
    kaynak: [11],
  },
  {
    slug: 'bozmadan-calisma',
    sort: 70,
    icon: '🛟',
    title: 'Fotoğrafa Zarar Vermeden Çalışmak',
    summary: 'Fotoğrafın üstüne değil, üstündeki boş katmana çalış. Beğenmezsen katmanı sil — fotoğraf hiç bozulmamış olur.',
    body: `Beyza'nın notundaki fikir Photoshop'un en önemli alışkanlığı: fotoğrafın kendi katmanına dokunma, üstüne yeni bir boş katman aç ve rötuşu orada yap.

Böyle çalışınca bir şey beğenmediğinde Ctrl+Z ile geri gitmeye çalışmana gerek kalmaz; sadece o katmanı silersin, altındaki fotoğraf hiç ellenmemiş gibi durur.

Ctrl+Z'ye güvenmemenin sebebi var: geri alma geçmişi sınırlıdır ve dosyayı kapatıp açtığında sıfırlanır. Katman ise dosyanın içinde kalır, yarın da geri alabilirsin.

Aynı mantık her yerde geçerli: silgiyle silmek yerine maske kullan, fotoğrafın rengini doğrudan değiştirmek yerine ayarlama katmanı ekle.`,
    steps: [
      'Fotoğraf katmanını seç.',
      'Ctrl+Shift+N ile üstüne yeni boş katman aç, adını "rötuş" koy.',
      'Leke temizliyorsan aracın ayar çubuğundaki Sample: All Layers seçeneğini işaretle — yoksa boş katmanda çalışmaz.',
      'Beğenmezsen o katmanı sil, baştan başla.',
    ],
    tips: [
      'Fotoğraf katmanına sağ tıklayıp Convert to Smart Object dersen, uyguladığın filtreler de sonradan düzenlenebilir hâle gelir.',
      'Büyük bir denemeye girişmeden önce Ctrl+J ile katmanın kopyasını al.',
    ],
    visual: null,
    kaynak: [12],
  },
  {
    slug: 'maske-mantigi',
    sort: 80,
    icon: '🎭',
    title: 'Katman Maskesi: Siyah Gizler, Beyaz Gösterir',
    summary: 'Maskede siyaha boyadığın yer kaybolur, beyaza boyadığın yer geri gelir. Silgiden farkı: hiçbir şey gerçekten silinmez.',
    body: `Katman maskesi, katmanın hangi kısmının görüneceğini belirleyen siyah-beyaz bir örtüdür. Tek kuralı vardır ve her şey bu kuraldan çıkar:

siyah gizler, beyaz gösterir, gri yarı saydam yapar.

İki fotoğrafı birleştirirken üstteki katmana maske eklersin, sonra fırçayla siyah boyayarak üstteki fotoğrafın istemediğin kısımlarını yok edersin — altındaki fotoğraf oradan görünmeye başlar. Yanlış yere boyadıysan rengi beyaza çevirip aynı yeri boyarsın, geri gelir.

Silgiyle silmenin farkı burada: silgi pikselleri gerçekten yok eder, maske sadece saklar. Fotoğraf olduğu gibi durmaya devam eder.

Fırça yerine gradyan aracıyla maskeye siyahtan beyaza bir geçiş çekersen, iki fotoğraf sert bir sınır olmadan yumuşacık birbirine karışır. Manzara birleştirmede en çok kullanılan yöntem budur.`,
    steps: [
      'Üstteki katmanı seç.',
      'Katmanlar panelinin altındaki "içi daire olan dikdörtgen" simgesine tıkla — katmanın yanında beyaz bir kutu belirir, maske budur.',
      'O beyaz kutuya tıklayarak maskeyi seçtiğinden emin ol.',
      'B ile fırçayı al, rengi siyah yap, gizlemek istediğin yerleri boya.',
      'Geri getirmek için X tuşuyla rengi beyaza çevir ve aynı yeri boya.',
      'Yumuşak geçiş için G ile gradyan aracını al, maskenin üstünde siyahtan beyaza sürükle.',
    ],
    tips: [
      'X tuşu siyah ile beyaz arasında geçiş yapar — maskede çalışırken en çok kullanacağın tuş.',
      'Fırçanın kenarı sert olursa geçiş de sert olur; Hardness değerini düşür.',
      'Maskeyi geçici olarak kapatmak için maske kutusuna Shift ile tıkla, üstünde kırmızı çarpı çıkar.',
    ],
    visual: 'maske-tonlari',
    kaynak: [15, 16],
  },
  {
    slug: 'maske-zincir',
    sort: 90,
    icon: '🔗',
    title: 'Maske ile Katman Arasındaki Zincir Ne İşe Yarar?',
    summary: 'Zincir açıkken ikisi birlikte hareket eder. Zinciri kaldırırsan çerçeve yerinde kalır, içindeki fotoğrafı ayrı kaydırırsın.',
    body: `Katman küçük resmi ile maske kutusu arasında minik bir zincir simgesi vardır. Varsayılan olarak açıktır ve "bu ikisi birbirine bağlı" demektir: fotoğrafı taşıdığında maske de aynı miktarda kayar, aralarındaki hizalama bozulmaz.

Zincire tıklayıp kaldırırsan bağ kopar. Artık hangisini seçtiysen sadece o hareket eder.

Bunun en işe yarar hâli şudur: maskeyle bir çerçeve şekli oluşturmuşsundur ve çerçevenin yeri doğrudur ama içindeki fotoğrafın kadrajı yanlıştır. Zinciri kaldırıp fotoğraf küçük resmini seçersin, fotoğrafı kaydırırsın; çerçeve olduğu yerde kalır.

Beyza'nın "2 farklı resim oluyor" dediği durum tam olarak budur — bozulma değil, ikisinin ayrı ayrı hareket edebilmesidir.`,
    steps: [
      'Katmanlar panelinde katman küçük resmi ile maske kutusunun arasına bak.',
      'Zincir simgesine tıkla — kaybolur, bağ kopmuştur.',
      'Taşımak istediğin kutuya (fotoğraf ya da maske) tıklayarak onu seç.',
      'V ile taşıma aracını al ve kaydır.',
      'İşin bitince aynı yere tekrar tıklayıp zinciri geri tak.',
    ],
    tips: [
      'Hangisinin seçili olduğunu kutunun etrafındaki ince çerçeveden anlarsın. Yanlış kutu seçiliyken boyarsan fotoğrafın üstüne boya sürersin.',
    ],
    visual: 'zincir',
    kaynak: [17],
  },
  {
    slug: 'apply-layer-mask',
    sort: 100,
    icon: '⚠️',
    title: 'Apply Layer Mask: Geri Dönüşü Yok',
    summary: 'Maskeyi piksellere kalıcı olarak işler. Gizlenen yerler gerçekten silinir, bir daha düzenleyemezsin.',
    body: `Maske kutusuna sağ tıklayıp Apply Layer Mask dersen, maskenin sakladığı kısımlar gerçekten silinir ve maske kutusu kaybolur. Katman artık tek parça bir görüntüdür.

Kazandığın şey: dosya sadeleşir, biraz küçülür, başka programa götürdüğünde sürpriz çıkmaz.

Kaybettiğin şey: maskeyi bir daha düzenleyemezsin. "Şurayı biraz daha açalım" dediğinde geri dönüş yoktur, o pikseller dosyada kalmamıştır.

Bu yüzden kural basit: müşteri işi onaylamadan Apply Layer Mask yapma. Yapman gerekiyorsa önce katmanın kopyasını al (Ctrl+J) ve kopyanın gözünü kapat, aslı dosyada dursun.`,
    steps: [
      'Önce Ctrl+J ile katmanın kopyasını al, kopyanın göz simgesini kapat.',
      'Asıl katmanın maske kutusuna sağ tıkla.',
      'Apply Layer Mask.',
    ],
    tips: [
      'Maskeyi tamamen iptal etmek istiyorsan Apply değil Delete Layer Mask demelisin — o zaman gizlenen her şey geri gelir.',
      'Dosya boyutunu küçültmek istiyorsan önce Layer > Flatten Image yerine kopyasını kaydetmeyi dene: File > Save a Copy.',
    ],
    visual: null,
    kaynak: [18],
  },
  {
    slug: 'karisim-modlari',
    sort: 110,
    icon: '🌗',
    title: 'Karışım Modları (Blend Modes) Nasıl Seçilir?',
    summary: 'Karartan modlarda beyaz kaybolur, aydınlatan modlarda siyah kaybolur. Fotoğrafın parlaklığına göre grup seç.',
    body: `Karışım modu, bir katmanın altındaki katmanla nasıl karışacağını belirler. Katmanlar panelinin üstündeki, normalde "Normal" yazan kutudan seçilir.

Modlar gruplara ayrılmıştır ve gruplar çizgiyle birbirinden ayrılmıştır. En çok kullanılan iki grup şudur:

Karartanlar (Darken, Multiply, Color Burn, Linear Burn): sonucu koyulaştırır. Bu modlarda katmandaki beyaz alanlar tamamen kaybolur. Bir dokuyu ya da beyaz zeminli bir taramayı fotoğrafa oturtmak istediğinde Multiply işini görür.

Aydınlatanlar (Lighten, Screen, Color Dodge, Linear Dodge): sonucu açar. Bu modlarda siyah alanlar kaybolur. Işık, parlama, siyah zeminli havai fişek gibi görselleri bindirirken Screen kullanılır.

Beyza'nın kuralı iyi bir başlangıç noktası: fotoğraf zaten aydınlıksa karartan modlara, karanlıksa aydınlatan modlara bak. Bir de üçüncü grup vardır — Overlay ve Soft Light: bunlar orta griyi yok eder, koyuyu daha koyu açığı daha açık yaparak kontrast ekler.`,
    steps: [
      'Üstteki katmanı seç.',
      'Katmanlar panelinin sol üstündeki "Normal" yazan kutuya tıkla.',
      'Fotoğraf açıksa karartan gruptan, koyuysa aydınlatan gruptan bir mod dene.',
      'Etki fazla geldiyse aynı satırdaki Opacity değerini düşür.',
    ],
    tips: [
      'Taşıma aracı seçiliyken Shift + artı / Shift + eksi tuşlarıyla modlar arasında sırayla gezebilirsin — hangisinin yakıştığını böyle bulmak en hızlısı.',
      'Mod seçtikten sonra Opacity ile Fill farklıdır: Fill katmanın efektlerini etkilemez.',
    ],
    visual: 'karisim-modlari',
    kaynak: [14],
  },
  {
    slug: 'ekip-psd-sablonu',
    sort: 120,
    icon: '📌',
    title: 'Ekip PSD Şablonu ve Action Kullanımı',
    summary: 'Bu bizim kendi şablonumuzun kuralı — Photoshop\'un genel kuralı değil. Şablondaki üç katman silinmemeli.',
    body: `Aşağıdakiler ekibin kendi çalışma şablonuna ait kurallardır; Photoshop'un genel davranışı değildir. Beyza'nın notundan olduğu gibi aktarıldı.

Şablon PSD'de kalması gereken katmanlar: "RENKLİ DOLGU 1", "1" ve "DON'T TOUCH THIS LAYER". Bunlar silinirse action beklendiği gibi çalışmaz.

Action çalıştırılırken "Layer 1" seçili olmalıdır. Action'lar katman adına ve sırasına göre iş yaptığı için yanlış katman seçiliyken çalıştırmak hatalı sonuç verir.

Kayıt, Katman 1 üzerindeyken yapılır ve dosya diğer dosyada açılır.

Bu şablonun neden böyle kurulduğunu bilen kişi Beyza. Bir adım eklemek veya değiştirmek gerekirse önce ona sorun; buradaki metni de o zaman güncelleyin.`,
    steps: [
      'Şablon PSD\'yi aç, üç katmanın da yerinde olduğunu doğrula.',
      'Katmanlar panelinden "Layer 1"i seç.',
      'Action\'ı çalıştır.',
      'Katman 1 üzerindeyken kaydet, sonra diğer dosyada aç.',
    ],
    tips: [
      'Action panelini açmak için: Window > Actions (Alt+F9).',
      'Şablonu bozmamak için üstünde çalışmadan önce File > Save As ile yeni bir isimle kaydet.',
    ],
    visual: null,
    kaynak: [2],
  },
];

const client = new pg.Client(baglanti(process.env.DATABASE_URL));

async function main() {
  await client.connect();

  let eklenen = 0;
  let atlanan = 0;

  for (const k of KAYITLAR) {
    const { rowCount } = await client.query(
      `INSERT INTO note_guides
         (slug, category, icon, title, summary, body, steps, tips, visual,
          source_note_ids, sort_order)
       VALUES ($1, 'Photoshop', $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (slug) DO NOTHING`,
      [k.slug, k.icon, k.title, k.summary, k.body, k.steps, k.tips,
       k.visual, k.kaynak, k.sort],
    );
    if (rowCount > 0) { eklenen++; console.log(`  + ${k.title}`); }
    else { atlanan++; }
  }

  const { rows } = await client.query('SELECT COUNT(*)::int AS n FROM note_guides');
  console.log(`\n${eklenen} anlatım eklendi, ${atlanan} tanesi zaten vardı.`);
  console.log(`Rehberde toplam ${rows[0].n} kayıt var.`);
  await client.end();
}

main().catch((e) => {
  console.error('HATA:', e.message);
  process.exit(1);
});
