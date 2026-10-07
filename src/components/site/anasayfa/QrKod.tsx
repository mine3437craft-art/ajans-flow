import { qrUret, qrYolu } from './qr';

type Props = {
  /** QR'ın içine yazılan metin (burada demo menünün tam adresi). */
  icerik: string;
  /** Ekran okuyucuya okunan ad. */
  baslik: string;
  sinif?: string;
};

/**
 * Gerçek, okunabilir QR kod — sunucuda üretilir, istemciye JS gitmez.
 *
 * Koyu modüller `--af-koyu`, zemin `--af-beyaz`: QR okuyucular koyu
 * modül / açık zemin bekler, bu yüzden koyu bantta da zemin beyaz kalır.
 * Sessiz kenar standart 4 modül. Metin sığmazsa (106 bayt) hiç basılmaz.
 */
export default function QrKod({ icerik, baslik, sinif }: Props) {
  const sonuc = qrUret(icerik);
  if (!sonuc) return null;

  const sessizKenar = 4;
  const toplam = sonuc.boy + sessizKenar * 2;

  return (
    <svg
      className={['af-as-qr', sinif ?? ''].filter(Boolean).join(' ')}
      viewBox={`0 0 ${toplam} ${toplam}`}
      role="img"
      aria-label={baslik}
      shapeRendering="crispEdges"
    >
      <rect width={toplam} height={toplam} fill="var(--af-beyaz)" />
      <path d={qrYolu(sonuc, sessizKenar)} fill="var(--af-koyu)" />
    </svg>
  );
}
