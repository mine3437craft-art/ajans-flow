import {
  PANEL_ARACLAR,
  PANEL_DURUM_ADI,
  PANEL_KASALAR,
  PANEL_OZET,
  PANEL_SEKMELER,
  PANEL_UYARILAR,
} from '../icerik';

/**
 * Galeri muhasebesi panel maketi.
 *
 * Bütün araç kodları, ortak adları ve tutarlar bu maket için üretildi —
 * gerçek müşteri verisi DEĞİL. Her sayı grubu "örnek" damgalı.
 * Saf HTML/CSS, hiç JS yok; sekmeler ekranın düzenini gösteren maket.
 */
export default function MuhasebePaneli() {
  return (
    <div className="af-oto-panel" data-belir="olcek">
      <div className="af-oto-panel-bas">
        <p className="af-mono-etiket af-mono-etiket--vurgu">Galeri muhasebesi · panel maketi</p>
        <span className="af-ornek-damga">bütün rakamlar örnek</span>
      </div>

      {/* Sekme şeridi — maket olduğu için bağlantı değil, düz metin */}
      <div className="af-oto-sekmeler" aria-hidden="true">
        {PANEL_SEKMELER.map((s, i) => (
          <span key={s} className={`af-oto-sekme${i === 0 ? ' af-oto-sekme--aktif' : ''}`}>
            {s}
          </span>
        ))}
      </div>

      <div className="af-oto-panel-ic">
        {/* ---- Özet şeridi ---- */}
        <div className="af-veri-serit">
          {PANEL_OZET.map((o) => (
            <div className="af-veri-oge" key={o.etiket}>
              <span className="af-veri-etiket">{o.etiket}</span>
              <span className="af-veri-deger">{o.deger}</span>
              <span className="af-veri-not">{o.not}</span>
            </div>
          ))}
        </div>

        {/* ---- Araç bazlı kâr tablosu ---- */}
        <div>
          <div className="af-oto-band-bas">
            <p className="af-mono-etiket">Araç bazlı kâr</p>
            <span className="af-ornek-damga">örnek</span>
          </div>
          <div className="af-oto-tablo-kaydir af-ust-16">
            <table className="af-veri-tablo">
              <caption className="af-gizli-metin">
                Araç bazlı alış, masraf, satış ve kâr tablosu. Araç kodları ve tutarlar bu maket
                için üretilmiş örneklerdir.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Araç</th>
                  <th scope="col">Alış</th>
                  <th scope="col">Masraf</th>
                  <th scope="col">Satış</th>
                  <th scope="col">Kâr</th>
                  <th scope="col">Durum</th>
                </tr>
              </thead>
              <tbody>
                {PANEL_ARACLAR.map((a) => (
                  <tr key={a.kod}>
                    <th scope="row">{a.kod}</th>
                    <td className="af-oto-sayi">{a.alis}</td>
                    <td className="af-oto-sayi">{a.masraf}</td>
                    <td className="af-oto-sayi">{a.satis}</td>
                    <td className="af-oto-sayi">{a.kar}</td>
                    <td>{PANEL_DURUM_ADI[a.durum]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ---- Ortak kasaları ---- */}
        <div>
          <div className="af-oto-band-bas">
            <p className="af-mono-etiket">Ortak kasası ve pay oranı</p>
            <span className="af-ornek-damga">örnek</span>
          </div>
          <div className="af-oto-paylar af-ust-16">
            {PANEL_KASALAR.map((k) => (
              <div className="af-oto-pay" key={k.ad}>
                <div className="af-oto-pay-ust">
                  <span>
                    <strong>{k.ad}</strong> <span className="af-silik-metin">· {k.not}</span>
                  </span>
                  <span className="af-oto-sayi">%{k.pay}</span>
                </div>
                <div className="af-oto-pay-iz">
                  <div
                    className="af-oto-pay-cubuk"
                    style={{ ['--pay' as string]: String(k.pay) } as React.CSSProperties}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="af-dugme-not af-ust-16">
            Pay oranı araç bazında değişebiliyor: gerçek hayatta her araca aynı ortaklar aynı
            oranla girmiyor.
          </p>
        </div>

        {/* ---- Salt okunur kasa taraması ---- */}
        <div>
          <div className="af-oto-band-bas">
            <p className="af-mono-etiket">Kasa taraması · salt okunur</p>
            <span className="af-ornek-damga">örnek</span>
          </div>
          <ul className="af-oto-uyarilar af-ust-16">
            {PANEL_UYARILAR.map((u) => (
              <li className="af-oto-uyari" key={u}>
                <span>{u}</span>
              </li>
            ))}
          </ul>
          <p className="af-dugme-not af-ust-16">
            Tarama hiçbir kaydı değiştirmiyor, yalnızca tutarsızlığı gösteriyor. Yanlış alarm
            üretmemesi için ortaklık devri olan araçlar ve borçlu ortaklar gibi istisnalar tanımlı.
          </p>
        </div>
      </div>
    </div>
  );
}
