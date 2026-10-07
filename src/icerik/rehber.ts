/**
 * Rehber (blog) içeriği ve veri modeli.
 *
 * Yazılar BURADA yaşar; sayfalar (`src/app/site/rehber/**`) yalnız okur.
 * Yeni yazı eklemek = bu dosyaya bir nesne eklemek. Başka hiçbir yere
 * dokunmak gerekmez: liste, detay, RSS ve yapısal veri kendiliğinden gelir.
 *
 * Kurallar (SITE-BRIEF.md §8 ve §8.1):
 *   - Uydurma yok: fiyat, müşteri yorumu, ödül, "%X artış", sertifika.
 *   - QR menü mevzuatında "zorunlu / ceza" dili kullanılmaz.
 *   - Yazılarımız bir hizmete bağlanır ama satış broşürü gibi yazılmaz.
 */

import { siteYolu } from '@/lib/site';
import { QR_MENU_BILGI, type Sss } from '@/lib/site-icerik';
import type { IkonAdi } from '@/components/site/Ikonlar';
import type { Bant } from '@/components/site/Bolum';

/* ================================================================== */
/* 1. Veri modeli                                                      */
/* ================================================================== */

/** Yazı kümesi (konu öbeği) anahtarları. */
export type KumeAnahtari =
  | 'reklam'
  | 'qr-menu'
  | 'yerel-arama'
  | 'web-yazilim'
  | 'sosyal-medya'
  | 'sektor';

/** Bir konu öbeği: rehberin üst kırılımı. */
export type RehberKumesi = {
  anahtar: KumeAnahtari;
  ad: string;
  /** Çip ve kart etiketlerinde kullanılan kısa ad. */
  kisaAd: string;
  aciklama: string;
  simge: IkonAdi;
  /**
   * Kümenin tercih ettiği zemin bandı (yazılım konuları koyu, stüdyo işleri
   * kâğıt). Liste sayfası iki aynı bandı yan yana koymamak için gerektiğinde
   * nötr banda düşürür.
   */
  bant: Bant;
  /** HIZMETLER içindeki `anahtar` — küme başlığının yanındaki hizmet düğmesi. */
  ilgiliHizmet: string;
};

/** Gövdeden çıkarılan içindekiler satırı. */
export type IcindekilerSatiri = { id: string; baslik: string; duzey: 2 | 3 };

/** Bir rehber yazısının tamamı. */
export type RehberYazisi = {
  /** URL parçası (ASCII, tireli). Tam adres: /rehber/<slug> */
  slug: string;
  kume: KumeAnahtari;
  /** Sayfadaki H1. */
  baslik: string;
  /** Sekme başlığı — "| Ajans Flow" DAHİL, en çok 60 karakter. */
  seoBaslik: string;
  /** Arama sonucu açıklaması — 120-158 karakter. */
  ozet: string;
  /** Yayın tarihi, ISO (YYYY-AA-GG). */
  tarih: string;
  /** Son güncelleme tarihi, ISO. Yoksa yazı hiç güncellenmemiştir. */
  guncelleme?: string;
  /** Okuma süresi, dakika. */
  okuma: number;
  etiketler: string[];
  sss: Sss[];
  /**
   * Gövde: güvenilen kaynaktan (bu dosyadan) gelen HTML.
   * `h2`/`h3` başlıkları `id` taşımak ZORUNDA — içindekiler oradan üretilir.
   */
  govde: string;
  /** HIZMETLER içindeki `anahtar` — yazı sonundaki hizmet kartı. */
  ilgiliHizmet: string;
  /** Başlığın hemen altında duran tek satırlık ön işaret (kısa cevap). */
  onIsaret: string;
};

/* ================================================================== */
/* 2. Kümeler                                                          */
/* ================================================================== */

export const REHBER_KUMELERI: RehberKumesi[] = [
  {
    anahtar: 'reklam',
    ad: 'Reklam ve bütçe',
    kisaAd: 'Reklam',
    aciklama:
      'Bütçe hesabı, ölçüm kurulumu, kampanya kurgusu ve panel rakamlarının gerçekte ne anlattığı.',
    simge: 'megafon',
    bant: 'kagit',
    ilgiliHizmet: 'meta-reklam',
  },
  {
    anahtar: 'qr-menu',
    ad: 'QR menü ve mevzuat',
    kisaAd: 'QR menü',
    aciklama:
      'Karekodlu menünün nasıl kurulduğu, fiyat listesi ve ürün bilgisi tarafında nelere dikkat edildiği.',
    simge: 'qr',
    bant: 'koyu',
    ilgiliHizmet: 'qr-menu',
  },
  {
    anahtar: 'yerel-arama',
    ad: 'Google ve yerel arama',
    kisaAd: 'Yerel arama',
    aciklama:
      'Haritada görünmek, Google İşletme Profilini doğru doldurmak ve bilgiyi her yerde tutarlı tutmak.',
    simge: 'konum',
    bant: 'beyaz',
    ilgiliHizmet: 'google-isletme',
  },
  {
    anahtar: 'web-yazilim',
    ad: 'Web sitesi ve yazılım',
    kisaAd: 'Web ve yazılım',
    aciklama:
      'Site teklifini okumak, hangi entegrasyonun gerçekten gerektiğini anlamak ve işi teslim almak.',
    simge: 'kod',
    bant: 'koyu',
    ilgiliHizmet: 'web-sitesi',
  },
  {
    anahtar: 'sosyal-medya',
    ad: 'Sosyal medya ve içerik',
    kisaAd: 'Sosyal medya',
    aciklama:
      'İçerik planı, çekim hazırlığı, Reels kurgusu ve hesabı düzenli tutmanın işleyen yolları.',
    simge: 'kamera',
    bant: 'kagit',
    ilgiliHizmet: 'sosyal-medya',
  },
  {
    anahtar: 'sektor',
    ad: 'Sektör rehberleri',
    kisaAd: 'Sektör',
    aciklama:
      'Kafe, oto galeri, klinik, salon: her işin dijital tarafında kendine özgü olan ne varsa.',
    simge: 'yildiz',
    bant: 'beyaz',
    ilgiliHizmet: 'icerik-stratejisi',
  },
];

/* ================================================================== */
/* 3. Yazılar                                                          */
/*                                                                     */
/* Gövde HTML'i bu dosyada yazılır; dışarıdan metin alınmaz. Başlıklara */
/* `id` vermek zorunlu — içindekiler listesi onlardan üretiliyor.       */
/* ================================================================== */

const QR_MENU_NASIL_YAPILIR: RehberYazisi = {
  slug: 'qr-menu-nasil-yapilir',
  kume: 'qr-menu',
  baslik: 'QR menü nasıl yapılır? Sekiz adımda kurulum',
  seoBaslik: 'QR Menü Nasıl Yapılır? Adım Adım Kurulum | Ajans Flow',
  ozet:
    'Karekodlu menüyü sıfırdan kurmanın sekiz adımı: ürün listesi, kategori kurgusu, fotoğraf seçimi, alerjen alanları, çok dilli yapı ve yayın öncesi kontrol.',
  tarih: '2026-10-06',
  okuma: 6,
  etiketler: ['QR menü', 'karekodlu menü', 'kafe', 'restoran', 'dijital menü'],
  ilgiliHizmet: 'qr-menu',
  onIsaret:
    'Karekodlu menü bir tasarım işi değil veri işi: önce ürün ve fiyat listesini düzeltin, karekod en son adım.',
  sss: [
    {
      soru: 'QR menü için ayrı bir uygulama indirtmek gerekir mi?',
      cevap:
        'Gerekmez ve önerilmez. Karekodu okutan misafir doğrudan tarayıcıda açılan bir sayfaya gitmeli; uygulama indirme, üyelik veya izin isteyen bir akış masada terk edilir.',
    },
    {
      soru: 'Menüyü kendimiz güncelleyebilir miyiz?',
      cevap:
        'Evet, zaten böyle kurulması gerekir. Fiyat ve ürün bilgisi işletmenin kendi panelinden değişmeli; her değişiklik için ajansa yazmak zorunda kalınan menü kısa sürede güncelliğini yitirir.',
    },
    {
      soru: 'Karekod değişince masadaki kartları yenilemek gerekir mi?',
      cevap:
        'Adres sabit kaldığı sürece gerekmez. Karekod sabit bir adrese bakar, menünün içeriği o adresin arkasında değişir; bu yüzden fiyat güncellemesi masa kartlarını etkilemez.',
    },
    {
      soru: 'Menüde kaç dil olmalı?',
      cevap:
        'Misafir profiline göre değişir. Türkçe esastır; turistin yoğun olduğu konumlarda İngilizce ilk eklenen dil olur. Kule İstanbul Cafe için kurduğumuz menüde Türkçe, İngilizce, Almanca ve Arapça birlikte çalışıyor.',
    },
  ],
  govde: `
<p>Karekodlu menü denince akla ilk gelen şey genelde tasarım oluyor: hangi yazı tipi, hangi renk, masada nasıl bir kart duracak. Oysa menünün ayakta kalmasını sağlayan şey tasarım değil, arkasındaki veri düzeni. Fiyatı kimin değiştireceği, ürünün mutfaktan kalktığında menüden nasıl düşeceği, aynı yemeğin dört dilde aynı şeyi anlatıp anlatmadığı belli değilse en iyi tasarım bile iki ayda eskiyor.</p>
<p>Aşağıdaki sekiz adım, bir kafe veya restoran menüsünü sıfırdan kurarken izlediğimiz sıra. Kendiniz kuracaksanız da aynı sırayı izlemenizi öneririz; en çok vakit kaybı, en son adımdan (karekod üretmekten) başlayanlarda oluyor.</p>

<h2 id="nedir">Karekodlu menü nedir, ne değildir</h2>
<p>Karekodlu menü, masadaki bir kodu okutan misafirin tarayıcısında açılan menü sayfasıdır. Basılı menünün fotoğrafını PDF olarak koymak bu işi görmez: PDF telefonda yakınlaştırma ister, aramaya kapalıdır, zayıf bağlantıda açılmaz ve fiyat değiştiğinde yeniden üretilmesi gerekir.</p>
<p>İşleyen bir karekodlu menü şu üç şeyi yapar: telefonda tek elle gezilir, ürün bilgisi aranabilir, fiyat tek yerden güncellenir. Geri kalan her şey (sipariş, rezervasyon, kampanya) bunların üstüne eklenen isteğe bağlı katmanlardır.</p>

<h2 id="hazirlik">Adım 1 — Ürün ve fiyat listesini tek yerde toplayın</h2>
<p>İşe menüden değil, listeden başlanır. Elinizdeki bütün ürünleri tek bir tabloya dökün: ürün adı, kategori, fiyat, varsa porsiyon bilgisi. Bu tabloyu çıkarırken hemen hemen her işletmede şu üçü görünür:</p>
<ul>
  <li>Menüde duran ama artık yapılmayan ürünler</li>
  <li>Kasada başka, menüde başka fiyatla duran ürünler</li>
  <li>Aynı ürünün iki ayrı kategoride iki ayrı adla yazılmış olması</li>
</ul>
<p>Bu üçünü düzeltmeden dijitale geçmek, dağınıklığı daha görünür hâle getirmekten başka bir şey yapmaz. Menü dijitalleşince fiyat farkları artık yalnız siz değil, masadaki misafir de görüyor.</p>

<h2 id="kategori">Adım 2 — Kategori ve sıralama kurgusu</h2>
<p>Telefon ekranı basılı menünün açılır sayfası kadar geniş değil; kategori sayısı arttıkça menü gezilemez hâle gelir. Pratikte işe yarayan ölçü, üst kategorinin tek ekranda görünebileceği kadar olması.</p>
<p>Sıralamada iki karar verirsiniz: kategorilerin sırası ve kategori içindeki ürünlerin sırası. İkisi de alfabetik olmak zorunda değil. Kahvaltı saatinde kahvaltı üstte, akşam saatinde ana yemek üstte olacak şekilde kurgulanabilir; karar işletmenin servis akışına göre verilir.</p>

<h2 id="fotograf">Adım 3 — Fotoğraf: hangi üründe gerekir</h2>
<p>Her ürünün fotoğrafı olmak zorunda değil, ama <strong>bazı ürünlerde fotoğraf satış yapar</strong>: misafirin adını okuyunca ne olduğunu kestiremediği ürünler, porsiyonu merak edilenler ve sunumuyla fark yaratanlar. Burada kritik olan tutarlılık: on ürünün iyi çekilmiş fotoğrafı, kırk ürünün telefonla aceleyle çekilmiş karesinden daha iyi durur.</p>
<p>Karışık ışıkta, yarısı yenmiş tabaktan ve farklı açılardan çekilmiş kareler menüyü ucuzlatır. Fotoğrafı olmayan ürünü boş çerçeveyle değil, yalnız adıyla göstermek daha iyidir. Yemek çekimi tarafında ne yaptığımızı <a href="${siteYolu('/hizmetler/fotograf-cekimi')}">fotoğraf çekimi</a> sayfasında anlattık.</p>

<h2 id="alerjen">Adım 4 — Alerjen, içerik ve diyet bilgisi için alan açın</h2>
<p>Misafirin sorduğu soruların önemli bir kısmı “bunun içinde ne var” sorusudur: fındık, süt, gluten, alkol, domuz kaynaklı bileşen. Bu bilgiyi menüye sonradan eklemek, menüyü baştan kurmak kadar iş çıkarır; o yüzden alanlar ilk kurulumda açılır.</p>
<p>Pratik kurgu şöyle: her ürünün yanında işaretlenebilir alerjen etiketleri, bir de vejetaryen / vegan gibi diyet filtreleri. Filtre açıldığında uygun olmayan ürünlerin listeden düşmesi, misafirin servis personeline soru sormasına gerek bırakmıyor. İçerik ve enerji değeri alanlarını da aynı kurulumda hazır bırakıyoruz; işletme kendi verisiyle dolduruyor.</p>

<h2 id="dil">Adım 5 — Çok dilli menü</h2>
<p>Çok dilli menü, Türkçe menünün makineyle çevrilmiş hâli değildir. Yemek adları çeviride anlamını yitirir: bir ürünün adını olduğu gibi bırakıp altına o dilde kısa bir tarif yazmak, adı zorlama çevirmekten çok daha iyi çalışır.</p>
<p>Dil seçimi menünün en üstünde, tek dokunuşla ulaşılabilir yerde durmalı. Dil değiştiğinde misafir bulunduğu kategoriden düşmemeli. Kule İstanbul Cafe için kurduğumuz menüde Türkçe, İngilizce, Almanca ve Arapça birlikte çalışıyor; <a href="${siteYolu('/calismalar/kule-istanbul-cafe')}">o çalışmayı burada</a> okuyabilirsiniz.</p>

<h2 id="karekod">Adım 6 — Karekodu üretin ve yerleştirin</h2>
<p>Karekod, menünün sabit adresine bakar. Bu yüzden önce adresi kesinleştirin, sonra kodu üretin: adres sonradan değişirse masadaki bütün kartlar çöp olur.</p>
<p>Yerleştirmede dikkat edilenler:</p>
<ul>
  <li>Kod yeterince büyük olmalı; masa kartında küçültülen kod zayıf ışıkta okunmuyor</li>
  <li>Parlak ve yansıma yapan yüzey okumayı zorlaştırıyor, mat yüzey tercih edilir</li>
  <li>Kodun yanında tek satırlık bir yönlendirme bulunmalı: ne olduğu ve okutulunca ne açılacağı</li>
  <li>Masa dışında da karekoda ihtiyaç olur: giriş, vitrin, kasa, paket servis torbası</li>
</ul>

<h2 id="guncelleme">Adım 7 — Güncelleme düzenini kurun</h2>
<p>Dijital menünün tek gerçek üstünlüğü, güncellenebilir olması. Bu üstünlüğü kullanabilmek için iki soruya baştan cevap vermek gerekiyor: <strong>fiyatı kim değiştirecek</strong> ve <strong>değişiklik kaç dakikada menüye yansıyacak</strong>.</p>
<p>Cevap “ajansa yazarız” ise menü altı ay içinde güncelliğini yitirir. İşletmede menüyü değiştirecek kişinin tanımlı olması, panelin telefondan da kullanılabilmesi ve fiyatın tek kaynaktan beslenmesi gerekiyor. Menü ile kasa arasında fiyat farkı oluşmasını en çok bu düzen engelliyor.</p>

<h2 id="kontrol">Adım 8 — Yayın öncesi son kontrol</h2>
<p>Menüyü açmadan önce elimizde tuttuğumuz liste:</p>
<ol>
  <li>Hizmete sunulan bütün ürünler listede var mı?</li>
  <li>Fiyatı boş kalmış ürün var mı?</li>
  <li>Menüdeki fiyatlar kasadaki fiyatlarla aynı mı?</li>
  <li>Karekod, zayıf bağlantıda ve farklı telefonlarda açılıyor mu?</li>
  <li>Dil değiştirince eksik kalan kategori veya ürün var mı?</li>
  <li>Alerjen ve diyet filtreleri doğru ürünleri gösteriyor mu?</li>
  <li>Giriş kapısı için basılabilir fiyat listesi çıktısı hazır mı?</li>
  <li>“Karekodu okuyamayan misafirlerimize bilgi ayrıca sunulur” ibaresi masa kartında ve menüde yazılı mı?</li>
</ol>

<h2 id="hatalar">Sık yapılan altı hata</h2>
<ul>
  <li><strong>Menüyü PDF koymak.</strong> Telefonda yakınlaştırma ister, aranamaz, güncellenemez.</li>
  <li><strong>Kayıt veya uygulama istemek.</strong> Masada en çok terk edilen adım budur.</li>
  <li><strong>Ağır fotoğraflarla yüklemek.</strong> Menü, kafedeki zayıf bağlantıda açılmak zorunda.</li>
  <li><strong>Fiyatı iki yerde tutmak.</strong> Kasa ile menü ayrı listeden besleniyorsa fark kaçınılmaz.</li>
  <li><strong>Basılı fiyat listesini kaldırmak.</strong> Giriş kapısı önündeki liste yükümlülüğü sürüyor.</li>
  <li><strong>Menüye servis veya kuver satırı eklemek.</strong> Yiyecek içecek hizmeti verilen işyerlerinde bu adla ek ödeme istenemiyor.</li>
</ul>

<h2 id="mevzuat">Mevzuat tarafı</h2>
<p>Karekodlu menü hakkında dolaşan en yaygın yanlış bilgi, zorunlu olduğu. Değil: karekod, masadaki fiyat listesini göstermek için izin verilen yöntemlerden biri. Zorunlu olan şey, fiyat listesinin eksiksiz ve doğru gösterilmesi ile ürün bilgisinin misafire ulaşması.</p>
<p>Buna bağlı üç şey karekoda geçtikten sonra da yerinde kalıyor: giriş kapısı önündeki fiziki fiyat listesi, misafir talep ettiğinde listenin ayrıca verilmesi ve karekodu okuyamayan misafire bilginin başka bir yolla sunulduğunu belirten bilgilendirme.</p>
<p>Hangi yükümlülüğün hangi düzenlemeden geldiğini, madde numaraları ve Resmî Gazete bilgileriyle ayrı bir sayfada derledik: <a href="${siteYolu('/qr-menu')}">QR menü ve mevzuat</a>. O sayfadaki son mevzuat kontrolü ${QR_MENU_BILGI.sonKontrolTarihi} tarihli. Mevzuat değişebilir; işletmenize özgü değerlendirme için bağlı olduğunuz meslek odasına danışmanızı öneririz.</p>

<h2 id="ozet">Özet</h2>
<p>Karekodlu menü kurmanın zor tarafı yazılım değil, sıralama. Ürün listesini temizleyip fiyatı tek kaynağa bağlayan bir işletme, menüyü hangi araçla kurarsa kursun iyi bir sonuç alıyor. Listeyi düzeltmeden tasarıma geçen işletme ise altı ay sonra aynı yerde duruyor.</p>
`,
};

const INSTAGRAM_REKLAM_BUTCESI: RehberYazisi = {
  slug: 'instagram-reklam-butcesi',
  kume: 'reklam',
  baslik: 'Instagram reklamına ne kadar bütçe ayırmalı?',
  seoBaslik: 'Instagram Reklam Bütçesi Nasıl Belirlenir? | Ajans Flow',
  ozet:
    'Instagram reklam bütçesi tahminle değil hesapla bulunur: müşteri değerinden başlayıp hedefi sayıya çeviren, ölçümü reklamdan önce kuran bir yöntem.',
  tarih: '2026-10-06',
  okuma: 5,
  etiketler: ['Instagram reklamı', 'Meta reklam', 'reklam bütçesi', 'dönüşüm', 'ölçüm'],
  ilgiliHizmet: 'meta-reklam',
  onIsaret:
    'Bütçeyi “ne kadar” diye sormak yanlış: bir müşterinin size kazandırdığı tutarı bilmeden doğru rakam bulunamaz.',
  sss: [
    {
      soru: 'Küçük bir bütçeyle reklam vermek anlamlı mı?',
      cevap:
        'Anlamlı, ama hedefi daralttığınız sürece. Küçük bütçe tek bir şeyi test etmeye yeter: tek kitle, tek mesaj, tek hedef. Aynı bütçeyi üç kampanyaya bölmek, hiçbirinin sonucunu okunabilir hâle getirmiyor.',
    },
    {
      soru: 'Reklam bütçesini ajansa mı ödüyoruz?',
      cevap:
        'Hayır. Reklam bütçesi doğrudan Meta’ya, kendi reklam hesabınızdan ödenir ve hesabın sahibi sizsiniz. Ajans bedeli kurulum, kampanya yönetimi, kreatif üretimi ve raporlama karşılığıdır; ikisi ayrı kalemdir.',
    },
    {
      soru: 'Kampanyayı kaç günde değerlendirmek gerekir?',
      cevap:
        'Birkaç günlük veriyle karar vermek yanıltıcı. Reklam setinin öğrenme aşamasını tamamlaması gerekiyor; o aşamada maliyetler dalgalı olur. Değerlendirme, yeterli sonuç birikmeden değil, biriktikten sonra yapılır.',
    },
    {
      soru: 'Bütçeyi birden artırmak zarar verir mi?',
      cevap:
        'Sert artışlar reklam setini yeniden öğrenme aşamasına sokabiliyor. Bu yüzden artışları kademeli yapıp her kademede sonuç başına maliyetin nereye gittiğini izliyoruz.',
    },
  ],
  govde: `
<p>“Instagram reklamına ne kadar bütçe ayırmalıyım?” sorusuna internette dolaşan cevapların neredeyse tamamı bir rakam söylüyor. O rakamların hiçbiri sizin işiniz için hesaplanmadı: aynı günlük bütçe, bir diş kliniği için fazla, bir oto galeri için komik olabiliyor. Çünkü bütçeyi belirleyen şey reklamın maliyeti değil, <strong>bir müşterinin size ne kazandırdığı</strong>.</p>
<p>Bu yazıda rakam vermiyoruz; rakamı kendi işiniz için bulmanızı sağlayan hesabı anlatıyoruz. Hesap altı adım. Sonunda elinizde bir bütçe aralığı ve o bütçenin neye göre artıp azalacağını söyleyen bir ölçüt oluyor.</p>

<h2 id="yanlis-soru">Neden “ne kadar” yanlış soru</h2>
<p>Reklam bütçesi bir maliyet kalemi gibi sorulduğunda cevabı yok. Doğru soru şu: <em>bir müşteri kazanmak için en fazla ne kadar harcayabilirim ve ayda kaç müşteri istiyorum?</em> Bu iki sayı belli olduğunda bütçe kendiliğinden çıkıyor.</p>
<aside class="af-rb-not"><p><span class="af-ornek-damga">örnek</span> Aşağıdaki rakamlar gerçek bir işletmeye ait değil, yalnızca hesabı göstermek için: bir müşteri size ortalama 2.000 lira bırakıyor ve maliyetlerden sonra elinizde 800 lira kalıyorsa, bir müşteriyi 800 liranın belirgin şekilde altında bir maliyetle kazanmanız gerekiyor. Bu üst sınır bilinmeden hiçbir kampanya “pahalı” ya da “ucuz” diye değerlendirilemez.</p></aside>

<h2 id="musteri-degeri">Adım 1 — Bir müşteri size ne kazandırıyor</h2>
<p>İki sayıya ihtiyacınız var ve ikisi de reklam panelinde değil, sizin kayıtlarınızda:</p>
<ul>
  <li><strong>Ortalama satış tutarı.</strong> Bir müşteri ilk gelişinde ortalama ne kadar harcıyor?</li>
  <li><strong>Tekrar oranı.</strong> Müşteri bir yıl içinde ortalama kaç kez geliyor?</li>
</ul>
<p>Bu ikisinin çarpımı, müşterinin size bir yıl içinde bıraktığı tutara yaklaşıyor. Üstünden ürün maliyetini, personeli ve sabit giderleri düşünce elinizde kalan tutar, bir müşteri için harcayabileceğiniz üst sınırı belirliyor.</p>
<p>Kafe gibi tekrar oranı yüksek işlerde bu sayı ilk bakışta sanıldığından büyük çıkıyor. Tek seferlik satış yapan işlerde ise tam tersi: ilk satıştaki kârın üstüne çıkan hiçbir reklam maliyeti sürdürülebilir olmuyor.</p>

<h2 id="hedef">Adım 2 — Hedefi sayıya çevirin</h2>
<p>“Daha fazla müşteri” bir hedef değil. Hedef şöyle yazılır: <em>ayda 20 yeni randevu</em>, <em>ayda 40 rezervasyon talebi</em>, <em>ayda 15 teklif formu</em>. Sayı yazıldığı anda bütçe hesabı mümkün hâle geliyor.</p>
<p>Sonra iki kırılım daha gerekiyor: bir reklam dönüşümünün (form, mesaj, arama) kaçının gerçek müşteriye döndüğü. Ayda 20 müşteri istiyorsanız ve gelen taleplerin yarısı müşteriye dönüyorsa, 40 talep hedeflemeniz gerekiyor. Bu oran sizin satış tarafınızla ilgili; reklam onu düzeltmiyor.</p>

<h2 id="olcum">Adım 3 — Ölçümü reklamdan önce kurun</h2>
<p>Bu adım atlandığında geri kalan her şey tahmine dönüşüyor. Reklam açmadan önce şunların kurulu olması gerekiyor:</p>
<ul>
  <li>Sitede dönüşüm olaylarının (form gönderimi, WhatsApp tıklaması, arama) ölçülmesi</li>
  <li>Reklamdan gelen trafiğin, diğer kaynaklardan ayrılabilmesi</li>
  <li>Gelen talebin nereden geldiğinin kayda geçmesi: formda kaynak alanı veya ayrı bir WhatsApp mesaj şablonu</li>
</ul>
<p>Ölçüm kurulmadan açılan kampanya, panelde “ucuz tıklama” gösterip kasada hiçbir şey göstermiyor. Bizim kurulum sırası da bu yüzden hep aynı: önce ölçüm, sonra iniş sayfası, en son reklam. Ölçüm tarafında ne yaptığımızı <a href="${siteYolu('/hizmetler/veri-analizi-raporlama')}">veri analizi ve raporlama</a> sayfasında anlattık.</p>

<h2 id="ogrenme">Adım 4 — Öğrenme aşamasını hesaba katın</h2>
<p>Meta’nın kendi reklam yardım belgelerinde, bir reklam setinin yayına alındıktan sonra <strong>öğrenme aşamasına</strong> girdiği ve haftalık yaklaşık 50 optimizasyon olayına ulaşana kadar bu aşamada kaldığı yazılı. Bu aşamada sonuç başına maliyet dalgalı olur ve kampanya hakkında verilen kararlar yanıltıcı olabilir.</p>
<p>Bütçe hesabı için pratik anlamı şu: haftalık bütçeniz, hedeflediğiniz dönüşüm olayından yeterli sayıda üretemeyecek kadar küçükse reklam seti öğrenme aşamasından çıkamıyor. Bu durumda yapılan şey bütçeyi artırmak değil, <strong>daha sık gerçekleşen bir olayı hedeflemek</strong>: satın alma yerine form, form yerine iniş sayfası görüntüleme.</p>
<p>Bu eşik Meta’nın yayımladığı bir kural; kampanya kurmadan önce güncel hâlini Meta Reklam Yardım Merkezi’nden teyit etmenizi öneririz.</p>

<h2 id="dagitim">Adım 5 — Bütçeyi test ve ölçekleme diye ayırın</h2>
<p>Yeni başlayan bir hesapta bütçenin tamamını tek kampanyaya vermek, en pahalı öğrenme yolu. İşleyen ayrım şöyle:</p>
<ul>
  <li><strong>Test bütçesi.</strong> Hangi mesajın, hangi görselin ve hangi kitlenin çalıştığını bulmak için. Burada amaç satış değil bilgi.</li>
  <li><strong>Ölçekleme bütçesi.</strong> Testten çıkan kazananı büyütmek için. Burada amaç satış.</li>
</ul>
<p>İlk ayda ağırlık testte olur; işleyen kurgu bulunduktan sonra ağırlık ölçeklemeye kayar. Testi bitmemiş bir kurguyu ölçeklemek, bütçeyi en hızlı tüketen hata.</p>

<h2 id="artirma">Adım 6 — Bütçeyi ne zaman artırırsınız</h2>
<p>Bütçe artışının tek meşru gerekçesi var: <strong>sonuç başına maliyet, müşteri başına harcayabileceğiniz üst sınırın altında kalıyor ve talep karşılanabiliyor.</strong> İkinci koşul sık atlanıyor: ayda 40 talep karşılayabilen bir işletmeye 120 talep getirmek, cevaplanmayan mesaj yığını ve kötü yorum üretiyor.</p>
<p>Artışı kademeli yapıyoruz, çünkü sert bütçe değişiklikleri reklam setini yeniden öğrenme aşamasına sokabiliyor. Her kademeden sonra sonuç başına maliyetin nereye gittiğini izleyip bir sonraki kademeye geçiyoruz.</p>

<h2 id="kavramlar">Reklam panelindeki rakamlar ne anlatır</h2>
<p>Panelde en çok karşılaşılan dört rakam ve gerçekte ne söyledikleri:</p>
<ul>
  <li><strong>Erişim:</strong> reklamı gören farklı kişi sayısı.</li>
  <li><strong>Gösterim:</strong> reklamın kaç kez ekranda göründüğü. Aynı kişi birden çok kez sayılır.</li>
  <li><strong>CPM:</strong> bin gösterim başına maliyet. Rekabete ve kitleye göre değişir; tek başına iyi ya da kötü değildir.</li>
  <li><strong>CTR:</strong> reklamı görenlerin ne kadarının tıkladığı. Kreatifin ve mesajın işe yarayıp yaramadığını en hızlı bu söyler.</li>
</ul>
<p>Bunların hiçbiri sonuç değil. Karar verdiren tek rakam, <strong>sonuç başına maliyet</strong>: bir form, bir mesaj veya bir satışın kaça geldiği. Düşük CPM’li bir kampanya hiç form getirmiyorsa pahalıdır.</p>

<h2 id="israf">Bütçeyi boşa harcatan beş şey</h2>
<ol>
  <li><strong>İniş sayfasının olmaması.</strong> Reklam Instagram profiline düşüyorsa talep kayboluyor; reklamın gittiği yer, reklamda anlatılan şeyi anlatan bir sayfa olmalı.</li>
  <li><strong>Tek kreatif.</strong> Aynı görsel uzun süre aynı kitleye gösterildiğinde performans düşüyor. Kreatif tazelemesi bütçe kadar belirleyici.</li>
  <li><strong>Hedefin çok dar tutulması.</strong> Aşırı daraltılmış kitlelerde maliyet yükseliyor ve öğrenme aşaması tamamlanamıyor.</li>
  <li><strong>Kampanyayı sürekli açıp kapatmak.</strong> Her müdahale öğrenmeyi sıfırlıyor.</li>
  <li><strong>Gelen talebe geç dönmek.</strong> Reklamın getirdiği talep saatler içinde soğuyor; en pahalı kayıp burada oluyor.</li>
</ol>

<h2 id="ajans-bedeli">Reklam bütçesi ile ajans bedeli ayrı kalemler</h2>
<p>Reklam bütçesi doğrudan Meta’ya, kendi reklam hesabınızdan ödenir. Hesabın ve verinin sahibi sizsiniz; çalışmaya son verseniz de hesap sizde kalıyor. Ajans bedeli ise kurulum, kampanya yönetimi, kreatif üretimi ve raporlama karşılığı. Bu iki kalemi aynı toplamda gösteren bir teklif, reklama gerçekte ne kadar gittiğini görmenizi engelliyor.</p>

<h2 id="ozet">Özet</h2>
<p>Bütçe sorusunun cevabı bir rakam değil, bir hesap: müşterinizin değeri, aylık hedefiniz, dönüşüm oranınız ve ölçümünüz. Bu dördü belliyse bütçe kendiliğinden çıkıyor ve ne zaman artırılacağı tartışma konusu olmuyor. Dördü belli değilse, hangi rakamla başlarsanız başlayın sonucu okuyamıyorsunuz.</p>
`,
};

const GOOGLE_ISLETME_PROFILI: RehberYazisi = {
  slug: 'google-isletme-profili-nasil-duzenlenir',
  kume: 'yerel-arama',
  baslik: 'Google İşletme Profili nasıl düzenlenir?',
  seoBaslik: 'Google İşletme Profili Nasıl Düzenlenir? | Ajans Flow',
  ozet:
    'Google İşletme Profilini adım adım düzenleme rehberi: sahiplik doğrulama, kategori, adres, çalışma saatleri, fotoğraf, hizmet listesi ve yorum yönetimi.',
  tarih: '2026-10-07',
  okuma: 5,
  etiketler: ['Google İşletme Profili', 'Google Haritalar', 'yerel arama', 'harita görünürlüğü'],
  ilgiliHizmet: 'google-isletme',
  onIsaret:
    'Profili yönetmek için ayrı bir panel yok: doğrulanmış profili Google Arama veya Haritalar içinden düzenliyorsunuz.',
  sss: [
    {
      soru: 'Profilim var ama düzenleyemiyorum, ne yapmalıyım?',
      cevap:
        'Profil Google tarafından veya başka biri tarafından oluşturulmuş olabilir. Bu durumda profilin sahipliğini talep edip doğrulamanız gerekiyor; doğrulama tamamlanana kadar düzenleme hakkı açılmıyor.',
    },
    {
      soru: 'İşletme adına anahtar kelime eklemek sıralamayı yükseltir mi?',
      cevap:
        'Google’ın işletme adı kuralları, adın gerçek dünyada kullanılan ad olmasını istiyor. Ada hizmet veya konum eklemek askıya alınma riski taşıyor; kazancı varsayılandan çok daha küçük, riski büyük.',
    },
    {
      soru: 'Yorumları silebilir miyiz?',
      cevap:
        'Yorumları siz silemiyorsunuz. Yalnızca Google’ın içerik kurallarını ihlal eden yorumları bildirebiliyorsunuz. Olumsuz yorumun gerçek karşılığı silmek değil, sakin ve çözüm öneren bir cevap yazmak.',
    },
    {
      soru: 'Adresi olmayan, yerinde hizmet veren bir iş profil açabilir mi?',
      cevap:
        'Açabilir. Müşteriye gidilen işler için profil, açık adres yerine hizmet bölgesi tanımlanarak kurulur. Bu durumda haritada bir nokta değil, hizmet verilen alan gösteriliyor.',
    },
  ],
  govde: `
<p>Bir kafeyi, kliniği veya galeriyi arayan kişi çoğu zaman web sitesine değil, haritadaki karta bakıyor: açık mı, nerede, kaç yorum almış, fotoğrafları nasıl. Bu kart Google İşletme Profili. Profil eksik veya yanlışsa, sitesi ne kadar iyi olursa olsun işletme o aramada kaybediyor.</p>
<p>Aşağıda profili sıfırdan düzenlemenin sırası var. Önemli bir şeyi baştan söylemek gerekiyor: profili yönetmek için ayrı bir panele girmiyorsunuz. Google, profil yönetimini doğrudan Arama ve Haritalar içine taşıdı; işletme hesabınızla arama yaptığınızda profilin düzenleme seçenekleri karşınıza geliyor.</p>

<h2 id="neden">Profil neden harita sonucunu belirler</h2>
<p>Yerel aramada hangi işletmenin görüneceğini Google üç şeye bakarak belirliyor: aramayla <strong>ilgi</strong>, arayan kişiye <strong>uzaklık</strong> ve işletmenin <strong>bilinirliği</strong>. Uzaklık üzerinde elinizde bir şey yok. İlgi doğrudan profilin ne kadar doğru ve eksiksiz doldurulduğuyla ilgili; bilinirlik ise yorumlar, site ve internetteki tutarlı bilgiyle besleniyor.</p>
<p>Yani profili doldurmak kozmetik bir iş değil: aramayla eşleşmenizi sağlayan tek sinyal grubunu doldurmak.</p>

<h2 id="sahiplik">Adım 1 — Profilin sahipliğini alın ve doğrulayın</h2>
<p>Çoğu işletmenin farkında olmadığı bir profil zaten var: Google, kullanıcı katkılarından veya başka kaynaklardan işletme kaydı oluşturabiliyor. İlk iş, o kaydı bulup sahipliğini talep etmek.</p>
<p>İşletme adını Google’da arayıp kartın üzerinde sahiplik talebi bağlantısını görüyorsanız profil sizin adınıza doğrulanmamış demektir. Doğrulama yöntemi işletme türüne göre değişiyor; Google doğrulama tamamlanana kadar düzenlemelerin çoğunu açmıyor. Profil başka birinin yönetiminde görünüyorsa (eski bir ajans, eski bir çalışan) sahiplik devri talebi açılıyor.</p>

<h2 id="isim">Adım 2 — İşletme adı</h2>
<p>İşletme adı, tabelada ve faturada yazan ad olmalı. Araya hizmet veya semt eklemek yaygın bir hata: “Kuaför Ayşe” yerine “Kuaför Ayşe | Beşiktaş Saç Bakımı Kaynak Ombre” yazmak sıralamayı yükseltmiyor, profili askıya alınma riskine sokuyor.</p>
<p>Hizmet ve konum bilgisi için zaten ayrı alanlar var: kategori, hizmet listesi ve adres. Anahtar kelimeyi doğru alana yazdığınızda ada ihtiyaç kalmıyor.</p>

<h2 id="kategori">Adım 3 — Kategori seçimi</h2>
<p>Profilin en belirleyici tek alanı kategori. Birincil kategori ne yaptığınızı en iyi anlatan tek seçenek olmalı; ek kategoriler gerçekten verdiğiniz diğer hizmetler için eklenir.</p>
<p>İki sık hata: birincil kategoriyi fazla genel seçmek (“restoran” yerine işin karşılığı neyse onu seçmek gerekir) ve vermediğiniz hizmetleri ek kategori olarak eklemek. İkincisi, alakasız aramalarda görünüp düşük etkileşim almanıza yol açıyor.</p>

<h2 id="adres">Adım 4 — Adres, hizmet bölgesi ve telefon</h2>
<p>Müşterinin geldiği bir mekânınız varsa adres eksiksiz girilir ve haritadaki iğne kapının önüne denk gelecek şekilde düzeltilir. İğne yanlış yerdeyse müşteri yolu bulamıyor; bu doğrudan kötü yorum üretiyor.</p>
<p>Müşteriye gittiğiniz bir iş yapıyorsanız açık adres yerine hizmet bölgesi tanımlanır. Telefon numarası, o numaradan gerçekten ulaşılabilen numara olmalı; cevaplanmayan numara profilin en pahalı eksiği.</p>

<h2 id="saat">Adım 5 — Çalışma saatleri ve özel günler</h2>
<p>Çalışma saatleri profilde en çok bakılan bilgi. Yanlış saat, kapıdan dönen müşteri ve olumsuz yorum anlamına geliyor.</p>
<p>Normal saatlerin yanında <strong>özel günler</strong> alanını kullanmak gerekiyor: resmî tatiller, bayram, yıllık izin, tadilat. Bu alan doldurulmadığında Google normal saatleri gösteriyor ve tatil gününde “açık” yazıyor.</p>

<h2 id="fotograf">Adım 6 — Fotoğraflar</h2>
<p>Profil fotoğrafları çoğu zaman web sitesinden önce görülüyor. Olması gerekenler: dış görünüş (müşteri kapıyı tanıyabilsin), iç mekân, ürün veya hizmetin kendisi ve logo.</p>
<p>Fotoğrafları bir kere yükleyip bırakmak yerine periyodik olarak eklemek işe yarıyor; profil hareketli kaldığında kart daha zengin görünüyor. Yüklenen her kare telefonla aceleyle çekilmiş olmak zorunda değil: aynı çekimde site, sosyal medya ve profil için kullanılabilecek kareler birlikte alınıyor.</p>

<h2 id="hizmet">Adım 7 — Ürün ve hizmet listesi</h2>
<p>Hizmet listesi, profilin en çok boş bırakılan alanı. Verdiğiniz her hizmeti adıyla ve kısa açıklamasıyla eklemek, hem müşterinin kartta cevap bulmasını hem de aramayla eşleşmeyi kolaylaştırıyor.</p>
<p>Burada fiyat yazmak zorunlu değil. Fiyat yazmayı tercih etmiyorsanız hizmet adını ve kapsamını yazıp detayı site üzerindeki ilgili sayfaya bırakmak daha iyi çalışıyor.</p>

<h2 id="yorum">Adım 8 — Değerlendirmeler ve cevaplar</h2>
<p>Yorum iki yönden önemli: müşterinin kararını etkiliyor ve profilin bilinirlik tarafını besliyor. Yorum sayısını artırmanın meşru yolu tek: hizmeti alan memnun müşteriden yorum istemek. Yorum satın almak veya sahte yorum yazdırmak Google’ın kurallarına aykırı ve profili riske atıyor.</p>
<p>Cevap yazma alışkanlığı en çok fark yaratan şey. Olumlu yorumlara kısa bir teşekkür, olumsuz yorumlara savunmaya geçmeyen, olayı kabul eden ve çözüm öneren bir cevap yazılır. Olumsuz yorumun altındaki sakin cevap, yorumun kendisinden daha çok okunuyor.</p>

<h2 id="sorular">Adım 9 — Sorular ve cevaplar</h2>
<p>Profildeki soru-cevap bölümünü herkes doldurabiliyor; yanlış cevabı bir yabancının yazması mümkün. En iyi yöntem, sık sorulan soruları kendi hesabınızdan sorup cevaplamak: otopark var mı, rezervasyon alıyor musunuz, kart geçiyor mu, çocuk menüsü var mı.</p>

<h2 id="guncelleme">Adım 10 — Güncellemeler</h2>
<p>Profilde kısa duyuru paylaşabileceğiniz bir güncelleme alanı var: yeni ürün, kampanya, etkinlik, çalışma saati değişikliği. Düzenli ama seyrek kullanmak yeterli; boş kalan bir profil sahipsiz görünüyor, günde üç duyuru ise kimseye ulaşmıyor.</p>

<h2 id="site">Adım 11 — Site bağlantısı ve bilgi tutarlılığı</h2>
<p>Profildeki site bağlantısı, işletmenin ana sayfasına veya o konuma ait sayfaya gitmeli. Birden çok şubeniz varsa her profilin kendi şube sayfasına bağlanması daha iyi çalışıyor.</p>
<p>Son olarak tutarlılık: işletme adı, adres ve telefonun profilde, sitede ve diğer dizinlerde <strong>birebir aynı</strong> yazması gerekiyor. Sitede yapısal veri kullanıyorsanız (LocalBusiness) orada yazan bilgiler de profille aynı olmalı. Farklı yazılmış bilgiler Google tarafında belirsizlik oluşturuyor.</p>

<h2 id="hatalar">Profili zedeleyen hatalar</h2>
<ul>
  <li><strong>Ada anahtar kelime doldurmak.</strong> Kazancı yok, askıya alınma riski var.</li>
  <li><strong>Doğrulamayı tamamlamamak.</strong> Doğrulanmayan profil düzenlenemiyor ve güvenilirliği düşük kalıyor.</li>
  <li><strong>Sahte yorum.</strong> Kurallara aykırı; yakalandığında profil ve yorumlar birlikte zarar görüyor.</li>
  <li><strong>Eski telefonun profilde kalması.</strong> Ulaşılamayan numara en pahalı eksik.</li>
  <li><strong>Tatil günlerinin girilmemesi.</strong> Kapıdan dönen müşteri yorumu yazıyor.</li>
  <li><strong>Profilin eski ajansın hesabında kalması.</strong> Çalışma bittiğinde sahipliğin devredildiğinden emin olun.</li>
</ul>

<h2 id="ozet">Özet</h2>
<p>Google İşletme Profili, yerel aramada elinizde olan en doğrudan araç ve tamamı ücretsiz. İş, doğrulamayı tamamlamak, kategoriyi doğru seçmek, saatleri ve hizmetleri gerçeğe uygun tutmak, fotoğrafı tazelemek ve yorumlara cevap yazmaktan oluşuyor. Bunlar yapıldığında profil, siteyle birlikte çalışan ikinci bir vitrine dönüşüyor.</p>
`,
};

/**
 * Yayındaki yazılar. Sıralama önemsiz — `rehberSirali()` tarihe göre diziyor.
 * Liste boşsa `/rehber` sayfası düzgün bir "boş durum" basıyor.
 */
export const REHBER: RehberYazisi[] = [
  QR_MENU_NASIL_YAPILIR,
  INSTAGRAM_REKLAM_BUTCESI,
  GOOGLE_ISLETME_PROFILI,
];

/* ================================================================== */
/* 4. Yardımcılar                                                      */
/* ================================================================== */

/** Yazı sayfasının tam yolu. */
export function rehberYolu(yazi: RehberYazisi | string): string {
  const slug = typeof yazi === 'string' ? yazi : yazi.slug;
  return siteYolu(`/rehber/${slug}`);
}

/** Küme çipinin bağlantısı (liste sayfasındaki bölüm çapası). */
export function kumeCapasi(anahtar: KumeAnahtari): string {
  return `#${anahtar}`;
}

/** `slug` ile yazı bulur. */
export function rehberBul(slug: string): RehberYazisi | undefined {
  return REHBER.find((y) => y.slug === slug);
}

/** `anahtar` ile küme bulur. */
export function kumeBul(anahtar: string): RehberKumesi | undefined {
  return REHBER_KUMELERI.find((k) => k.anahtar === anahtar);
}

/** Yeniden eskiye sıralı yazılar (güncelleme değil, yayın tarihine göre). */
export function rehberSirali(): RehberYazisi[] {
  return [...REHBER].sort((a, b) => b.tarih.localeCompare(a.tarih));
}

/** Bir kümenin yazıları, yeniden eskiye. */
export function kumeYazilari(anahtar: KumeAnahtari): RehberYazisi[] {
  return rehberSirali().filter((y) => y.kume === anahtar);
}

/** Yazısı olan kümeler — boş küme için başlık basılmaz. */
export function doluKumeler(): RehberKumesi[] {
  return REHBER_KUMELERI.filter((k) => REHBER.some((y) => y.kume === k.anahtar));
}

/** Aynı kümeden başlayıp gerekirse diğerlerinden tamamlayan okuma önerisi. */
export function ilgiliYazilar(yazi: RehberYazisi, adet = 2): RehberYazisi[] {
  const digerleri = rehberSirali().filter((y) => y.slug !== yazi.slug);
  const ayniKume = digerleri.filter((y) => y.kume === yazi.kume);
  const kalan = digerleri.filter((y) => y.kume !== yazi.kume);
  return [...ayniKume, ...kalan].slice(0, adet);
}

/** Yazının son değişiklik tarihi (güncelleme varsa o). */
export function sonTarih(yazi: RehberYazisi): string {
  return yazi.guncelleme ?? yazi.tarih;
}

const AYLAR = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

/**
 * '2026-10-06' → '6 Ekim 2026'.
 * `toLocaleDateString` kullanılmıyor: sunucu ve tarayıcı farklı sonuç verip
 * hidrasyon uyuşmazlığı çıkarabiliyor.
 */
export function tarihYaz(iso: string): string {
  const [yil, ay, gun] = iso.split('-').map(Number);
  const adi = AYLAR[(ay ?? 1) - 1];
  if (!yil || !adi || !gun) return iso;
  return `${gun} ${adi} ${yil}`;
}

const BASLIK_DESENI = /<h([23])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;

/** Gövde HTML'inden içindekiler listesi çıkarır. */
export function icindekiler(govde: string): IcindekilerSatiri[] {
  const satirlar: IcindekilerSatiri[] = [];
  for (const esleme of govde.matchAll(BASLIK_DESENI)) {
    const duzey = Number(esleme[1]) === 3 ? 3 : 2;
    const baslik = esleme[3].replace(/<[^>]+>/g, '').trim();
    if (baslik) satirlar.push({ id: esleme[2], baslik, duzey });
  }
  return satirlar;
}

/** Gövdedeki kelime sayısı — `okuma` alanını kontrol etmek için. */
export function kelimeSayisi(govde: string): number {
  return govde
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

/* ================================================================== */
/* 5. Liste sayfası metinleri                                          */
/* ================================================================== */

export const REHBER_SAYFASI = {
  ustEtiket: 'Rehber',
  baslik: 'Satın alma kararınızı kolaylaştıran yazılar.',
  giris:
    'QR menü kurulumundan reklam bütçesi hesabına, Google İşletme Profilinden web sitesi teklifini okumaya kadar; işletme sahibinin gerçekten sorduğu soruları yazıyoruz. Mevzuat konularında dayandığımız kaynağı gösteriyor, uydurma rakam kullanmıyoruz.',
  bosBaslik: 'İlk yazılar hazırlanıyor.',
  bosMetin:
    'Rehber yazıları yayına alınma sırasında. Bu arada sorunuzu doğrudan sorabilirsiniz: aynı gün dönüyoruz.',
  metaBaslik: 'Rehber: Dijital Pazarlama ve Yazılım Yazıları',
  metaAciklama:
    'QR menü kurulumu, Instagram reklam bütçesi, Google İşletme Profili ve web sitesi rehberleri. İşletme sahibinin sorduğu sorulara kaynaklı yanıtlar.',
  anahtarKelimeler: [
    'dijital pazarlama rehberi',
    'QR menü rehberi',
    'Instagram reklam bütçesi',
    'Google İşletme Profili',
  ],
} as const;
