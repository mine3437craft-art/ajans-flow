'use client';

import { startTransition, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  sablonDoldur, doldurulmamisYer, DURUM_HARITA, adayEksikleri, eksikMetni,
} from '@/lib/adaylar';
import { telefonCoz } from '@/lib/telefon';
import { useAcilir, panoyaKopyala, bildir } from './acilir';
import { formVerisi, type AdayRow, type Eylem, type Sablon } from './tipler';

export type Kanal = 'whatsapp' | 'instagram';

/** Mesajı hazırlamak için gereken marka bilgisi. */
export type MesajMarkasi = { ad: string; analiz: boolean };

/** Adayın kişisel tanıtım sayfasının yolu (bağlantılar için, göreli). */
export function sunumYolu(aday: Pick<AdayRow, 'share_code'>): string | null {
  return aday.share_code ? `/t/${aday.share_code}` : null;
}

/**
 * Mesaja konan tam adres. Yalnızca tıklama anında / açık menüde çağrılır:
 * sunucuda çizilen HTML'de window yok (orada göreli yol kullanılıyor).
 */
export function sunumAdresi(aday: Pick<AdayRow, 'share_code'>): string | null {
  const yol = sunumYolu(aday);
  if (!yol) return null;
  const koken = typeof window !== 'undefined' ? window.location.origin : 'https://ajans-flow.vercel.app';
  return `${koken}${yol}`;
}

/** wa.me bağlantısını mesaj metniyle kurar. */
export function whatsappAdresi(aday: Pick<AdayRow, 'phone_raw'>, metin: string): string | null {
  const t = telefonCoz(aday.phone_raw);
  if (!t.whatsapp) return null;
  return metin ? `${t.whatsapp}?text=${encodeURIComponent(metin)}` : t.whatsapp;
}

/** Instagram'da doğrudan mesaj (DM) ekranı. Metin önceden yazılamıyor. */
export function instagramAdresi(aday: Pick<AdayRow, 'instagram'>): string | null {
  return aday.instagram ? `https://ig.me/m/${encodeURIComponent(aday.instagram)}` : null;
}

/** Şablonu bu aday için doldurur. */
export function mesajMetni(
  sablon: Sablon | null, aday: AdayRow, gonderen: string, marka: MesajMarkasi,
): string {
  if (!sablon) return '';
  return sablonDoldur(sablon.body, {
    ad: aday.name, yetkili: aday.contact_person, gonderen, marka: marka.ad,
    eksikler: eksikMetni(marka.analiz ? adayEksikleri(aday) : []),
    site: marka.analiz ? sunumAdresi(aday) ?? '' : '',
  });
}

/** Hazır şablonda "[buraya teklif…]" gibi doldurulmamış yer kaldıysa sorar. */
function bosYerOnayi(metin: string): boolean {
  const bos = doldurulmamisYer(metin);
  return !bos || window.confirm(
    `Mesajda doldurulmamış yer var: ${bos}\n\nŞablonu Mesaj şablonları sayfasından düzenleyebilirsin. Yine de açılsın mı?`,
  );
}

function kayitGonder(kaydet: Eylem, aday: AdayRow, sablon: Sablon | null, kanal: Kanal) {
  startTransition(async () => {
    await kaydet(formVerisi({ id: aday.id, sablon_id: sablon?.id ?? null, kanal }));
  });
}

/**
 * WhatsApp'ı seçilen şablonla açar ve kaydını tutar. Mesajı WhatsApp
 * gönderir: uygulama mesaj hazır açılır, "Gönder"e basmak kişide.
 * window.open tıklamanın içinde, eşzamanlı çağrılıyor — yoksa tarayıcı
 * açılır pencere engelleyicisine takılır.
 */
export function whatsappGonder(
  aday: AdayRow, sablon: Sablon | null, gonderen: string, marka: MesajMarkasi, kaydet: Eylem,
): boolean {
  const metin = mesajMetni(sablon, aday, gonderen, marka);
  if (!bosYerOnayi(metin)) return false;
  const adres = whatsappAdresi(aday, metin);
  if (!adres) return false;
  window.open(adres, '_blank', 'noopener');
  kayitGonder(kaydet, aday, sablon, 'whatsapp');
  return true;
}

/**
 * Instagram DM: Instagram bağlantıyla hazır metin almıyor. Mesaj panoya
 * kopyalanır, sohbet açılır — kişi yapıştırıp gönderir.
 */
export function instagramGonder(
  aday: AdayRow, sablon: Sablon | null, gonderen: string, marka: MesajMarkasi, kaydet: Eylem,
): boolean {
  const adres = instagramAdresi(aday);
  if (!adres) return false;
  const metin = mesajMetni(sablon, aday, gonderen, marka);
  if (!bosYerOnayi(metin)) return false;
  // Kopyalama tıklama anında başlar, sekme hemen ardından açılır.
  const kopya = metin ? panoyaKopyala(metin) : null;
  window.open(adres, '_blank', 'noopener');
  void kopya?.then((ok) => bildir(ok
    ? 'Mesaj kopyalandı — Instagram’da sohbete yapıştırıp gönder.'
    : 'Mesaj kopyalanamadı: menüdeki ön izlemeden seçip kopyala.', ok ? 3500 : 6000));
  kayitGonder(kaydet, aday, sablon, 'instagram');
  return true;
}

/**
 * Satırdaki mesaj düğmesi (WhatsApp ya da Instagram): dokununca şablon
 * listesi açılır, birine basınca mesaj o metinle hazırlanır. Ön izleme
 * şablonun bu adaya göre doldurulmuş hâlini gösterir.
 */
export default function WhatsAppMenu({
  aday, sablonlar, gonderen, marka, kaydet, kanal = 'whatsapp',
}: {
  aday: AdayRow;
  sablonlar: Sablon[];
  gonderen: string;
  marka: MesajMarkasi;
  kaydet: Eylem;
  kanal?: Kanal;
}) {
  const [onizleme, setOnizleme] = useState<Sablon | null>(null);
  const { acik, setAcik, konum, kutu, dugme, panel, degistir } = useAcilir(340, 420);

  const ig = kanal === 'instagram';
  if (ig ? !aday.instagram : !telefonCoz(aday.phone_raw).whatsapp) return null;

  const gonder = (s: Sablon | null) => {
    if (ig) instagramGonder(aday, s, gonderen, marka, kaydet);
    else whatsappGonder(aday, s, gonderen, marka, kaydet);
    setAcik(false);
  };

  return (
    <div className="wa-menu" ref={kutu}>
      <button ref={dugme} type="button" className={ig ? 'ig-bag' : 'wa-bag'}
              title={ig ? `Instagram'dan mesaj: @${aday.instagram}` : 'WhatsApp mesajı'}
              aria-expanded={acik}
              onClick={() => { degistir(); setOnizleme(sablonlar[0] ?? null); }}>
        {ig ? 'IG' : 'WA'}
      </button>
      {acik && createPortal(
        <div ref={panel} className={`wa-acilir${ig ? ' ig-acilir' : ''}`} role="menu"
             style={konum ? { top: konum.top, left: konum.left } : undefined}>
          <div className="wa-acilir-baslik">
            {ig ? `Instagram — @${aday.instagram}` : `WhatsApp — ${aday.name}`}
          </div>
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
              <span>{ig ? 'Sadece sohbeti aç' : 'Boş mesaj'}</span>
            </button>
          </div>
          {onizleme && (
            <div className="wa-onizleme">{mesajMetni(onizleme, aday, gonderen, marka)}</div>
          )}
          <div className="wa-not">
            {ig
              ? 'Mesaj panoya kopyalanır ve Instagram sohbeti açılır — yapıştırıp gönder.'
              : 'WhatsApp mesaj hazır açılır — Gönder’e basman yeterli.'}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
