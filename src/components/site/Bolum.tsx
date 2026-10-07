import type { ReactNode } from 'react';

export type Bant = 'kagit' | 'koyu' | 'beyaz';

type Props = {
  children: ReactNode;
  /** Zemin bandı: kâğıt = stüdyo işleri · koyu = yazılım işleri · beyaz = nötr */
  bant?: Bant;
  id?: string;
  /** Mono üst etiket (bölümün ne olduğunu söyler) */
  ustEtiket?: string;
  baslik?: ReactNode;
  /** Başlığın altındaki giriş paragrafı */
  giris?: ReactNode;
  /** Başlık etiketi — sayfada yalnız bir h1 olmalı */
  baslikEtiketi?: 'h1' | 'h2' | 'h3';
  /** Başlık bloğu ortalanır */
  orta?: boolean;
  /** Kapsayıcı genişliği */
  genislik?: 'normal' | 'dar' | 'genis' | 'tasma';
  /** Akış hattının bu bölümde alacağı şekil (Efektler okur) */
  akis?: 'duz' | 'kare' | 'veri' | 'imza';
  /** Dikey boşluğu azalt */
  sikis?: boolean;
  sinif?: string;
  /** Başlık bloğunun sağında duracak ek içerik (ör. "tümünü gör" düğmesi) */
  basYani?: ReactNode;
};

const GENISLIK: Record<string, string> = {
  normal: 'af-kap',
  dar: 'af-kap af-kap--dar',
  genis: 'af-kap af-kap--genis',
  tasma: 'af-kap af-kap--tasma',
};

/**
 * Bölüm iskeleti: bant + kapsayıcı + başlık bloğu.
 *
 *   <Bolum bant="koyu" ustEtiket="Yazılım" baslik="QR dijital menü" giris="…" id="qr" akis="kare">
 *     …içerik…
 *   </Bolum>
 *
 * Bant rengini değiştirmek içindeki bütün kart/çip/düğme renklerini
 * kendiliğinden ayarlar; bileşenlere renk vermeyin.
 */
export default function Bolum({
  children,
  bant = 'beyaz',
  id,
  ustEtiket,
  baslik,
  giris,
  baslikEtiketi = 'h2',
  orta,
  genislik = 'normal',
  akis,
  sikis,
  sinif,
  basYani,
}: Props) {
  const Baslik = baslikEtiketi;
  const basVar = Boolean(ustEtiket || baslik || giris);

  const basBlogu = basVar ? (
    <div className={['af-bolum-bas', orta ? 'af-bolum-bas--orta' : ''].filter(Boolean).join(' ')} data-belir>
      {ustEtiket ? <p className="af-ust-etiket">{ustEtiket}</p> : null}
      {baslik ? <Baslik className={baslikEtiketi === 'h1' ? 'af-h1' : 'af-h2'}>{baslik}</Baslik> : null}
      {giris ? <p className="af-giris">{giris}</p> : null}
    </div>
  ) : null;

  return (
    <section
      id={id}
      className={['af-bant', `af-bant--${bant}`, sikis ? 'af-bant--sikis' : '', sinif ?? '']
        .filter(Boolean)
        .join(' ')}
      data-akis={akis}
    >
      <div className={GENISLIK[genislik] ?? GENISLIK.normal}>
        {/* Tam genişlik (tasma) bölümlerde bile başlık bloğu normal
            kapsayıcıda kalır; yalnız içerik kenara dayanır. */}
        {genislik === 'tasma' && basBlogu && !basYani ? (
          <div className="af-kap">{basBlogu}</div>
        ) : basBlogu && basYani ? (
          <div className="af-bolum-bas-sarmal">
            {basBlogu}
            <div className="af-mobil-gizle">{basYani}</div>
          </div>
        ) : (
          basBlogu
        )}
        {children}
      </div>
    </section>
  );
}
