import type { Metadata } from 'next';

import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import { IkonWhatsApp } from '@/components/site/Ikonlar';
import { MARKA, siteYolu, whatsappBaglantisi } from '@/lib/site';

import DemoMenu from './DemoMenu';
import './sayfa.css';

const YOL = '/demo/qr-menu';
const QR_YOLU = siteYolu('/qr-menu');

export const metadata: Metadata = {
  title: 'QR Dijital Menü Demosu',
  description:
    'Dört dilli örnek QR menü: kategori gezinme, anlık arama, vegan ve glutensiz filtreleri, alerjen bilgisi. Sipariş iletilmez; veriler örnektir.',
  alternates: { canonical: YOL },
  /* Demo aramaya kapalı: örnek fiyat ve ürünlerin arama sonucuna düşmesini
     istemiyoruz. Bağlantılar izlenebilir kalır. */
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: MARKA.ad,
    url: YOL,
    title: 'QR dijital menü demosu — dört dil, arama, alerjen filtreleri',
    description: 'Kurduğumuz menü sisteminin çalışan bir örneği. Ürünler, fiyatlar ve kalori değerleri örnektir.',
  },
};

/* Aramaya kapalı bir sayfada yapısal veriye gerek yok; bilinçli olarak
   JSON-LD basmıyoruz (SITE-TASARIM.md §9). */

const DENENECEKLER = [
  'Sağ üstteki TR · EN · DE · AR düğmeleriyle dili değiştirin; Arapçada menü sağdan sola akar.',
  'Arama kutusuna “bur”, “ceviz” ya da “lentil” yazın: arama ürün adında, açıklamada, içindekilerde ve alerjen adlarında çalışır.',
  'Glutensiz ve vegan filtrelerini birlikte açın; filtreler rozetten değil, ürünün alerjen ve kaynak listesinden hesaplanır.',
  'Bir üründe “İçindekiler ve alerjen” düğmesine dokunun: içindekiler, alerjen bilgisi ve enerji değeri açılır.',
  'Menüden ürün ekleyip Sipariş sekmesine geçin; masa numarası ve not alanlarını görün.',
  'Rezervasyon sekmesinde tarih, saat ve kişi sayısı alanlarını deneyin.',
];

export default function QrMenuDemoSayfasi() {
  return (
    <>
      {/* ============ Tanıtım PLAKASI ============
          Demo sayfası bir broşür değil ÜRÜN SAYFASI: plaka + devasa
          başlık + ürün künyesi şeridi. Grain ve tek ışık havuzu
          `.af-yk-plaka` pseudo'larından gelir (ek DOM yok). */}
      <div data-alt-cta-gizle="">
        <Bolum
          bant="koyu"
          ustEtiket="Canlı demo"
          baslik="QR dijital menü demosu"
          baslikEtiketi="h1"
          giris="Aşağıdaki menü gerçekten çalışıyor: dört dil, kategori gezinme, anlık arama, diyet filtreleri ve ürün detayı. İşletme, ürünler, fiyatlar ve kalori değerleri örnektir; gerçek bir müşterimize ait veri içermez."
          akis="kare"
          genislik="dar"
          sinif="af-yk-plaka af-demo-giris"
        >
          <div className="af-veri-serit af-demo-serit-iri">
            <div className="af-veri-oge">
              <span className="af-veri-etiket">Dil</span>
              <span className="af-veri-deger">4</span>
              <span className="af-veri-not">TR · EN · DE · AR</span>
            </div>
            <div className="af-veri-oge">
              <span className="af-veri-etiket">Ürün</span>
              <span className="af-veri-deger">18</span>
              <span className="af-veri-not">
                <span className="af-ornek-damga">örnek</span>
              </span>
            </div>
            <div className="af-veri-oge">
              <span className="af-veri-etiket">Kategori</span>
              <span className="af-veri-deger">5</span>
              <span className="af-veri-not">kahvaltıdan içeceğe</span>
            </div>
            <div className="af-veri-oge">
              <span className="af-veri-etiket">Gönderilen veri</span>
              <span className="af-veri-deger">yok</span>
              <span className="af-veri-not">sipariş iletilmez</span>
            </div>
          </div>
          <div className="af-dugmeler af-dugmeler--mobil-blok af-ust-24">
            <Dugme tur="ikincil" href={QR_YOLU}>
              QR menü hizmetine dön
            </Dugme>
            <Dugme tur="hayalet" href={`${QR_YOLU}#mevzuat`}>
              Mevzuat bölümünü oku
            </Dugme>
          </div>
        </Bolum>
      </div>

      {/* ============ Demo SAHNESİ ============
          Ürün karanlık bir sahnede duruyor: menü kabuğu kendi ışık
          bağlamını kuran BEYAZ bir ada (`.af-demo` dokuz bant
          değişkenini yeniden yazıyor), çevresinde ince bir cihaz
          çerçevesi ve altında plaka. Kapatılamayan demo şeridi
          kabuğun EN ÜSTÜNDE ve yapışkan kalır. */}
      <div data-alt-cta-gizle="">
        <Bolum bant="koyu" id="demo" sikis akis="veri" sinif="af-yk-plaka af-yk-kesik">
          <div className="af-demo-sayfa">
            <div className="af-yigin">
              <h2 className="af-h3 af-demo-h2">Neyi deneyebilirsiniz?</h2>
              {/* Tik listesi yerine NUMARALI DEFTER: altı adım, iri
                  mono numara, saç teli ayraç. */}
              <ol className="af-demo-dene">
                {DENENECEKLER.map((d, i) => (
                  <li key={d}>
                    <span className="af-demo-dene-no" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{d}</span>
                  </li>
                ))}
              </ol>
              <p className="af-ikincil-metin">
                Demoda ürün fotoğrafı yok; gerçek kurulumda menüyü dolduran kareler çekimden geliyor. Sipariş ve
                rezervasyon ekranlarındaki gönder düğmeleri çalışır ama hiçbir veri iletilmez, kaydedilmez ve
                tarayıcınızda tutulmaz.
              </p>
              <p className="af-dugme-not">
                Menü içeriği JavaScript olmadan da okunur; dil değiştirme, arama ve filtreler JavaScript ile çalışır.
              </p>
            </div>

            <div className="af-demo-cihaz">
              <p className="af-demo-cihaz-bar" aria-hidden="true">
                <span className="af-demo-cihaz-nokta" />
                <span className="af-demo-cihaz-nokta" />
                <span className="af-demo-cihaz-nokta" />
                <span className="af-demo-cihaz-ad">QR dijital menü · örnek kurulum</span>
              </p>
              <DemoMenu />
            </div>
          </div>
        </Bolum>
      </div>

      {/* ============ Çağrı ============ */}
      <div data-alt-cta-gizle="">
        <Bolum
          bant="koyu"
          baslik="Menünüzü bu düzende kurarız."
          giris="Kendi kategorilerinizle, kendi fotoğraflarınızla ve ihtiyacınız olan dillerle. Mevcut menünüzü ve fiyat listesi düzeninizi birlikte gözden geçirelim."
          orta
          genislik="dar"
          akis="imza"
        >
          <div className="af-dugmeler af-dugmeler--mobil-blok af-demo-cagri">
            <Dugme buyuk href={siteYolu('/iletisim')}>
              Ücretsiz analiz iste
            </Dugme>
            <Dugme
              tur="ikincil"
              whatsapp
              href={whatsappBaglantisi('Merhaba, QR menü demosunu gördüm. Bizim menümüz için bilgi almak istiyorum.')}
            >
              <IkonWhatsApp />
              WhatsApp
            </Dugme>
          </div>
        </Bolum>
      </div>
    </>
  );
}
