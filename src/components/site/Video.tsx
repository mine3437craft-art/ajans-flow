import { siteYolu } from '@/lib/site';
import { IkonOynat } from './Ikonlar';
/**
 * Medya künyesi — `public/site/medya/kunye.json` (medya ajanının dosyası).
 * Burada YALNIZCA "bu dosya var mı?" sorusu için okunur. Sunucu bileşeni
 * olduğu için istemci paketine girmez.
 */
import kunyeHam from '../../../public/site/medya/kunye.json';

type KunyeKaydi = {
  dosya: string;
  tur?: string;
  marka?: string;
  baslik?: string;
  aciklama?: string;
  genislik?: number;
  yukseklik?: number;
};

const KUNYE = kunyeHam as KunyeKaydi[];
const KUNYE_HARITA = new Map(KUNYE.map((k) => [k.dosya, k]));

/** 'x.mp4' → 'video/x.mp4' · 'video/x.mp4' → olduğu gibi */
function tamAd(klasor: 'video' | 'poster' | 'foto', ad: string): string {
  return ad.includes('/') ? ad : `${klasor}/${ad}`;
}

export type Oran = 'yatay' | 'dikey' | 'kare' | 'sinema';

const ORAN_CSS: Record<Oran, string> = {
  yatay: '16 / 9',
  dikey: '9 / 16',
  kare: '1 / 1',
  sinema: '21 / 9',
};

type Props = {
  /** `public/site/medya/video/` altındaki dosya adı ('mas-gokart-...mp4') */
  ad: string;
  /** `public/site/medya/poster/` altındaki poster ('mas-gokart-...jpg'). Yoksa
   *  video adından türetilir. */
  poster?: string;
  /** Kutu oranı — önceden rezerve edilir, CLS 0. Serbest değer de olur: '4 / 3' */
  oran?: Oran | string;
  /** Erişilebilir ad ve künye satırı. */
  baslik: string;
  /** Künye şeridini göster (marka + başlık). */
  kunyeGoster?: boolean;
  /** Oynatma sırasında öncelik: aynı anda tek video oynar, küçük sayı önce. */
  sira?: number;
  sinif?: string;
};

/**
 * Tek video bileşeni. Kurallar (SITE-TASARIM.md §5) burada toplanmıştır —
 * sayfalar kendi <video> etiketini YAZMAZ.
 *
 *  - `muted playsInline loop` + `poster` + `preload="none"`.
 *  - `src` sunucuda BASILMAZ; Efektler, öğe %50 görününce atar.
 *  - Ekrandan çıkınca duraklar; sayfada aynı anda tek video oynar.
 *  - `saveData` / 2g-3g → `src` hiç atanmaz, poster kalır (turuncu oynat
 *    düğmesi kullanıcı isterse yüklemesi için görünür).
 *  - Otomatik oynatma başarısız olursa poster üstünde oynat düğmesi çıkar.
 *  - `aspect-ratio` ile kutu önceden rezerve edilir → düzen kaymaz.
 *  - Dosya `kunye.json`'da yoksa <video> hiç basılmaz: poster kompozisyonu
 *    kalır; poster da yoksa marka dokulu boş kutu.
 *
 *   <Video ad="hero-mas-gokart-gece-grid.mp4" baslik="MAS Go Kart — gece gridi" />
 */
export default function Video({
  ad,
  poster,
  oran = 'yatay',
  baslik,
  kunyeGoster = false,
  sira,
  sinif,
}: Props) {
  const videoAd = tamAd('video', ad);
  const kayit = KUNYE_HARITA.get(videoAd);
  const videoVar = Boolean(kayit);

  // Poster: verildiyse o, verilmediyse video adından türetilir.
  const posterAd = poster
    ? tamAd('poster', poster)
    : videoAd.replace(/^video\//, 'poster/').replace(/\.(mp4|webm|mov)$/i, '.jpg');
  const posterVar = KUNYE_HARITA.has(posterAd);
  const posterKayit = KUNYE_HARITA.get(posterAd);

  const oranCss = (ORAN_CSS as Record<string, string>)[oran] ?? oran;
  const kutuStil = { ['--af-oran' as string]: oranCss } as React.CSSProperties;
  const kunyeSatiri = kunyeGoster ? (
    <figcaption className="af-video-kunye">
      <span>{kayit?.marka ?? posterKayit?.marka ?? ''}</span>
      <span>{kayit?.baslik ?? baslik}</span>
    </figcaption>
  ) : null;

  /* ---- 1. Video dosyası yok → poster kompozisyonu ---- */
  if (!videoVar) {
    if (!posterVar) {
      return (
        <figure className={['af-video', 'af-video--bos', sinif ?? ''].filter(Boolean).join(' ')}>
          <div className="af-video-kutu" style={kutuStil}>
            <p className="af-video-bos-yazi">{baslik}</p>
          </div>
          {kunyeSatiri}
        </figure>
      );
    }
    return (
      <figure className={['af-video', sinif ?? ''].filter(Boolean).join(' ')}>
        <div className="af-video-kutu" style={kutuStil}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteYolu(`/medya/${posterAd}`)} alt={baslik} loading="lazy" decoding="async" />
        </div>
        {kunyeSatiri}
      </figure>
    );
  }

  /* ---- 2. Video var → src'siz <video>, Efektler devralır ---- */
  return (
    <figure
      className={['af-video', sinif ?? ''].filter(Boolean).join(' ')}
      data-video=""
      data-video-kaynak={siteYolu(`/medya/${videoAd}`)}
      data-video-sira={sira}
    >
      <div className="af-video-kutu" style={kutuStil}>
        <video
          muted
          playsInline
          loop
          preload="none"
          poster={posterVar ? siteYolu(`/medya/${posterAd}`) : undefined}
          aria-label={baslik}
          tabIndex={-1}
          disablePictureInPicture
        />
        <button type="button" className="af-video-oynat" data-video-oynat="">
          <IkonOynat />
          Oynat
        </button>
      </div>
      {kunyeSatiri}
    </figure>
  );
}
