import { ZINCIR } from '../icerik';

/**
 * Zincir şeması — TEK SVG, sunucuda basılır (istemci paketine girmez).
 *
 * Hat düz dikey olduğu için:
 *   - çizilen kısım  → pathLength="1" + stroke-dashoffset: 1 - p
 *   - ilerleyen nokta → translateY(p * 464px)
 * İkisi de tek CSS değişkeninden (`--af-zincir-p`) beslenir. JS yoksa
 * değişken 1'de kalır ve şema tam çizili görünür (sayfa.css).
 */

/** Durak merkezleri (viewBox birimi). */
const Y = [64, 196, 328, 460];
/** Hattın başı ve sonu; nokta aradaki 464 birimi kat eder. */
const HAT_BAS = 30;

type Props = { id: string; erisimMetni: string };

export default function ZincirSema({ id, erisimMetni }: Props) {
  return (
    <figure className="af-oto-sema" id={id} data-adim="0">
      <svg viewBox="0 0 330 524" role="img" aria-label={erisimMetni}>
        {/* Hat: soluk iz + çizilen turuncu kısım */}
        <path className="af-oto-sema-iz" d="M30 30 V494" />
        <path className="af-oto-sema-dolu" d="M30 30 V494" pathLength={1} />

        {/* Duraklar */}
        {ZINCIR.map((d, i) => {
          const cy = Y[i];
          return (
            <g className="af-oto-durak" data-sira={i} key={d.no}>
              <rect
                className="af-oto-durak-kutu"
                x={58}
                y={cy - 50}
                width={268}
                height={100}
                rx={2}
              />
              <text className="af-oto-durak-sira" x={74} y={cy - 28}>
                HALKA {d.no}
              </text>
              <text className="af-oto-durak-ad" x={74} y={cy - 6}>
                {d.ad}
              </text>
              <text className="af-oto-durak-not" x={74} y={cy + 18}>
                {d.satirlar[0]}
              </text>
              <text className="af-oto-durak-not" x={74} y={cy + 36}>
                {d.satirlar[1]}
              </text>
              <circle className="af-oto-durak-halka" cx={30} cy={cy} r={13} />
              <text className="af-oto-durak-no" x={30} y={cy + 4} textAnchor="middle">
                {d.no}
              </text>
            </g>
          );
        })}

        {/* Hattın üzerinde ilerleyen nokta */}
        <circle className="af-oto-sema-nokta-halo" cx={30} cy={HAT_BAS} r={11} />
        <circle className="af-oto-sema-nokta" cx={30} cy={HAT_BAS} r={5} />
      </svg>
    </figure>
  );
}
