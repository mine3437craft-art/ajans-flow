'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import { sablonDoldur, doldurulmamisYer, DURUM_HARITA } from '@/lib/adaylar';
import { telefonCoz } from '@/lib/telefon';
import { formVerisi, type AdayRow, type Eylem, type Sablon } from './tipler';

/** wa.me bağlantısını mesaj metniyle kurar. */
export function whatsappAdresi(aday: Pick<AdayRow, 'phone_raw'>, metin: string): string | null {
  const t = telefonCoz(aday.phone_raw);
  if (!t.whatsapp) return null;
  return metin ? `${t.whatsapp}?text=${encodeURIComponent(metin)}` : t.whatsapp;
}

/** Şablonu bu aday için doldurur. */
export function mesajMetni(
  sablon: Sablon | null, aday: Pick<AdayRow, 'name' | 'contact_person'>,
  gonderen: string, marka: string,
): string {
  if (!sablon) return '';
  return sablonDoldur(sablon.body, { ad: aday.name, yetkili: aday.contact_person, gonderen, marka });
}

/**
 * WhatsApp'ı seçilen şablonla açar ve kaydını tutar. Mesajı WhatsApp
 * gönderir: uygulama mesaj hazır açılır, "Gönder"e basmak kişide.
 * window.open tıklamanın içinde, eşzamanlı çağrılıyor — yoksa tarayıcı
 * açılır pencere engelleyicisine takılır.
 */
export function whatsappGonder(
  aday: AdayRow, sablon: Sablon | null, gonderen: string, marka: string, kaydet: Eylem,
): boolean {
  const metin = mesajMetni(sablon, aday, gonderen, marka);
  // Hazır "Detaylar" şablonunda "[buraya teklif…]" gibi doldurulmamış yer
  // kaldıysa müşteriye öyle gitmesin.
  const bos = doldurulmamisYer(metin);
  if (bos && !window.confirm(
    `Mesajda doldurulmamış yer var: ${bos}\n\nŞablonu Mesaj şablonları sayfasından düzenleyebilirsin. Yine de açılsın mı?`,
  )) return false;
  const adres = whatsappAdresi(aday, metin);
  if (!adres) return false;
  window.open(adres, '_blank', 'noopener');
  startTransition(async () => {
    await kaydet(formVerisi({ id: aday.id, sablon_id: sablon?.id ?? null }));
  });
  return true;
}

/**
 * Satırdaki WhatsApp düğmesi: dokununca şablon listesi açılır, birine
 * basınca WhatsApp o mesajla açılır. Ön izleme şablonun bu adaya göre
 * doldurulmuş hâlini gösterir.
 */
export default function WhatsAppMenu({
  aday, sablonlar, gonderen, marka, kaydet,
}: {
  aday: AdayRow;
  sablonlar: Sablon[];
  gonderen: string;
  marka: string;
  kaydet: Eylem;
}) {
  const [acik, setAcik] = useState(false);
  const [onizleme, setOnizleme] = useState<Sablon | null>(null);
  // Menü tablonun taşma kutusunun içinde kalıp kırpılıyordu: sabit konumla
  // düğmenin yanına yerleşiyor, dar ekranda alttan panel olarak açılıyor.
  const [konum, setKonum] = useState<{ top: number; left: number } | null>(null);
  const kutu = useRef<HTMLDivElement>(null);
  const dugme = useRef<HTMLButtonElement>(null);

  const konumla = () => {
    const r = dugme.current?.getBoundingClientRect();
    if (!r) return;
    const genislik = 340;
    const yukseklik = 420;
    const left = Math.max(8, Math.min(r.right - genislik, window.innerWidth - genislik - 8));
    const asagi = r.bottom + 6 + yukseklik < window.innerHeight;
    const top = asagi ? r.bottom + 6 : Math.max(8, r.top - 6 - yukseklik);
    setKonum({ top, left });
  };

  // Dışarı dokununca / Esc ile / kaydırınca kapansın. pointerdown: iOS
  // Safari boş alana dokunuşta mousedown göndermiyor.
  useEffect(() => {
    if (!acik) return;
    const disari = (e: PointerEvent) => {
      if (kutu.current && !kutu.current.contains(e.target as Node)) setAcik(false);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setAcik(false); };
    const kapat = () => setAcik(false);
    document.addEventListener('pointerdown', disari);
    document.addEventListener('keydown', esc);
    window.addEventListener('resize', kapat);
    return () => {
      document.removeEventListener('pointerdown', disari);
      document.removeEventListener('keydown', esc);
      window.removeEventListener('resize', kapat);
    };
  }, [acik]);

  if (!telefonCoz(aday.phone_raw).whatsapp) return null;

  const gonder = (s: Sablon | null) => {
    whatsappGonder(aday, s, gonderen, marka, kaydet);
    setAcik(false);
  };

  return (
    <div className="wa-menu" ref={kutu}>
      <button ref={dugme} type="button" className="wa-bag" title="WhatsApp mesajı" aria-expanded={acik}
              onClick={() => {
                if (!acik) konumla();
                setAcik((v) => !v);
                setOnizleme(sablonlar[0] ?? null);
              }}>
        WA
      </button>
      {acik && (
        <div className="wa-acilir" role="menu"
             style={konum ? { top: konum.top, left: konum.left } : undefined}>
          <div className="wa-acilir-baslik">WhatsApp — {aday.name}</div>
          <div className="wa-sablonlar">
            {sablonlar.map((s) => (
              <button key={s.id} type="button" role="menuitem" className="wa-sablon"
                      onMouseEnter={() => setOnizleme(s)} onFocus={() => setOnizleme(s)}
                      onClick={() => gonder(s)}>
                <span>{s.title}</span>
                {s.sets_status && (
                  <span className="cell-sub">→ {DURUM_HARITA[s.sets_status]?.ad}</span>
                )}
              </button>
            ))}
            <button type="button" role="menuitem" className="wa-sablon wa-bos" onClick={() => gonder(null)}>
              <span>Boş mesaj</span>
            </button>
          </div>
          {onizleme && (
            <div className="wa-onizleme">{mesajMetni(onizleme, aday, gonderen, marka)}</div>
          )}
          <div className="wa-not">WhatsApp mesaj hazır açılır — Gönder&apos;e basman yeterli.</div>
        </div>
      )}
    </div>
  );
}
