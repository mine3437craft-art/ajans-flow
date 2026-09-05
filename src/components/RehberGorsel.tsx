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

function FircaHareket() {
  return (
    <div className="gorsel">
      <div className="pusula">
        <div className="pusula-ok ust">↑ <span>yumuşar</span></div>
        <div className="pusula-orta">
          <div className="pusula-ok sol">← <span>küçülür</span></div>
          <div className="pusula-merkez">
            <kbd>Alt</kbd> + <strong>sağ tık</strong><br />
            <small>basılı tutup sürükle</small>
          </div>
          <div className="pusula-ok sag"><span>büyür</span> →</div>
        </div>
        <div className="pusula-ok alt">↓ <span>sertleşir</span></div>
      </div>
      <p className="gorsel-not">Mac'te aynı hareket: <kbd>Control</kbd> + <kbd>Option</kbd> basılıyken sürükle.</p>
    </div>
  );
}

function MaskeMenusu() {
  const satirlar = [
    ['Disable Layer Mask', 'Maskeyi geçici kapatır, üstünde kırmızı çarpı çıkar.', 'Evet — Enable ile anında', 'evet'],
    ['Delete Layer Mask', 'Maskeyi siler, gizlenen her şey geri görünür.', 'Sadece Ctrl+Z ile', 'orta'],
    ['Apply Layer Mask', 'Maskeyi piksellere işler, gizlenen yerler gerçekten silinir.', 'Hayır', 'hayir'],
  ];
  return (
    <div className="gorsel tablo-mini">
      <table>
        <thead>
          <tr><th>Seçenek</th><th>Ne olur?</th><th>Geri alınır mı?</th></tr>
        </thead>
        <tbody>
          {satirlar.map((s) => (
            <tr key={s[0]}>
              <td><strong>{s[0]}</strong></td>
              <td>{s[1]}</td>
              <td className={`geri-${s[3]}`}>{s[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ClippingMask() {
  return (
    <div className="gorsel klip">
      <div className="klip-adim">
        <div className="klip-kutu"><div className="klip-daire" /></div>
        <div className="klip-etiket">Alttaki katman<br /><em>şekil (daire)</em></div>
      </div>
      <div className="klip-arti">+</div>
      <div className="klip-adim">
        <div className="klip-kutu klip-foto" />
        <div className="klip-etiket">Üstteki katman<br /><em>fotoğraf</em></div>
      </div>
      <div className="klip-arti">=</div>
      <div className="klip-adim">
        <div className="klip-kutu"><div className="klip-daire klip-foto" /></div>
        <div className="klip-etiket">Sonuç<br /><em>fotoğraf yalnızca dairenin içinde</em></div>
      </div>
    </div>
  );
}

function SecimTuslari() {
  const tuslar = [
    { tus: 'Shift', sembol: '+', ad: 'Seçime ekler', renk: 'var(--success)' },
    { tus: 'Alt', sembol: '−', ad: 'Seçimden çıkarır', renk: 'var(--danger)' },
    { tus: 'Shift + Alt', sembol: '∩', ad: 'Kesişimi alır', renk: 'var(--info)' },
  ];
  return (
    <div className="gorsel secim-tuslari">
      {tuslar.map((t) => (
        <div className="secim-tus" key={t.tus}>
          <span className="secim-sembol" style={{ color: t.renk }}>{t.sembol}</span>
          <kbd>{t.tus}</kbd>
          <span className="secim-ad">{t.ad}</span>
        </div>
      ))}
      <p className="gorsel-not" style={{ flexBasis: '100%' }}>
        Tuşa basılıyken çizmeye başla; imlecin yanında küçük bir + / − işareti çıkar.
      </p>
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
  'firca-hareket': FircaHareket,
  'maske-menusu': MaskeMenusu,
  'clipping-mask': ClippingMask,
  'secim-tuslari': SecimTuslari,
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
  { k: 'firca-hareket', l: 'Fırça boyut/sertlik hareketi (pusula)' },
  { k: 'maske-menusu', l: 'Maske menüsü: Disable / Delete / Apply' },
  { k: 'clipping-mask', l: 'Clipping mask (şekil + fotoğraf = sonuç)' },
  { k: 'secim-tuslari', l: 'Seçim tuşları (Shift / Alt)' },
];

export default function RehberGorsel({ anahtar }: { anahtar: string | null }) {
  if (!anahtar) return null;
  const Bilesen = GORSELLER[anahtar];
  return Bilesen ? <Bilesen /> : null;
}
