/**
 * Ekran görüntüsü basan tek yer. Üç kuralı burada topluyoruz ki sayfada
 * hiç unutulmasın:
 *
 *  1. KUTU ÖNCEDEN REZERVE: her görsel `width`/`height` ile basılır ve
 *     kapsayıcısı `aspect-ratio` taşır → düzen kaymaz (CLS 0).
 *  2. AVIF ÖNCE, JPEG YEDEK: `<picture>` ile; proje `next/image`
 *     kullanmadığı için dönüşüm elle yapıldı (bkz. medya/urun/kunye.json).
 *  3. "ÖRNEK VERİ" DAMGASI ZORUNLU: bütün ekranlar yerelde yalnız demo
 *     veriyle çekildi. Damga hem gözle görünür hem de `alt` metninde
 *     yazılıdır; izleyici gerçek müşteri verisi sanmasın.
 */

import { CerceveDizustu, CerceveTelefon } from '@/components/site/Cerceve';
import { medyaYolu } from '@/lib/site-icerik';
import type { Ekran } from './paketler';

type GorselProps = {
  ekran: Ekran;
  /** İlk ekranda görünen tek görsel: erken yüklenir. */
  oncelikli?: boolean;
};

/** Yalnız `<picture>` — çerçeveyi çağıran seçer. */
export function EkranGorseli({ ekran, oncelikli }: GorselProps) {
  return (
    <picture>
      <source srcSet={medyaYolu(`urun/${ekran.ad}.avif`)} type="image/avif" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={medyaYolu(`urun/${ekran.ad}.jpg`)}
        alt={ekran.alt}
        width={ekran.genislik}
        height={ekran.yukseklik}
        loading={oncelikli ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={oncelikli ? 'high' : 'auto'}
      />
    </picture>
  );
}

/** Damga — her ekranın yanında. */
export function OrnekDamgasi() {
  return <span className="af-ornek-damga">örnek veri</span>;
}

type CerceveProps = GorselProps & {
  boy?: 'kucuk' | 'buyuk';
  sinif?: string;
};

/** Telefon çerçevesi + altyazı + damga. */
export function TelefonEkrani({ ekran, oncelikli, boy, sinif }: CerceveProps) {
  return (
    <figure className={['af-og-ekran', 'af-og-ekran--tel', sinif ?? ''].filter(Boolean).join(' ')}>
      <CerceveTelefon boy={boy}>
        <EkranGorseli ekran={ekran} oncelikli={oncelikli} />
      </CerceveTelefon>
      <figcaption className="af-og-altyazi">
        <span>{ekran.altyazi}</span>
        <OrnekDamgasi />
      </figcaption>
    </figure>
  );
}

/** Dizüstü çerçevesi + altyazı + damga. */
export function DizustuEkrani({ ekran, oncelikli, sinif }: CerceveProps) {
  return (
    <figure className={['af-og-ekran', sinif ?? ''].filter(Boolean).join(' ')}>
      <CerceveDizustu>
        <EkranGorseli ekran={ekran} oncelikli={oncelikli} />
      </CerceveDizustu>
      <figcaption className="af-og-altyazi">
        <span>{ekran.altyazi}</span>
        <OrnekDamgasi />
      </figcaption>
    </figure>
  );
}

/**
 * Çerçevesiz, kenarlıklı kutu. Aynı bölümde ikinci ve üçüncü masaüstü
 * ekranı için: üç dizüstü kapağı yan yana gelince sayfa oyuncak
 * vitrinine dönüyor, tek cihaz çerçevesi anlamını kaybediyor.
 */
export function KutuEkrani({ ekran, sinif }: CerceveProps) {
  return (
    <figure className={['af-og-ekran', sinif ?? ''].filter(Boolean).join(' ')}>
      <span className="af-og-kutu">
        <EkranGorseli ekran={ekran} />
      </span>
      <figcaption className="af-og-altyazi">
        <span>{ekran.altyazi}</span>
        <OrnekDamgasi />
      </figcaption>
    </figure>
  );
}
