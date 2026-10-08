import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import SSS from '@/components/site/SSS';
import Video from '@/components/site/Video';
import MarkaSeridi from '@/components/site/MarkaSeridi';
import { CerceveDizustu, CerceveTelefon } from '@/components/site/Cerceve';
import { siteYolu } from '@/lib/site';
import {
  FlowSembolTek,
  IkonDrone,
  IkonGrafik,
  IkonKamera,
  IkonKod,
  IkonKonum,
  IkonQr,
  IkonTik,
  IkonWhatsApp,
  MarkaLogosu,
} from '@/components/site/Ikonlar';

export const metadata: Metadata = {
  title: 'Tasarım sistemi',
  description: 'Ajans Flow sitesinin renk, tipografi, bileşen ve hareket kılavuzu. Yalnızca ekip içi.',
  robots: { index: false, follow: false },
};

/* ---------- Kılavuz yardımcıları ---------- */

function Sinif({ children }: { children: string }) {
  return <code className="ts-sinif">{children}</code>;
}

function Blok({
  sinif,
  not,
  children,
}: {
  sinif: string;
  not?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="ts-blok">
      <div className="ts-blok-bas">
        <Sinif>{sinif}</Sinif>
        {not ? <span className="ts-not">{not}</span> : null}
      </div>
      <div className="ts-blok-ic">{children}</div>
    </div>
  );
}

const RENKLER: Array<[string, string, string]> = [
  ['--af-koyu', '#0E0E16', 'Ana kimlik zemini (yazılım bandı)'],
  ['--af-koyu-2', '#15151F', 'Koyu bant içi kart'],
  ['--af-koyu-3', '#1E1E2B', 'Koyu bantta ikinci kat'],
  ['--af-kagit', '#F7F5F2', 'Stüdyo bandı — kâğıt beyazı'],
  ['--af-beyaz', '#FFFFFF', 'Nötr bant / kart zemini'],
  ['--af-turuncu', '#FF6B35', 'Vurgu. KOYU zeminde metin olabilir'],
  ['--af-turuncu-koyu', '#B83C13', 'AÇIK zeminde turuncu METİN (zorunlu)'],
  ['--af-turuncu-dolu', '#E2541F', 'Dolu düğme zemini + beyaz yazı'],
  ['--af-ink', '#14141F', 'Açık zeminde ana metin'],
  ['--af-ink-2', '#4A4A5A', 'İkincil metin'],
  ['--af-ink-3', '#6F6F82', 'Silik metin / mono etiket'],
];

const BOSLUKLAR = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128];

const SSS_ORNEK = [
  { soru: 'Bu sayfa canlıda görünür mü?', cevap: 'Hayır. robots: index:false ile aramaya kapalı; sitemap’e de girmez. Yalnızca ekip içi kılavuz.' },
  { soru: 'Yeni bir renk gerekiyor, ne yapmalıyım?', cevap: 'Yapma. Önce mevcut bağlam değişkenleriyle (--af-vurgu, --af-metin-2, --af-kenar) çözmeyi dene. Gerçekten eksikse temel ajanına söyle; token site.css’e eklensin.' },
  { soru: 'Kendi CSS dosyamı nereye koyacağım?', cevap: 'Kendi sayfa klasörüne (ör. src/app/site/qr-menu/sayfa.css) ve yalnız o sayfaya import et. Sınıf adların af- ile başlasın, tokenları buradan oku.' },
];

export default function TasarimSistemi() {
  return (
    <>
      <style>{KILAVUZ_CSS}</style>

      {/* ============ Başlık ============ */}
      <Bolum
        bant="koyu"
        baslikEtiketi="h1"
        ustEtiket="Ekip içi kılavuz"
        baslik="Ajans Flow tasarım sistemi"
        giris="Sayfa ajanları buradaki sınıfları kullanır; yeni renk, yeni radius, yeni gölge icat etmez. Her bloğun üstünde kullanılacak sınıf adı yazılı."
        akis="duz"
      >
        <div className="af-sira">
          <Dugme href={siteYolu('/')}>Siteye dön</Dugme>
          <Dugme tur="ikincil" href="#bilesenler">
            Bileşenlere atla
          </Dugme>
        </div>
        <div className="af-veri-serit af-ust-32">
          <div className="af-veri-oge">
            <span className="af-veri-etiket">Bant</span>
            <span className="af-veri-deger">3</span>
            <span className="af-veri-not">kâğıt · koyu · beyaz</span>
          </div>
          <div className="af-veri-oge">
            <span className="af-veri-etiket">Radius</span>
            <span className="af-veri-deger">3</span>
            <span className="af-veri-not">2 · 14 · 999</span>
          </div>
          <div className="af-veri-oge">
            <span className="af-veri-etiket">Boşluk</span>
            <span className="af-veri-deger">10</span>
            <span className="af-veri-not">4 → 128</span>
          </div>
          <div className="af-veri-oge">
            <span className="af-veri-etiket">Düğme türü</span>
            <span className="af-veri-deger">3</span>
            <span className="af-veri-not">birincil · ikincil · hayalet</span>
          </div>
        </div>
      </Bolum>

      {/* ============ Renk ============ */}
      <Bolum bant="beyaz" id="renk" ustEtiket="1 · Token" baslik="Renk" giris="Açık zeminde turuncu metin ASLA #FF6B35 olmaz (kontrast 2.9:1) — --af-turuncu-koyu kullanılır. Geniş turuncu dolgu yok.">
        <div className="ts-renkler">
          {RENKLER.map(([ad, hex, not]) => (
            <div className="ts-renk" key={ad}>
              <span className="ts-renk-kutu" style={{ background: hex }} />
              <div>
                <Sinif>{ad}</Sinif>
                <p className="ts-not">
                  {hex} · {not}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Blok
          sinif="--af-zemin · --af-metin · --af-metin-2 · --af-kenar · --af-vurgu · --af-kart-zemin"
          not="Bağlam değişkenleri: bandı değiştir, bileşenler kendiliğinden uyar. Bileşene renk YAZMA."
        >
          <p className="af-ikincil-metin">
            Bir bileşen asla <Sinif>#FF6B35</Sinif> yazmaz; <Sinif>var(--af-vurgu)</Sinif> yazar. Kâğıt
            bantta bu <Sinif>#B83C13</Sinif>, koyu bantta <Sinif>#FF6B35</Sinif> olur.
          </p>
        </Blok>
      </Bolum>

      {/* ============ Bantlar ============ */}
      <Bolum bant="kagit" id="bantlar" ustEtiket="2 · Zemin" baslik="İki bant ritmi" giris="Bant rengi dekor değil bilgi: kâğıt bant stüdyo işlerini (sosyal medya, çekim, tasarım), koyu bant yazılım işlerini (QR menü, otomotiv, web) anlatır. Beyaz bant nötr aradır.">
        <div className="af-izgara af-izgara--3">
          {(['kagit', 'beyaz', 'koyu'] as const).map((b) => (
            <div className={`af-bant af-bant--${b} ts-bant-ornek`} key={b}>
              <p className="af-ust-etiket">af-bant--{b}</p>
              <h3 className="af-h3">Başlık örneği</h3>
              <p className="af-ikincil-metin">İkincil metin bu bantta böyle görünür.</p>
              <div className="af-sira af-sira--sik">
                <Dugme>Birincil</Dugme>
                <Dugme tur="ikincil">İkincil</Dugme>
              </div>
              <div className="af-kart">
                <p className="af-mono-etiket">kart</p>
                <p className="af-kart-metin">Kart zemini ve kenarı bandı takip eder.</p>
              </div>
            </div>
          ))}
        </div>
        <Blok sinif="<Bolum bant='kagit|koyu|beyaz' ustEtiket baslik giris id akis />" not="Bölüm iskeletini her zaman bu bileşenle kur.">
          <p className="af-ikincil-metin">
            <Sinif>akis=&quot;kare|veri|imza|duz&quot;</Sinif> akış hattının o bölümdeki şeklini seçer.
          </p>
        </Blok>
      </Bolum>

      {/* ============ Tipografi ============ */}
      <Bolum bant="beyaz" id="tipografi" ustEtiket="3 · Tipografi" baslik="Yazı ölçeği" giris="Başlık: Bricolage Grotesque (--font-baslik). Metin: Inter (--font-inter). Mono: JetBrains Mono (--font-mono). Ölçek clamp() ile akışkan.">
        <div className="af-yigin af-yigin--genis">
          <Blok sinif=".af-ust-etiket" not="Mono, 12px, 0.14em aralık, turuncu, önünde 2px çizgi">
            <p className="af-ust-etiket">Yazılım kanadı</p>
          </Blok>
          <Blok sinif=".af-h1" not="34px (mobil) → 76px (masaüstü), letter-spacing -0.03em">
            <p className="af-h1">İçeriği de yazılımı da aynı ekip yazıyor</p>
          </Blok>
          <Blok sinif=".af-h2" not="26px → 48px">
            <p className="af-h2">Bölüm başlığı buraya gelir</p>
          </Blok>
          <Blok sinif=".af-h3 · .af-h4" not="20px → 28px · 17px → 20px">
            <p className="af-h3">Kart grubu başlığı</p>
            <p className="af-h4">Kart başlığı</p>
          </Blok>
          <Blok sinif=".af-giris" not="Giriş paragrafı, en çok 62ch">
            <p className="af-giris">
              Site bir broşür değil, tezgâh: sattığımız şeyin çalışan bir minyatürü sayfanın içinde durur.
            </p>
          </Blok>
          <Blok sinif=".af-mono-etiket · .af-mono-etiket--vurgu" not="Veri/anahtar etiketi, 2px radius">
            <div className="af-sira af-sira--sik">
              <span className="af-mono-etiket">4 dil</span>
              <span className="af-mono-etiket">alerjen filtresi</span>
              <span className="af-mono-etiket af-mono-etiket--vurgu">canlı demo</span>
            </div>
          </Blok>
          <Blok sinif=".af-aksan · .af-alinti" not="Kâğıt bandın serif aksanı — insan dili">
            <blockquote className="af-alinti">
              <p className="af-aksan">Menü değişince fiyatı aynı gün güncelliyoruz.</p>
              <cite>Kule İstanbul Cafe · QR menü</cite>
            </blockquote>
          </Blok>
          <Blok sinif=".af-rakam · [data-sayac]" not="Yalnız doğrulanmış rakam. Sayaç bir kez sayar.">
            <div className="af-sira">
              <span className="af-rakam" data-sayac="12" data-ek="+">
                12+
              </span>
              <span className="af-ikincil-metin">marka</span>
              <span className="af-rakam" data-sayac="244" data-ek="+">
                244+
              </span>
              <span className="af-ikincil-metin">Instagram gönderisi</span>
            </div>
          </Blok>
          <Blok sinif=".af-metin" not="Rehber yazısı / yasal metin gövdesi — otomatik başlık ve liste biçimi">
            <div className="af-metin">
              <p>Gövde metni bu kapsayıcının içine konur; başlıklar, listeler ve paragraf aralıkları hazırdır.</p>
              <ul>
                <li>Madde işareti 2px turuncu çizgidir.</li>
                <li>Satır uzunluğu 70ch ile sınırlıdır.</li>
              </ul>
            </div>
          </Blok>
        </div>
      </Bolum>

      {/* ============ Bileşenler ============ */}
      <Bolum bant="koyu" id="bilesenler" ustEtiket="4 · Bileşen" baslik="Düğmeler, çipler, kartlar" giris="Dokunma hedefi her yerde en az 44px. Düğme köşesi 999px (çip ailesi), kart 14px, veri 2px." akis="veri">
        <div className="af-yigin af-yigin--genis">
          <Blok sinif="<Dugme tur='birincil|ikincil|hayalet' href= onClick= buyuk blok whatsapp />" not="href varsa <a>, yoksa <button type='button'> basılır.">
            <div className="af-sira">
              <Dugme>Ücretsiz analiz</Dugme>
              <Dugme tur="ikincil">Çalışmaları gör</Dugme>
              <Dugme tur="hayalet">Detaylar</Dugme>
              <Dugme buyuk>Büyük birincil</Dugme>
              <Dugme tur="ikincil" whatsapp>
                <IkonWhatsApp />
                WhatsApp
              </Dugme>
            </div>
          </Blok>

          <Blok sinif=".af-cip · .af-cip--aktif · .af-cip--mono · .af-cip--nokta" not="Sektör kapısı ve filtreler. <button>/<a> olduğunda 44px.">
            <div className="af-cipler">
              <button type="button" className="af-cip af-cip--aktif">
                Kafe / restoran
              </button>
              <button type="button" className="af-cip">
                Oto galeri
              </button>
              <button type="button" className="af-cip">
                Go kart
              </button>
              <span className="af-cip af-cip--mono">qr-menu</span>
              <span className="af-cip af-cip--nokta">Eksik: Google profili</span>
            </div>
          </Blok>

          <Blok sinif=".af-kart · .af-kart--tikla · .af-kart--genis · .af-kart--veri · .af-ikon-kutu · .af-tikli" not="Izgara: .af-izgara .af-izgara--3">
            <div className="af-izgara af-izgara--3">
              <article className="af-kart af-kart--tikla">
                <span className="af-ikon-kutu">
                  <IkonQr />
                </span>
                <h3 className="af-kart-baslik">QR dijital menü</h3>
                <p className="af-kart-metin">Çok dilli menü, arama, alerjen filtresi, anında fiyat güncelleme.</p>
                <p className="af-kart-alt">
                  <span className="af-bag-ok" aria-hidden="true">
                    İncele
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                      <path d="M4.5 12h15M13.5 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </p>
              </article>
              <article className="af-kart">
                <span className="af-ikon-kutu">
                  <IkonKamera />
                </span>
                <h3 className="af-kart-baslik">Paket kapsamı</h3>
                <ul className="af-tikli">
                  <li>
                    <IkonTik />
                    Ayda 1 çekim günü
                  </li>
                  <li>
                    <IkonTik />
                    12 içerik + 2 Reels
                  </li>
                  <li>
                    <IkonTik />
                    Aylık ölçüm raporu
                  </li>
                </ul>
                <p className="af-dugme-not">Fiyat yazılmaz; kapsam anlatılır, teklife yönlendirilir.</p>
              </article>
              <article className="af-kart af-kart--vurgulu">
                <span className="af-ikon-kutu">
                  <IkonKod />
                </span>
                <h3 className="af-kart-baslik">.af-kart--vurgulu</h3>
                <p className="af-kart-metin">Turuncu kenarlı kart — sayfada en çok bir kez.</p>
              </article>
            </div>
          </Blok>

          <Blok sinif=".af-veri-serit · .af-veri-oge · .af-veri-tablo · .af-ornek-damga" not="Koyu bant / yazılım kanadı. Demolardaki her rakam 'örnek' damgalı olur.">
            <div className="af-veri-serit">
              <div className="af-veri-oge">
                <span className="af-veri-etiket">Dil</span>
                <span className="af-veri-deger">4</span>
                <span className="af-veri-not">TR · EN · DE · AR</span>
              </div>
              <div className="af-veri-oge">
                <span className="af-veri-etiket">Kategori</span>
                <span className="af-veri-deger">18</span>
                <span className="af-veri-not">
                  <span className="af-ornek-damga">örnek</span>
                </span>
              </div>
              <div className="af-veri-oge">
                <span className="af-veri-etiket">Güncelleme</span>
                <span className="af-veri-deger">anında</span>
                <span className="af-veri-not">panelden</span>
              </div>
            </div>
            <table className="af-veri-tablo af-ust-16">
              <tbody>
                <tr>
                  <th scope="row">Kaynak</th>
                  <td>Web sitesi</td>
                </tr>
                <tr>
                  <th scope="row">Sektör</th>
                  <td>Kafe / restoran</td>
                </tr>
                <tr>
                  <th scope="row">Eksikler</th>
                  <td>Google profili, QR menü</td>
                </tr>
              </tbody>
            </table>
          </Blok>

          <Blok sinif=".af-ikon-kutu + Ikonlar.tsx" not="Satır içi SVG, currentColor. <Ikon ad='qr' /> ile veriden de seçilir.">
            <div className="af-sira">
              {[IkonQr, IkonKamera, IkonDrone, IkonGrafik, IkonKod, IkonWhatsApp, IkonKonum].map((I, i) => (
                <span className="af-ikon-kutu" key={i}>
                  <I />
                </span>
              ))}
            </div>
          </Blok>
        </div>
      </Bolum>

      {/* ============ Cihaz çerçeveleri + video ============ */}
      <Bolum bant="kagit" id="cihaz" ustEtiket="5 · Vitrin" baslik="Cihaz çerçeveleri ve video" giris="Çerçeveler saf CSS. Video tek bileşenden geçer: src ancak görününce atanır, aynı anda tek video oynar, saveData'da hiç yüklenmez." akis="kare">
        <Blok sinif="<CerceveTelefon altyazi /> · <CerceveDizustu altyazi />">
          <div className="af-cihazlar">
            <CerceveTelefon altyazi="QR menü — mobil">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={siteYolu('/medya/foto/kule-istanbul-qr-menu-mobil.jpg')}
                alt="Kule İstanbul Cafe QR menüsünün telefon görünümü"
              />
            </CerceveTelefon>
            <CerceveDizustu altyazi="QR menü — masaüstü">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={siteYolu('/medya/foto/kule-istanbul-qr-menu-masaustu.jpg')}
                alt="Kule İstanbul Cafe QR menüsünün masaüstü görünümü"
              />
            </CerceveDizustu>
          </div>
        </Blok>

        <Blok
          sinif="<Video ad poster oran baslik kunyeGoster />"
          not="oran: yatay | dikey | kare | sinema ya da '4 / 3'. Dosya kunye.json'da yoksa poster kompozisyonu kalır."
        >
          <div className="af-izgara af-izgara--3">
            <Video ad="mas-gokart-gece-pist-surusu.mp4" baslik="MAS Go Kart — gece pisti" kunyeGoster />
            <Video ad="kok-cafe-burger-sunumu.mp4" oran="dikey" baslik="Kök Cafe — burger sunumu" kunyeGoster />
            <Video ad="olmayan-dosya.mp4" baslik="Dosya yoksa: boş kutu kompozisyonu" />
          </div>
        </Blok>
      </Bolum>

      {/* ============ Marka şeridi ============ */}
      <Bolum bant="koyu" id="markalar" ustEtiket="6 · Referans" baslik="Marka şeridi" giris="İki sıra, ters yönlerde, sonsuz. hover ve prefers-reduced-motion durdurur. Logosu olmayan marka tipografik kelime-işaret olur." genislik="tasma">
        <div className="af-kap">
          <Blok sinif="<MarkaSeridi bant='koyu' markalar={…} ikiSira />" not="Logolar public/site/medya/logo/ içinden; uydurma marka eklenmez." >
            <span className="af-ikincil-metin">Aşağıdaki şerit gerçek dosyalarla çalışıyor.</span>
          </Blok>
        </div>
        <MarkaSeridi bant="koyu" />
      </Bolum>

      {/* ============ Form ============ */}
      <Bolum bant="beyaz" id="form" ustEtiket="7 · Dönüşüm" baslik="Form öğeleri" giris="Panelden tamamen bağımsız. KVKK onayı ve ticari ileti izni ASLA tek kutuda birleşmez.">
        <Blok sinif=".af-form · .af-form-izgara · .af-alan · .af-etiket · .af-girdi · .af-onay · .af-secenek · .af-balkupu">
          <form className="af-form">
            <div className="af-form-izgara">
              <p className="af-alan">
                <label className="af-etiket" htmlFor="ts-isletme">
                  İşletme adı<span className="af-etiket-zorunlu">*</span>
                </label>
                <input className="af-girdi" id="ts-isletme" name="isletme" placeholder="Kök Cafe Lounge" />
              </p>
              <p className="af-alan">
                <label className="af-etiket" htmlFor="ts-telefon">
                  Telefon<span className="af-etiket-zorunlu">*</span>
                </label>
                <input className="af-girdi" id="ts-telefon" name="telefon" type="tel" inputMode="tel" placeholder="05__ ___ __ __" />
                <span className="af-yardim">Yalnız teklif için kullanılır.</span>
              </p>
              <p className="af-alan">
                <label className="af-etiket" htmlFor="ts-sektor">
                  Sektör
                </label>
                <select className="af-girdi" id="ts-sektor" name="sektor" defaultValue="kafe">
                  <option value="kafe">Kafe / restoran</option>
                  <option value="oto">Oto galeri</option>
                  <option value="gokart">Go kart</option>
                </select>
              </p>
              <p className="af-alan">
                <label className="af-etiket" htmlFor="ts-hata">
                  Hatalı alan örneği
                </label>
                <input className="af-girdi" id="ts-hata" aria-invalid="true" defaultValue="" />
                <span className="af-hata-metin">Bu alan zorunlu.</span>
              </p>
              <p className="af-alan af-alan--tam">
                <label className="af-etiket" htmlFor="ts-not">
                  Not
                </label>
                <textarea className="af-girdi" id="ts-not" name="not" placeholder="Kısaca ne istiyorsunuz?" />
              </p>
            </div>

            <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
              <legend className="af-etiket" style={{ marginBottom: 'var(--af-b-8)' }}>
                Eksikler (çoklu)
              </legend>
              <div className="af-cipler">
                {['Google İşletme Profili', 'QR menü', 'Web sitesi', 'Düzenli içerik'].map((e) => (
                  <label className="af-secenek" key={e}>
                    <input type="checkbox" name="eksik" value={e} />
                    {e}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="af-onay">
              <input type="checkbox" name="kvkk" required />
              <span>
                <a href={siteYolu('/kvkk')}>KVKK aydınlatma metnini</a> okudum, kişisel verilerimin işlenmesini kabul
                ediyorum. <span className="af-etiket-zorunlu">*</span>
              </span>
            </label>
            <label className="af-onay">
              <input type="checkbox" name="ticari" />
              <span>Kampanya ve bilgilendirme mesajı almak istiyorum. (isteğe bağlı)</span>
            </label>

            <input className="af-balkupu" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <div className="af-dugmeler af-dugmeler--mobil-blok">
              <Dugme buyuk type="submit">
                Ücretsiz analiz iste
              </Dugme>
              <Dugme tur="hayalet">Vazgeç</Dugme>
            </div>
          </form>
        </Blok>
      </Bolum>

      {/* ============ SSS ============ */}
      <Bolum bant="kagit" id="sss" ustEtiket="8 · İçerik" baslik="SSS akordeonu" giris="<details> tabanlı; JavaScript olmadan da çalışır. FAQPage şeması KULLANILMAZ (Google kaldırdı)." genislik="dar" akis="imza">
        <Blok sinif="<SSS sorular={[{soru, cevap}]} tekli grup ilkAcik />">
          <SSS sorular={SSS_ORNEK} ilkAcik />
        </Blok>
      </Bolum>

      {/* ============ Ölçü ve hareket ============ */}
      <Bolum bant="beyaz" id="olcu" ustEtiket="9 · Ölçü" baslik="Boşluk, radius, gölge, kapsayıcı">
        <div className="af-yigin af-yigin--genis">
          <Blok sinif="--af-b-4 … --af-b-128" not="Başka boşluk değeri kullanma.">
            <div className="ts-olcek">
              {BOSLUKLAR.map((b) => (
                <div className="ts-olcek-oge" key={b}>
                  <span className="ts-olcek-cubuk" style={{ width: `${b}px` }} />
                  <code className="ts-sinif">--af-b-{b}</code>
                </div>
              ))}
            </div>
          </Blok>

          <Blok sinif="--af-r-veri (2px) · --af-r-kart (14px) · --af-r-cip (999px)" not="Köşe yarıçapı anlamlıdır: veri · kart · çip. Rastgele radius yok.">
            <div className="af-sira">
              <span className="ts-radius" style={{ borderRadius: 'var(--af-r-veri)' }}>
                2px
              </span>
              <span className="ts-radius" style={{ borderRadius: 'var(--af-r-kart)' }}>
                14px
              </span>
              <span className="ts-radius" style={{ borderRadius: 'var(--af-r-cip)' }}>
                999px
              </span>
            </div>
          </Blok>

          <Blok sinif="--af-golge-1 · --af-golge-2 · --af-golge-3">
            <div className="af-sira">
              {['--af-golge-1', '--af-golge-2', '--af-golge-3'].map((g) => (
                <span className="ts-golge" style={{ boxShadow: `var(${g})` }} key={g}>
                  {g.replace('--af-golge-', 'golge-')}
                </span>
              ))}
            </div>
          </Blok>

          <Blok sinif=".af-kap · .af-kap--dar · .af-kap--genis · .af-izgara--2|3|4 · .af-ikili · .af-kaydir · .af-ayrac">
            <div className="af-izgara af-izgara--4">
              {[1, 2, 3, 4].map((n) => (
                <div className="af-kart af-kart--veri" key={n}>
                  <span className="af-mono-etiket">sütun {n}</span>
                </div>
              ))}
            </div>
            <hr className="af-ayrac" />
            <p className="af-ikincil-metin">
              <Sinif>.af-kap</Sinif> 1200px · <Sinif>.af-kap--dar</Sinif> 840px ·{' '}
              <Sinif>.af-kap--genis</Sinif> 1440px
            </p>
          </Blok>
        </div>
      </Bolum>

      <Bolum bant="koyu" id="hareket" ustEtiket="10 · Hareket" baslik="Nitelik sözlüğü" giris="Efektler.tsx bu nitelikleri okur. Fazlasını yazma: her sahneye animasyon konmaz." akis="imza">
        <FlowSembolTek className="af-filigran" />
        <table className="af-veri-tablo">
          <thead>
            <tr>
              <th scope="col">Nitelik</th>
              <th scope="col">Ne yapar</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['data-belir', 'Görününce belirir. Kardeşlerde --i ile kademelenir. data-belir="yan|olcek|solma" yön değiştirir.'],
              ['data-sayac="244" data-ek="+"', 'Bir kez sayar. Yalnız doğrulanmış rakam.'],
              ['data-baslik-ac', 'SplitText ile kelime kelime açılır. Yalnız ana sayfa H1 ve bölüm H2.'],
              ['data-miknatis', 'Düğme imlece hafifçe çekilir (yalnız ince imleç).'],
              ['data-akis="kare|veri|imza|duz"', 'Akış hattının o bölümdeki şekli. <Bolum akis=… /> ile verilir.'],
              ['data-alt-cta-gizle', 'Ekrandayken mobil alt şerit gizlenir (hero ve alt bilgi taşır).'],
              ['data-video', 'Video bileşeni basar; elle yazılmaz.'],
            ].map(([n, a]) => (
              <tr key={n}>
                <th scope="row">
                  <code className="ts-sinif">{n}</code>
                </th>
                <td>{a}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="af-dugme-not af-ust-24">
          Korumalar: <Sinif>prefers-reduced-motion</Sinif> bütün geçişleri kapatır ve içeriği açar;
          <Sinif>saveData</Sinif> / 2g ağır efektleri ve videoyu kapatır; JS 4 saniyede gelmezse
          <Sinif>js-var</Sinif> kalkar ve her şey görünür olur.
        </p>
        <div className="af-sira af-ust-32">
          <MarkaLogosu boyut={40} />
          <span className="af-ikincil-metin">
            Marka kilidi: <Sinif>&lt;MarkaLogosu boyut /&gt;</Sinif> · filigran:{' '}
            <Sinif>&lt;FlowSembolTek className=&quot;af-filigran&quot; /&gt;</Sinif>
          </span>
        </div>
      </Bolum>
    </>
  );
}

/* Yalnız bu kılavuz sayfasına ait stiller (tasarım sisteminin parçası DEĞİL). */
const KILAVUZ_CSS = `
.ts-sinif{font-family:var(--af-yazi-mono);font-size:.75rem;background:color-mix(in srgb,var(--af-vurgu-cizgi) 14%,transparent);color:var(--af-vurgu);border-radius:var(--af-r-veri);padding:2px 6px;overflow-wrap:anywhere}
.ts-not{font-size:var(--af-y-mini);color:var(--af-metin-3)}
.ts-blok{border:1px dashed var(--af-kenar);border-radius:var(--af-r-kart);overflow:hidden;margin-block-start:var(--af-b-24)}
.ts-blok-bas{display:flex;flex-wrap:wrap;align-items:center;gap:var(--af-b-12);padding:var(--af-b-12) var(--af-b-16);border-block-end:1px dashed var(--af-kenar);background:color-mix(in srgb,var(--af-metin) 3%,transparent)}
.ts-blok-ic{padding:clamp(var(--af-b-16),2vw,var(--af-b-24));display:grid;gap:var(--af-b-16)}
.ts-renkler{display:grid;gap:var(--af-b-12);grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr))}
.ts-renk{display:flex;gap:var(--af-b-12);align-items:center}
.ts-renk-kutu{width:44px;height:44px;border-radius:var(--af-r-veri);border:1px solid var(--af-kenar);flex:none}
.ts-bant-ornek{display:grid;gap:var(--af-b-12);padding:var(--af-b-24);border-radius:var(--af-r-kart);border:1px solid var(--af-kenar)}
.ts-olcek{display:grid;gap:var(--af-b-8)}
.ts-olcek-oge{display:flex;align-items:center;gap:var(--af-b-12)}
.ts-olcek-cubuk{height:12px;background:var(--af-vurgu-cizgi);border-radius:var(--af-r-veri);flex:none}
.ts-radius{display:grid;place-items:center;width:90px;height:56px;border:1px solid var(--af-kenar);background:var(--af-kart-zemin);font-family:var(--af-yazi-mono);font-size:var(--af-y-mono)}
.ts-golge{display:grid;place-items:center;width:140px;height:64px;border-radius:var(--af-r-kart);background:var(--af-kart-zemin);font-family:var(--af-yazi-mono);font-size:var(--af-y-mono);border:1px solid var(--af-kenar-ince)}
`;
