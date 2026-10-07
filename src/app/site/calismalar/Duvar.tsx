/**
 * HARF KADRAJI — tek satırlık anahtar kelime (SITE-GIRIS.md tekniği).
 *
 * SUNUCU BİLEŞENİ, istemciye hiç JS taşımaz. Açılış saf CSS (perde),
 * videoyu mevcut `Efektler.tsx` denetleyicisi yönetir: `data-video` /
 * `data-video-kaynak` / `data-video-sira` sözleşmesi aynen korunuyor,
 * `data-video-bekle="yukleme"` ile `src` ancak window.load + boşta
 * zaman + 4g üstü bağlantıda atanır.
 *
 * ÇEKİRDEK TEKNİK: BLEND KNOCKOUT (`background-clip: text` DEĞİL).
 *   .af-vk-taban   turuncu gradyan   (marka sembolünün kendi durakları)
 *   .af-vk-plan    <img> + <video>   mix-blend-mode: screen   (varsa)
 *   .af-vk-maske   #000              mix-blend-mode: multiply
 * Matematik: siyah plaka × düzlem = siyah (gizler), beyaz harf × düzlem
 * = düzlem (gösterir). Alttaki `screen` videoyu turuncu tabana EKLER,
 * harfin içi ASLA turuncudan koyu olamaz (#E2541F/#000 = 5,52:1).
 *
 * ÜÇ HÂLDE DE EKSİKSİZ:
 *   (a) JS yok            → kelime durağan kareyle / gradyanla DOLU.
 *   (b) az hareket isteği → perde animasyonu yok, aynı kompozisyon.
 *   (c) saveData / 2g     → düzlem hiç basılmaz, harfler marka
 *                           gradyanıyla dolar (0 bayt).
 *
 * KURALLAR (bozulmaz):
 *   - Sayfada EN ÇOK BİR kadraj, TEK satır, TEK kelime.
 *   - Harfin içine YALNIZ yatay klip girer (ortak.ts → kadrajKlibi).
 *   - Satır yüksekliği CSS uzunluğundan gelir, yazı tipinden DEĞİL → CLS 0.
 *   - Kelime kolonundan geniş olamaz: punto harf sayısına göre
 *     sınırlanır (sayfa.css → --vk-boy), taşan parça knockout dışında
 *     kalır ve GÖRÜNMEZ.
 */
import { medyaYolu } from '@/lib/site-icerik';
import { KADRAJ_DOLGU_AVIF, KADRAJ_DOLGU_WEBP } from './ortak';

type Props = {
  /** Tek sözcük. Doğal yazımda verilir; büyük harfe CSS çevirir (lang=tr). */
  kelime: string;
  /** Harflerin içinden akacak YATAY klip. Yoksa marka gradyanı kalır. */
  klip?: string;
  /** "Aynı anda tek video" denetleyicisinde öncelik (küçük sayı önce). */
  sira?: number;
  /** Sayfanın başlık sırası bozulmasın: varsayılan <p>. */
  etiket?: 'p' | 'h1' | 'h2';
  id?: string;
};

export default function Duvar({ kelime, klip, sira = 0, etiket: Etiket = 'p', id }: Props) {
  // Punto genişlik kapısı: en uzun kelime bile kolonu aşmaz.
  const harf = Math.max(kelime.length, 3);

  return (
    <div
      className="af-vk-oyuk"
      style={{ ['--vk-harf' as string]: harf } as React.CSSProperties}
    >
      {/* --- blend yığını: taban → düzlem → maske --- */}
      <div className="af-vk-duvar" aria-hidden="true">
        <span className="af-vk-taban" />

        {klip ? (
          <div
            className="af-vk-plan"
            data-video=""
            data-video-kaynak={medyaYolu(klip)}
            data-video-sira={sira}
            data-video-bekle="yukleme"
          >
            {/* Durağan kare KALICI: video onun ÜSTÜNE geçer. Video hiç
                gelmezse, play() reddedilirse ya da ağ kötüyse duvar
                bozulmaz — hep dolu görünür. 24 KB AVIF, LCP'yi geriye
                itmemesi için `eager` + varsayılan öncelik. */}
            <picture>
              <source srcSet={medyaYolu(KADRAJ_DOLGU_AVIF)} type="image/avif" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={medyaYolu(KADRAJ_DOLGU_WEBP)}
                alt=""
                width={1024}
                height={576}
                decoding="async"
              />
            </picture>
            {/* Ses yok, kontrol yok, künye yok: başlığın içine altyazı
                girmez. `src` yokken öge saydam boyar, altındaki durağan
                kare görünür; `src` gelince CSS `[src]` ile yumuşak açar. */}
            <video
              muted
              playsInline
              loop
              preload="none"
              tabIndex={-1}
              aria-hidden="true"
              disablePictureInPicture
            />
          </div>
        ) : null}

        {/* Knockout kopyası — gerçek metin AŞAĞIDA. Bu katman yalnız
            hangi pikselin açık olduğunu söyler. */}
        <div className="af-vk-maske">
          <p className="af-vk-satir af-vk-satir--dolu">
            <span className="af-vk-i">{kelime}</span>
          </p>
        </div>
      </div>

      {/* GERÇEK metin: seçilebilir, SSR'da basılı, ekran okuyucu bunu
          okur. `color: transparent` — görünür olan maskenin açtığı
          düzlemdir. `position: relative; z-index: 1` ZORUNLU (duvar
          `isolation: isolate` ile yığın bağlamı yaratıyor). */}
      <Etiket className="af-vk-satir af-vk-yazi" id={id}>
        <span className="af-vk-i">{kelime}</span>
      </Etiket>
    </div>
  );
}
