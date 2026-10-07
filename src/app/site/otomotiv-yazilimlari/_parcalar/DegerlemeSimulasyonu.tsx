'use client';

import { useMemo, useState } from 'react';
import Dugme from '@/components/site/Dugme';
import { IkonTik } from '@/components/site/Ikonlar';
import { ALIS_ARALIGI, KIRICILAR } from '../icerik';

/**
 * Değerleme bandı simülasyonu.
 *
 * Mantığı gösterir, FİYAT VERMEZ: piyasa göstergesi 100 puan kabul edilir,
 * kırıcılar çarpan olarak uygulanır. Gerçek araç verisi, gerçek fiyat ve
 * gerçek müşteri kaydı yok; her rakam "örnek" damgalı.
 *
 * Bandın kayması tek CSS değişkeninden gelir: `--af-kirici-oran`.
 */

/** Puan biçimi: 82,5 — gösterge değerleri. */
const PUAN = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 });
/** Çarpan biçimi: 0,85 · 0,985 — yuvarlanırsa oranlar yanlış görünür. */
const CARPAN = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 3 });

export default function DegerlemeSimulasyonu() {
  const [secili, setSecili] = useState<string[]>([]);
  const [veriYok, setVeriYok] = useState(false);

  const oran = useMemo(
    () => KIRICILAR.filter((k) => secili.includes(k.anahtar)).reduce((t, k) => t * k.oran, 1),
    [secili],
  );

  const duzeltilmis = oran * 100;
  const alisAlt = duzeltilmis * ALIS_ARALIGI.alt;
  const alisUst = duzeltilmis * ALIS_ARALIGI.ust;
  const kayip = 100 - duzeltilmis;

  const degistir = (anahtar: string) =>
    setSecili((o) => (o.includes(anahtar) ? o.filter((a) => a !== anahtar) : [...o, anahtar]));

  return (
    <div className="af-yigin af-yigin--genis">
      {/* ---- Kırıcı çipleri ---- */}
      <div>
        <p className="af-mono-etiket">Kırıcılar</p>
        <div className="af-cipler af-ust-16">
          {KIRICILAR.map((k) => {
            const acik = secili.includes(k.anahtar);
            return (
              <button
                key={k.anahtar}
                type="button"
                className="af-cip af-oto-kirici"
                aria-pressed={acik}
                onClick={() => degistir(k.anahtar)}
              >
                <span>
                  {k.ad} <span className="af-oto-kirici-oran">×{CARPAN.format(k.oran)}</span>
                </span>
                <span className="af-oto-kirici-kural">{k.kural}</span>
              </button>
            );
          })}
        </div>
        <p className="af-dugme-not af-ust-16">
          Çipler bağımsız çalışıyor; seçtiklerinizin çarpanları sırayla uygulanıyor. Gerçek akışta
          kaporta durumu parça parça işaretleniyor ve hesaba hangi parçanın etkilendiği de giriyor.
        </p>
      </div>

      {/* ---- Bant ---- */}
      <div
        className="af-oto-band"
        style={{ ['--af-kirici-oran' as string]: String(veriYok ? 0 : oran) }}
        aria-hidden={veriYok}
      >
        <div className="af-oto-band-bas">
          <p className="af-mono-etiket af-mono-etiket--vurgu">Gösterge bandı</p>
          <span className="af-ornek-damga">örnek</span>
        </div>
        <div className="af-oto-band-iz">
          <div className="af-oto-band-dolu" />
          <div className="af-oto-band-aralik" />
          {/* Düzeltilmiş gösterge bandın ucunda yazılı durur: göz bandı
              ölçeğe çevirmek zorunda kalmıyor. `aria-hidden`, çünkü
              aynı sayı aşağıdaki role="status" kutusunda okunuyor;
              iki kez duyurulmasın. */}
          <p className="af-oto-band-imlec" aria-hidden="true">
            {PUAN.format(duzeltilmis)}
          </p>
        </div>
        <div className="af-oto-band-olcek">
          <span>0</span>
          <span>50</span>
          <span>piyasa 100</span>
        </div>
      </div>

      {/* ---- Sonuç ---- */}
      {veriYok ? (
        <div className="af-kart af-kart--vurgulu">
          <p className="af-mono-etiket af-mono-etiket--vurgu">Veri yoksa rakam yok</p>
          <p className="af-kart-baslik">Bu araç için rakam göstermiyoruz.</p>
          <p className="af-kart-metin">
            Yeterli yakın kayıt bulunamadığında akış bir fiyat uydurmuyor; &quot;ekibimiz sizinle
            iletişime geçecek&quot; diyor ve talep galerinin paneline düşüyor. Talep kaybolmuyor,
            yalnızca dayanağı olmayan rakam gösterilmiyor.
          </p>
        </div>
      ) : (
        <div className="af-oto-sonuc" role="status" aria-live="polite">
          <div className="af-oto-sonuc-oge">
            <span className="af-veri-etiket">Piyasa göstergesi</span>
            <span className="af-oto-sonuc-deger">100</span>
            <span className="af-veri-not">kabul edilen başlangıç</span>
          </div>
          <div className="af-oto-sonuc-oge">
            <span className="af-veri-etiket">Kırıcıların götürdüğü</span>
            <span className="af-oto-sonuc-deger">
              {kayip > 0 ? '−' : ''}
              {PUAN.format(kayip)}
            </span>
            <span className="af-veri-not">
              {secili.length === 0 ? 'çip seçilmedi' : `${secili.length} kalem uygulandı`}
            </span>
          </div>
          <div className="af-oto-sonuc-oge">
            <span className="af-veri-etiket">Düzeltilmiş gösterge</span>
            <span className="af-oto-sonuc-deger">{PUAN.format(duzeltilmis)}</span>
            <span className="af-veri-not">×{CARPAN.format(oran)} çarpan</span>
          </div>
          <div className="af-oto-sonuc-oge af-oto-sonuc-oge--vurgulu">
            <span className="af-veri-etiket">Galerinin alış aralığı</span>
            <span className="af-oto-sonuc-deger">
              {PUAN.format(alisAlt)}–{PUAN.format(alisUst)}
            </span>
            <span className="af-veri-not">
              düzeltilmiş göstergenin %{ALIS_ARALIGI.alt * 100}–%{ALIS_ARALIGI.ust * 100}&apos;ı
            </span>
          </div>
        </div>
      )}

      {/* ---- "Veri yoksa rakam yok" anahtarı ---- */}
      <div className="af-oto-veri-yok">
        <div>
          <p className="af-kart-baslik">Peki yakın kayıt bulunamazsa?</p>
          <p className="af-kart-metin">
            Akışın en önemli kuralı bu. Aşağıdaki düğmeye basıp sonucun nasıl değiştiğini görün.
          </p>
        </div>
        <Dugme tur={veriYok ? 'birincil' : 'ikincil'} onClick={() => setVeriYok((v) => !v)}>
          {veriYok ? (
            <>
              <IkonTik />
              Bandı geri getir
            </>
          ) : (
            'Yakın kayıt yok say'
          )}
        </Dugme>
      </div>

      <p className="af-dugme-not">
        Buradaki 100 puan bir para birimi değil, hesabın başlangıç noktası; ekrandaki her sayı
        uydurma bir örnektir.
      </p>
    </div>
  );
}
