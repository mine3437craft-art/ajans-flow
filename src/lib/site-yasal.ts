/**
 * Sitenin yasal metinleri (KVKK aydınlatma, gizlilik, çerez).
 *
 * Metinler iletişim formunun gerçekte topladığı verilere göre yazıldı:
 * ad, telefon, e-posta (isteğe bağlı), işletme adı, sektör, mesaj.
 * Form IP adresi SAKLAMIYOR (yalnızca sunucu belleğinde saatlik sayaç tutuluyor),
 * bu yüzden metinlerde IP'den söz edilmiyor.
 *
 * NOT: Şirket ünvanı ve vergi/ticaret bilgileri sahibi tarafından verilince
 * `veriSorumlusu` alanı güncellenmeli; avukat kontrolü önerilir.
 */

import { ILETISIM, MARKA } from './site';

export type YasalBolum = { baslik: string; paragraflar: string[]; maddeler?: string[] };

export const SON_GUNCELLEME = '7 Ekim 2026';

export const veriSorumlusu = {
  ad: MARKA.ad,
  eposta: ILETISIM.eposta,
  telefon: ILETISIM.telefonGorunum,
  adres: ILETISIM.adres,
};

export const KVKK_METNI: YasalBolum[] = [
  {
    baslik: 'Veri sorumlusu',
    paragraflar: [
      `Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında, ${veriSorumlusu.ad} tarafından işletilen flowajans.com adresindeki internet sitesi için hazırlanmıştır. Veri sorumlusu ${veriSorumlusu.ad}'dur; iletişim: ${veriSorumlusu.eposta} · ${veriSorumlusu.telefon} · ${veriSorumlusu.adres}.`,
    ],
  },
  {
    baslik: 'Hangi verileri topluyoruz',
    paragraflar: [
      'Yalnızca sitedeki iletişim formunu doldurduğunuzda, kendi yazdığınız bilgileri topluyoruz:',
    ],
    maddeler: [
      'Ad ve soyadınız',
      'Telefon numaranız',
      'E-posta adresiniz (isteğe bağlı)',
      'İşletme adınız ve sektörünüz (isteğe bağlı)',
      'Mesajınızda yazdığınız bilgiler ve ilgilendiğiniz hizmetler',
    ],
  },
  {
    baslik: 'Neden topluyoruz',
    paragraflar: [
      'Verilerinizi yalnızca talebinize dönmek, size teklif hazırlamak ve hizmetlerimiz hakkında bilgi vermek için kullanıyoruz. Pazarlama listesi oluşturmuyor, üçüncü kişilere satmıyoruz.',
    ],
  },
  {
    baslik: 'Hukuki sebep',
    paragraflar: [
      'Formu gönderirken verdiğiniz açık rızanız (KVKK m.5/1) ile; ayrıca sözleşme öncesi görüşmelerin yürütülmesi ve meşru menfaatimiz kapsamında (KVKK m.5/2-c ve f) işlenmektedir.',
    ],
  },
  {
    baslik: 'Kimlerle paylaşıyoruz',
    paragraflar: [
      'Verileriniz ajans içindeki yetkili ekip üyeleri dışında kimseyle paylaşılmaz. Sitenin ve müşteri takip programımızın çalışması için hizmet aldığımız barındırma ve veritabanı sağlayıcılarının sunucularında saklanır; bu sağlayıcılar yalnızca altyapı hizmeti verir, verilerinizi kendi amaçları için kullanmaz.',
    ],
  },
  {
    baslik: 'Ne kadar süre saklıyoruz',
    paragraflar: [
      'Talebiniz sonuçlanana kadar ve sonrasında ticari ilişkinin gerektirdiği süre boyunca saklıyoruz. Silinmesini istediğinizde, yasal saklama yükümlülüğü yoksa siliyoruz.',
    ],
  },
  {
    baslik: 'Haklarınız',
    paragraflar: ['KVKK m.11 uyarınca şu haklara sahipsiniz:'],
    maddeler: [
      'Kişisel verinizin işlenip işlenmediğini öğrenme',
      'İşlenmişse buna ilişkin bilgi talep etme',
      'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme',
      'Eksik ya da yanlış işlenmişse düzeltilmesini isteme',
      'Silinmesini ya da yok edilmesini isteme',
      'Yapılan işlemlerin aktarıldığı üçüncü kişilere bildirilmesini isteme',
      'Zararınız doğmuşsa giderilmesini talep etme',
    ],
  },
  {
    baslik: 'Başvuru',
    paragraflar: [
      `Haklarınızı kullanmak için ${veriSorumlusu.eposta} adresine yazabilir ya da ${veriSorumlusu.telefon} numarasından ulaşabilirsiniz. Başvurunuza en geç otuz gün içinde dönüş yapılır.`,
    ],
  },
];

export const GIZLILIK_METNI: YasalBolum[] = [
  {
    baslik: 'Kısaca',
    paragraflar: [
      'Bu sitede üyelik yok, ödeme yok, reklam izleme kodu yok. Sizden tek bilgi aldığımız yer iletişim formu; orada da yalnızca kendi yazdıklarınızı alıyoruz.',
    ],
  },
  {
    baslik: 'Çerezler',
    paragraflar: [
      'Site, çalışması için gerekli olmayan hiçbir çerez kullanmaz; reklam ya da takip çerezi yoktur. Bu nedenle çerez onay penceresi de göstermiyoruz.',
    ],
  },
  {
    baslik: 'Dış bağlantılar',
    paragraflar: [
      'Sitede Instagram, WhatsApp ve müşterilerimizin kendi sitelerine bağlantılar bulunur. Bu bağlantılara tıkladığınızda ilgili sitenin kendi gizlilik politikası geçerli olur.',
    ],
  },
  {
    baslik: 'Video ve görseller',
    paragraflar: [
      'Sitedeki videolar kendi sunucumuzdan, sessiz olarak oynatılır; YouTube, Vimeo gibi bir dış oynatıcı ve onların takip kodları kullanılmaz.',
    ],
  },
  {
    baslik: 'İletişim',
    paragraflar: [
      `Gizlilikle ilgili her sorunuz için: ${veriSorumlusu.eposta}`,
    ],
  },
];

/** Form altındaki kısa onay metni. */
export const FORM_ONAY_METNI =
  'Formu göndererek, talebime dönülmesi amacıyla ad, telefon ve yazdığım bilgilerin işlenmesine izin veriyorum.';
