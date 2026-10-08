/**
 * Rehber (blog) içeriği ve veri modeli.
 *
 * Yazılar BURADA yaşar; sayfalar (`src/app/site/rehber/**`) yalnız okur.
 * Yeni yazı eklemek = bu dosyaya bir nesne eklemek. Başka hiçbir yere
 * dokunmak gerekmez: liste, detay, RSS, sitemap ve yapısal veri
 * kendiliğinden gelir.
 *
 * Kurallar (SITE-BRIEF.md §8 ve §8.1):
 *   - Uydurma yok: fiyat, müşteri yorumu, ödül, "%X artış", sertifika.
 *     Rakam kalacaksa kaynağı yazının İÇİNDE görünür olur.
 *   - QR menü mevzuatında "zorunlu / ceza yersiniz" korku dili KULLANILMAZ.
 *     Mevzuat iddiaları `arastirma/02-qr-menu-mevzuati.md` ile birebir
 *     uyuşmak zorunda; madde ve tarih listesi oradan okunur.
 *   - Yazılarımız bir hizmete bağlanır ama satış broşürü gibi yazılmaz.
 *   - Türkçe kesme işareti ’ (U+2019) kullanılır; ASCII ' dizgiyi bozar.
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
  /** Arama sonucu açıklaması — 120-155 karakter. */
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
    /* Sektör yazılarının ortak çıkışı site ve yazılım tarafı oluyor. */
    ilgiliHizmet: 'web-sitesi',
  },
];

/* ================================================================== */
/* 3. Yazılar                                                          */
/*                                                                     */
/* Gövde HTML'i bu dosyada yazılır; dışarıdan metin alınmaz. Başlıklara */
/* `id` vermek zorunlu — içindekiler listesi onlardan üretiliyor.       */
/*                                                                     */
/* Mevzuat içeren yazılarda üç öge ZORUNLU:                            */
/*   1. En üstte "son mevzuat kontrolü" damgası,                       */
/*   2. Sonda birincil kaynak listesi (Resmî Gazete / mevzuat.gov.tr), */
/*   3. "Hukuki görüş değildir" sorumluluk notu.                       */
/* ================================================================== */

/** Mevzuat yazılarının başındaki damga + sorumluluk notu. */
const MEVZUAT_NOTU = `
<aside class="af-rb-not af-rb-damga">
  <p><span class="af-mono-etiket">${QR_MENU_BILGI.sonKontrolEtiketi}: ${QR_MENU_BILGI.sonKontrolTarihi}</span></p>
  <p>Bu yazı bilgilendirme amaçlıdır, hukuki görüş niteliği taşımaz. Mevzuat değişebilir; aşağıdaki bilgiler yazılı son kontrol tarihi itibarıyla derlendi. İşletmenize özgü değerlendirme için bağlı olduğunuz meslek odasına veya hukuk danışmanınıza başvurun.</p>
</aside>`;

const QR_MENU_NASIL_YAPILIR: RehberYazisi = {
  slug: 'qr-menu-nasil-yapilir',
  kume: 'qr-menu',
  baslik: 'QR menü nasıl yapılır, zorunlu mu?',
  seoBaslik: 'QR Menü Nasıl Yapılır, Zorunlu mu? | Ajans Flow',
  ozet:
    'Karekodlu menü zorunlu değil; zorunlu olan fiyat listesinin eksiksiz gösterilmesi. Kurulum sırası, fiyat listesi kuralları ve isteğe bağlı modüller.',
  tarih: '2026-10-06',
  guncelleme: '2026-10-07',
  okuma: 9,
  etiketler: [
    'QR menü',
    'karekodlu menü',
    'fiyat listesi',
    'kafe',
    'restoran',
    'dijital menü',
  ],
  ilgiliHizmet: 'qr-menu',
  onIsaret:
    'Kısa cevap: karekodlu menü zorunlu değil. Zorunlu olan, fiyat listesinin eksiksiz ve doğru gösterilmesi; karekod bunu yapmanın izin verilen yollarından biri.',
  sss: [
    {
      soru: 'QR menü kullanırsam basılı menüye hiç gerek kalmaz mı?',
      cevap:
        'Kalır. Fiyat Etiketi Yönetmeliği masalardaki fiyat listesinin karekod ile de gösterilmesine izin veriyor, ancak tüketici talep ettiğinde listenin ayrıca verilmesini istiyor. Giriş kapısının önündeki fiyat listesi yükümlülüğü de ayrıca sürüyor.',
    },
    {
      soru: 'Karekodlu menüdeki fiyat ile kasadaki fiyat farklı olursa ne olur?',
      cevap:
        'Yönetmelik, satış fiyatı ile kasa fiyatı arasında fark olduğunda tüketici lehine olan fiyatın uygulanmasını söylüyor. Bu yüzden menü ile kasanın aynı fiyat kaynağından beslenmesi, karekodlu menünün en somut faydası oluyor.',
    },
    {
      soru: 'Küçük bir kafeyim; menüde içerik ve kalori bilgisi benim için de gerekli mi?',
      cevap:
        'Uyum takvimi işletme ölçeğine göre farklı. 1 Temmuz 2026, ulusal zincir işletmeler için sürenin dolduğu tarih; bağımsız bir kafe için takvim daha ileride. Hangi grupta olduğunuzu il veya ilçe tarım ve orman müdürlüğünden teyit etmenizi öneririz.',
    },
    {
      soru: 'Menüye servis veya kuver ücreti satırı ekleyebilir miyim?',
      cevap:
        'Yönetmelik, yiyecek içecek hizmeti sunulan işyerlerinde tüketiciden servis, masa veya kuver ücreti adı altında ilave ödeme talep edilemeyeceğini söylüyor. Tüketicinin kendi isteğiyle bıraktığı bahşiş ayrı bir konu.',
    },
    {
      soru: 'QR menü için ayrı bir uygulama indirtmek gerekir mi?',
      cevap:
        'Mevzuatta böyle bir şart yok; pratikte de önerilmez. Karekodu okutan misafir doğrudan tarayıcıda açılan bir sayfaya gitmeli. Uygulama indirme, üyelik veya izin isteyen akışlar masada terk ediliyor.',
    },
  ],
  govde: `
<p>“QR menü zorunlu mu?” sorusu son bir yılda kafe ve restoran sahiplerinin en sık sorduğu sorulardan biri oldu. İnternette “artık her masada karekod zorunlu” diyen de var, “QR menü kaldırıldı” diyen de. İkisi de doğru değil. Karışıklığın sebebi belli: Türkiye’de kafe ve restoran menüsünü <strong>iki ayrı bakanlığın iki ayrı düzenlemesi</strong> ilgilendiriyor ve bu ikisi sürekli birbirine karıştırılıyor.</p>
<p>Aşağıda önce hangi yükümlülüğün nereden geldiğini ayırıyoruz, sonra menüyü kurarken izlediğimiz sırayı ve isteğe bağlı sipariş/rezervasyon modüllerini anlatıyoruz. Amaç korkutmak değil: karekoda geçmek de geçmemek de işletmenin kararı.</p>
${MEVZUAT_NOTU}

<h2 id="kisa-cevap">Kısa cevap: karekod zorunlu değil, fiyat listesi zorunlu</h2>
<p>Zorunlu olan, fiyatlarınızın tüketiciye eksiksiz, doğru ve okunabilir biçimde gösterilmesi. Karekod ise bu yükümlülüğü yerine getirmenin izin verilen yollarından biri.</p>
<p>Ticaret Bakanlığı’nın Fiyat Etiketi Yönetmeliği’nde yaptığı değişiklik 11 Ekim 2025 tarihli ve 33044 sayılı Resmî Gazete’de yayımlanarak yayımı tarihinde yürürlüğe girdi; bir geçiş süresi tanımlanmadı. Değişiklik, yiyecek ve içecek hizmeti sunulan işyerlerindeki <strong>masalarda</strong> fiyat listelerinin tüketicilere karekod ile <em>de</em> gösterilebileceğini söylüyor. Yönetmelik karekodu “fiyat listesine erişimi sağlayan görsel” olarak tanımlıyor.</p>
<p>Yani karekod bir seçenek. Basılı menüyle çalışmaya devam eden bir işletme, yalnızca karekod kullanmadığı için mevzuata aykırı duruma düşmüyor. Piyasada dolaşan “QR Menü Yasası” başlıklarının mevzuatta bir karşılığı yok.</p>

<h2 id="fiyat-listesi">Birinci taraf: fiyat listesi kuralları</h2>
<p>Bu tarafı Ticaret Bakanlığı’nın Fiyat Etiketi Yönetmeliği düzenliyor ve karekoda geçtikten sonra da yerinde kalan maddeler var:</p>
<ul>
  <li><strong>Giriş kapısı önündeki liste sürüyor.</strong> Fiyat listesinin işyerinin giriş kapısının önüne, kapı birden fazlaysa her kapı için ayrı ayrı asılması gerekiyor. Karekoda geçmek bunu ortadan kaldırmıyor.</li>
  <li><strong>Talep halinde liste ayrıca verilir.</strong> Telefonu olmayan, şarjı biten ya da karekod okutmak istemeyen misafir listeyi istediğinde sunulabilmeli. Pratikte bu, kasada güncel bir basılı liste bulundurmak demek.</li>
  <li><strong>Hizmete sunulan tüm ürünler listede yer alır.</strong> “Menüde yok ama soran olursa yaparız” dediğiniz ürünler de fiyatıyla birlikte listeye girer.</li>
  <li><strong>Aykırılık sayısı ürün başına belirleniyor.</strong> Yönetmelik, aykırılık sayısı belirlenirken fiyat listelerinde eksik veya hatalı belirtilen ürün sayısının dikkate alındığını söylüyor. Yazılım tarafında bunun karşılığı tek bir şey: fiyatı boş kalmış ürün için panelde uyarı.</li>
  <li><strong>Kasa farkı tüketici lehine çözülür.</strong> Satış fiyatı ile kasa fiyatı arasında fark olduğunda tüketici lehine olan fiyat uygulanıyor.</li>
  <li><strong>Fiyatlar TL cinsinden, listeler Türkçe.</strong> Satış fiyatlarının “Türk Lirası”, “TL” veya ₺ simgesiyle yazılması; rakam ve harflerin okunabilir, eksiksiz ve gerçeğe uygun olması isteniyor. Çok dilli menü yasak değil, Türkçe’nin bulunması şart.</li>
  <li><strong>Servis, masa ve kuver ücreti talep edilemiyor.</strong> 30 Ocak 2026 tarihli ve 33153 sayılı Resmî Gazete’de yayımlanan değişiklikle, yiyecek içecek hizmeti sunulan işyerlerinde tüketiciden servis ücreti, masa ücreti, kuver ücreti ve benzeri herhangi bir isim altında ilave ödeme istenemiyor.</li>
</ul>
<aside class="af-rb-not">
  <p>Pratik özet: masadaki karekod, masaya konan basılı menünün yerini alabiliyor. Kapının önündeki listeyi ve talep halinde verilecek listeyi ortadan kaldırmıyor. Üçünü birlikte planlamak gerekiyor.</p>
</aside>
<p>Bir madde de ileride devreye girecek: Yönetmelik, yiyecek içecek işletmelerinin fiyat listesi verilerini kurulacak bir sisteme aktarmakla yükümlü olduğunu söylüyor. Ancak yükümlülük tüm işletmelere değil, <strong>kriterleri Bakanlıkça belirlenen</strong> işyerlerine ait ve usul ve esaslar Bakanlığın resmî sitesinde ilan edildikten sonra üç aylık bir süre işliyor. Bu yazının son kontrol tarihinde ilan edilmiş bir usul ve esas metnine ulaşamadık; konuyu takip ediyoruz.</p>

<h2 id="icerik-kalori">İkinci taraf: menüde içerik, alerjen ve kalori</h2>
<p>Bu taraf fiyatı değil, ürün hakkındaki bilgiyi düzenliyor ve Tarım ve Orman Bakanlığı’na ait: TGK Gıda Etiketleme ve Tüketicileri Bilgilendirme Yönetmeliği ile ona bağlı Kılavuz. Sıkça duyulan “1 Temmuz” tarihi buradan geliyor ve <strong>karekodla ilgili değil</strong>.</p>
<p>İki şeyi ayırmak gerekiyor:</p>
<ul>
  <li><strong>Alerjen bildirimi yeni değil.</strong> Toplu tüketim yerlerinde gıdanın adı, alerjiye veya intoleransa neden olan maddeler, etil alkol ve alkollü içki içerenler ile domuzdan elde edilen madde içerenler hakkındaki bilginin sunulması 1 Ocak 2020’den beri yapılıyor. Yönetmelik 14 alerjen sayıyor.</li>
  <li><strong>2026’da düzenlenen şey içerik detayı ve enerji değeri.</strong> Menüde ürünlerin bileşen bilgisi ve enerji (kalori) değerinin tüketiciye sunulması, Yönetmeliğe bağlı Kılavuz’un 13 Mart 2026 güncellemesiyle düzenlendi ve uyum takvimi işletme ölçeğine göre farklı.</li>
</ul>
<div class="af-rb-tablo">
  <table class="af-veri-tablo">
    <caption>İçerik ve enerji bilgisi için uyum takvimi (Yönetmeliğe bağlı Kılavuz’un geçiş süreleri bölümü)</caption>
    <thead>
      <tr>
        <th scope="col">İşletme</th>
        <th scope="col">Tarih</th>
        <th scope="col">Konu</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Ulusal zincir işletmeler</td><td>1 Temmuz 2026</td><td>İçerik (bileşen) ve enerji bilgisi — süre doldu</td></tr>
      <tr><td>Aynı ilde üç ve üzeri şubesi olanlar</td><td>31 Aralık 2026</td><td>İçerik ve enerji bilgisi</td></tr>
      <tr><td>Diğer toplu tüketim yerleri</td><td>31 Aralık 2026</td><td>İçerik (bileşen) bilgisi</td></tr>
      <tr><td>Diğer toplu tüketim yerleri</td><td>31 Aralık 2027</td><td>Enerji (kalori) bilgisi</td></tr>
    </tbody>
  </table>
</div>
<p>Bu düzenleme de karekodu zorunlu kılmıyor: bilgi menü, yazı tahtası, broşür, dijital ekran veya karekod yoluyla sunulabiliyor — seçim işletmenin. Ancak <strong>karekod kullanıyorsanız</strong> Kılavuz’un aynı güncellemesi bir şey daha istiyor: karekodu kullanamayan tüketicilere bilginin ayrıca sağlanacağına dair bilgilendirme yapılması. Bu, fiyat listesi tarafındaki “talep halinde liste verilir” hükmüne benziyor ama ondan ayrı bir yükümlülük.</p>
<p>Dijital menünün burada görünür bir avantajı var: onlarca ürünün bileşen ve enerji bilgisini basılı menüye sığdırmak zor, dijitalde her ürün için ayrı bir alan açmak mümkün. İşletmenizin hangi takvime tabi olduğunu il veya ilçe tarım ve orman müdürlüğünden teyit etmenizi öneririz.</p>
<p>Hangi yükümlülüğün hangi düzenlemeden geldiğini, madde numaraları ve Resmî Gazete bilgileriyle ayrı bir sayfada derledik: <a href="${siteYolu('/qr-menu')}">QR menü ve mevzuat</a>.</p>

<h2 id="kurulum">Menüyü kurarken izlediğimiz sıra</h2>
<p>Karekodlu menü bir tasarım işi değil veri işi. En çok vakit kaybı, son adımdan — karekod üretmekten — başlayanlarda oluyor. İzlediğimiz sıra şu:</p>
<ol>
  <li><strong>Ürün ve fiyat listesini tek yerde toplayın.</strong> Bütün ürünleri tek tabloya dökün: ad, kategori, fiyat, varsa porsiyon. Bu tablo çıkarılırken hemen her işletmede üç şey görünüyor: menüde duran ama artık yapılmayan ürünler, kasada başka menüde başka fiyatla duran ürünler ve aynı ürünün iki kategoride iki ayrı adla yazılması.</li>
  <li><strong>Kategori ve sıralamayı kurgulayın.</strong> Telefon ekranı basılı menünün açılır sayfası kadar geniş değil; üst kategorinin tek ekranda görünebileceği kadar olması işe yarıyor. Sıra alfabetik olmak zorunda değil, servis akışına göre kurulur.</li>
  <li><strong>Fotoğrafı seçici kullanın.</strong> Her ürünün fotoğrafı olmak zorunda değil. On ürünün iyi çekilmiş karesi, kırk ürünün aceleyle çekilmiş karesinden iyi durur. Fotoğrafı olmayan ürünü boş çerçeveyle değil yalnız adıyla göstermek daha iyi. <a href="${siteYolu('/hizmetler/fotograf-cekimi')}">Yemek çekimi tarafında ne yaptığımızı</a> ayrı anlattık.</li>
  <li><strong>Alerjen, içerik ve diyet alanlarını ilk kurulumda açın.</strong> Bu bilgiyi sonradan eklemek menüyü baştan kurmak kadar iş çıkarıyor. Takviminiz henüz başlamamış olsa bile altyapının bu alanları taşıması, ileride menüyü yeniden kurmanızı önlüyor.</li>
  <li><strong>Çok dilliyi çeviri olarak değil içerik olarak kurun.</strong> Yemek adları çeviride anlamını yitiriyor; adı olduğu gibi bırakıp altına o dilde kısa bir tarif yazmak daha iyi çalışıyor. Türkçe esas, diğer diller üzerine eklenir.</li>
  <li><strong>Karekodu en son üretin.</strong> Kod sabit bir adrese bakar; adres sonradan değişirse masadaki bütün kartlar çöp olur. Kod yeterince büyük ve mat yüzeyde olmalı, yanında tek satırlık bir yönlendirme bulunmalı. Masa dışında da gerekiyor: giriş, vitrin, kasa, paket servis.</li>
  <li><strong>Güncelleme düzenini tanımlayın.</strong> İki soruya baştan cevap verin: fiyatı kim değiştirecek ve değişiklik kaç dakikada menüye yansıyacak? Cevap “ajansa yazarız” ise menü altı ayda güncelliğini yitiriyor.</li>
  <li><strong>Yayın öncesi kontrol listesini geçin.</strong> Hizmete sunulan bütün ürünler listede mi, fiyatı boş ürün var mı, menüdeki fiyat kasayla aynı mı, kod zayıf bağlantıda açılıyor mu, dil değişince eksik kalan kategori var mı, giriş kapısı için basılabilir çıktı hazır mı, “karekodu okuyamayan misafirlerimize bilgi ayrıca sunulur” ibaresi masa kartında ve menüde yazılı mı?</li>
</ol>

<h3 id="hatalar">Sık yapılan altı hata</h3>
<ul>
  <li><strong>Menüyü PDF koymak.</strong> Telefonda yakınlaştırma ister, aranamaz, güncellenemez, zayıf bağlantıda açılmaz.</li>
  <li><strong>Kayıt veya uygulama istemek.</strong> Masada en çok terk edilen adım bu.</li>
  <li><strong>Ağır fotoğraflarla yüklemek.</strong> Menü, kafedeki zayıf bağlantıda açılmak zorunda.</li>
  <li><strong>Fiyatı iki yerde tutmak.</strong> Kasa ile menü ayrı listeden besleniyorsa fark kaçınılmaz.</li>
  <li><strong>Basılı fiyat listesini kaldırmak.</strong> Giriş kapısı önündeki liste yükümlülüğü sürüyor.</li>
  <li><strong>Menüye servis veya kuver satırı eklemek.</strong> Bu adla ek ödeme istenemiyor.</li>
</ul>

<h2 id="moduller">İsteğe bağlı eklenebilen modüller: sipariş ve rezervasyon</h2>
<p>Karekodlu menü doğru kurgulandığında günlük iş akışına da katkı sağlıyor. Bunlar zorunlu değil, menünün üstüne isteğe bağlı eklenen katmanlar:</p>
<ul>
  <li><strong>Masadan sipariş.</strong> Misafir siparişini telefondan verir, sipariş mutfağa veya bara düşer. Her işletmeye uymuyor: servis deneyimini öne çıkaran bir restoranda tam sipariş yerine yalnız “garson çağır” daha uygun olabiliyor.</li>
  <li><strong>Garson çağırma ve hesap isteme.</strong> Basit ama en çok kullanılan özellik; el kaldırarak beklenen süreyi kısaltıyor.</li>
  <li><strong>Paket ve gel-al sipariş.</strong> Aynı menü altyapısı masadan bağımsız bir sipariş sayfası olarak da çalışıyor; telefonda sipariş alırken yaşanan yanlış anlaşılmalar azalıyor, sipariş yazılı kayda geçiyor.</li>
  <li><strong>Rezervasyon.</strong> Instagram profilinden, Google İşletme Profilinden veya siteden gelen misafir aynı sistemden masa ayırtabiliyor; kayıtlar defter ile telefon mesajları arasında kaybolmuyor.</li>
</ul>
<p>Modülleri değerlendirirken üç şeye bakın: mevcut adisyon veya POS sisteminizle birlikte çalışıp çalışmadığı, mutfağın gelen siparişi nasıl göreceği ve personelin yeni akışa ne kadar sürede alışacağı. Kâğıt üzerinde en kapsamlı görünen modül değil, ekibinizin gerçekten kullandığı modül işe yarıyor. Online sipariş akışında bir not daha var: mesafeli satışta bileşen ve enerji bilgisinin satın alma aşamasında sunulması isteniyor, bu yüzden ürün detayını sipariş ekranının içinde tutuyoruz.</p>

<h2 id="sorular">Hizmet alırken sorulacak sorular</h2>
<p>Bir QR menü sağlayıcısıyla görüşmeden önce şunların yanıtını netleştirin:</p>
<ol>
  <li>Fiyat ve ürün değişikliğini kendim yapabiliyor muyum, yoksa her seferinde destek mi istemem gerekiyor?</li>
  <li>Menü verilerim (ürünler, fotoğraflar, fiyatlar) kime ait? Hizmeti bıraktığımda dışa aktarabilir miyim?</li>
  <li>Alerjen, içerik ve enerji değeri için ayrı alanlar var mı?</li>
  <li>Giriş kapısı ve talep halinde gösterilecek liste için menüden basılabilir çıktı alınabiliyor mu?</li>
  <li>Menüye servis veya kuver satırı eklenmesi engellenmiş mi?</li>
  <li>Sipariş ve rezervasyon modülleri sonradan eklenebiliyor mu?</li>
  <li>Menü sayfası reklam içeriyor mu, mobil veriyle ne kadar hızlı açılıyor?</li>
</ol>

<h2 id="bizim-kurgu">Biz menüyü nasıl kuruyoruz</h2>
<p>Kafe ve restoranlar için karekodlu menüyü, iki tarafı ayrı ayrı karşılayacak şekilde kuruyoruz: fiyat listesi düzeni ve ürün bilgisi. Uygulama indirmeden açılan, zayıf bağlantıda da yüklenen bir menü; fiyatın tek kaynaktan beslenmesi; fiyatı boş ürün için uyarı; giriş kapısı için basılabilir fiyat listesi çıktısı; alerjen, alkol ve domuz kaynaklı bileşen işaretleme alanları; içerik ve enerji değeri için hazır alanlar.</p>
<p>Kule İstanbul Cafe için kurduğumuz menüde Türkçe, İngilizce, Almanca ve Arapça birlikte çalışıyor; <a href="${siteYolu('/calismalar/kule-istanbul-cafe')}">o çalışmayı burada</a> okuyabilirsiniz. Menüdeki ürün fotoğraflarının ve kısa mutfak videolarının nasıl üretildiğini de <a href="${siteYolu('/calismalar/kok-cafe-lounge')}">Kök Cafe Lounge çalışmasında</a> görebilirsiniz. Sipariş ve rezervasyon modülleri, ihtiyaç duyulduğunda menünün üstüne ekleniyor.</p>

<h2 id="kaynaklar">Kaynaklar</h2>
<p>Bu yazıdaki mevzuat bilgileri aşağıdaki birincil kaynaklardan derlendi. Listede olmayan bir madde numarası veya tarih kullanmıyoruz.</p>
<ul class="af-rb-kaynaklar">
  <li><a href="https://www.mevzuat.gov.tr/MevzuatMetin/yonetmelik/7.5.19819.pdf" rel="noreferrer">Fiyat Etiketi Yönetmeliği — konsolide metin (mevzuat.gov.tr)</a></li>
  <li><a href="https://www.resmigazete.gov.tr/eskiler/2025/10/20251011-6.htm" rel="noreferrer">Fiyat Etiketi Yönetmeliğinde Değişiklik — RG 11/10/2025, Sayı 33044 (karekod)</a></li>
  <li><a href="https://www.resmigazete.gov.tr/eskiler/2026/01/20260130-2.htm" rel="noreferrer">Fiyat Etiketi Yönetmeliğinde Değişiklik — RG 30/1/2026, Sayı 33153 (servis ve kuver ücreti)</a></li>
  <li><a href="https://resmigazete.gov.tr/eskiler/2017/01/20170126M1-6.htm" rel="noreferrer">TGK Gıda Etiketleme ve Tüketicileri Bilgilendirme Yönetmeliği — RG 26/01/2017</a></li>
  <li><a href="https://kms.kaysis.gov.tr/Home/Goster/204259" rel="noreferrer">TGK Gıda Etiketleme ve Tüketicileri Bilgilendirme Yönetmeliği Kılavuzu (KAYSIS)</a></li>
  <li><a href="https://tuketici.ticaret.gov.tr/yayinlar/tuketici-bilgi-rehberi/fiyat-etiketleri-hakkinda-bilgilendirme" rel="noreferrer">Ticaret Bakanlığı — fiyat etiketleri hakkında tüketici bilgilendirmesi</a></li>
  <li><a href="https://www.tarimorman.gov.tr/Konu/2023/Toplu_Tuketim_Yerlerinde_Alerjen_Bildirimi" rel="noreferrer">Tarım ve Orman Bakanlığı — toplu tüketim yerlerinde alerjen bildirimi</a></li>
</ul>
`,
};

const INSTAGRAM_REKLAM_BUTCESI: RehberYazisi = {
  slug: 'instagram-reklam-butcesi',
  kume: 'reklam',
  baslik: 'Instagram reklamına ne kadar bütçe ayırmalı?',
  seoBaslik: 'Instagram Reklam Bütçesi Nasıl Hesaplanır? | Ajans Flow',
  ozet:
    'Instagram reklam bütçesi hazır bir rakam değil, bir hesap: hedeften geriye hesaplama, test dönemi, öğrenme aşaması ve bütçeyi etkileyen kalemler.',
  tarih: '2026-10-06',
  guncelleme: '2026-10-07',
  okuma: 7,
  etiketler: [
    'Instagram reklamı',
    'Meta reklam',
    'reklam bütçesi',
    'reklam yöneticisi',
    'dönüşüm',
  ],
  ilgiliHizmet: 'meta-reklam',
  onIsaret:
    'Bütçeyi “ne kadar” diye sormanın cevabı yok; hedeflediğiniz sonuç sayısı ile sonuç başına maliyet belli olduğunda rakam kendiliğinden çıkıyor.',
  sss: [
    {
      soru: 'Instagram reklamı için minimum bütçe var mı?',
      cevap:
        'Meta, reklam setleri için para birimine ve kampanya ayarlarına göre değişen bir minimum günlük bütçe uyguluyor; Reklam Yöneticisi bu sınırı kurulum sırasında gösteriyor. Ancak sistemin izin verdiği en düşük bütçe, anlamlı sonuç almaya yeten bütçe anlamına gelmiyor.',
    },
    {
      soru: 'Reklam bütçesini ajansa mı ödüyoruz?',
      cevap:
        'Hayır. Reklam bütçesi doğrudan Meta’ya, kendi reklam hesabınızdan ödenir ve hesabın sahibi sizsiniz. Ajans bedeli kurulum, kampanya yönetimi, kreatif üretimi ve raporlama karşılığıdır; ikisi ayrı kalemdir.',
    },
    {
      soru: 'Günlük bütçe mi seçmeliyim, toplam bütçe mi?',
      cevap:
        'Sürekli devam eden kampanyalarda günlük bütçe takip açısından pratik. Belirli bir tarihte biten kampanyalarda (bir açılış, bir kayıt dönemi) toplam bütçe harcamanın dönem boyunca dağıtılmasına yardımcı oluyor.',
    },
    {
      soru: 'Reklam verdim ama mesajlar satışa dönüşmüyor, sorun bütçede mi?',
      cevap:
        'Çoğu zaman hayır. Önce reklamın doğru kişilere gidip gitmediğine, teklifin net olup olmadığına ve mesajlara ne kadar hızlı cevap verildiğine bakın. Bu halkalardan biri zayıfsa bütçeyi artırmak yalnızca daha fazla kaçan fırsat demek.',
    },
    {
      soru: 'Bütçeyi birden artırmak zarar verir mi?',
      cevap:
        'Meta’nın belgelerine göre hedef kitlede, kreatifte ve bütçede yapılan büyük değişiklikler reklam setini yeniden öğrenme aşamasına sokabiliyor. Bu yüzden artışları kademeli yapıp her kademede sonuç başına maliyetin nereye gittiğini izliyoruz.',
    },
  ],
  govde: `
<p>“Instagram reklamına ayda ne kadar vermeliyim?” sorusunun herkese uyan bir cevabı yok. Aynı bütçe bir mahalle kafesi için fazlasıyla yeterliyken, şehrin dört bir yanından müşteri bekleyen bir spor salonu için yetersiz kalabiliyor. Bu yüzden burada hazır bir rakam vermiyoruz; <strong>rakamı kendi işiniz için bulmanızı sağlayan hesabı</strong> anlatıyoruz. Yöntem kafe, oto galeri, diş kliniği, spor salonu ya da anaokulu fark etmeksizin aynı mantıkla işliyor.</p>
<p>İnternette gördüğünüz “ortalama maliyet” rakamları başka bir şehirden, başka bir sektörden veya başka bir dönemden geliyor. Sizin için geçerli tek rakam, kendi verinizden çıkan rakam.</p>

<h2 id="hedef">Bütçeyi belirleyen ilk şey: reklamdan ne bekliyorsunuz</h2>
<p>Instagram reklamları Meta’nın Reklam Yöneticisi üzerinden yönetiliyor ve her kampanya bir amaçla başlıyor: bilinirlik, trafik, etkileşim, potansiyel müşteriler, uygulama tanıtımı, satış. Seçtiğiniz amaç reklamın kime ve nasıl gösterileceğini belirliyor; dolayısıyla bütçenin ne işe yarayacağını da.</p>
<p>Küçük ve orta ölçekli işletmelerde en çok karşılaştığımız üç hedef şu:</p>
<ul>
  <li><strong>Bilinirlik.</strong> Yeni açılan bir şube veya yeni bir hizmet için çevredeki insanlara görünmek.</li>
  <li><strong>Mesaj ve potansiyel müşteri.</strong> Instagram veya WhatsApp üzerinden soru almak, form doldurtmak, randevu ya da ön kayıt toplamak.</li>
  <li><strong>Trafik.</strong> Siteye, menüye ya da araç ilanlarına ziyaretçi göndermek.</li>
</ul>
<p>Bütçe sorusu ancak hedef netleştiğinde anlam kazanıyor. “Daha çok takipçi” ile “ayda belirli sayıda deneme dersi kaydı” çok farklı bütçeler istiyor. Hedefin yazılma biçimi şöyle olmalı: <em>ayda şu kadar randevu</em>, <em>ayda şu kadar rezervasyon talebi</em>, <em>ayda şu kadar teklif formu</em>. Sayıyı siz koyuyorsunuz; sayı yazıldığı anda hesap mümkün hâle geliyor.</p>

<h2 id="hesap">Hedeften geriye doğru hesaplama</h2>
<p>En sağlıklı yöntem, ulaşmak istediğiniz sonuçtan geriye gitmek. Formül basit:</p>
<blockquote class="af-alinti">
  <p>Aylık reklam bütçesi ≈ Hedeflenen sonuç sayısı × Sonuç başına maliyet</p>
</blockquote>
<p>Buradaki “sonuç” işinize göre değişiyor: bir rezervasyon mesajı, bir form doldurma, bir randevu talebi ya da bir site ziyareti. Sorun şu ki sonuç başına maliyeti önceden kesin olarak bilemiyorsunuz. Bu maliyet sektörünüze, konumunuza, hedef kitlenizin büyüklüğüne, rakiplerin o dönemdeki reklam yoğunluğuna ve kreatiflerinizin kalitesine göre değişiyor. Bu yüzden ilk adım, kendi verinizi üreten bir test dönemi.</p>
<p>Bir de dönüşüm oranını hesaba katın. Hedefiniz randevu ise gelen her mesaj randevuya dönüşmüyor; bu oran büyük ölçüde mesajlara ne kadar hızlı ve ne kadar iyi cevap verdiğinize bağlı. Reklamın getirdiği mesajlar saatlerce bekletiliyorsa bütçeyi artırmak sorunu çözmüyor.</p>
<p>Üst sınırı belirleyen şey ise bir müşterinin size kazandırdığı tutar: ortalama satış tutarı ile tekrar oranının çarpımından ürün maliyeti, personel ve sabit giderler düşüldüğünde kalan tutar, bir müşteri için harcayabileceğiniz en yüksek maliyeti söylüyor. Bu iki sayı da reklam panelinde değil, sizin kendi kayıtlarınızda. Kafe gibi tekrar oranı yüksek işlerde bu sayı sanıldığından büyük çıkıyor; tek seferlik satış yapan işlerde ilk satıştaki kârın üstüne çıkan hiçbir reklam maliyeti sürdürülebilir olmuyor.</p>

<h2 id="olcum">Ölçümü reklamdan önce kurun</h2>
<p>Bu adım atlandığında geri kalan her şey tahmine dönüşüyor. Reklam açmadan önce şunların kurulu olması gerekiyor:</p>
<ul>
  <li>Sitede dönüşüm olaylarının (form gönderimi, WhatsApp tıklaması, arama) ölçülmesi</li>
  <li>Reklamdan gelen trafiğin diğer kaynaklardan ayrılabilmesi</li>
  <li>Gelen talebin nereden geldiğinin kayda geçmesi: formda kaynak alanı veya ayrı bir WhatsApp mesaj şablonu</li>
</ul>
<p>Ölçüm kurulmadan açılan kampanya panelde “ucuz tıklama” gösterip kasada hiçbir şey göstermiyor. Bizim kurulum sırası da bu yüzden hep aynı: önce ölçüm, sonra iniş sayfası, en son reklam. Ölçüm tarafında ne yaptığımızı <a href="${siteYolu('/hizmetler/veri-analizi-raporlama')}">veri analizi ve raporlama</a> sayfasında anlattık.</p>

<h2 id="test">Test dönemi nasıl kurgulanmalı</h2>
<p>Test döneminin amacı, sizin işletmeniz için gerçek sonuç başına maliyeti öğrenmek. Önerdiğimiz yaklaşım:</p>
<ol>
  <li><strong>Tek bir net hedef seçin.</strong> Aynı anda hem takipçi hem satış hem trafik peşinde koşmayın.</li>
  <li><strong>Kampanyayı sade tutun.</strong> Birkaç reklam seti ve her birinde iki üç kreatif yeterli. Çok parçaya bölünen küçük bir bütçe hiçbir parçada anlamlı veri üretmiyor.</li>
  <li><strong>En az iki ila dört hafta bekleyin.</strong> Hafta içi ve hafta sonu davranışları farklı; birkaç günlük veriyle karar vermek yanıltıcı.</li>
  <li><strong>Her gün değişiklik yapmayın.</strong> Sürekli hedef kitle, metin veya bütçe değiştirmek öğrenmeyi sıfırlıyor.</li>
  <li><strong>Sonuçları gerçek işle karşılaştırın.</strong> Panelde görünen mesaj sayısının kaçının gerçekten müşteriye dönüştüğünü kendi kayıtlarınızdan kontrol edin.</li>
</ol>

<h2 id="ogrenme">Öğrenme aşamasını hesaba katın</h2>
<p>Meta’nın reklam sistemi, yeni bir reklam seti yayına alındığında bir “öğrenme aşamasından” geçiyor. <strong>Meta’nın kendi reklam yardım belgelerine göre</strong> bir reklam setinin bu aşamadan çıkması için genellikle son önemli düzenlemeden sonraki yedi gün içinde yaklaşık 50 optimizasyon etkinliği gerekiyor. Optimizasyon etkinliği, kampanyayı neye göre optimize ettiyseniz odur: mesaj, form ya da satın alma.</p>
<p>Bütçe açısından pratik anlamı şu: bütçeniz haftada bu sayıda sonuç üretmeye yetmiyorsa reklam seti uzun süre “öğrenme sınırlı” durumunda kalabiliyor ve performans dalgalı seyrediyor. Bu durumda çözüm her zaman bütçeyi artırmak değil; reklam setlerini birleştirmek, <strong>daha sık gerçekleşen bir hedefe geçmek</strong> (satın alma yerine form, form yerine mesaj) ya da hedef kitleyi aşırı daraltmamak da işe yarıyor.</p>
<p>Bu eşik Meta’nın yayımladığı bir kural ve değişebilir; kampanya kurmadan önce güncel hâlini Meta Reklam Yardım Merkezi’nden teyit etmenizi öneririz.</p>

<h2 id="etkenler">Bütçeyi neler etkiler</h2>
<ul>
  <li><strong>Konum ve yarıçap.</strong> Yalnızca işletmenizin çevresini hedeflemek kitleyi daraltıyor; bu bazen maliyeti artırıyor, bazen boşa giden gösterimi azaltıyor.</li>
  <li><strong>Sezon.</strong> Anaokulları için kayıt dönemi, spor salonları için yeni yıl ve yaz öncesi, kafeler için tatil dönemleri; hem talep hem rekabet değişiyor.</li>
  <li><strong>Kreatif kalitesi.</strong> İlk birkaç saniyede dikkat çekmeyen bir video daha yüksek bütçeyle de iyi sonuç vermiyor. Çoğu zaman kreatifi iyileştirmek bütçeyi artırmaktan etkili.</li>
  <li><strong>Formun sürtünmesi.</strong> Uzun bir form daha az ama genellikle daha nitelikli başvuru getiriyor; kısa form daha çok ama daha karışık başvuru.</li>
</ul>

<h3 id="panel">Paneldeki rakamlar ne anlatır</h3>
<p>Panelde en çok karşılaşılan dört rakam: <strong>erişim</strong> (reklamı gören farklı kişi sayısı), <strong>gösterim</strong> (reklamın kaç kez ekranda göründüğü; aynı kişi birden çok sayılır), <strong>CPM</strong> (bin gösterim başına maliyet) ve <strong>CTR</strong> (görenlerin ne kadarının tıkladığı). Bunların hiçbiri sonuç değil. Karar verdiren tek rakam <strong>sonuç başına maliyet</strong>: bir form, bir mesaj veya bir satışın kaça geldiği. Düşük CPM’li bir kampanya hiç form getirmiyorsa pahalıdır.</p>

<h3 id="one-cikar">“Gönderiyi öne çıkar” mı, Reklam Yöneticisi mi</h3>
<p>Instagram uygulamasındaki “Öne Çıkar” düğmesi hızlı ve kolay; bir gönderiyi birkaç dokunuşla daha çok kişiye gösterebiliyorsunuz. Ancak hedefleme, yerleşim, ölçümleme ve test seçenekleri Reklam Yöneticisi’ne göre sınırlı. Ara sıra bir duyuruyu öne çıkarmak için yeterli olabilir; düzenli müşteri kazanımı hedefliyorsanız Reklam Yöneticisi üzerinden planlı kampanya kurmak daha sağlıklı.</p>

<h2 id="diger-maliyetler">Reklam bütçesinin dışında kalan kalemler</h2>
<p>Instagram reklamının toplam maliyeti yalnızca Meta’ya ödenen tutar değil:</p>
<ul>
  <li><strong>İçerik üretimi.</strong> Reels videoları, fotoğraf çekimi ve tasarım.</li>
  <li><strong>Kampanya yönetimi.</strong> Kurulum, takip, raporlama ve optimizasyon için ayrılan zaman ya da ajans bedeli.</li>
  <li><strong>Dönüşüm altyapısı.</strong> Mesajlara cevap verecek bir kişi, düzgün çalışan bir site veya form, ölçüm kurulumu.</li>
  <li><strong>Vergiler.</strong> Reklam faturalarına uygulanan vergileri ödeme ekranında ve faturalarınızda kontrol edip bütçenizi buna göre planlayın.</li>
</ul>
<p>Son bir ayrım: reklam bütçesi doğrudan Meta’ya, kendi reklam hesabınızdan ödenir. Hesabın ve verinin sahibi sizsiniz; çalışmaya son verseniz de hesap sizde kalıyor. Ajans bedeli ise kurulum, kampanya yönetimi, kreatif üretimi ve raporlama karşılığı. Bu iki kalemi aynı toplamda gösteren bir teklif, reklama gerçekte ne kadar gittiğini görmenizi engelliyor.</p>

<h2 id="sektor-notlari">Sektöre özel küçük notlar</h2>
<ul>
  <li><strong>Kafe ve restoran.</strong> Yakın çevre hedeflemesi ve görsel olarak güçlü yemek içerikleri öne çıkıyor. Rezervasyon veya mesaj hedefi, takipçi kampanyasından genellikle daha ölçülebilir sonuç veriyor.</li>
  <li><strong>Oto galeri.</strong> Araç bazlı ilan içerikleri ve mesaj kampanyaları sık kullanılıyor. Reklamdaki fiyat ve araç bilgilerinin ilan sitelerindeki bilgilerle tutarlı olması gerekiyor.</li>
  <li><strong>Diş kliniği.</strong> Sağlık hizmetlerinin tanıtımı Türkiye’de ayrı mevzuata ve meslek kurallarına tabi. Meta’nın reklam politikaları da kişinin sağlık durumunu ima eden ifadeleri kısıtlıyor. Kampanya metinleri bu iki çerçeveye uygun hazırlanmalı.</li>
  <li><strong>Spor salonu ve anaokulu.</strong> Deneme dersi, tanışma ziyareti veya ön kayıt formu gibi somut ve düşük eşikli bir teklif, genel tanıtım reklamından daha net sonuç veriyor.</li>
</ul>

<h2 id="artirma">Bütçeyi ne zaman artırmalı</h2>
<p>Bütçe artışının iki koşulu var ve ikincisi sık atlanıyor: <strong>sonuç başına maliyet, bir müşteri için harcayabileceğiniz üst sınırın altında kalıyor</strong> ve <strong>gelen talebi karşılayabilecek kapasiteniz var.</strong> Kapasitesinin kat kat üstünde talep alan bir işletmede sonuç, cevaplanmayan mesaj yığını ve kötü yorum oluyor.</p>
<p>Artışı kademeli yapıyoruz ve her kademeden sonra birkaç gün sonuçları izliyoruz. Maliyet belirgin şekilde yükseliyorsa hedef kitlenin doyduğunu veya kreatiflerin yorulduğunu düşünüp yeni içerik üretmeye odaklanıyoruz. Reklamlarda kullanılacak Reels ve fotoğraf içeriklerini de aynı ekip üretiyor; <a href="${siteYolu('/hizmetler/video-produksiyon')}">video ve Reels prodüksiyonu</a> tarafını ayrı anlattık.</p>
`,
};

const GOOGLE_ISLETME_PROFILI: RehberYazisi = {
  slug: 'google-isletme-profili-nasil-duzenlenir',
  kume: 'yerel-arama',
  baslik: 'Google İşletme Profili nasıl oluşturulur?',
  seoBaslik: 'Google İşletme Profili Nasıl Oluşturulur? | Ajans Flow',
  ozet:
    'Google İşletme Profili nasıl açılır, nasıl doğrulanır, haritalarda sıralamayı ne belirler? Adım adım kurulum, video doğrulama ve sık yapılan hatalar.',
  tarih: '2026-10-07',
  okuma: 7,
  etiketler: [
    'Google İşletme Profili',
    'Google Haritalar',
    'yerel arama',
    'video doğrulama',
    'harita görünürlüğü',
  ],
  ilgiliHizmet: 'google-isletme',
  onIsaret:
    'Profil ücretsiz ve çoğu işletme için web sitesinden önce görülen vitrin; iş, doğrulamayı tamamlamak ve bilgiyi her yerde aynı tutmaktan oluşuyor.',
  sss: [
    {
      soru: 'Google İşletme Profili ücretli mi?',
      cevap:
        'Hayır. Profil oluşturmak ve yönetmek ücretsiz. Haritalarda reklamlı olarak öne çıkmak isterseniz bu ayrı bir hizmet olan Google Ads üzerinden yapılıyor; organik yerel sıralama ise ödeme ile yükseltilemiyor.',
    },
    {
      soru: 'Video doğrulamam reddedildi, ne yapmalıyım?',
      cevap:
        'Önce Google’ın verdiği gerekçeye bakın. Genellikle konumun, tabelanın, iş alanının veya yönetim yetkisinin videoda yeterince net görünmemesi sorun oluyor. Eksik unsuru gösterecek şekilde tek parça, kesintisiz yeni bir video çekip tekrar gönderebilirsiniz.',
    },
    {
      soru: 'Profilim var ama düzenleyemiyorum, ne yapmalıyım?',
      cevap:
        'Profil Google tarafından veya başka biri tarafından oluşturulmuş olabilir. Bu durumda profilin sahipliğini talep edip doğrulamanız gerekiyor; doğrulama tamamlanana kadar düzenleme hakkı açılmıyor.',
    },
    {
      soru: 'Kötü bir yorumu silebilir miyim?',
      cevap:
        'Yorumu kendiniz silemiyorsunuz. Yorum Google’ın politikalarını ihlal ediyorsa (hakaret, spam veya işletmeyle ilgisi olmayan içerik) profil üzerinden bildirebilirsiniz. Politikaya aykırı olmayan olumsuz yorumlar için en iyi yaklaşım sakin ve çözüm odaklı bir cevap yazmak.',
    },
    {
      soru: 'Adresi olmayan, yerinde hizmet veren bir iş profil açabilir mi?',
      cevap:
        'Açabilir. Müşteriye gidilen işler için profil, açık adres yerine hizmet bölgesi tanımlanarak kuruluyor. Bu durumda haritada bir nokta değil, hizmet verilen alan gösteriliyor.',
    },
  ],
  govde: `
<p>Birisi telefonuna “yakınımdaki kafe”, “diş kliniği Levent” ya da “oto galeri Kağıthane” yazdığında karşısına çıkan harita sonuçları Google İşletme Profili’nden besleniyor. Çoğu işletme için bu profil, web sitesinden bile önce görülen dijital vitrin. Üstelik açması ücretsiz.</p>
<p>Aşağıda profili sıfırdan oluşturmanın sırası, doğrulamada takılınan noktalar ve haritada daha görünür olmak için yapılabilecekler var. Bir şeyi baştan söylemek gerekiyor: profili yönetmek için ayrı bir panele girmiyorsunuz. Google, profil yönetimini doğrudan Arama ve Haritalar içine taşıdı; işletme hesabınızla arama yaptığınızda profilin düzenleme seçenekleri karşınıza geliyor.</p>

<h2 id="kimler">Profil nedir, kimler açabilir</h2>
<p>Google İşletme Profili (eski adıyla Google Benim İşletmem), işletmenizin Google Arama ve Google Haritalar’da görünen kartı. Adres, çalışma saatleri, telefon, fotoğraflar, yorumlar ve site bağlantısı bu kartta duruyor.</p>
<p>Google’ın yönergelerine göre profil açabilmek için işletmenin, belirttiği çalışma saatlerinde müşterilerle yüz yüze temas kurması gerekiyor. Bu temas iki şekilde olabiliyor: müşteri sizin adresinize gelir (kafe, klinik, galeri, spor salonu, anaokulu) ya da siz müşterinin adresine gidersiniz (servis, kurulum, temizlik). Yalnızca internet üzerinden hizmet veren işletmeler bu profile uygun değil.</p>
<p>Müşteriyi adresinizde ağırlamıyorsanız “hizmet bölgesi işletmesi” olarak profil açıp açık adresinizi gizleyebilir, hizmet verdiğiniz bölgeleri belirtebilirsiniz.</p>

<h2 id="adimlar">Adım adım profil oluşturma</h2>
<ol>
  <li><strong>Google hesabınızla giriş yapın.</strong> Mümkünse kişisel değil, işletmeye ait bir Google hesabı kullanın. Çalışan değiştiğinde profilin erişimini kaybetmemek için bu önemli.</li>
  <li><strong>İşletme adını girin.</strong> Tabelanızda, faturanızda ve müşterilerinizin bildiği hâliyle. Adın yanına anahtar kelime veya slogan eklemeyin.</li>
  <li><strong>Ana kategoriyi seçin.</strong> Kategori, profilin hangi aramalarda gösterileceğini en çok etkileyen alanlardan biri. İşinizi en doğru anlatan kategoriyi ana kategori yapın, gerekiyorsa ek kategoriler ekleyin. İki sık hata: ana kategoriyi fazla genel seçmek ve vermediğiniz hizmetleri ek kategori olarak eklemek.</li>
  <li><strong>Adres veya hizmet bölgesini girin.</strong> Haritadaki işaretin girişinizin tam üzerinde olduğundan emin olun. İşaret yanlış yerdeyse müşteri yolu bulamıyor; bu doğrudan kötü yorum üretiyor.</li>
  <li><strong>İletişim bilgilerini ekleyin.</strong> Telefon numarası ve varsa siteniz. Numara, o numaradan gerçekten ulaşılabilen numara olmalı.</li>
  <li><strong>Doğrulamayı tamamlayın.</strong> Profil doğrulanmadan yaptığınız düzenlemeler herkese açık görünmüyor.</li>
</ol>

<h2 id="dogrulama">Doğrulama: en çok takılınan aşama</h2>
<p>Google, işletmenizi doğrulamak için hangi yöntemleri sunacağına kendisi karar veriyor. Seçenekler işletmenin kategorisine, konumuna ve geçmişine göre değişebiliyor; telefon veya SMS, e-posta ve video kaydı karşılaşılan yöntemler arasında.</p>
<p>Video doğrulamada genellikle şunları tek ve kesintisiz bir çekimde göstermeniz isteniyor:</p>
<ul>
  <li>İşletmenin bulunduğu sokak veya çevre — konumu doğrulamak için</li>
  <li>Tabela veya dışarıdan tanınmayı sağlayan işaretler</li>
  <li>İçeride işin yapıldığını gösteren alan: mutfak, muayene odası, sergi alanı</li>
  <li>İşletmeyi yönetme yetkiniz olduğunu gösteren bir unsur: anahtarla kapıyı açmak, kasaya veya yönetim alanına erişmek</li>
</ul>
<p>Kalıcı tabelası olmayan, ev adresinden çalışan ya da adres bilgisi tutarsız işletmelerde doğrulama zorlaşabiliyor. Reddedilirse gerekçeyi okuyup eksik unsuru tamamlayarak yeniden denemek gerekiyor. Aynı işletme için farklı hesaplardan art arda yeni profiller açmak durumu genellikle daha da karmaşık hâle getiriyor.</p>
<p>Profil başka birinin yönetiminde görünüyorsa (eski bir ajans, eski bir çalışan) sahiplik devri talebi açılıyor. Çalışma bittiğinde sahipliğin devredildiğinden emin olmak, sonradan en çok vakit alan işlerden birini önlüyor.</p>

<h2 id="siralama">Haritalarda sıralamayı ne belirler</h2>
<p>Google, yerel sonuçların temel olarak üç faktöre göre belirlendiğini kendi yardım belgelerinde açıklıyor:</p>
<ul>
  <li><strong>Alaka.</strong> Profilin, kullanıcının aradığı şeyle ne kadar örtüştüğü. Kategori, hizmetler ve açıklama burada belirleyici.</li>
  <li><strong>Mesafe.</strong> İşletmenin, arama yapan kişiye ya da aramada belirtilen konuma uzaklığı. Bunu değiştiremiyorsunuz; ama adres işaretinin doğru olmasını sağlayabiliyorsunuz.</li>
  <li><strong>Öne çıkma.</strong> İşletmenin ne kadar bilinir olduğu. Yorum sayısı ve puanı, internetteki diğer kaynaklarda işletmeden bahsedilmesi ve sitenin arama performansı bu faktöre katkı sağlıyor.</li>
</ul>
<p>Google ayrıca yerel sıralamanın ödeme yapılarak yükseltilemeyeceğini belirtiyor. “Haritalarda sizi birinci sıraya çıkarırız” garantisi veren tekliflere bu yüzden temkinli yaklaşmak gerekiyor.</p>

<h2 id="guclendirme">Profili güçlendiren adımlar</h2>
<ul>
  <li><strong>Çalışma saatlerini güncel tutun.</strong> Bayram, resmî tatil ve özel günler için “özel çalışma saatleri” ekleyin. Bu alan doldurulmadığında Google normal saatleri gösteriyor ve tatil gününde “açık” yazıyor.</li>
  <li><strong>Açıklamayı müşteri için yazın.</strong> Ne yaptığınızı, kime hizmet verdiğinizi ve sizi farklı kılanı sade bir dille anlatın. Anahtar kelimeleri art arda sıralamak işe yaramıyor.</li>
  <li><strong>Gerçek fotoğraflar ekleyin.</strong> Dış cephe (müşteri kapıyı tanıyabilsin), iç mekân, ekip, ürünler ve hizmet alanı. Stok görsel yerine işletmenin gerçek hâlini gösterin; aynı çekimde site, sosyal medya ve profil için kullanılabilecek kareleri birlikte almak işi kolaylaştırıyor.</li>
  <li><strong>Hizmetleri ve ürünleri girin.</strong> Profilin en çok boş bırakılan alanı bu. Diş kliniği tedavi başlıklarını, spor salonu ders türlerini, kafe öne çıkan ürünlerini ekleyebilir. Fiyat yazmak zorunlu değil; kapsamı yazıp detayı sitedeki ilgili sayfaya bırakmak daha iyi çalışıyor.</li>
  <li><strong>Bağlantıları doğru kurun.</strong> Restoranlar için menü ve rezervasyon, klinik ve salonlar için randevu bağlantısı eklemek, profili ziyaret eden kişinin bir sonraki adımı atmasını kolaylaştırıyor.</li>
  <li><strong>Güncelleme paylaşın.</strong> Kampanya, etkinlik, yeni ürün veya duyuru. Düzenli ama seyrek kullanmak yeterli; boş kalan profil sahipsiz görünüyor, günde üç duyuru ise kimseye ulaşmıyor.</li>
  <li><strong>Soru-cevap bölümünü boş bırakmayın.</strong> Bu bölümü herkes doldurabiliyor; yanlış cevabı bir yabancının yazması mümkün. Sık sorulan soruları kendi hesabınızdan sorup cevaplamak en temiz yöntem: otopark var mı, rezervasyon alıyor musunuz, kart geçiyor mu.</li>
</ul>

<h2 id="yorumlar">Yorumlar: nasıl istenir, nasıl cevaplanır</h2>
<p>Yorum istemek serbest; önemli olan nasıl istendiği. Google’ın politikaları, yorum karşılığında indirim, hediye veya para teklif edilmesini yasaklıyor. Yalnızca memnun olduğunu düşündüğünüz müşterilerden yorum istemek ya da olumsuz yorum yazılmasını engellemeye çalışmak da politikalara aykırı. En temiz yöntem, hizmetin sonunda tüm müşterilere aynı şekilde yorum bağlantısını iletmek: masadaki bir kart, randevu sonrası gönderilen bir mesaj ya da faturadaki bir karekod.</p>
<p>Cevap yazarken:</p>
<ul>
  <li>Olumlu yorumlara kısa ve kişisel bir teşekkür yeterli; her cevaba aynı kalıbı yapıştırmayın.</li>
  <li>Olumsuz yorumlara sakin, savunmaya geçmeyen ve çözüm öneren bir dille yanıt verin. Bu cevabı, yorumu yazan kişiden çok profilinize bakan sonraki müşteriler okuyor.</li>
  <li>Sağlık gibi hassas alanlarda cevapta hastaya ait hiçbir bilgiyi paylaşmayın.</li>
</ul>
<p>Yorum sayısını artırmanın meşru yolu tek: hizmeti alan müşteriden yorum istemek. Yorum satın almak veya sahte yorum yazdırmak Google’ın kurallarına aykırı ve yakalandığında profil ile yorumlar birlikte zarar görüyor.</p>

<h2 id="tutarlilik">Site bağlantısı ve bilgi tutarlılığı</h2>
<p>Profildeki site bağlantısı, işletmenin ana sayfasına veya o konuma ait sayfaya gitmeli. Birden çok şubeniz varsa her profilin kendi şube sayfasına bağlanması daha iyi çalışıyor.</p>
<p>Sonra tutarlılık: işletme adı, adres ve telefonun profilde, sitede ve diğer dizinlerde <strong>birebir aynı</strong> yazması gerekiyor. Sitede yapısal veri kullanıyorsanız (LocalBusiness) orada yazan bilgiler de profille aynı olmalı. Farklı yazılmış bilgiler Google tarafında belirsizlik oluşturuyor.</p>

<h2 id="hatalar">Sık yapılan hatalar</h2>
<ul>
  <li><strong>İşletme adına anahtar kelime eklemek.</strong> “X Kafe” yerine “X Kafe Levent En İyi Kahvaltı” yazmak Google yönergelerine aykırı ve profilin askıya alınmasına yol açabiliyor. Hizmet ve konum bilgisi için zaten ayrı alanlar var: kategori, hizmet listesi ve adres.</li>
  <li><strong>Sanal ofis veya posta kutusu adresi kullanmak.</strong> Müşterinin gerçekten gelebileceği, çalışma saatlerinde personel bulunan bir adres olmalı.</li>
  <li><strong>Aynı işletme için birden fazla profil açmak.</strong> Mükerrer profiller hem müşteriyi karıştırıyor hem doğrulama sorunu çıkarıyor.</li>
  <li><strong>Tutarsız bilgiler.</strong> Sitede, Instagram’da ve profilde farklı telefon numaraları ya da adres yazımları hem müşteriyi hem Google’ı yanıltıyor.</li>
  <li><strong>Profili kurup unutmak.</strong> Saatleri eski kalmış, yorumları cevapsız bir profil, hiç profil olmamasından kötü bir izlenim bırakabiliyor.</li>
</ul>
<p>Yerel görünürlüğün ikinci ayağı siteniz. Profildeki bilgiyle sitedeki bilginin aynı olması ve sitenin telefonda hızlı açılması, profilin “öne çıkma” tarafını besliyor; <a href="${siteYolu('/hizmetler/web-sitesi-tasarimi')}">web sitesi tarafında ne yaptığımızı</a> ayrı anlattık. Haritada reklamlı görünmek istiyorsanız o ayrı bir iş: <a href="${siteYolu('/hizmetler/google-ads-yonetimi')}">Google Ads yönetimi</a>.</p>
`,
};

const KURUMSAL_WEB_SITESI: RehberYazisi = {
  slug: 'kurumsal-web-sitesi-yaptirma',
  kume: 'web-yazilim',
  baslik: 'Kurumsal web sitesi yaptırmadan önce bilmeniz gerekenler',
  seoBaslik: 'Kurumsal Web Sitesi Yaptırma Rehberi | Ajans Flow',
  ozet:
    'Kurumsal web sitesi yaptırırken teklifte neler yazmalı, alan adı kimin adına alınmalı, hız ve KVKK tarafında nelere bakılmalı? Maddeli kontrol listesi.',
  tarih: '2026-10-07',
  okuma: 6,
  etiketler: [
    'kurumsal web sitesi',
    'web sitesi yaptırma',
    'web sitesi teklifi',
    'alan adı',
    'KVKK',
  ],
  ilgiliHizmet: 'web-sitesi',
  onIsaret:
    'Teklifler arasındaki farkın büyük kısmı fiyattan değil, tekliflerin aynı şeyi anlatmamasından geliyor: önce kapsamı yazın, sonra karşılaştırın.',
  sss: [
    {
      soru: 'Instagram hesabım varken web sitesine gerçekten ihtiyacım var mı?',
      cevap:
        'Instagram güçlü bir kanal ama sahibi siz değilsiniz; algoritma, kurallar veya hesap erişimi bir gün değişebilir. Web sitesi kontrolü tamamen sizde olan bir adres. Google aramalarında görünmek, randevu veya rezervasyon almak ve reklamdan gelen ziyaretçiyi karşılamak için de site büyük kolaylık sağlıyor.',
    },
    {
      soru: 'Web sitesi yaptırmak ne kadar sürer?',
      cevap:
        'Sayfa sayısına, özel modüllere ve özellikle içeriğin ne zaman hazır olduğuna bağlı. Basit bir tanıtım sitesi ile randevu veya stok sistemi içeren bir site arasında ciddi süre farkı oluyor. Teklif aşamasında aşamalara bölünmüş bir takvim istemek beklentileri netleştiriyor.',
    },
    {
      soru: 'Siteyi yaptırdıktan sonra Google’da hemen çıkar mıyım?',
      cevap:
        'Site yayına girdikten sonra Google’ın siteyi keşfetmesi ve dizine eklemesi zaman alabiliyor. Search Console’a site haritası göndermek bu süreci kolaylaştırıyor. Rekabetçi aramalarda üst sıralara çıkmak ise içerik kalitesine, sitenin teknik durumuna ve zamanla kazanılan güvene bağlı; kimse bunun için kesin bir süre garanti edemiyor.',
    },
    {
      soru: 'Alan adı neden benim adıma olmalı?',
      cevap:
        'Alan adı işletmenin kimliği. Siteyi yapan kişi veya firma adına kayıtlıysa, taraflar arasında bir anlaşmazlık çıktığında veya o kişiye ulaşılamadığında işletme kendi adresi üzerinde kontrolünü kaybedebiliyor. Aynı şey hosting, Search Console ve analitik hesapları için de geçerli.',
    },
  ],
  govde: `
<p>Web sitesi yaptırmak isteyen bir işletme sahibi genellikle birbirinden çok farklı teklifler alıyor. Biri birkaç günde teslim edeceğini söylüyor, diğeri haftalar istiyor; aradaki fark da ciddi oluyor. Bu farkın büyük kısmı tekliflerin <strong>aynı şeyi anlatmamasından</strong> kaynaklanıyor.</p>
<p>Aşağıda kafe, oto galeri, diş kliniği, spor salonu ya da anaokulu fark etmeksizin, kurumsal web sitesi yaptırmadan önce netleştirmeniz gereken konular sırayla duruyor. Rakam yazmıyoruz; yazdığımız şey fiyatı belirleyen kalemler.</p>

<h2 id="amac">Önce sitenin amacını netleştirin</h2>
<p>“Bir web sitemiz olsun” bir amaç değil. Siteden beklediğiniz şey, sitenin yapısını ve maliyetini belirliyor. Kendinize tek soru sorun: <em>siteyi ziyaret eden kişinin ne yapmasını istiyorum?</em></p>
<ul>
  <li><strong>Bilgi almak.</strong> Hizmetleri, konumu ve iletişim bilgilerini görmek.</li>
  <li><strong>İletişime geçmek.</strong> Telefonla aramak, WhatsApp’tan yazmak, form doldurmak.</li>
  <li><strong>Randevu veya rezervasyon yapmak.</strong> Klinik, salon veya restoran için.</li>
  <li><strong>Ürün veya stok incelemek.</strong> Oto galeri için araç listesi, kafe için menü.</li>
  <li><strong>Kayıt veya ön başvuru yapmak.</strong> Anaokulu ya da spor salonu için.</li>
</ul>
<p>Bu sorunun cevabı netleştiğinde hangi sayfalara ve hangi özelliklere ihtiyacınız olduğu da ortaya çıkıyor. Teklif istediğiniz firmalara bu listeyi göndermek, birbiriyle karşılaştırılabilir teklifler almanızı sağlıyor.</p>

<h2 id="secenekler">Site kurucu, hazır tema, özel geliştirme</h2>
<p><strong>Site kurucu platformlar</strong> hızlı başlamanızı sağlıyor; kendiniz de kurabilirsiniz. Ancak tasarım ve özellikler platformun sunduğuyla sınırlı, aylık ödeme devam ediyor ve siteyi başka bir yere taşımak çoğu zaman kolay olmuyor.</p>
<p><strong>Hazır tema üzerine kurulan siteler</strong> genellikle bir içerik yönetim sistemi kullanıyor ve makul maliyetle düzgün bir sonuç verebiliyor. Dikkat edilmesi gereken nokta, gereksiz eklentilerle yavaşlayan ve güncellenmediğinde güvenlik açığı oluşturan yapılar.</p>
<p><strong>Özel tasarım ve geliştirme</strong>, işletmeye özgü bir görünüm ve ihtiyaca göre şekillenen özellikler sunuyor. Randevu sistemi, stok listesi, karekodlu menü bağlantısı gibi işe özel modüller gerekiyorsa bu yol daha uygun olabiliyor; süre ve maliyet de diğer seçeneklere göre daha fazla.</p>
<p>Hangisinin doğru olduğu sitenin amacına ve bütçenize bağlı. Üçünün de iyi ve kötü uygulamaları var.</p>

<h2 id="teklif">Teklifte mutlaka yazması gerekenler</h2>
<p>Teklifleri karşılaştırırken şu başlıkların her birinde net bir cevap arayın:</p>
<ol>
  <li><strong>Sayfa listesi.</strong> Hangi sayfalar yapılacak? “Kurumsal site” ifadesi tek başına bir şey anlatmıyor.</li>
  <li><strong>İçerik kimde.</strong> Metinleri ve fotoğrafları siz mi sağlayacaksınız, yazım ve çekim teklife dahil mi?</li>
  <li><strong>Tasarım ve revizyon.</strong> Kaç tasarım taslağı sunulacak, kaç tur revizyon hakkınız var?</li>
  <li><strong>Yönetim paneli.</strong> Metin, fotoğraf, fiyat gibi içerikleri kendiniz güncelleyebilecek misiniz?</li>
  <li><strong>Mobil uyum.</strong> Site telefonda da düzgün çalışacak mı? Bu artık ek özellik değil, temel gereklilik.</li>
  <li><strong>Temel SEO ayarları.</strong> Sayfa başlıkları, açıklamalar, site haritası ve Search Console kurulumu dahil mi?</li>
  <li><strong>Alan adı, hosting ve SSL.</strong> Kimin adına alınacak, yenileme bedellerini kim ödeyecek?</li>
  <li><strong>Teslim süresi ve şartları.</strong> Hangi aşamada ne teslim edilecek?</li>
  <li><strong>Bakım ve destek.</strong> Teslimden sonra güncelleme, yedekleme ve hata düzeltmeleri nasıl yürüyecek?</li>
  <li><strong>Kaynak kod ve erişimler.</strong> Site tamamlandığında yönetici erişimleri ve gerekiyorsa kaynak kod size teslim edilecek mi?</li>
</ol>

<h2 id="alan-adi">Alan adı ve hosting sizin adınıza olmalı</h2>
<p>En sık karşılaşılan sorunlardan biri, alan adının işletme yerine siteyi yapan kişi veya firma adına kayıtlı olması. Taraflar arasında bir anlaşmazlık çıktığında ya da o kişiye ulaşılamadığında işletme kendi alan adı üzerinde kontrolünü kaybedebiliyor.</p>
<p>Alan adını işletmenize ait bir hesapla kaydettirin ve hesabın giriş bilgilerini kendiniz saklayın. Siteyi yapan ekibe gerekiyorsa yetki verin, ama sahipliği devretmeyin. Aynı yaklaşım hosting hesabı, Google Search Console ve analitik hizmetleri için de geçerli. Biz de işi bu şekilde yürütüyoruz: alan adı ve tüm erişimler işletmenin adına kalıyor.</p>

<h2 id="teknik">Hız, mobil uyum ve teknik temeller</h2>
<p>Google, sitelerin dizine eklenmesinde ve sıralanmasında öncelikle mobil sürümü esas alıyor. Yani sitenizin telefonda nasıl göründüğü ve çalıştığı, masaüstü sürümünden daha belirleyici. Ziyaretçilerin önemli bir kısmı da siteye telefondan geliyor; mobil deneyim ikincil bir konu değil.</p>
<p>Google ayrıca sayfa deneyimini ölçmek için <strong>Önemli Web Verileri</strong> (Core Web Vitals) adı verilen metrikleri kullanıyor: sayfanın ana içeriğinin ne kadar hızlı yüklendiği, kullanıcı etkileşimlerine ne kadar hızlı yanıt verdiği ve yükleme sırasında öğelerin yerinden kayıp kaymadığı. Bu değerleri Google’ın ücretsiz PageSpeed Insights aracıyla kontrol edebilirsiniz.</p>
<aside class="af-rb-not">
  <p>Teklif aldığınız firmaya, daha önce yaptığı sitelerin PageSpeed Insights sonuçlarını sormak iyi bir başlangıç sorusu. Hızı en çok etkileyen şeyler genellikle sıkıştırılmamış büyük görseller, gereksiz eklentiler ve yavaş barındırma hizmeti oluyor.</p>
</aside>
<p>Bir not daha: WhatsApp ve Instagram bağlantıları uygulama içi tarayıcıda açılıyor. Reklamdan veya DM’den gelen ziyaretçinin siteyi gördüğü ilk yer burası; teslim öncesi testin bu tarayıcıları da kapsaması gerekiyor.</p>

<h2 id="yasal">Yasal sayfalar: KVKK ve çerezler</h2>
<p>Sitenizde iletişim formu, randevu formu, analiz aracı veya reklam takip kodu varsa kişisel veri işliyorsunuz demektir. 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında ziyaretçileri bilgilendiren bir aydınlatma metni hazırlamanız gerekiyor. Kişisel Verileri Koruma Kurumu’nun çerez uygulamalarına ilişkin rehberi de zorunlu olmayan çerezler için kullanıcının onayının alınması gerektiğini vurguluyor.</p>
<p>Bu metinlerin başka bir siteden kopyalanması yerine, işletmenizin gerçekte hangi veriyi hangi amaçla işlediğine göre hazırlanması gerekiyor; hazırlık sürecinde bir hukukçudan destek almanızı öneririz. Web ekibinin görevi ise metinlerin sitede doğru yerde yayımlanmasını ve çerez onayının teknik olarak düzgün çalışmasını sağlamak. Formların da yalnızca e-posta göndermekle kalmaması, aydınlatma onayını kayda alması ve sahte gönderime karşı korunması gerekiyor.</p>

<h2 id="icerik">İçerik: sitenin en çok ihmal edilen kısmı</h2>
<p>Pek çok site projesi, tasarım bittiği hâlde metinler hazır olmadığı için haftalarca bekliyor. Sonunda da “Firmamız sektörde öncü…” gibi kimseye bir şey anlatmayan metinlerle yayına çıkıyor.</p>
<p>İyi bir site metni müşterinin aklındaki soruları cevaplıyor: ne yapıyorsunuz, kime hizmet veriyorsunuz, nerede ve hangi saatlerde çalışıyorsunuz, süreç nasıl işliyor, size nasıl ulaşılır? Gerçek fotoğraflar da bu güveni destekliyor; mekânı, ekibi ve işi gösteren kareler stok görsellerden çok daha fazlasını anlatıyor.</p>

<h2 id="sektorler">Sektöre göre olmazsa olmaz sayfalar</h2>
<ul>
  <li><strong>Kafe ve restoran.</strong> Menü (karekodlu menüyle aynı kaynaktan beslenirse fiyat tek yerden güncellenir), rezervasyon, konum ve çalışma saatleri.</li>
  <li><strong>Oto galeri.</strong> Güncel stok listesi, araç detay sayfaları, takas ve iletişim formu.</li>
  <li><strong>Diş kliniği.</strong> Tedaviler hakkında bilgilendirici sayfalar, hekim bilgileri, randevu ve konum. Sağlık hizmetlerinin tanıtımına ilişkin mevzuat ve meslek kuralları nedeniyle metinlerin bilgilendirici olması önemli.</li>
  <li><strong>Spor salonu.</strong> Ders programı, eğitmenler, üyelik seçenekleri ve deneme dersi başvurusu.</li>
  <li><strong>Anaokulu.</strong> Eğitim yaklaşımı, günlük akış, ekip, fiziki ortam fotoğrafları ve ön kayıt formu.</li>
</ul>
<p>Sektöre özel modüllerin nasıl kurulduğunu <a href="${siteYolu('/sektorler')}">sektör sayfalarında</a> ayrı ayrı anlattık; gerçek örnekler için <a href="${siteYolu('/calismalar')}">çalışmalarımıza</a> bakabilirsiniz.</p>

<h2 id="bakim">Teslimden sonra: bakım ve güncelleme</h2>
<p>Web sitesi teslim edildiği gün bitmiyor. İçerik yönetim sistemi ve eklentilerin güncellenmesi, düzenli yedek alınması, SSL sertifikasının yenilenmesi ve çalışma saatleri, fiyatlar, kampanyalar gibi bilgilerin güncel tutulması gerekiyor. Bu işlerin kim tarafından ve hangi koşullarla yapılacağını baştan konuşmak, ileride yaşanacak sürprizleri önlüyor.</p>
`,
};

const OTO_GALERI_YAZILIMI: RehberYazisi = {
  slug: 'oto-galeri-yazilimi-secimi',
  kume: 'sektor',
  baslik: 'Oto galeri yazılımı seçerken nelere bakmalı?',
  seoBaslik: 'Oto Galeri Yazılımı Seçimi: Nelere Bakmalı? | Ajans Flow',
  ozet:
    'Oto galeri yazılımında stok ve araç kartı, ilan yönetimi, araç değerleme ve kârlılık takibi tarafında nelere bakılmalı? Galericiler için kontrol listesi.',
  tarih: '2026-10-07',
  okuma: 6,
  etiketler: [
    'oto galeri yazılımı',
    'galeri stok takibi',
    'araç değerleme',
    'ilan yönetimi',
    'galeri muhasebesi',
  ],
  ilgiliHizmet: 'web-sitesi',
  onIsaret:
    'Yazılımın işi dağınıklığı yok etmek değil görünür kılmak: araç kartı tek doğru kaynak olmadan ilan, değerleme ve kârlılık modülleri doğru çalışmıyor.',
  sss: [
    {
      soru: 'Küçük bir galeri için yazılım gerçekten gerekli mi?',
      cevap:
        'Stokunuz azsa ve tek kişi çalışıyorsanız düzenli tutulan bir tablo da iş görebilir. Ancak birden fazla kişi ilan giriyor, araçlar birden çok sitede yayınlanıyor ya da araç başı maliyetinizi net göremiyorsanız, yazılımın sağladığı düzen genellikle harcanan zamanı kısa sürede geri kazandırıyor.',
    },
    {
      soru: 'Araç değerleme yazılımı kesin fiyat verir mi?',
      cevap:
        'Vermez ve vermesi de beklenmemeli. İyi bir değerleme aracı; kendi satış geçmişinizi, piyasa ilanlarını ve araca özel durumları bir arada göstererek karar vermenizi kolaylaştırıyor. Son kararı aracı gören ve piyasayı bilen kişi veriyor.',
    },
    {
      soru: 'İlanlarda yetki belgesi bilgisi yazmak zorunlu mu?',
      cevap:
        'Motorlu Kara Taşıtlarının Ticareti Hakkında Yönetmelik, yetki belgesi sahibi işletmelerin ilanlarında yetki belgesi bilgisine ve işletme adı veya unvanına güncel olarak yer vermesini istiyor. Mevzuat değişebildiği için güncel metni Ticaret Bakanlığı kaynaklarından veya bağlı olduğunuz odadan kontrol etmenizi öneririz.',
    },
    {
      soru: 'İlanlar ilan sitelerine otomatik aktarılabiliyor mu?',
      cevap:
        'Bu tamamen platformun sunduğu resmî yönteme bağlı ve platformdan platforma değişiyor. Satın alma öncesinde bağlantının resmî bir yöntemle mi kurulduğunu, platform kuralları değiştiğinde ne olacağını sorun. Biz bu konuda bir taahhüt vermiyoruz; yaptığımız iş ilan açıklaması ve görseli hazırlama akışı ile galerinin kendi ilan yönetim panelini kurmak.',
    },
  ],
  govde: `
<p>Birçok oto galeride gün şöyle geçiyor: stok listesi bir Excel dosyasında, araç fotoğrafları birinin telefonunda, ilanlar iki üç farklı sitede, müşteri mesajları WhatsApp’ta, alış maliyetleri ise bir defterde. Galeri büyüdükçe bu dağınıklık yanlış fiyatlı ilanlara, takip edilmeyen müşterilere ve aslında ne kadar kâr edildiğinin bilinmemesine dönüşüyor.</p>
<p>Galeri yazılımı bu parçaları tek yerde toplamak için var. Ancak her yazılım her galeriye uymuyor. Aşağıda bir galeri yazılımında aranması gereken özellikler ve seçim yaparken sorulması gereken sorular duruyor.</p>

<h2 id="maliyet">Dağınık çalışmanın galeriye maliyeti</h2>
<p>Dağınıklığın maliyeti çoğu zaman fark edilmiyor, çünkü faturası tek seferde gelmiyor:</p>
<ul>
  <li>Bir aracın fiyatı güncellenir ama ilanlardan biri eski fiyatla kalır, müşteri eski fiyatı sorar.</li>
  <li>Satılmış bir araç ilanda kalmaya devam eder; gelen her soru boşa harcanmış bir zaman olur.</li>
  <li>Takas teklifi veren müşteri geri aranmaz, çünkü kimin arayacağı belli değildir.</li>
  <li>Bir aracın boya, ekspertiz, bakım ve noter masrafları ayrı yerlerde tutulduğu için aracın gerçekte kaça mal olduğu satıştan sonra bile net değildir.</li>
</ul>
<p>İyi kurulmuş bir yazılım bu sorunların hepsini çözmüyor, ama her birini görünür kılıyor.</p>

<h2 id="arac-karti">Stok ve araç kartı: tek doğru kaynak</h2>
<p>Galeri yazılımının kalbi araç kartı. Her araç için bilgilerin tek bir kayıtta tutulması, diğer bütün modüllerin doğru çalışmasının ön koşulu. Bir araç kartında en azından şunlar olmalı:</p>
<ul>
  <li>Plaka, şasi numarası, marka, model, model yılı, paket ve donanım bilgisi</li>
  <li>Kilometre, yakıt ve vites tipi, renk</li>
  <li>Boyalı ve değişen parçalar, hasar kaydı ve ekspertiz raporu bilgisi</li>
  <li>Alış tarihi, alış fiyatı ve kimden alındığı</li>
  <li>Araca yapılan tüm masraflar: bakım, boya, lastik, ekspertiz, noter, komisyon</li>
  <li>Satış fiyatı ve fiyat değişikliği geçmişi</li>
  <li>Fotoğraflar ve ilan metni</li>
</ul>
<p>Fotoğrafların telefonda değil araç kartında durması tek başına ciddi bir zaman kazancı. Ekipten kim ilan girerse girsin aynı fotoğraf setine ve aynı bilgilere ulaşıyor.</p>

<h2 id="ilan">İlan yönetimi ve mevzuat tarafı</h2>
<p>İkinci el araç ticareti, Ticaret Bakanlığı’nın Motorlu Kara Taşıtlarının Ticareti Hakkında Yönetmeliği ile düzenleniyor. Yönetmelik, yetki belgesi sahibi işletmelerin ilanlarında yetki belgesi bilgisine ve yetki belgesindeki işletme adı veya unvanına yer vermesini istiyor; aracın temel bilgilerinin ve satış fiyatının ilanda güncel olarak bulunması da bekleniyor.</p>
<aside class="af-rb-not">
  <p>Bu yazıda otomotiv ticareti mevzuatını yalnızca genel çerçeve olarak anlatıyoruz; madde numarası ve tarih vermiyoruz, çünkü bu başlık düzenli olarak değişiyor. Güncel metni Ticaret Bakanlığı kaynaklarından veya bağlı olduğunuz odadan teyit etmenizi öneririz. Karekodlu menü tarafında olduğu gibi, doğrulayamadığımız bir madde veya tarihi sitemizde yazmıyoruz.</p>
</aside>
<p>Yazılımdan beklentiniz, mevzuatı sizin yerinize yorumlaması değil; <strong>zorunlu alanları eksiksiz ve güncel tutmanızı kolaylaştırması.</strong> İlan modülünde bakılacaklar:</p>
<ul>
  <li><strong>Şablon.</strong> Yetki belgesi ve işletme bilgisi her ilana otomatik eklenebiliyor mu?</li>
  <li><strong>Tek yerden güncelleme.</strong> Fiyat değiştiğinde ya da araç satıldığında ilanların hepsini tek seferde güncellemek mümkün mü?</li>
  <li><strong>Platform bağlantısı.</strong> Kullandığınız ilan sitelerine ilan doğrudan aktarılabiliyor mu? Bu bağlantı platformun sunduğu resmî bir yöntemle mi kuruluyor, yoksa elle kopyalamaya mı dayanıyor? Platformun kuralları değiştiğinde ne olacağını da sorun.</li>
  <li><strong>Kendi web siteniz.</strong> Stoktaki araçlar galerinin sitesinde listelenebiliyor mu? İlan sitelerine bağımlılığı azaltmanın en sağlam yolu, kendi sitenizde güncel bir stok sayfası bulundurmak.</li>
</ul>

<h2 id="degerleme">Araç değerleme modülü neye dayanmalı</h2>
<p>Araç değerleme, galericinin en çok tecrübeye dayandığı iş ve hiçbir yazılım bu tecrübenin yerini tutmuyor. Yazılımın görevi, karar verirken önünüze doğru verileri bir arada koymak. Bir değerleme ekranında şu kaynakların birlikte görülebilmesi işe yarıyor:</p>
<ul>
  <li><strong>Kendi satış geçmişiniz.</strong> Benzer marka, model ve kilometredeki araçları kaça alıp kaça sattığınız ve stokta kaç gün beklediği. Galeri için en değerli veri bu ve yalnızca düzenli kayıt tutulursa oluşuyor.</li>
  <li><strong>Piyasadaki güncel ilanlar.</strong> Benzer araçların ilan fiyatları — ilan fiyatının satış fiyatı olmadığını unutmamak gerekiyor.</li>
  <li><strong>Kasko değer listesi.</strong> Türkiye Sigorta, Reasürans ve Emeklilik Şirketleri Birliği’nin yayımladığı kasko değer listesi bir referans noktası olarak kullanılabiliyor; piyasa fiyatıyla birebir örtüşmeyebiliyor.</li>
  <li><strong>Araca özel düzeltmeler.</strong> Hasar kaydı, boyalı ve değişen parçalar, ekspertiz sonuçları, kilometre, bakım geçmişi ve donanım farkları.</li>
  <li><strong>Maliyet ve hedef kâr.</strong> Aracı satışa hazırlamak için öngörülen masraflar ve hedeflenen marj.</li>
</ul>
<p>Değerleme sonucunun tek bir rakam yerine <strong>bir aralık</strong> olarak gösterilmesi ve bu aralığın hangi verilere dayandığının görülebilmesi önemli. Nereden geldiği belli olmayan “otomatik fiyat” önerileri, özellikle takas pazarlığında güven sorunu yaratabiliyor.</p>

<h2 id="talep">Müşteri ve talep takibi</h2>
<p>Talepler ilan sitelerinden, Instagram’dan, telefondan ve galeriye gelen ziyaretçilerden geliyor. Yazılımda her talebin hangi araçla ilgili olduğu, kaynağı, kiminle görüşüldüğü ve bir sonraki adımın ne olduğu kaydedilebilmeli. “Bu modelden gelirse haber verin” diyen müşterilerin listesi de değerli; uygun araç stoğa girdiğinde bu kişilere ulaşmak, ilana para harcamadan satış yapmanın yollarından biri.</p>
<p>Müşteri bilgileri kişisel veri olduğu için yazılımın kullanıcı yetkilerini ayırabilmesi ve verileri güvenli şekilde saklaması gerekiyor. Kişisel verilerin işlenmesine ilişkin yükümlülükleriniz için bir hukukçudan destek almanızı öneririz.</p>

<h2 id="karlilik">Maliyet ve kârlılık takibi</h2>
<p>Bir aracın gerçek kârı, satış fiyatı ile alış fiyatı arasındaki fark değil. Arada ekspertiz, bakım, boya, lastik, temizlik, noter ve komisyon gibi kalemler var. Ayrıca stokta uzun süre bekleyen bir araç sermayeyi bağlıyor. Yazılımda araç başına toplam maliyetin, net kârın ve stokta bekleme süresinin görülebilmesi, hangi segmentte daha iyi çalıştığınızı veriye dayanarak görmenizi sağlıyor.</p>

<h2 id="hazir-ozel">Hazır paket mi, size özel yazılım mı</h2>
<p>Hazır paketler hızlı başlıyor ve genellikle aylık bedelle çalışıyor; standart bir iş akışınız varsa iyi bir seçenek olabiliyor. Çok şubeli çalışıyorsanız, kendi sitenizle sıkı bir bağ istiyorsanız ya da iş akışınız standart paketlere uymuyorsa size özel geliştirilen bir yazılım daha uygun olabiliyor. Kararı belirleyen soru şu: <em>yazılıma mı uyacaksınız, yazılım mı size uyacak?</em></p>

<h2 id="sorular">Satın almadan önce sorulacak sorular</h2>
<ol>
  <li>Verilerim kime ait? Hizmeti bıraktığımda araç, müşteri ve satış verilerimi dışa aktarabilir miyim?</li>
  <li>Mobil cihazdan araç ekleyip fotoğraf yükleyebiliyor muyum?</li>
  <li>Çalışanlara farklı yetkiler (örneğin alış fiyatını görmeme) tanımlanabiliyor mu?</li>
  <li>Veriler nerede saklanıyor, ne sıklıkla yedekleniyor?</li>
  <li>Mevcut Excel listemi sisteme aktarmama yardım ediliyor mu?</li>
  <li>Destek hangi kanallardan ve hangi saatlerde veriliyor?</li>
</ol>

<h2 id="bizim-is">Bu tarafta biz ne yaptık</h2>
<p>Bir oto galerinin dijital tarafını uçtan uca kurduğumuz iş May Motors. Orada adım adım ilerleyen bir araç değerleme akışı kurduk; değerleme sonucunun müşterinin beyanına dayandığını açıkça yazdık ve yeterli veri olmadığında rakam göstermeyip ekibin iletişime geçtiği bir akış tasarladık. Kaporta parça durumunu görsel bir şema olarak kurguladık, ilan açıklaması ve ilan görseli hazırlama akışını kurduk, galerinin kendi ilan yönetim panelini yazdık ve çok ortaklı galeri muhasebesini araç bazlı masraf takibiyle birlikte kurduk.</p>
<p>Ayrıntıları <a href="${siteYolu('/calismalar/may-motors')}">May Motors çalışmasında</a>, sektörün tamamına nasıl baktığımızı <a href="${siteYolu('/sektorler/oto-galeri')}">oto galeri sayfasında</a> okuyabilirsiniz. Değerleme, ilan hazırlama ve galeri muhasebesi tarafını ayrı ayrı anlattığımız sayfa ise <a href="${siteYolu('/otomotiv-yazilimlari')}">otomotiv yazılımları</a>.</p>
<p>Bir şeyi net söylemek gerekiyor: ilan sitelerinden otomatik veri çekme veya senkronizasyon gibi bir iddiada bulunmuyoruz. Yaptığımız iş, ilan içeriğinin hazırlanmasını ve galerinin kendi stok/ilan düzenini kurmak.</p>
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
  KURUMSAL_WEB_SITESI,
  OTO_GALERI_YAZILIMI,
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

/**
 * Listedeki komşular: `onceki` daha yeni, `sonraki` daha eski yazı.
 * Yazı sayfasının altındaki önceki/sonraki şeridi bunu okuyor. Tek yazı
 * varsa ikisi de `undefined` döner ve şerit basılmaz.
 */
export function komsuYazilar(yazi: RehberYazisi): {
  onceki?: RehberYazisi;
  sonraki?: RehberYazisi;
} {
  const sirali = rehberSirali();
  const i = sirali.findIndex((y) => y.slug === yazi.slug);
  if (i < 0) return {};
  return { onceki: sirali[i - 1], sonraki: sirali[i + 1] };
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
    'QR menü mevzuatından reklam bütçesi hesabına, Google İşletme Profilinden web sitesi teklifini okumaya ve galeri yazılımı seçmeye kadar; işletme sahibinin gerçekten sorduğu soruları yazıyoruz. Mevzuat konularında dayandığımız birincil kaynağı gösteriyor, uydurma rakam kullanmıyoruz.',
  bosBaslik: 'İlk yazılar hazırlanıyor.',
  bosMetin:
    'Rehber yazıları yayına alınma sırasında. Bu arada sorunuzu doğrudan sorabilirsiniz: aynı gün dönüyoruz.',
  metaBaslik: 'Rehber: Dijital Pazarlama ve Yazılım Yazıları',
  metaAciklama:
    'QR menü mevzuatı, Instagram reklam bütçesi, Google İşletme Profili, web sitesi ve galeri yazılımı rehberleri. İşletme sahibinin sorularına kaynaklı yanıtlar.',
  anahtarKelimeler: [
    'dijital pazarlama rehberi',
    'QR menü rehberi',
    'Instagram reklam bütçesi',
    'Google İşletme Profili',
    'kurumsal web sitesi yaptırma',
    'oto galeri yazılımı',
  ],
} as const;
