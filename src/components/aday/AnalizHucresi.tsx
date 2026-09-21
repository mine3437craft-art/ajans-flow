'use client';

import { startTransition, useOptimistic } from 'react';
import { createPortal } from 'react-dom';
import {
  EKSIKLER, EK_ALANLAR, SEKTORLER, SEKTOR_HARITA, UC_DURUMLAR, adayEksikleri, ekAlanDegeri,
  type UcDurum,
} from '@/lib/adaylar';
import { useAcilir, linkKopyala } from './acilir';
import { sunumAdresi, sunumYolu } from './WhatsAppMenu';
import { formVerisi, type AdayRow, type Eylem } from './tipler';

type Durum = { gaps: string[]; has_website: UcDurum; worked_with_agency: UcDurum; sector: string | null };
type Degisim =
  | { tur: 'eksik'; anahtar: string; acik: boolean }
  | { tur: 'web' | 'ajans'; deger: UcDurum }
  | { tur: 'sektor'; deger: string | null };

function uygula(d: Durum, x: Degisim): Durum {
  if (x.tur === 'eksik') {
    if (x.anahtar === 'web_yok') {
      return { ...d, has_website: x.acik ? 'yok' : d.has_website === 'yok' ? 'bilinmiyor' : d.has_website };
    }
    const set = new Set(d.gaps);
    if (x.acik) set.add(x.anahtar); else set.delete(x.anahtar);
    return { ...d, gaps: [...set] };
  }
  if (x.tur === 'web') return { ...d, has_website: x.deger };
  if (x.tur === 'ajans') return { ...d, worked_with_agency: x.deger };
  return { ...d, sector: x.deger };
}

const UC_AD: Record<UcDurum, string> = { bilinmiyor: 'Bilinmiyor', var: 'Var', yok: 'Yok' };

/**
 * Ajans Flow tablosundaki "Analiz" sütunu: adayın eksikleri çip olarak
 * görünür, dokununca hızlı düzenleme paneli açılır. Her dokunuş hemen
 * kaydedilir (iyimser: ekranda anında değişir, sunucu arkadan yetişir).
 */
export default function AnalizHucresi({ aday, kaydet }: { aday: AdayRow; kaydet: Eylem }) {
  const [d, degistir] = useOptimistic<Durum, Degisim>(
    { gaps: aday.gaps ?? [], has_website: aday.has_website, worked_with_agency: aday.worked_with_agency, sector: aday.sector },
    uygula,
  );
  const { acik, setAcik, konum, kutu, dugme, panel, degistir: acKapa } = useAcilir(380, 560);

  const eksikler = adayEksikleri(d);
  const sektor = d.sector ? SEKTOR_HARITA[d.sector] : null;
  const bos = eksikler.length === 0 && d.worked_with_agency === 'bilinmiyor' && d.has_website === 'bilinmiyor' && !sektor;

  const gonder = (x: Degisim) => {
    startTransition(async () => {
      degistir(x);
      if (x.tur === 'eksik') {
        await kaydet(formVerisi({ id: aday.id, alan: 'eksik', deger: x.anahtar, acik: x.acik ? '1' : '0' }));
      } else if (x.tur === 'sektor') {
        await kaydet(formVerisi({ id: aday.id, alan: 'sektor', deger: x.deger ?? '' }));
      } else {
        await kaydet(formVerisi({ id: aday.id, alan: x.tur, deger: x.deger }));
      }
    });
  };

  const gorunen = eksikler.slice(0, 3);
  const link = sunumYolu(aday);

  return (
    <div className="wa-menu analiz-menu" ref={kutu}>
      <button ref={dugme} type="button" className={`analiz-hucre${bos ? ' bos' : ''}`} aria-expanded={acik}
              title="Eksikleri ve bilgileri düzenle" onClick={acKapa}>
        {bos ? (
          <span className="analiz-ekle">＋ Analiz et</span>
        ) : (
          <>
            {sektor && <span className="analiz-sektor">{sektor.simge} {sektor.ad}</span>}
            {eksikler.length > 0 ? (
              <span className="analiz-cipler">
                {gorunen.map((e) => <span key={e.anahtar} className="eksik-cip">{e.kisa}</span>)}
                {eksikler.length > gorunen.length && <span className="eksik-cip daha">+{eksikler.length - gorunen.length}</span>}
              </span>
            ) : (
              <span className="cell-sub">Eksik işaretlenmedi</span>
            )}
            {(d.worked_with_agency !== 'bilinmiyor' || d.has_website === 'var') && (
              <span className="analiz-bilgi">
                {d.has_website === 'var' && <span>🌐 Web var</span>}
                {d.worked_with_agency === 'var' && <span>🤝 Ajansla çalışmış</span>}
                {d.worked_with_agency === 'yok' && <span>🤝 Ajans deneyimi yok</span>}
              </span>
            )}
          </>
        )}
      </button>

      {acik && createPortal(
        <div ref={panel} className="wa-acilir analiz-acilir" role="dialog" aria-label={`${aday.name} analizi`}
             style={konum ? { top: konum.top, left: konum.left } : undefined}>
          <div className="analiz-ust">
            <div className="wa-acilir-baslik" style={{ margin: 0 }}>Analiz — {aday.name}</div>
            <button type="button" className="btn btn-sm btn-primary" onClick={() => setAcik(false)}>Bitti</button>
          </div>

          <div className="analiz-bolum">
            <span className="analiz-baslik">Sektör</span>
            <select className="form-control" value={d.sector ?? ''} aria-label="Sektör"
                    onChange={(e) => gonder({ tur: 'sektor', deger: e.target.value || null })}>
              <option value="">— Seçilmedi —</option>
              {SEKTORLER.map((s) => <option key={s.anahtar} value={s.anahtar}>{s.simge} {s.ad}</option>)}
            </select>
          </div>

          <div className="analiz-bolum">
            <span className="analiz-baslik">Eksikler — dokun, işaretle</span>
            <div className="eksik-secim">
              {EKSIKLER.map((e) => {
                const secili = eksikler.some((x) => x.anahtar === e.anahtar);
                return (
                  <button key={e.anahtar} type="button" aria-pressed={secili}
                          className={`eksik-dugme${secili ? ' secili' : ''}`}
                          onClick={() => gonder({ tur: 'eksik', anahtar: e.anahtar, acik: !secili })}>
                    <span aria-hidden>{e.simge}</span> {e.ad}
                  </button>
                );
              })}
            </div>
          </div>

          {(['web', 'ajans'] as const).map((k) => {
            const alan = EK_ALANLAR[k];
            const deger = ekAlanDegeri({ ...aday, ...d }, k);
            return (
              <div className="sonuc-ek-satir analiz-soru" key={k}>
                <span>{alan.simge} {alan.soru}</span>
                <span className="segment">
                  {UC_DURUMLAR.map((v) => (
                    <button key={v} type="button" className={deger === v ? 'aktif' : ''}
                            onClick={() => gonder({ tur: k, deger: v })}>
                      {UC_AD[v]}
                    </button>
                  ))}
                </span>
              </div>
            );
          })}

          {link && (
            <div className="analiz-sunum">
              <div>
                <strong>Kişisel sunum linki</strong>
                <div className="cell-sub">
                  İşaretlediğin eksikler müşteriye öneri olarak görünür.
                  {aday.site_views > 0 && <> · 👀 {aday.site_views} kez açıldı</>}
                </div>
              </div>
              <div className="analiz-sunum-eylem">
                <button type="button" className="btn btn-sm btn-secondary"
                        onClick={() => linkKopyala(sunumAdresi(aday) ?? link)}>
                  Kopyala
                </button>
                <a className="btn btn-sm btn-ghost" href={link} target="_blank" rel="noopener noreferrer">Aç ↗</a>
              </div>
            </div>
          )}
        </div>,
        document.body,
      )}
    </div>
  );
}
