'use client';

/**
 * Adresteki #r-<id> hangi anlatımı gösteriyorsa onu açar ve oraya kaydırır.
 * Notlar sayfasındaki "Düzenlenmiş hâli" ve İçindekiler bağlantıları bunu
 * kullanır — kapalı bir <details> :target ile kendiliğinden açılmaz.
 *
 * React etkisi degil, HTML'e gomulu duz betik: hidrasyonu beklemez, sayfa
 * yuklenir yuklenmez calisir. Sayfanin SONUNA konur ki calistiginda
 * <details> ogeleri DOM'da olsun.
 */
const HASH_BETIGI = `(function(){
  function ac(){
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    var el = document.getElementById(id);
    if (!el || el.tagName !== 'DETAILS') return;
    el.open = true;
    requestAnimationFrame(function(){ el.scrollIntoView({ block: 'start' }); });
  }
  ac();
  addEventListener('hashchange', ac);
})();`;

export function HashIleAc() {
  return <script dangerouslySetInnerHTML={{ __html: HASH_BETIGI }} />;
}

/** Sayfadaki bütün anlatımları açan / kapatan iki küçük düğme. */
export function HepsiniAcKapa() {
  const ayarla = (acik: boolean) => {
    document.querySelectorAll<HTMLDetailsElement>('details.rehber-kart').forEach((d) => { d.open = acik; });
  };
  return (
    <span style={{ display: 'inline-flex', gap: 6 }}>
      <button type="button" className="btn btn-sm btn-secondary" onClick={() => ayarla(true)}>Hepsini aç</button>
      <button type="button" className="btn btn-sm btn-secondary" onClick={() => ayarla(false)}>Hepsini kapat</button>
    </span>
  );
}
