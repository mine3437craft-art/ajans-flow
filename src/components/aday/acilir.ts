'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Tablo satırındaki açılır paneller (mesaj menüsü, analiz) için ortak
 * davranış. Panel document.body'ye portal ile çizilir (bkz. kullananlar):
 * tablonun taşma kutusunda ya da transform'lu sonuç penceresinin içinde
 * kırpılmasın. Konum düğmeye göre hesaplanır, açıldıktan sonra panelin
 * gerçek yüksekliği ölçülüp ekrana sığdırılır; dar ekranda CSS ile alttan
 * panel olur. Dışarı dokununca / Esc ile / pencere genişliği değişince kapanır.
 */
export function useAcilir(genislik: number, tahminiYukseklik: number) {
  const [acik, setAcik] = useState(false);
  const [konum, setKonum] = useState<{ top: number; left: number } | null>(null);
  const kutu = useRef<HTMLDivElement>(null);
  const dugme = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const hesapla = (yukseklik: number) => {
    const r = dugme.current?.getBoundingClientRect();
    if (!r) return null;
    const left = Math.max(8, Math.min(r.right - genislik, window.innerWidth - genislik - 8));
    const asagi = r.bottom + 6 + yukseklik < window.innerHeight;
    const top = asagi ? r.bottom + 6 : Math.max(8, r.top - 6 - yukseklik);
    return { top, left };
  };

  // Açıldıktan sonra gerçek yüksekliğe göre düzelt (tahmin tutmayabilir).
  useLayoutEffect(() => {
    if (!acik || !panel.current) return;
    const h = panel.current.getBoundingClientRect().height;
    const k = hesapla(h);
    if (k && (k.top !== konum?.top || k.left !== konum?.left)) setKonum(k);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acik]);

  useEffect(() => {
    if (!acik) return;
    // pointerdown: iOS Safari boş alana dokunuşta mousedown göndermiyor.
    // Panel portal ile body'de: DOM'da düğmenin kutusunun içinde değil.
    const disari = (e: PointerEvent) => {
      const hedef = e.target as Node;
      if (kutu.current?.contains(hedef) || panel.current?.contains(hedef)) return;
      setAcik(false);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setAcik(false); };
    // Telefonda kaydırırken adres çubuğu gizlenip yükseklik değişiyor:
    // yalnızca genişlik değişince (döndürme, pencere boyutu) kapan.
    const ilkGenislik = window.innerWidth;
    const boyut = () => { if (window.innerWidth !== ilkGenislik) setAcik(false); };
    document.addEventListener('pointerdown', disari);
    document.addEventListener('keydown', esc);
    window.addEventListener('resize', boyut);
    return () => {
      document.removeEventListener('pointerdown', disari);
      document.removeEventListener('keydown', esc);
      window.removeEventListener('resize', boyut);
    };
  }, [acik]);

  const degistir = () => {
    if (!acik) setKonum(hesapla(tahminiYukseklik));
    setAcik((v) => !v);
  };

  return { acik, setAcik, konum, kutu, dugme, panel, degistir };
}

/**
 * Metni panoya kopyalar; sonucu Promise ile bildirir. Eşzamanlı yol
 * (execCommand) çağrıldığı anda çalışır: Instagram'ı hemen ardından yeni
 * sekmede açınca sayfa odağı kaybediyor ve navigator.clipboard'ın gecikmeli
 * yazması "Document is not focused" hatasıyla düşüyordu. O yol olmazsa
 * navigator.clipboard denenir; ikisi de olmazsa false.
 */
export function panoyaKopyala(metin: string): Promise<boolean> {
  let ok = false;
  try {
    const t = document.createElement('textarea');
    t.value = metin;
    t.setAttribute('readonly', '');
    t.style.position = 'fixed';
    t.style.top = '-1000px';
    t.style.opacity = '0';
    document.body.appendChild(t);
    t.select();
    t.setSelectionRange(0, metin.length); // iOS
    ok = document.execCommand('copy');
    t.remove();
  } catch { ok = false; }
  if (ok) return Promise.resolve(true);
  if (!navigator.clipboard) return Promise.resolve(false);
  return navigator.clipboard.writeText(metin).then(() => true, () => false);
}

/** Ekranın altında birkaç saniyelik bilgi balonu. */
export function bildir(metin: string, sure = 3500) {
  const el = document.createElement('div');
  el.className = 'bildirim-tost';
  el.setAttribute('role', 'status');
  el.textContent = metin;
  document.body.appendChild(el);
  window.setTimeout(() => el.classList.add('gider'), sure);
  window.setTimeout(() => el.remove(), sure + 400);
}

/** Linki kopyalar; olmazsa linki gösterir (elle seçilip kopyalansın). */
export function linkKopyala(adres: string) {
  void panoyaKopyala(adres).then((ok) => bildir(ok ? 'Link kopyalandı.' : adres, ok ? 3500 : 8000));
}
