'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  MENU_ARAYUZ,
  MENU_DILLERI,
  MENU_OGELERI,
  QR_BOLUMU,
  type MenuDili,
  type MenuEtiketi,
  type MenuKategori,
} from './icerik';
import { IkonArama } from './Ikonlar';

/**
 * QR menü vitrini: önce kamera QR'ı "okutur", sonra çalışan küçük bir
 * dört dilli menü açılır (arama, filtre, kategori gerçekten çalışır).
 *
 * Aşamalar: bekle → tara → bulundu → menu.
 * JS yoksa CSS kamerayı gizler ve menüyü doğrudan gösterir.
 */

type Asama = 'bekle' | 'tara' | 'bulundu' | 'menu';

const KATEGORILER: MenuKategori[] = ['kahvalti', 'icecek', 'tatli'];
const FILTRELER: MenuEtiketi[] = ['vegan', 'glutensiz', 'kuruyemissiz'];
const ROZET: Record<MenuEtiketi, string> = { vegan: 'V', glutensiz: 'GF', kuruyemissiz: 'NF' };
const YEREL: Record<MenuDili, string> = { tr: 'tr-TR', en: 'en-GB', de: 'de-DE', ar: 'ar' };

export default function QrMenu({ kamera }: { kamera: ReactNode }) {
  const [asama, setAsama] = useState<Asama>('bekle');
  const [dil, setDil] = useState<MenuDili>('tr');
  const [kategori, setKategori] = useState<MenuKategori>('kahvalti');
  const [arama, setArama] = useState('');
  const [filtreler, setFiltreler] = useState<MenuEtiketi[]>([]);
  const kutuRef = useRef<HTMLDivElement>(null);
  const zamanlar = useRef<number[]>([]);
  /** Kullanıcı menüye dokunduysa/odaklandıysa otomatik tarama bir daha başlamasın. */
  const etkilesim = useRef(false);

  const oynat = useCallback(() => {
    zamanlar.current.forEach((z) => window.clearTimeout(z));
    setAsama('tara');
    zamanlar.current = [
      window.setTimeout(() => setAsama('bulundu'), 2300),
      window.setTimeout(() => setAsama('menu'), 3000),
    ];
  }, []);

  useEffect(() => {
    const kutu = kutuRef.current;
    if (!kutu) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setAsama('menu');
      return;
    }
    const io = new IntersectionObserver(
      ([g]) => {
        if (!g?.isIntersecting) return;
        io.disconnect();
        if (!etkilesim.current) oynat();
      },
      { threshold: 0.45 },
    );
    io.observe(kutu);
    const zaman = zamanlar;
    return () => {
      io.disconnect();
      zaman.current.forEach((z) => window.clearTimeout(z));
    };
  }, [oynat]);

  const ui = MENU_ARAYUZ[dil];
  const liste = useMemo(() => {
    const yerel = YEREL[dil];
    const aranan = arama.trim().toLocaleLowerCase(yerel);
    return MENU_OGELERI.filter((o) => {
      if (!aranan && o.kategori !== kategori) return false;
      if (filtreler.some((f) => !o.etiketler.includes(f))) return false;
      if (!aranan) return true;
      const [ad, aciklama] = o.metin[dil];
      return `${ad} ${aciklama}`.toLocaleLowerCase(yerel).includes(aranan);
    });
  }, [dil, kategori, arama, filtreler]);

  // Klavyeyle menüye gelinirse tarama beklenmeden menü açılsın
  const odaklaninca = () => {
    etkilesim.current = true;
    if (asama === 'menu') return;
    zamanlar.current.forEach((z) => window.clearTimeout(z));
    setAsama('menu');
  };

  return (
    <div className="tn-qr-sar">
      <div ref={kutuRef} className="tn-qr-telefon" data-asama={asama}>
        <div className="tn-telefon tn-telefon--qr">
          <div className="tn-telefon-ekran">
            <span className="tn-telefon-ada" aria-hidden="true" />

            {/* Dokununca taramayı atla (klavye için menüye odaklanmak yeterli) */}
            <div className="tn-qr-kamera" aria-hidden="true" onClick={odaklaninca}>
              {kamera}
              <p className="tn-qr-durum">
                {asama === 'bulundu' ? `✓ ${QR_BOLUMU.bulundu}` : QR_BOLUMU.tara}
              </p>
            </div>

            <div
              className="tn-qm"
              lang={dil}
              dir={dil === 'ar' ? 'rtl' : 'ltr'}
              aria-label="Örnek kafe dijital menü demosu"
              role="group"
              onFocus={odaklaninca}
            >
              <div className="tn-qm-ust">
                <div className="tn-qm-marka">
                  <b>Örnek Kafe</b>
                  <small>{ui.selam}</small>
                </div>
              </div>

              <div className="tn-qm-diller" role="group" aria-label="Menü dili" dir="ltr">
                {MENU_DILLERI.map((d) => (
                  <button
                    key={d.kod}
                    type="button"
                    lang={d.kod}
                    aria-pressed={dil === d.kod}
                    aria-label={d.ad}
                    onClick={() => setDil(d.kod)}
                  >
                    {d.kisa}
                  </button>
                ))}
              </div>

              <div className="tn-qm-ara">
                <IkonArama className="tn-qm-ara-ikon" />
                <input
                  type="search"
                  value={arama}
                  onChange={(e) => setArama(e.target.value)}
                  placeholder={ui.ara}
                  aria-label={ui.ara}
                  enterKeyHint="search"
                  autoComplete="off"
                />
              </div>

              <div className="tn-qm-filtreler" role="group" aria-label="Filtreler">
                {FILTRELER.map((f) => {
                  const secili = filtreler.includes(f);
                  return (
                    <button
                      key={f}
                      type="button"
                      aria-pressed={secili}
                      onClick={() => setFiltreler((l) => (secili ? l.filter((x) => x !== f) : [...l, f]))}
                    >
                      <i aria-hidden="true">{ROZET[f]}</i>
                      {ui.etiketler[f]}
                    </button>
                  );
                })}
              </div>

              <div className="tn-qm-kategoriler" role="group" aria-label="Kategoriler">
                {KATEGORILER.map((k) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={!arama.trim() && kategori === k}
                    onClick={() => {
                      setKategori(k);
                      setArama('');
                    }}
                  >
                    {ui.kategoriler[k]}
                  </button>
                ))}
              </div>

              <ul className="tn-qm-liste" aria-live="polite">
                {liste.map((o) => {
                  const [ad, aciklama] = o.metin[dil];
                  return (
                    <li key={o.metin.tr[0]}>
                      <span className="tn-qm-simge" aria-hidden="true">
                        {o.simge}
                      </span>
                      <span className="tn-qm-metin">
                        <b>{ad}</b>
                        <small>{aciklama}</small>
                      </span>
                      {o.etiketler.length > 0 && (
                        <span className="tn-qm-rozetler">
                          {o.etiketler.map((e) => (
                            <i key={e} title={ui.etiketler[e]} className={`tn-qm-rozet--${e}`}>
                              <span aria-hidden="true">{ROZET[e]}</span>
                              <span className="tn-sr">{ui.etiketler[e]}</span>
                            </i>
                          ))}
                        </span>
                      )}
                    </li>
                  );
                })}
                {liste.length === 0 && <li className="tn-qm-bos">{ui.bos}</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <button type="button" className="tn-qr-tekrar" onClick={oynat} data-gorunur={asama === 'menu'}>
        <span aria-hidden="true">↻</span> {QR_BOLUMU.tekrar}
      </button>
    </div>
  );
}
