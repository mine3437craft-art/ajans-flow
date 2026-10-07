import { medyaYolu, vakaHizmetleri, vakaYolu, type Vaka } from '@/lib/site-icerik';
import { IkonOk } from '@/components/site/Ikonlar';
import { altMetni, oran } from './medya';
import {
  markaYaziVaryanti,
  vakaKapagi,
  vakaLogosu,
  vakaSektorAnahtarlari,
} from './ortak';

type Props = {
  vaka: Vaka;
  /** Belirme kademesi (--i). */
  sira?: number;
  /** Sayfanın başlık sırasını bozmamak için. */
  baslikEtiketi?: 'h3' | 'h4';
  /** Kısa kart: özet ve çipler basılmaz (ilgili çalışmalar şeridi). */
  sade?: boolean;
  /**
   * Görününce belirme. Süzülen listede KULLANILMAZ: filtre bir kartı
   * gizleyip sonra gösterdiğinde kaydırma tetikleyicisi yeniden
   * çalışmayabilir ve kart görünmez kalır.
   */
  belir?: boolean;
};

/**
 * Vaka kartı — hem /calismalar listesinde hem detay sayfasının "diğer
 * çalışmalar" şeridinde kullanılır.
 *
 * `data-vk-hizmet` listedeki JS'siz filtrenin, `data-vk-sektor` ise sektör
 * kapısı seçiminin (html[data-sektor]) okuduğu niteliklerdir.
 */
export default function VakaKarti({ vaka, sira = 0, baslikEtiketi: Baslik = 'h3', sade, belir }: Props) {
  const kapak = vakaKapagi(vaka);
  const logo = vakaLogosu(vaka);
  const hizmetler = vakaHizmetleri(vaka);
  const gosterilen = hizmetler.slice(0, 3);
  const kalan = hizmetler.length - gosterilen.length;
  // Uzun kareler (telefon ekranı, afiş) üstten hizalanır: başlık görünür kalsın.
  const ustHizala = kapak ? oran(kapak) < 0.85 : false;

  return (
    <article
      className="af-kart af-kart--tikla af-vk-kart"
      data-vk-hizmet={vaka.hizmetler.join(' ')}
      data-vk-sektor={vakaSektorAnahtarlari(vaka).join(' ')}
      data-belir={belir ? '' : undefined}
      style={{ ['--i' as string]: Math.min(sira, 6) } as React.CSSProperties}
    >
      <div className={['af-kart-gorsel', 'af-vk-kapak', ustHizala ? 'af-vk-kapak--ust' : '']
        .filter(Boolean)
        .join(' ')}
      >
        {kapak ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={medyaYolu(kapak.dosya)}
            alt={altMetni(kapak)}
            width={kapak.genislik}
            height={kapak.yukseklik}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className={`af-marka-yazi af-marka-yazi--${markaYaziVaryanti(vaka.marka)}`}>
            {vaka.marka}
          </span>
        )}
        {logo ? (
          <span className={`af-marka af-vk-logo af-marka--kutu-${logo.ton}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={medyaYolu(logo.kayit.dosya)}
              alt={`${vaka.marka} logosu`}
              width={logo.kayit.genislik}
              height={logo.kayit.yukseklik}
              loading="lazy"
              decoding="async"
            />
          </span>
        ) : null}
      </div>

      <p className="af-vk-kart-ust">
        <span className="af-mono-etiket">{vaka.marka}</span>
        <span className="af-vk-kart-sektor">{vaka.sektor}</span>
        <span className="af-cip af-cip--mono af-vk-sizin">Sizin sektörünüz</span>
      </p>

      <Baslik className="af-kart-baslik">{vaka.baslik}</Baslik>

      {sade ? null : <p className="af-kart-metin">{vaka.ozet}</p>}

      {sade ? null : (
        <p className="af-cipler af-vk-kart-cipler">
          {gosterilen.map((h) => (
            <span className="af-cip af-cip--mono" key={h.anahtar}>
              {h.kisaAd}
            </span>
          ))}
          {kalan > 0 ? <span className="af-cip af-cip--mono">+{kalan}</span> : null}
        </p>
      )}

      <p className="af-kart-alt">
        <span className="af-bag-ok">
          Çalışmayı oku
          <IkonOk />
        </span>
      </p>

      <a className="af-kaplayan-bag" href={vakaYolu(vaka)}>
        <span className="af-gizli-metin">{`${vaka.marka}: ${vaka.baslik}`}</span>
      </a>
    </article>
  );
}
