import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import SSS from '@/components/site/SSS';
import Video from '@/components/site/Video';
import { CerceveTelefon } from '@/components/site/Cerceve';
import { Ikon, IkonOk, IkonTik, IkonWhatsApp } from '@/components/site/Ikonlar';
import { YapisalVeri } from '@/components/site/YapisalVeri';
import { MARKA, siteAdresi, siteYolu, whatsappBaglantisi } from '@/lib/site';
import {
  BIRINCIL_CAGRI,
  SEKTORLER,
  sektorBul,
  sektorVakasi,
  sektorYolu,
  vakaYolu,
  type Sektor,
  type Vaka,
} from '@/lib/site-icerik';
import {
  cumleAyir,
  ikiBasamak,
  kisaVaat,
  oranaUygun,
  sayfaBasligi,
  sektorIkonu,
  sektorSirasi,
  vakaArayuzu,
  vakaFotograflari,
  vakaKolaji,
  videoOrani,
  type Gorsel,
} from '../ortak';
import SektorIsaretle from './SektorIsaretle';
import '../sayfa.css';

type Parametre = { sektor: string };

// oto-galeri'nin KENDİ statik rotası var (src/app/site/sektorler/oto-galeri/).
// Burada da üretilirse `next build` aynı yolu iki kez üretmeye çalışır.
const OZEL_ROTALAR = ['oto-galeri'];

export function generateStaticParams(): Parametre[] {
  return SEKTORLER.filter((s) => !OZEL_ROTALAR.includes(s.slug)).map((s) => ({ sektor: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Parametre>;
}): Promise<Metadata> {
  const { sektor: slug } = await params;
  const sektor = sektorBul(slug);
  if (!sektor) return { title: 'Sektör bulunamadı', robots: { index: false, follow: false } };

  const yol = `/sektorler/${sektor.slug}`;
  return {
    title: sayfaBasligi(sektor.metaBaslik),
    description: sektor.metaAciklama,
    keywords: sektor.anahtarKelimeler,
    alternates: { canonical: yol },
    openGraph: {
      type: 'article',
      locale: 'tr_TR',
      siteName: MARKA.ad,
      url: yol,
      title: `${sektor.metaBaslik}${sektor.metaBaslik.includes(MARKA.ad) ? '' : ` | ${MARKA.ad}`}`,
      description: sektor.metaAciklama,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Yapısal veri: Service + BreadcrumbList                              */
/* FAQPage KULLANILMAZ (SITE-TASARIM.md §9).                           */
/* ------------------------------------------------------------------ */
function yapisalVeri(sektor: Sektor) {
  const kok = siteAdresi();
  const adres = `${kok}/sektorler/${sektor.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${adres}#hizmet`,
        name: sektor.baslik,
        serviceType: sektor.metaBaslik,
        description: sektor.metaAciklama,
        url: adres,
        provider: { '@id': `${kok}/#kurulus` },
        areaServed: 'TR',
        audience: { '@type': 'BusinessAudience', name: sektor.ad },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${adres}#iz`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana sayfa', item: kok },
          { '@type': 'ListItem', position: 2, name: 'Sektörler', item: `${kok}/sektorler` },
          { '@type': 'ListItem', position: 3, name: sektor.ad, item: adres },
        ],
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Örnek iş medyası — künyede GERÇEKTEN duran dosyalardan              */
/* Sıra: video → arayüz karesi (yazılımı gösterir) → en geniş kare.    */
/* Hiçbiri yoksa bölüm tipografik çözüme düşer, sahte görsel YOK.      */
/* ------------------------------------------------------------------ */
function OrnekMedya({ vaka, arayuz }: { vaka: Vaka; arayuz: Gorsel | null }) {
  if (vaka.medya.video) {
    return (
      <div className="af-sk-vaka-medya" data-belir="olcek">
        <Video
          ad={vaka.medya.video}
          poster={vaka.medya.poster}
          oran={videoOrani(vaka.medya.video)}
          baslik={`${vaka.marka} — ${vaka.baslik}`}
          kunyeGoster
        />
      </div>
    );
  }

  const gorsel = arayuz ?? oranaUygun(vakaFotograflari(vaka), 1.1);
  if (!gorsel) return null;

  if (gorsel.telefonMu) {
    return (
      <div className="af-sk-vaka-medya af-sk-vaka-medya--dar" data-belir="olcek">
        <CerceveTelefon boy="buyuk" altyazi={`${vaka.marka} — mobil görünüm`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gorsel.yol}
            alt={gorsel.alt}
            width={gorsel.genislik}
            height={gorsel.yukseklik}
            loading="lazy"
            decoding="async"
          />
        </CerceveTelefon>
      </div>
    );
  }

  return (
    <figure className="af-sk-vaka-medya" data-belir="olcek">
      <span
        className="af-sk-kolaj-kutu"
        style={{ ['--sk-oran' as string]: gorsel.oran } as React.CSSProperties}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={gorsel.yol}
          alt={gorsel.alt}
          width={gorsel.genislik}
          height={gorsel.yukseklik}
          loading="lazy"
          decoding="async"
        />
      </span>
      <figcaption className="af-sektor-kart-not af-ust-16">{vaka.marka}</figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */

export default async function SektorSayfasi({ params }: { params: Promise<Parametre> }) {
  const { sektor: slug } = await params;
  const sektor = sektorBul(slug);
  if (!sektor) notFound();

  const vaka = sektorVakasi(sektor);
  const sira = sektorSirasi(sektor);
  const digerleri = SEKTORLER.filter((s) => s.anahtar !== sektor.anahtar);
  const analizYolu = `${siteYolu(BIRINCIL_CAGRI.href)}?sektor=${encodeURIComponent(sektor.anahtar)}`;
  const waMetni = `Merhaba, ${MARKA.ad} sitesindeki "${sektor.ad}" sayfasından yazıyorum. Ücretsiz dijital analiz istiyorum.`;
  const [girisBasi, girisKalani] = cumleAyir(sektor.giris);

  /* Arayüz karesi örnek işe, kalan kareler stüdyo kolajına gider. */
  const arayuz = vakaArayuzu(vaka);
  const kolaj = vakaKolaji(vaka, arayuz ? [arayuz.dosya] : []);

  return (
    <>
      <YapisalVeri veri={yapisalVeri(sektor)} />
      <SektorIsaretle anahtar={sektor.anahtar} />

      {/* ============ İz şeridi ============ */}
      <div className="af-sk-iz-serit">
        <div className="af-sk-iz-ic">
          <nav className="af-sektor-iz" aria-label="Site yolu">
            <a href={siteYolu('/')}>Ana sayfa</a>
            <span aria-hidden="true">/</span>
            <a href={siteYolu('/sektorler')}>Sektörler</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{sektor.ad}</span>
          </nav>
          <p className="af-sk-iz-sayac">
            Sektör&nbsp;<b>{ikiBasamak(sira)}</b>&nbsp;/&nbsp;{SEKTORLER.length}
          </p>
        </div>
      </div>

      {/* ============ S1 · PLAKA — sektörün derdi ============ */}
      <section className="af-sk-plaka" data-akis="duz" data-alt-cta-gizle aria-labelledby="af-sk-baslik">
        <span className="af-sk-isik" aria-hidden="true" />
        <span className="af-sk-zerre" aria-hidden="true" />

        <div className="af-sk-plaka-ic">
          <div className="af-sk-hero">
            <div>
              <p className="af-ust-etiket">{sektor.ad}</p>
              <h1 className="af-sk-sektor-bas" id="af-sk-baslik">
                {sektor.baslik}
              </h1>
              {/* Uzun giriş kırıldı: ilk cümle büyük puntoda durur,
                  kalanı normal gövdeye iner. Tek kelime değişmedi. */}
              <p className="af-giris af-dar-metin">{girisBasi}</p>
              {girisKalani ? (
                <p className="af-ikincil-metin af-dar-metin af-ust-16">{girisKalani}</p>
              ) : null}

              <div className="af-cipler af-ust-24">
                <span className="af-cip">
                  <Ikon ad={sektorIkonu(sektor.anahtar)} />
                  {kisaVaat(sektor)}
                </span>
                {vaka ? (
                  <a className="af-cip af-cip--nokta" href="#ornek-is">
                    Örnek iş: {vaka.marka}
                  </a>
                ) : null}
              </div>

              <div className="af-sira af-ust-32">
                <Dugme buyuk href={analizYolu}>
                  {BIRINCIL_CAGRI.etiket}
                </Dugme>
                <Dugme tur="ikincil" href={whatsappBaglantisi(waMetni)} whatsapp>
                  <IkonWhatsApp />
                  WhatsApp&apos;tan yazın
                </Dugme>
              </div>
              <p className="af-dugme-not af-ust-16">
                Formda sektör <strong>{sektor.ad}</strong> olarak hazır gelir; baştan anlatmanız
                gerekmez.
              </p>
            </div>

            {/* Sayfanın künyesi: rakamların hepsi bu sayfanın KENDİ
                içeriğinden sayılıyor, hiçbiri iddia değil. */}
            <dl className="af-sk-kunye">
              <div>
                <dt>Yazılım kanadı</dt>
                <dd>
                  <a href="#web">{ikiBasamak(sektor.webTarafi.maddeler.length)} parça</a>
                </dd>
              </div>
              <div>
                <dt>Stüdyo kanadı</dt>
                <dd>
                  <a href="#sosyal">{ikiBasamak(sektor.sosyalTarafi.maddeler.length)} parça</a>
                </dd>
              </div>
              <div>
                <dt>Örnek iş</dt>
                <dd>{vaka ? <a href="#ornek-is">{vaka.marka}</a> : 'yok'}</dd>
              </div>
              <div>
                <dt>Sık sorulan</dt>
                <dd>
                  <a href="#sss">{ikiBasamak(sektor.sss.length)} soru</a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ============ ÇİFT KANAT — iki taraf yan yana, HER KANAT DOLU ======
          Bant farkının KENDİSİ bir bölümdür: koyu = yazılım, kâğıt =
          stüdyo. Ziyaretçi iki tarafın ayrı olduğunu okumadan ÖNCE
          görür. İki kanadın arasındaki sert kesik tek `clip-path`.

          Eskiden burada yalnız iki dev kelime dururdu; maddeler iki ayrı
          bantta AŞAĞIDA tekrar ederdi. Sonuç: kelimelerin altında ve
          bölümün ardında yüzlerce piksel ölü boşluk, üstelik aynı sayı
          ("09 parça") üç ayrı yerde. Artık maddeler kelimenin HEMEN
          ALTINDA; bölümün yüksekliğini içerik belirliyor, sabit
          `min-height` yok. Kanatların kimliği değişmedi: koyu taraf veri
          hücresi, kâğıt taraf editoryal satır. */}
      <section
        className="af-bant af-bant--kagit af-bant--ustsuz af-bant--altsiz"
        aria-label="İki kanat"
        data-akis="veri"
      >
        <div className="af-kap af-kap--tasma">
          <div className="af-kanat">
            {/* ---------- Yazılım kanadı: koyu zemin, veri hücreleri ---------- */}
            <div className="af-kanat-yari af-kanat-yari--koyu" id="web">
              <p className="af-kanat-rozet">
                <span>Yazılım kanadı</span>
                <span>{ikiBasamak(sektor.webTarafi.maddeler.length)} parça</span>
              </p>
              <p className="af-kanat-dev" aria-hidden="true">Yazılım</p>
              <p className="af-kanat-alt">Web sitesi tarafı</p>
              <h2 className="af-kanat-bas">{sektor.webTarafi.baslik}</h2>
              <p className="af-kanat-giris">
                Aşağıdakiler hazır bir şablonun özellikleri değil; işin akışına göre seçtiğimiz
                parçalar. Hangisi sizin için gerekli, görüşmede birlikte işaretliyoruz.
              </p>
              <p className="af-sk-veri-bas">
                <span>Seçmeli · şablon değil</span>
              </p>
              {/* Numaralar sıra değil, okumayı kolaylaştıran sayaç: aria-hidden. */}
              <ul className="af-sektor-veri">
                {sektor.webTarafi.maddeler.map((madde, i) => (
                  <li
                    key={madde}
                    data-belir
                    style={{ ['--i' as string]: Math.min(i, 6) } as React.CSSProperties}
                  >
                    <span className="af-sektor-veri-no" aria-hidden="true">
                      {ikiBasamak(i + 1)}
                    </span>
                    <span>{madde}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ---------- Stüdyo kanadı: kâğıt zemin, editoryal satır ---------- */}
            <div className="af-kanat-yari af-kanat-yari--kagit" id="sosyal">
              <p className="af-kanat-rozet">
                <span>Stüdyo kanadı</span>
                <span>{ikiBasamak(sektor.sosyalTarafi.maddeler.length)} parça</span>
              </p>
              <p className="af-kanat-dev af-sk-gradyan" aria-hidden="true">Stüdyo</p>
              <p className="af-kanat-alt">Sosyal medya tarafı</p>
              <h2 className="af-kanat-bas">{sektor.sosyalTarafi.baslik}</h2>
              <p className="af-kanat-giris">
                Çekim, kurgu, paylaşım düzeni ve reklam aynı ekipten çıkıyor; içerikle siteyi
                birbirine bağlamak için ayrı ajansla konuşmanız gerekmiyor.
              </p>
              <ol className="af-sk-studyo-liste">
                {sektor.sosyalTarafi.maddeler.map((madde, i) => (
                  <li
                    key={madde}
                    data-belir
                    style={{ ['--i' as string]: Math.min(i, 6) } as React.CSSProperties}
                  >
                    <span className="af-sk-studyo-no" aria-hidden="true">
                      {ikiBasamak(i + 1)}
                    </span>
                    <span>{madde}</span>
                  </li>
                ))}
              </ol>

              {kolaj.length ? (
                <div className="af-sk-kolaj" data-belir="olcek">
                  {kolaj.map((g) => (
                    <figure key={g.dosya}>
                      <span
                        className="af-sk-kolaj-kutu"
                        style={{ ['--sk-oran' as string]: g.oran } as React.CSSProperties}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={g.yol}
                          alt={g.alt}
                          width={g.genislik}
                          height={g.yukseklik}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                    </figure>
                  ))}
                </div>
              ) : (
                /* Bu sektörde yayımlanabilir çekim arşivimiz yok: stok
                   fotoğraf koymuyoruz, tipografik çözüme düşüyoruz. */
                <aside className="af-sk-levha" data-belir="olcek">
                  <p className="af-sk-levha-bas af-sk-gradyan">{sektor.ad}</p>
                  <p className="af-sk-levha-metin">{kisaVaat(sektor)}</p>
                  <p className="af-sk-levha-metin">
                    İçerik akışı bu sektörde de aynı sırayla yürüyor: çekim, kurgu, paylaşım düzeni
                    ve bölge hedefli reklam.
                  </p>
                  <p className="af-dugme-not af-ust-0">
                    Yayımlanabilir çekim arşivimiz olmayan sektörlerde stok fotoğraf kullanmıyoruz.
                  </p>
                </aside>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ ÖRNEK İŞ — yalnız gerçekten varsa ============ */}
      {vaka && sektor.ornekIs ? (
        <Bolum
          bant="beyaz"
          id="ornek-is"
          genislik="genis"
          ustEtiket="Örnek iş"
          baslik={`${vaka.marka} · ${vaka.baslik}`}
          giris={sektor.ornekIs.ozet}
          akis="duz"
        >
          <div className="af-sk-vaka">
            <OrnekMedya vaka={vaka} arayuz={arayuz} />
            <div className="af-yigin af-yigin--genis">
              <div>
                <p className="af-sk-vaka-bas">
                  <span>Başlarken</span>
                  <b>{vaka.sektor}</b>
                </p>
                <p className="af-sk-alinti">{vaka.zorluk}</p>
              </div>
              <div>
                <p className="af-sk-vaka-bas">
                  <span>Yaptığımız iş</span>
                  <b>
                    {ikiBasamak(Math.min(4, vaka.yaptiklarimiz.length))} /{' '}
                    {ikiBasamak(vaka.yaptiklarimiz.length)} madde
                  </b>
                </p>
                <ul className="af-tikli">
                  {vaka.yaptiklarimiz.slice(0, 4).map((is) => (
                    <li key={is}>
                      <IkonTik />
                      {is}
                    </li>
                  ))}
                </ul>
              </div>
              <Dugme tur="ikincil" href={vakaYolu(vaka)}>
                İşin tamamını okuyun
              </Dugme>
            </div>
          </div>
        </Bolum>
      ) : null}

      {/* ============ Sektöre özel SSS ============ */}
      <Bolum
        bant="kagit"
        sinif="af-bant--cizgili"
        id="sss"
        genislik="dar"
        ustEtiket="Sık sorulanlar"
        baslik={`${sektor.ad} için sorulanlar`}
        giris="Görüşmelerde en çok karşımıza çıkan sorular. Cevaplar iddiasız: bilmediğimizi bilmiyoruz diyoruz."
      >
        <SSS sorular={sektor.sss} grup={`sss-${sektor.anahtar}`} ilkAcik />
      </Bolum>

      {/* ============ Diğer sektörler — dizin ============ */}
      <Bolum
        bant="beyaz"
        sikis
        ustEtiket="Diğer sektörler"
        baslik="Başka bir işiniz de var mı?"
        giris="İşletme sahipleri çoğu zaman birden fazla alanda çalışıyor. Diğer sektör sayfaları da aynı iskeletle yazıldı."
      >
        <ul className="af-sk-indeks">
          {digerleri.map((s) => (
            <li key={s.anahtar}>
              <a href={sektorYolu(s)}>
                <span aria-hidden="true">{ikiBasamak(sektorSirasi(s))}</span>
                <span>{s.ad}</span>
                <IkonOk />
              </a>
            </li>
          ))}
        </ul>
      </Bolum>

      {/* ============ Çağrı ============ */}
      <Bolum
        bant="koyu"
        orta
        genislik="dar"
        ustEtiket="Sırada ne var"
        baslik={`${sektor.ad} için eksikleri birlikte çıkaralım`}
        giris={BIRINCIL_CAGRI.altMetin}
        akis="imza"
      >
        <div className="af-sektor-cagri" data-alt-cta-gizle>
          <div className="af-dugmeler af-dugmeler--mobil-blok">
            <Dugme buyuk href={analizYolu}>
              {BIRINCIL_CAGRI.etiket}
            </Dugme>
            <Dugme tur="ikincil" href={whatsappBaglantisi(waMetni)} whatsapp>
              <IkonWhatsApp />
              WhatsApp
            </Dugme>
          </div>
          <p className="af-dugme-not">
            Sitede fiyat yazmıyoruz: kapsamı konuşup size özel teklif çıkarıyoruz.
          </p>
        </div>
      </Bolum>
    </>
  );
}
