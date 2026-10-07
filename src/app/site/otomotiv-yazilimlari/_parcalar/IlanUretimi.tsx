import { ORNEK_ILAN_SATIRLARI, ORNEK_KAYIT } from '../icerik';

/**
 * Yapılandırılmış kayıttan ilan metninin satır satır kurulması.
 *
 * Animasyon SAF CSS: her satır `--n` (karakter sayısı) ve `--g` (sıra) alır,
 * genişliği `steps(--n)` ile açılır (sayfa.css). JS yoksa ya da hareket
 * azaltılmışsa satırlar tam genişlikte, okunur hâlde durur — metin HTML'de
 * zaten basılıdır.
 */
export default function IlanUretimi() {
  return (
    <div className="af-oto-uretim">
      {/* ---- Sol: yapılandırılmış kayıt ---- */}
      <div className="af-kart">
        <div className="af-kart-ust">
          <p className="af-mono-etiket">Araç kaydı</p>
          <span className="af-ornek-damga">örnek</span>
        </div>
        <table className="af-veri-tablo">
          <caption className="af-gizli-metin">
            İlan metnini besleyen örnek araç kaydı. Bütün değerler uydurmadır.
          </caption>
          <tbody>
            {ORNEK_KAYIT.map((s) => (
              <tr key={s.alan}>
                <th scope="row">{s.alan}</th>
                <td>{s.deger}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="af-dugme-not">
          Marka, model ve plaka bilgisi bu örnekte bilerek yok: gerçek bir araca ait olmadığını
          göstermek için yalnızca kalıbı besleyen alanlar duruyor.
        </p>
      </div>

      {/* ---- Sağ: kurulan metin ---- */}
      <div className="af-kart af-kat-2" data-belir="solma">
        <div className="af-kart-ust">
          <p className="af-mono-etiket af-mono-etiket--vurgu">Kurulan ilan metni</p>
          <span className="af-ornek-damga">örnek</span>
        </div>
        {/* Satır numarası AYRI kolonda: daktilo genişliği
            `var(--n) * 1ch` hesabının içine girmemeli, yoksa her satır
            iki karakter fazla yazılır. `--n` ve `--g` satıra miras
            yoluyla iner (CSS değişkeni), animasyon seçicisi aynı kalır. */}
        <div className="af-oto-yazim">
          {ORNEK_ILAN_SATIRLARI.map((satir, i) => (
            <p
              key={satir}
              className="af-oto-yazim-row"
              style={
                {
                  ['--n' as string]: String(satir.length),
                  ['--g' as string]: String(i),
                } as React.CSSProperties
              }
            >
              <span className="af-oto-yazim-no" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="af-oto-yazim-satir">{satir}</span>
            </p>
          ))}
        </div>
        <p className="af-dugme-not">
          Cümle kalıpları sabit, veriyi galeri giriyor. Fiyat satırı metne yazılım tarafından
          eklenmiyor; ilan fiyatını galeri kendisi belirliyor.
        </p>
      </div>
    </div>
  );
}
