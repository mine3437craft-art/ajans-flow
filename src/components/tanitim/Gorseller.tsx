import type { CSSProperties, JSX } from 'react';
import type { VakaGorseli } from './icerik';
import { IkonKalp, IkonInstagram, IkonOnayli, IkonOynat } from './Ikonlar';

/**
 * Sayfadaki tüm "görseller": fotoğraf yok, hepsi CSS + satır içi SVG.
 * Sunucu bileşenleridir; istemci paketine girmez.
 */

type Stil = CSSProperties & Record<`--${string}`, string | number>;

/* ------------------------------------------------------------------ */
/* Logo: daire içinde AJANS / FLOW                                      */
/* ------------------------------------------------------------------ */

export function Logo({ className }: { className?: string }): JSX.Element {
  return (
    <svg className={`tn-logo ${className ?? ''}`} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="47" className="tn-logo-daire" />
      <text x="50" y="45" textAnchor="middle" className="tn-logo-ust" textLength="58" lengthAdjust="spacingAndGlyphs">
        AJANS
      </text>
      <text x="50" y="72" textAnchor="middle" className="tn-logo-alt" textLength="70" lengthAdjust="spacingAndGlyphs">
        FLOW
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* QR deseni (dekoratif, sabit tohumlu)                                */
/* ------------------------------------------------------------------ */

function qrYolu(boyut = 25, tohum = 20240921): string {
  let s = tohum;
  const rastgele = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  const dolu: boolean[][] = Array.from({ length: boyut }, () => Array<boolean>(boyut).fill(false));
  const ayrik: boolean[][] = Array.from({ length: boyut }, () => Array<boolean>(boyut).fill(false));

  const bulucu = (x0: number, y0: number) => {
    for (let dy = -1; dy <= 7; dy++) {
      for (let dx = -1; dx <= 7; dx++) {
        const x = x0 + dx;
        const y = y0 + dy;
        if (x < 0 || y < 0 || x >= boyut || y >= boyut) continue;
        ayrik[y][x] = true;
        const kenar = dx === 0 || dx === 6 || dy === 0 || dy === 6;
        const ic = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
        dolu[y][x] = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6 && (kenar || ic);
      }
    }
  };
  bulucu(0, 0);
  bulucu(boyut - 7, 0);
  bulucu(0, boyut - 7);

  // Zamanlama çizgileri
  for (let i = 8; i < boyut - 8; i++) {
    dolu[6][i] = dolu[i][6] = i % 2 === 0;
    ayrik[6][i] = ayrik[i][6] = true;
  }
  // Hizalama deseni
  const h = boyut - 9;
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      ayrik[h + dy][h + dx] = true;
      dolu[h + dy][h + dx] = Math.max(Math.abs(dx), Math.abs(dy)) !== 1;
    }
  }
  for (let y = 0; y < boyut; y++) {
    for (let x = 0; x < boyut; x++) {
      if (!ayrik[y][x]) dolu[y][x] = rastgele() < 0.47;
    }
  }
  // Yatay koşuları birleştirerek kısa bir path üret
  let yol = '';
  for (let y = 0; y < boyut; y++) {
    let x = 0;
    while (x < boyut) {
      if (!dolu[y][x]) {
        x++;
        continue;
      }
      let uz = 1;
      while (x + uz < boyut && dolu[y][x + uz]) uz++;
      yol += `M${x} ${y}h${uz}v1h-${uz}z`;
      x += uz;
    }
  }
  return yol;
}

const QR_YOLU = qrYolu();

export function QrKod({ className }: { className?: string }): JSX.Element {
  return (
    <svg className={className} viewBox="-2 -2 29 29" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <rect x="-2" y="-2" width="29" height="29" rx="2" fill="#fff" />
      <path d={QR_YOLU} fill="#14141F" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Hero telefonu: Instagram benzeri canlı profil                        */
/* ------------------------------------------------------------------ */

const ONE_CIKANLAR: { ad: string; kisa: string; renk: string }[] = [
  { ad: 'Kule', kisa: 'K', renk: '#FF6B35' },
  { ad: 'Mas', kisa: 'M', renk: '#14141F' },
  { ad: 'Kök', kisa: 'K', renk: '#3F6B4A' },
  { ad: 'May', kisa: 'M', renk: '#2D3A8C' },
  { ad: 'Dent', kisa: 'D', renk: '#0E8C9A' },
];

export function HeroTelefon(): JSX.Element {
  return (
    <div className="tn-hero-sahne">
      <div
        className="tn-telefon tn-telefon--hero"
        role="img"
        aria-label="Ajans Flow Instagram profilini canlandıran telefon görseli: onaylı hesap, 244+ paylaşım, hizmet ve marka içerikleri."
      >
        <div className="tn-telefon-ekran" aria-hidden="true">
          <span className="tn-telefon-ada" />
          <div className="tn-ig">
            <div className="tn-ig-durum">
              <span>9:41</span>
              <span className="tn-ig-durum-sag">
                <i />
                <i />
                <i />
              </span>
            </div>
            <div className="tn-ig-ust">
              <b>ajansflow</b>
              <IkonOnayli className="tn-ig-onay" />
            </div>
            <div className="tn-ig-profil">
              <div className="tn-ig-avatar">
                <span className="tn-ig-halka" />
                <span className="tn-ig-avatar-ic">
                  <Logo />
                </span>
              </div>
              <ul className="tn-ig-istat">
                <li>
                  <b>244+</b>
                  <span>gönderi</span>
                </li>
                <li>
                  <b>12+</b>
                  <span>marka</span>
                </li>
                <li>
                  <b>12</b>
                  <span>hizmet</span>
                </li>
              </ul>
            </div>
            <div className="tn-ig-bio">
              <b>Ajans Flow | Sosyal Medya Ajansı</b>
              <span>📍İstanbul / 4.Levent</span>
              <span>🎬 İçerik • Reklam • Yönetim</span>
            </div>
            <div className="tn-ig-dugmeler">
              <span className="tn-ig-takip">Takip et</span>
              <span>Mesaj</span>
            </div>
            <ul className="tn-ig-oneler">
              {ONE_CIKANLAR.map((o, i) => (
                <li key={o.ad} style={{ '--i': i } as Stil}>
                  <span className="tn-ig-one-halka">
                    <span style={{ background: o.renk }}>{o.kisa}</span>
                  </span>
                  <small>{o.ad}</small>
                </li>
              ))}
            </ul>
            <div className="tn-ig-sekmeler">
              <span className="is-secili" />
              <span />
              <span />
            </div>
            <div className="tn-ig-izgara">
              <span className="tn-ig-kare tn-kare--slogan" style={{ '--i': 0 } as Stil}>
                <b>Fikirler hareket kazanır.</b>
              </span>
              <span className="tn-ig-kare tn-kare--reels" style={{ '--i': 1 } as Stil}>
                <IkonOynat className="tn-kare-oynat" />
                <IkonKalp className="tn-ig-kalp" />
              </span>
              <span className="tn-ig-kare tn-kare--drone" style={{ '--i': 2 } as Stil}>
                <svg viewBox="0 0 40 20" className="tn-kare-drone">
                  <path d="M16 9h8v3h-8z M16 10 9 6 M24 10l7-4" stroke="currentColor" strokeWidth="1.6" fill="currentColor" />
                  <path d="M4 5h10M26 5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <span className="tn-ig-kare tn-kare--yemek" style={{ '--i': 3 } as Stil}>
                <i />
              </span>
              <span className="tn-ig-kare tn-kare--logo" style={{ '--i': 4 } as Stil}>
                <Logo />
              </span>
              <span className="tn-ig-kare tn-kare--qr" style={{ '--i': 5 } as Stil}>
                <QrKod className="tn-kare-qr" />
              </span>
              <span className="tn-ig-kare tn-kare--liste" style={{ '--i': 6 } as Stil}>
                <b>Hizmetlerimiz</b>
                <i />
                <i />
                <i />
              </span>
              <span className="tn-ig-kare tn-kare--rec" style={{ '--i': 7 } as Stil}>
                <em>REC</em>
              </span>
              <span className="tn-ig-kare tn-kare--dm" style={{ '--i': 8 } as Stil}>
                <b>Ücretsiz analiz için DM</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Telefonun çevresinde süzülen bildirim kartları */}
      <div className="tn-yuzen tn-yuzen--begeni" data-parallax="-0.05" aria-hidden="true">
        <div className="tn-yuzen-ic">
          <span className="tn-yuzen-ikon tn-yuzen-ikon--kalp">
            <IkonKalp />
          </span>
          {/* Gerçek olmayan bir sayı göstermemek için sayaç yok: yalnızca bildirim. */}
          <span className="tn-yuzen-metin">
            <small>Bildirim</small>
            <b>Yeni beğeniler</b>
          </span>
        </div>
      </div>
      <div className="tn-yuzen tn-yuzen--mesaj" data-parallax="0.06" aria-hidden="true">
        <div className="tn-yuzen-ic">
          <span className="tn-yuzen-ikon tn-yuzen-ikon--ig">
            <IkonInstagram />
          </span>
          <span className="tn-yuzen-metin">
            <small>Yeni mesaj</small>
            “Ücretsiz analiz istiyorum 👋”
          </span>
        </div>
      </div>
      <div className="tn-yuzen tn-yuzen--reels" data-parallax="-0.08" aria-hidden="true">
        <div className="tn-yuzen-ic">
          <span className="tn-yuzen-ikon tn-yuzen-ikon--oynat">
            <IkonOynat />
          </span>
          <span>Reels yayında</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Önce / Sonra profil ızgaraları                                      */
/* ------------------------------------------------------------------ */

function ProfilBasligi({ ad }: { ad: string }) {
  return (
    <div className="tn-kp-ust">
      <span className="tn-kp-avatar" />
      <span className="tn-kp-satirlar">
        <b>{ad}</b>
        <i />
      </span>
    </div>
  );
}

export function OnceProfil(): JSX.Element {
  return (
    <div className="tn-kp tn-kp--once">
      <ProfilBasligi ad="isletmem_resmi_2" />
      <div className="tn-kp-izgara">
        <span className="tn-o1">İNDİRİM!!!</span>
        <span className="tn-o2" />
        <span className="tn-o3">Günaydın 🌞🌞</span>
        <span className="tn-o4">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="tn-o5" />
        <span className="tn-o6">#kahve #cafe #lezzet #istanbul #follow #like #keşfet</span>
        <span className="tn-o7" />
        <span className="tn-o8">Hoş geldiniz</span>
        <span className="tn-o9">yeni ürünlerimiz geldi bekleriz...</span>
      </div>
    </div>
  );
}

export function SonraProfil(): JSX.Element {
  return (
    <div className="tn-kp tn-kp--sonra">
      <ProfilBasligi ad="isletmeniz" />
      <div className="tn-kp-izgara">
        <span className="tn-s1">
          <small>Hafta sonu</small>
          <b>Yeni menü</b>
        </span>
        <span className="tn-s2">
          <i />
        </span>
        <span className="tn-s3">
          <IkonOynat />
          <small>Mutfaktan</small>
        </span>
        <span className="tn-s4">
          <b>İyi yemek, güzel anlar.</b>
        </span>
        <span className="tn-s5">
          <i />
        </span>
        <span className="tn-s6">
          <small>Kahvaltı</small>
          <b>08:00 – 12:00</b>
        </span>
        <span className="tn-s7">
          <i />
        </span>
        <span className="tn-s8">
          <small>📍 Konum</small>
          <b>Bizi ziyaret edin</b>
        </span>
        <span className="tn-s9">
          <b>Rezervasyon için DM</b>
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Vaka görselleri                                                     */
/* ------------------------------------------------------------------ */

const VAKA_ETIKETI: Record<VakaGorseli, string> = {
  kule: 'Kule İstanbul Cafe için dört dilli QR menü arayüzünü temsil eden çizim',
  may: 'May Motors web sitesini temsil eden tarayıcı ve otomobil çizimi',
  minik: 'Minik Starlar Ligi için futbol sahası ve skor tabelası çizimi',
  kok: 'Kök Cafe Lounge yemek fotoğrafçılığını temsil eden tabak ve vizör çizimi',
  mas: 'Mas Go Kart tanıtım videolarını temsil eden hız çizgileri ve damalı bayrak',
  lityum: 'Lityum Servis tanıtım içeriklerini temsil eden şarj olan batarya çizimi',
};

export function VakaGorseli({ tur }: { tur: VakaGorseli }): JSX.Element {
  return (
    <div className={`tn-vg tn-vg--${tur}`} role="img" aria-label={VAKA_ETIKETI[tur]}>
      <div className="tn-vg-ic" aria-hidden="true">
        {tur === 'kule' && <KuleGorseli />}
        {tur === 'may' && <MayGorseli />}
        {tur === 'minik' && <MinikGorseli />}
        {tur === 'kok' && <KokGorseli />}
        {tur === 'mas' && <MasGorseli />}
        {tur === 'lityum' && <LityumGorseli />}
      </div>
    </div>
  );
}

function KuleGorseli() {
  return (
    <>
      <svg className="tn-vg-kule-kule" viewBox="0 0 120 220">
        <path d="M60 8 34 70h52z" />
        <path d="M30 70h60v10H30z" />
        <path d="M38 80h44v132H38z" />
        <path d="M46 96h8v16h-8zM66 96h8v16h-8zM46 130h8v16h-8zM66 130h8v16h-8zM52 176h16v36H52z" className="tn-vg-pencere" />
      </svg>
      <div className="tn-vg-mini-tel">
        <div className="tn-vg-diller">
          <span className="is-secili">TR</span>
          <span>EN</span>
          <span>DE</span>
          <span>AR</span>
        </div>
        <span className="tn-vg-ara" />
        <div className="tn-vg-filtre">
          <span>🌱 Vegan</span>
          <span>Glutensiz</span>
        </div>
        <span className="tn-vg-satir" />
        <span className="tn-vg-satir" />
        <span className="tn-vg-satir tn-vg-satir--kisa" />
      </div>
      <span className="tn-vg-qr">
        <QrKod />
      </span>
    </>
  );
}

function MayGorseli() {
  return (
    <div className="tn-vg-tarayici">
      <div className="tn-vg-tarayici-ust">
        <i />
        <i />
        <i />
        <span />
      </div>
      <div className="tn-vg-tarayici-govde">
        <div className="tn-vg-may-metin">
          <b>Aracının değerini öğren</b>
          <span className="tn-vg-input" />
          <span className="tn-vg-input" />
          <span className="tn-vg-buton">Hemen sat →</span>
        </div>
        <svg className="tn-vg-araba" viewBox="0 0 220 90">
          <path
            d="M14 62c0-8 4-13 13-15l30-6 26-19c6-4 12-6 20-6h44c9 0 16 3 22 9l17 16 20 4c7 2 11 6 11 13v6c0 3-2 5-5 5h-12M42 69H26c-7 0-12-3-12-7M72 69h80"
            fill="none"
          />
          <circle cx="57" cy="68" r="13" />
          <circle cx="170" cy="68" r="13" />
          <path d="M92 24h34v18H78zM132 24h24c5 0 9 2 12 5l12 13h-48z" className="tn-vg-cam" />
        </svg>
      </div>
    </div>
  );
}

function MinikGorseli() {
  return (
    <>
      <svg className="tn-vg-saha" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice">
        <rect x="10" y="10" width="280" height="180" rx="4" />
        <path d="M150 10v180" />
        <circle cx="150" cy="100" r="30" />
        <path d="M10 60h40v80H10M290 60h-40v80h40" />
      </svg>
      <div className="tn-vg-skor">
        <span>U10</span>
        <b>–</b>
        <span>U12</span>
      </div>
      <div className="tn-vg-yildizlar">
        <span>★</span>
        <span>★</span>
        <span>★</span>
      </div>
      <span className="tn-vg-top" />
    </>
  );
}

function KokGorseli() {
  return (
    <>
      <div className="tn-vg-tabak">
        <i className="tn-vg-yemek tn-vg-yemek--1" />
        <i className="tn-vg-yemek tn-vg-yemek--2" />
        <i className="tn-vg-yemek tn-vg-yemek--3" />
      </div>
      <span className="tn-vg-catal" />
      <span className="tn-vg-bicak" />
      <span className="tn-vg-odak tn-vg-odak--1" />
      <span className="tn-vg-odak tn-vg-odak--2" />
      <span className="tn-vg-odak tn-vg-odak--3" />
      <span className="tn-vg-odak tn-vg-odak--4" />
    </>
  );
}

function MasGorseli() {
  return (
    <>
      <span className="tn-vg-dama" />
      <div className="tn-vg-hiz">
        {Array.from({ length: 7 }, (_, i) => (
          <i key={i} style={{ '--i': i } as Stil} />
        ))}
      </div>
      <b className="tn-vg-mas-metin">
        Hız
        <br />
        Eğlence
        <br />
        Adrenalin
      </b>
    </>
  );
}

function LityumGorseli() {
  return (
    <>
      <div className="tn-vg-batarya">
        <i style={{ '--i': 0 } as Stil} />
        <i style={{ '--i': 1 } as Stil} />
        <i style={{ '--i': 2 } as Stil} />
        <i style={{ '--i': 3 } as Stil} />
      </div>
      <svg className="tn-vg-simsek" viewBox="0 0 24 24">
        <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
      </svg>
      <span className="tn-vg-lityum-metin">Daha güçlü yarınlar için</span>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Video / drone vizörü                                                */
/* ------------------------------------------------------------------ */

export function Vizor({ altyazi }: { altyazi: string }): JSX.Element {
  return (
    <div
      className="tn-vizor"
      role="img"
      aria-label="Kamera vizörü içinden İstanbul silueti: kayıt ışığı yanıp sönüyor, zaman kodu ilerliyor."
    >
      <div className="tn-vizor-sahne" aria-hidden="true">
        <span className="tn-vizor-gunes" />
        <svg className="tn-vizor-katman tn-vizor-katman--uzak" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMax slice">
          <path d="M0 400C150 364 260 376 400 384S700 362 850 374s250-18 350-8V500H0z" />
        </svg>
        <svg className="tn-vizor-katman tn-vizor-katman--orta" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMax slice">
          {/* Cami */}
          <path d="M232 362a68 68 0 0 1 136 0zM226 362h148v22H226zM190 384a42 42 0 0 1 84 0zM326 384a42 42 0 0 1 84 0zM170 384h260v36H170zM298 294v-24h4v24z" />
          <circle cx="300" cy="266" r="4" />
          <path d="M144 420V252h12v168zM142 254l8-40 8 40zM139 300h22v6h-22zM444 420V252h12v168zM442 254l8-40 8 40zM439 300h22v6h-22z" />
          {/* Galata */}
          <path d="M622 420V300h36v120zM618 302h44v-10h-44zM616 294l24-58 24 58z" />
          {/* 4.Levent kuleleri */}
          <path d="M820 420V290h42v130zM876 420V236h34v184zM930 420l6-230 16-30 16 30 6 230zM990 420V262h44v158zM1046 420V214l20-18 20 18v206zM1100 420V300h50v120z" />
          <path d="M0 420h1200v80H0z" />
          <g className="tn-vizor-isiklar">
            <rect x="884" y="260" width="4" height="6" />
            <rect x="896" y="300" width="4" height="6" />
            <rect x="946" y="240" width="4" height="6" />
            <rect x="1000" y="290" width="4" height="6" />
            <rect x="1060" y="250" width="4" height="6" />
            <rect x="1016" y="330" width="4" height="6" />
            <rect x="836" y="320" width="4" height="6" />
          </g>
        </svg>
        <svg className="tn-vizor-kuslar" viewBox="0 0 120 40">
          <path d="M10 20q5-6 10 0q5-6 10 0M50 10q4-5 8 0q4-5 8 0M84 26q3-4 6 0q3-4 6 0" />
        </svg>
        <span className="tn-vizor-su" />
      </div>

      <div className="tn-vizor-arayuz" aria-hidden="true">
        <span className="tn-vizor-izgara" />
        <span className="tn-vizor-kose tn-vizor-kose--1" />
        <span className="tn-vizor-kose tn-vizor-kose--2" />
        <span className="tn-vizor-kose tn-vizor-kose--3" />
        <span className="tn-vizor-kose tn-vizor-kose--4" />
        <span className="tn-vizor-odak" />
        <div className="tn-vizor-ust">
          <span className="tn-vizor-rec">
            <i />
            REC
          </span>
          <span className="tn-vizor-tc" data-zaman-kodu>
            00:00:00:00
          </span>
          <span className="tn-vizor-pil">
            <i />
          </span>
        </div>
        <div className="tn-vizor-alt">
          <span>ISO 100 · f/2.8</span>
          <span className="tn-vizor-ufuk">
            <i />
          </span>
          <span>DRONE · 1/50</span>
        </div>
        <p className="tn-vizor-altyazi">{altyazi}</p>
      </div>
    </div>
  );
}

/** Sayfa genelinde kullanılan, Instagram kullanıcı adının onaylı gösterimi. */
export function InstagramKimlik({ kullanici }: { kullanici: string }): JSX.Element {
  return (
    <span className="tn-ig-kimlik">
      @{kullanici}
      <IkonOnayli className="tn-ig-kimlik-rozet" />
      <span className="tn-sr">(onaylı hesap)</span>
    </span>
  );
}


/* ------------------------------------------------------------------ */
/* QR vitrini: kameranın gördüğü masa kartı                            */
/* ------------------------------------------------------------------ */

export function QrKamera(): JSX.Element {
  return (
    <div className="tn-qr-sahne">
      <div className="tn-qr-masa">
        <small>Örnek Kafe</small>
        <QrKod className="tn-qr-kod" />
        <span>Menü için okutun</span>
      </div>
      <span className="tn-qr-cerceve">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="tn-qr-cizgi" />
    </div>
  );
}
