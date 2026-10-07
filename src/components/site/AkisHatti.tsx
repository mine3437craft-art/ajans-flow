/**
 * AKIŞ HATTI — sitenin imzası.
 *
 * Sayfanın tepesinden altına inen TEK 2px turuncu SVG stroke. Kaydırma
 * ilerlemesine göre `stroke-dasharray` ile çizilir (Efektler.tsx, ScrollTrigger
 * scrub). Bölümden bölüme şekil değiştirir: bir bölüm `data-akis="kare"`
 * derse hat o bölümde QR kodunun kenarına, `"veri"` derse değerleme bandına,
 * `"imza"` derse imza kıvrımına döner.
 *
 * Bu bileşen SUNUCU bileşenidir: yalnızca SVG'yi basar, hiç JS getirmez.
 * JS gelmezse ya da `prefers-reduced-motion` açıksa düz hat tam boy görünür.
 *
 * Kullanım (Bolum bileşeni zaten `akis` propuyla basıyor):
 *   <section data-akis="kare"> … </section>
 *
 * `preserveAspectRatio="none"` + `vector-effect: non-scaling-stroke`:
 * hat ekran yüksekliğine uzar ama kalınlığı her zaman tam 2px kalır.
 */

/** Şekil adı → yol verisi. viewBox 48 × 1000, hat x=24'ten iner. */
const SEKILLER = {
  /** Varsayılan: yumuşak yılan akış */
  duz: 'M24 0 C24 140 8 230 24 340 C40 450 8 560 24 670 C40 780 12 880 24 1000',
  /** QR kodunun kenarı — dik köşeler */
  kare: 'M24 0 V260 H6 V380 H42 V520 H24 V1000',
  /** Değerleme / veri bandı — testere dişi */
  veri: 'M24 0 V240 L8 280 L40 320 L8 360 L40 400 L8 440 L24 480 V1000',
  /** İmza kıvrımı — kapanış bölümleri */
  imza: 'M24 0 V360 C46 400 2 450 24 500 C46 550 2 600 24 650 V1000',
} as const;

export type AkisSekli = keyof typeof SEKILLER;

export default function AkisHatti() {
  return (
    <div className="af-akis" aria-hidden="true" data-akis-hat="">
      <svg viewBox="0 0 48 1000" preserveAspectRatio="none">
        {/* Soluk iz: hattın nereye gittiğini gösterir, hep tam boy */}
        <path className="af-akis-iz" d={SEKILLER.duz} />
        {/* Çizilen hat — aynı anda yalnız biri `.is-aktif` */}
        {(Object.keys(SEKILLER) as AkisSekli[]).map((sekil) => (
          <path key={sekil} className="af-akis-yol" data-akis-sekil={sekil} d={SEKILLER[sekil]} />
        ))}
      </svg>
    </div>
  );
}
