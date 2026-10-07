/**
 * VİTRİN KARTI — /calismalar listesinin sinematik kartı.
 *
 * Ritim düz ızgara değil ÖLÇEK FARKI: ilk kart tam genişlikte sinema
 * penceresi (içinde maskelenmiş, sessiz döngüde video), sonrası portre
 * ve manzara pencereler arasında dönüşümlü. Her pencere oranı CSS'te
 * kilitli → görsel gelmeden kutu rezerve, CLS 0.
 *
 * JS'siz filtrenin ve sektör kapısının okuduğu nitelikler AYNEN korunur:
 *   data-vk-hizmet  → `.af-vk-liste:has(#vk-f-X:checked)` kuralları
 *   data-vk-sektor  → `:root[data-sektor="X"]` sıralaması
 * `af-vk-kart` sınıfı bu yüzden pazarlık konusu değil.
 */
import Video from '@/components/site/Video';
import { IkonOk } from '@/components/site/Ikonlar';
import { medyaYolu, vakaHizmetleri, vakaYolu, type Vaka } from '@/lib/site-icerik';
import { altMetni } from './medya';
import {
  markaYaziVaryanti,
  vakaLogosu,
  vakaSektorAnahtarlari,
  vitrinPenceresi,
} from './ortak';

type Props = {
  vaka: Vaka;
  /** Liste sırası: pencere oranını ve belirme kademesini belirler. */
  sira: number;
};

export default function VitrinKarti({ vaka, sira }: Props) {
  // Maskelenmiş video önizlemesi YALNIZ ilk (tam genişlik) kartta:
  // sayfada aynı anda tek video oynar, poster bütçesi de böyle korunur.
  const { oranCss, kare, klip } = vitrinPenceresi(vaka, sira);
  const logo = vakaLogosu(vaka);
  const hizmetler = vakaHizmetleri(vaka);
  const gosterilen = hizmetler.slice(0, 3);
  const kalan = hizmetler.length - gosterilen.length;

  return (
    <article
      className="af-kart af-kart--tikla af-vk-kart af-vk-vitrin-kart"
      data-vk-hizmet={vaka.hizmetler.join(' ')}
      data-vk-sektor={vakaSektorAnahtarlari(vaka).join(' ')}
      data-vk-boy={sira === 0 ? 'genis' : undefined}
      data-vk-isik=""
      style={
        {
          ['--i' as string]: Math.min(sira, 6),
          ['--vk-pencere' as string]: oranCss,
        } as React.CSSProperties
      }
    >
      <div className="af-vk-pencere">
        {klip ? (
          <Video
            ad={klip.kayit.dosya}
            poster={klip.poster}
            oran={oranCss}
            baslik={klip.kayit.baslik ?? `${vaka.marka} — ${vaka.baslik}`}
            sira={1}
            sinif="af-vk-pencere-video"
          />
        ) : kare ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={medyaYolu(kare.dosya)}
            alt={altMetni(kare)}
            width={kare.genislik}
            height={kare.yukseklik}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="af-vk-pencere-bos" aria-hidden="true" />
        )}

        {/* Perde: pencerenin alt kenarını koyulaştırır ki kelime-işaret
            her karede okunsun (kontrast tesadüfe bırakılmaz). Grain
            satır içi feTurbulence — İSTEK YOK, 390 bayt. */}
        <span className="af-vk-perde" aria-hidden="true" />
        <span className="af-vk-zerre" aria-hidden="true" />
        {/* İmleç ışığı: masaüstünde imlecin peşinden gelen tek havuz. */}
        <span className="af-vk-isik-havuz" aria-hidden="true" />

        <p className="af-vk-pencere-no" aria-hidden="true">
          {String(sira + 1).padStart(2, '0')}
        </p>

        <span className="af-vk-pencere-marka">
          {logo ? (
            <span className={`af-marka af-vk-logo af-marka--kutu-${logo.ton}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={medyaYolu(logo.kayit.dosya)}
                alt={`${vaka.marka} logosu`}
                width={logo.kayit.genislik}
                height={logo.kayit.yukseklik}
                decoding="async"
              />
            </span>
          ) : (
            <span className={`af-marka-yazi af-marka-yazi--${markaYaziVaryanti(vaka.marka)}`}>
              {vaka.marka}
            </span>
          )}
        </span>
      </div>

      <div className="af-vk-govde">
        <p className="af-vk-kart-ust">
          <span className="af-mono-etiket">{vaka.sektor}</span>
          <span className="af-cip af-cip--mono af-vk-sizin">Sizin sektörünüz</span>
        </p>

        <h3 className="af-vk-vitrin-baslik">{vaka.baslik}</h3>
        <p className="af-kart-metin">{vaka.ozet}</p>

        <p className="af-cipler af-vk-kart-cipler">
          {gosterilen.map((h) => (
            <span className="af-cip af-cip--mono" key={h.anahtar}>
              {h.kisaAd}
            </span>
          ))}
          {kalan > 0 ? <span className="af-cip af-cip--mono">+{kalan}</span> : null}
        </p>

        <p className="af-kart-alt">
          <span className="af-bag-ok">
            Çalışmayı oku
            <IkonOk />
          </span>
        </p>
      </div>

      <a className="af-kaplayan-bag" href={vakaYolu(vaka)}>
        <span className="af-gizli-metin">{`${vaka.marka}: ${vaka.baslik}`}</span>
      </a>
    </article>
  );
}
