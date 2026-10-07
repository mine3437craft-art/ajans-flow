import { siteYolu } from '@/lib/site';

export type MarkaYazi = 'serif' | 'kalin' | 'genis' | 'mono' | 'yuvarlak';

export type Marka = {
  ad: string;
  /** AÇIK zemine uygun (koyu mürekkepli) logo — 'logo/…png' */
  logoAcik?: string;
  /** KOYU zemine uygun (beyaz) logo — 'logo/…svg' */
  logoKoyu?: string;
  genislik?: number;
  yukseklik?: number;
  /** Logosu yoksa tipografik kelime-işaret varyantı */
  yazi?: MarkaYazi;
};

/**
 * Varsayılan liste — `public/site/medya/logo/` içinde GERÇEKTEN duran
 * dosyalar. Logosu olmayan markalar tipografik kelime-işaret olur
 * (SITE-TASARIM.md §3). Uydurma marka eklenmez.
 *
 * Not: Kule İstanbul, Kök Cafe ve May Motors logolarının yalnızca beyaz
 * (koyu zemine uygun) sürümü var; bu yüzden şerit KOYU bantta en iyi
 * görünür. Açık bantta bileşen bu logoları koyu bir kutunun içine alır.
 */
export const VARSAYILAN_MARKALAR: readonly Marka[] = [
  { ad: 'MAS Go Kart', logoAcik: 'logo/masgokart-logo.png', logoKoyu: 'logo/masgokart-logo-beyaz.png', genislik: 288, yukseklik: 120 },
  { ad: 'May Motors', logoKoyu: 'logo/maymotors-logo-beyaz.svg', genislik: 289, yukseklik: 34 },
  { ad: 'Kule İstanbul Cafe', logoKoyu: 'logo/kule-istanbul-cafe-logo.png', genislik: 195, yukseklik: 120 },
  { ad: 'Kök Cafe Lounge', logoKoyu: 'logo/kok-cafe-lounge-logo.png', genislik: 166, yukseklik: 120 },
  { ad: 'Airsoft İstinye', logoAcik: 'logo/airsoft-istinye-logo.png', genislik: 120, yukseklik: 120 },
  { ad: 'Mimar Elif Kara', yazi: 'serif' },
  { ad: 'Mançurya', yazi: 'genis' },
  { ad: 'Dent 50 Clinic', yazi: 'mono' },
];

/** Logosu olmayan markalara sabit (her yüklemede aynı) varyant dağıt. */
const YAZI_SIRASI: MarkaYazi[] = ['serif', 'kalin', 'genis', 'mono', 'yuvarlak'];

type Props = {
  markalar?: readonly Marka[];
  /** Şeridin durduğu bandın rengi — logo sürümü buna göre seçilir. */
  bant?: 'koyu' | 'kagit' | 'beyaz';
  /** Tek sıra isteniyorsa false. */
  ikiSira?: boolean;
  sinif?: string;
};

function MarkaKutusu({ marka, bant, sira }: { marka: Marka; bant: Props['bant']; sira: number }) {
  const koyuBant = bant === 'koyu';
  const istenen = koyuBant ? marka.logoKoyu : marka.logoAcik;
  const yedek = koyuBant ? marka.logoAcik : marka.logoKoyu;
  const dosya = istenen ?? yedek;

  if (!dosya) {
    const varyant = marka.yazi ?? YAZI_SIRASI[sira % YAZI_SIRASI.length];
    return (
      <div className="af-marka">
        <span className={`af-marka-yazi af-marka-yazi--${varyant}`}>{marka.ad}</span>
      </div>
    );
  }

  // İstenen sürüm yoksa logoyu zıt tonda bir kutuya al (okunurluk).
  const kutuSinifi = istenen ? '' : koyuBant ? 'af-marka--kutu-acik' : 'af-marka--kutu-koyu';
  return (
    <div className={['af-marka', kutuSinifi].filter(Boolean).join(' ')}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={siteYolu(`/medya/${dosya}`)}
        alt={`${marka.ad} logosu`}
        width={marka.genislik}
        height={marka.yukseklik}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function Sira({
  markalar,
  bant,
  ters,
}: {
  markalar: readonly Marka[];
  bant: Props['bant'];
  ters?: boolean;
}) {
  // Kesintisiz döngü için liste iki kez basılır; ikinci kopya okuyucuda yok.
  return (
    <div className={['af-marka-sira', ters ? 'af-marka-sira--ters' : ''].filter(Boolean).join(' ')}>
      {markalar.map((m, i) => (
        <MarkaKutusu key={`a-${m.ad}`} marka={m} bant={bant} sira={i} />
      ))}
      <div className="af-marka-kopya" aria-hidden="true">
        {markalar.map((m, i) => (
          <MarkaKutusu key={`b-${m.ad}`} marka={m} bant={bant} sira={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Sonsuz kayan marka şeridi — iki sıra, ters yönlerde.
 * `:hover` ve `prefers-reduced-motion` durdurur.
 *
 *   <MarkaSeridi bant="koyu" />
 *   <MarkaSeridi markalar={VAKALAR.map(…)} ikiSira={false} />
 */
export default function MarkaSeridi({
  markalar = VARSAYILAN_MARKALAR,
  bant = 'koyu',
  ikiSira = true,
  sinif,
}: Props) {
  if (!markalar.length) return null;
  const ikinci = [...markalar].reverse();
  return (
    <div className={['af-marka-serit', sinif ?? ''].filter(Boolean).join(' ')}>
      <Sira markalar={markalar} bant={bant} />
      {ikiSira ? <Sira markalar={ikinci} bant={bant} ters /> : null}
    </div>
  );
}
