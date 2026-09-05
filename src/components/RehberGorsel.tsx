/**
 * Rehber kayitlarindaki gorsel anlatimlar. `note_guides.visual` sutunundaki
 * anahtar buradaki bir bilesene denk gelir; eslesmezse hicbir sey cizilmez.
 * Hepsi saf CSS -- disaridan gorsel yuklenmiyor, tema renklerini kullaniyor.
 */

function Cozunurluk() {
  const satirlar = [
    { ppi: 72, etiket: 'Ekran / sosyal medya', oran: 24, renk: 'var(--info)' },
    { ppi: 150, etiket: 'Ara boy, taslak baskı', oran: 50, renk: 'var(--warning)' },
    { ppi: 300, etiket: 'Gerçek baskı — altına düşme', oran: 100, renk: 'var(--success)' },
  ];
  return (
    <div className="gorsel">
      {satirlar.map((s) => (
        <div className="olcek-satir" key={s.ppi}>
          <span className="olcek-ad">{s.ppi} ppi</span>
          <span className="olcek-cubuk">
            <span style={{ width: `${s.oran}%`, background: s.renk }} />
          </span>
          <span className="olcek-not">{s.etiket}</span>
        </div>
      ))}
    </div>
  );
}

function RenkModu() {
  return (
    <div className="gorsel renk-ikili">
      <div className="renk-kutu" style={{ background: '#12121A' }}>
        <div className="renk-baslik" style={{ color: '#fff' }}>RGB — ışık</div>
        <div className="renk-noktalar">
          <span style={{ background: '#FF0000' }} />
          <span style={{ background: '#00FF00' }} />
          <span style={{ background: '#0000FF' }} />
        </div>
        <div className="renk-alt" style={{ color: '#9a9ab0' }}>
          Üçü birleşince <strong style={{ color: '#fff' }}>beyaz</strong> olur. Ekran, telefon, Instagram.
        </div>
      </div>
      <div className="renk-kutu" style={{ background: '#FFFFFF', border: '1px solid var(--border)' }}>
        <div className="renk-baslik">CMYK — mürekkep</div>
        <div className="renk-noktalar">
          <span style={{ background: '#00AEEF' }} />
          <span style={{ background: '#EC008C' }} />
          <span style={{ background: '#FFF200' }} />
          <span style={{ background: '#1A1A2E' }} />
        </div>
        <div className="renk-alt">
          Üstü üste binince <strong>siyaha</strong> gider. Afiş, broşür, kartvizit.
        </div>
      </div>
    </div>
  );
}

function MaskeTonlari() {
  return (
    <div className="gorsel">
      <div className="maske-serit" />
      <div className="maske-etiketler">
        <span>Siyah<br /><em>tamamen gizler</em></span>
        <span>Gri<br /><em>yarı saydam</em></span>
        <span>Beyaz<br /><em>tamamen gösterir</em></span>
      </div>
    </div>
  );
}

function KatmanYigini() {
  const katmanlar = [
    { ad: 'Metin katmanı', tur: 'içerik', renk: 'var(--primary-subtle)', kenar: 'var(--primary)' },
    { ad: 'Brightness / Contrast', tur: 'ayarlama', renk: 'var(--info-bg)', kenar: 'var(--info)' },
    { ad: 'Fotoğraf', tur: 'içerik', renk: 'var(--success-bg)', kenar: 'var(--success)' },
    { ad: 'Arka plan (Background)', tur: 'içerik', renk: 'var(--bg-input)', kenar: 'var(--text-muted)' },
  ];
  return (
    <div className="gorsel">
      <div className="yigin">
        {katmanlar.map((k, i) => (
          <div className="yigin-kat" key={k.ad}
               style={{ background: k.renk, borderColor: k.kenar, marginLeft: i * 14 }}>
            <span>{k.ad}</span>
            <span className="yigin-tur">{k.tur}</span>
          </div>
        ))}
      </div>
      <p className="gorsel-not">Üstteki katman alttakini kapatır. Sıra değişince sonuç değişir.</p>
    </div>
  );
}

function DosyaTurleri() {
  const satirlar = [
    ['Katmanlar korunur', true, false, false],
    ['Şeffaf zemin', true, false, true],
    ['Her kayıtta kalite kaybı', false, true, false],
    ['Dosya boyutu küçük', false, true, false],
  ];
  return (
    <div className="gorsel tablo-mini">
      <table>
        <thead>
          <tr><th /><th>PSD</th><th>JPEG</th><th>PNG</th></tr>
        </thead>
        <tbody>
          {satirlar.map((s) => (
            <tr key={String(s[0])}>
              <td>{s[0]}</td>
              {s.slice(1).map((v, i) => (
                <td key={i} className="isaret">
                  {v ? <span className="evet">✓</span> : <span className="hayir">✕</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KarisimModlari() {
  return (
    <div className="gorsel mod-ikili">
      <div className="mod-grup">
        <div className="mod-grup-baslik" style={{ color: 'var(--info)' }}>Karartanlar</div>
        <div className="mod-etiketler">
          {['Darken', 'Multiply', 'Color Burn', 'Linear Burn'].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
        <p className="gorsel-not">Bu modlarda <strong>beyaz kaybolur</strong>. Fotoğraf fazla açıksa buradan başla.</p>
      </div>
      <div className="mod-grup">
        <div className="mod-grup-baslik" style={{ color: 'var(--warning)' }}>Aydınlatanlar</div>
        <div className="mod-etiketler">
          {['Lighten', 'Screen', 'Color Dodge', 'Linear Dodge'].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
        <p className="gorsel-not">Bu modlarda <strong>siyah kaybolur</strong>. Fotoğraf fazla koyuysa buradan başla.</p>
      </div>
    </div>
  );
}

function Zincir() {
  return (
    <div className="gorsel zincir-ikili">
      <div className="zincir-kutu">
        <div className="zincir-satir">
          <span className="zincir-kare">🖼️</span>
          <span className="zincir-baglanti">🔗</span>
          <span className="zincir-kare">◧</span>
        </div>
        <div className="zincir-baslik">Zincir açık (varsayılan)</div>
        <p className="gorsel-not">Fotoğrafı taşırsan maske de birlikte gelir.</p>
      </div>
      <div className="zincir-kutu">
        <div className="zincir-satir">
          <span className="zincir-kare">🖼️</span>
          <span className="zincir-baglanti kopuk">⛓️‍💥</span>
          <span className="zincir-kare">◧</span>
        </div>
        <div className="zincir-baslik">Zincir kaldırılmış</div>
        <p className="gorsel-not">Maske yerinde durur, içindeki fotoğrafı ayrı kaydırırsın.</p>
      </div>
    </div>
  );
}

const GORSELLER: Record<string, () => React.ReactElement> = {
  cozunurluk: Cozunurluk,
  'renk-modu': RenkModu,
  'maske-tonlari': MaskeTonlari,
  'katman-yigini': KatmanYigini,
  'dosya-turleri': DosyaTurleri,
  'karisim-modlari': KarisimModlari,
  zincir: Zincir,
};

/** Rehber formundaki seçim kutusu için: anahtar + okunur ad. */
export const GORSEL_SECENEKLERI: Array<{ k: string; l: string }> = [
  { k: '', l: '— Görsel yok —' },
  { k: 'cozunurluk', l: 'Çözünürlük ölçeği (72 / 150 / 300)' },
  { k: 'renk-modu', l: 'RGB — CMYK karşılaştırması' },
  { k: 'maske-tonlari', l: 'Maske tonları (siyah–gri–beyaz)' },
  { k: 'katman-yigini', l: 'Katman yığını' },
  { k: 'dosya-turleri', l: 'PSD / JPEG / PNG tablosu' },
  { k: 'karisim-modlari', l: 'Karışım modları grupları' },
  { k: 'zincir', l: 'Maske–katman zinciri' },
];

export default function RehberGorsel({ anahtar }: { anahtar: string | null }) {
  if (!anahtar) return null;
  const Bilesen = GORSELLER[anahtar];
  return Bilesen ? <Bilesen /> : null;
}
