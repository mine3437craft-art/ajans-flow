import './plaka.css';

/**
 * OKUMA İLERLEME ÇİZGİSİ — 0 JS, 0 bayt istek.
 *
 * Üst barın hemen altında duran 2px'lik turuncu bir hat; genişliği
 * sayfanın kaydırma ilerlemesine bağlı (`animation-timeline: scroll()`).
 * Uzun metin sayfalarında "ne kadar kaldı" sorusunu tek bakışta
 * yanıtlar.
 *
 * Kapılar (bkz. plaka.css §8):
 *  - `prefers-reduced-motion: reduce` → hiç basılmaz. Gerekçe teknik:
 *    site.css'teki genel kural bütün animasyonların süresini 0,001 ms'ye
 *    çekiyor ve ilerleme tabanlı zaman çizelgesinde bu, çizgiyi anında
 *    doldurup YANLIŞ BİLGİ verirdi.
 *  - `animation-timeline` desteklenmeyen tarayıcı → hiç görünmez.
 *    Eksik bilgi değil, yalnız eksik süs: içindekiler listesi ve madde
 *    numaraları konumu zaten söylüyor.
 *
 * Dekoratif olduğu için `aria-hidden`.
 */
export default function Ilerleme() {
  return <div className="af-kr-ilerleme" aria-hidden="true" />;
}
