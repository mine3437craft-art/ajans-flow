import type { YasalBolum } from '@/lib/site-yasal';
import { basligaId } from './kurumsal';
import './kurumsal.css';

type Props = {
  bolumler: readonly YasalBolum[];
  /** İçindekiler listesinin görünür başlığı. */
  icindekilerBaslik?: string;
};

/**
 * Uzun yasal metnin dizgisi: solda yapışkan içindekiler, sağda numaralı
 * maddeler. Metinler `src/lib/site-yasal.ts` içinde; burada tek satır
 * metin yazılmaz.
 *
 * JavaScript GEREKMEZ — çapa bağlantıları, numaralandırma (`counter`),
 * yapışkan sütun ve bulunduğunuz maddenin işaretlenmesi (`:target`)
 * tamamen tarayıcı işi.
 *
 * Madde numarası `aria-hidden`: ekran okuyucu başlığı iki kez (bir kez
 * "yedi", bir kez başlık metni olarak) okumasın. Sıra bilgisi zaten
 * içindekiler listesindeki `<ol>`da duruyor.
 */
export default function YasalGovde({ bolumler, icindekilerBaslik = 'İçindekiler' }: Props) {
  const basligiId = 'af-kr-icindekiler-baslik';

  return (
    <div className="af-kr-yasal">
      <nav className="af-kr-icindekiler" aria-labelledby={basligiId}>
        <p className="af-ust-etiket" id={basligiId}>
          {icindekilerBaslik}
        </p>
        <ol>
          {bolumler.map((b) => (
            <li key={b.baslik}>
              <a href={`#${basligaId(b.baslik)}`}>{b.baslik}</a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="af-kr-yasal-govde">
        {bolumler.map((b, i) => (
          <section className="af-kr-madde" id={basligaId(b.baslik)} key={b.baslik}>
            <div className="af-kr-madde-ust">
              <p className="af-kr-madde-no" aria-hidden="true">
                Madde {String(i + 1).padStart(2, '0')} / {String(bolumler.length).padStart(2, '0')}
              </p>
              <h2 className="af-kr-madde-bas">{b.baslik}</h2>
            </div>
            <div className="af-metin">
              {b.paragraflar.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {b.maddeler?.length ? (
                <ul>
                  {b.maddeler.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
