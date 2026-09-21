'use client';

import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { DURUMLAR } from '@/lib/adaylar';
import { telefonCoz } from '@/lib/telefon';
import { whatsappGonder, instagramGonder, mesajMetni, type Kanal } from './WhatsAppMenu';
import type { AdayRow, Eylemler, Kisi, Kullanici, Marka, Sablon } from './tipler';

function Bekle({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <span className={pending ? 'alan-bekliyor' : undefined}>{children}</span>;
}

function Gizli({ marka, idler, alan }: { marka: string; idler: string; alan: string }) {
  return (
    <>
      <input type="hidden" name="marka" value={marka} />
      <input type="hidden" name="idler" value={idler} />
      <input type="hidden" name="alan" value={alan} />
    </>
  );
}

/** Seçim kutusu değişince formu gönderir. (Render içinde tanımlanırsa her
 *  çizimde yeniden kurulur ve seçim kaybolur — o yüzden modül düzeyinde.) */
function SecimFormu({
  action, marka, idler, alan, children,
}: {
  action: (fd: FormData) => Promise<void>;
  marka: string; idler: string; alan: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form ref={ref} action={action}
          onChange={(e) => {
            if ((e.target as unknown as { value: string }).value !== '') ref.current?.requestSubmit();
          }}>
      <Gizli marka={marka} idler={idler} alan={alan} />
      <Bekle>{children}</Bekle>
    </form>
  );
}

/**
 * Seçilen adaylara toplu işlem çubuğu. "Tekrardan kişileri seçebileyim"
 * isteği: bir süzgeçle (ör. notta "ARANACAK" geçenler) listeyi daralt,
 * hepsini seç, tek dokunuşla "Tekrar aranacak" yap.
 */
export default function TopluCubuk({
  secili, marka, personel, sablonlar, kullanici, eylemler, temizle, waBaslat,
}: {
  secili: number[];
  marka: Marka;
  personel: Kisi[];
  sablonlar: Sablon[];
  kullanici: Kullanici;
  eylemler: Pick<Eylemler, 'topluGuncelle' | 'topluSil'>;
  temizle: () => void;
  waBaslat: (sablon: Sablon | null, kanal: Kanal) => void;
}) {
  const idler = secili.join(',');

  /** Form gönderildikten sonra seçimi temizleyen sarmalayıcı. */
  const toplu = async (fd: FormData) => {
    await eylemler.topluGuncelle(fd);
    temizle();
  };
  const sil = async (fd: FormData) => {
    await eylemler.topluSil(fd);
    temizle();
  };

  return (
    <div className="toplu-cubuk" role="region" aria-label="Toplu işlem">
      <span className="toplu-sayi"><b>{secili.length}</b> seçili</span>

      <form action={toplu}>
        <Gizli marka={marka.yol} idler={idler} alan="durum" />
        <input type="hidden" name="deger" value="tekrar_aranacak" />
        <Bekle><button type="submit" className="btn btn-sm btn-primary">↻ Tekrar aranacak</button></Bekle>
      </form>

      <SecimFormu action={toplu} marka={marka.yol} idler={idler} alan="durum">
        <select name="deger" defaultValue="" className="toplu-secim" aria-label="Durum değiştir">
          <option value="" disabled>Durum…</option>
          {DURUMLAR.map((d) => <option key={d.anahtar} value={d.anahtar}>{d.ad}</option>)}
        </select>
      </SecimFormu>

      <SecimFormu action={toplu} marka={marka.yol} idler={idler} alan="sorumlu">
        <select name="deger" defaultValue="" className="toplu-secim" aria-label="Kime ait">
          <option value="" disabled>Kime ait…</option>
          {personel.map((p) => <option key={p.id} value={p.id}>{p.display_name}</option>)}
        </select>
      </SecimFormu>

      {/* Tarih kendiliğinden gönderilmiyor: elle yazarken tarayıcı her yıl
          hanesinde ara değer (0002-09-21) yolluyor ve hepsine yazılıyordu. */}
      <form action={toplu} className="toplu-tarih">
        <Gizli marka={marka.yol} idler={idler} alan="tarih" />
        <input type="date" name="deger" className="toplu-secim" aria-label="Arama tarihi" required
               title="Seçilenlerin arama tarihini ayarla" />
        <Bekle><button type="submit" className="btn btn-sm btn-ghost">Tarihi uygula</button></Bekle>
      </form>

      {sablonlar.length > 0 && (['whatsapp', 'instagram'] as const).map((k) => (
        <select key={k} className="toplu-secim wa-secim" defaultValue=""
                aria-label={k === 'instagram' ? 'Instagram ile sırayla yaz' : 'WhatsApp ile sırayla yaz'}
                onChange={(e) => {
                  const v = e.target.value;
                  e.target.value = '';
                  if (v === 'bos') waBaslat(null, k);
                  else { const s = sablonlar.find((x) => String(x.id) === v); if (s) waBaslat(s, k); }
                }}>
          <option value="" disabled>{k === 'instagram' ? '📸 Instagram…' : '💬 WhatsApp…'}</option>
          {sablonlar.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          <option value="bos">{k === 'instagram' ? 'Sadece sohbeti aç' : 'Boş mesaj'}</option>
        </select>
      ))}

      {kullanici.yonetici && (
        <form action={sil} onSubmit={(e) => {
          if (!window.confirm(`${secili.length} aday kalıcı olarak silinsin mi? Arama geçmişleri de gider.`)) e.preventDefault();
        }}>
          <Gizli marka={marka.yol} idler={idler} alan="sil" />
          <Bekle><button type="submit" className="btn btn-sm btn-ghost toplu-sil">Sil</button></Bekle>
        </form>
      )}

      <button type="button" className="btn btn-sm btn-ghost" onClick={temizle}>✕ Seçimi kaldır</button>
    </div>
  );
}

/**
 * Seçilenlere sırayla WhatsApp ya da Instagram: tarayıcı aynı anda birden
 * çok sekme açmaya izin vermediği için her kişi için bir dokunuş. WhatsApp'ı
 * olmayan numaralar (sabit hat) / Instagram'ı girilmemiş adaylar atlanır.
 */
export function WaKuyruk({
  adaylar, sablon, kanal = 'whatsapp', kullanici, marka, kaydet, bitir,
}: {
  /** Kuyruk başladığı andaki satırlar. Canlı listeden okunmuyor: mesaj atılan
   *  aday süzgeçten düşünce sıra kayıyor ve her ikinci kişi atlanıyordu. */
  adaylar: AdayRow[];
  sablon: Sablon | null;
  kanal?: Kanal;
  kullanici: Kullanici;
  marka: Marka;
  kaydet: Eylemler['mesajKaydet'];
  bitir: () => void;
}) {
  const [biten, setBiten] = useState<Set<number>>(new Set());
  const [gonderilen, setGonderilen] = useState(0);

  const ig = kanal === 'instagram';
  const uygun = adaylar.filter((a) => (ig ? Boolean(a.instagram) : Boolean(telefonCoz(a.phone_raw).whatsapp)));
  const atlanan = adaylar.length - uygun.length;
  const simdiki = uygun.find((a) => !biten.has(a.id)) ?? null;
  const sira = uygun.findIndex((a) => a.id === simdiki?.id);

  if (!simdiki) {
    return (
      <div className="wa-kuyruk">
        <div className="wa-kuyruk-ust">
          <strong>Bitti — {gonderilen} mesaj açıldı</strong>
          {atlanan > 0 && (
            <span className="cell-sub">
              {' · '}{atlanan} kişi atlandı ({ig ? 'Instagram adı girilmemiş' : 'WhatsApp yok: sabit hat / numara yok'})
            </span>
          )}
        </div>
        <button type="button" className="btn btn-sm btn-primary" onClick={bitir}>Kapat</button>
      </div>
    );
  }

  const ilerle = () => {
    if (simdiki) setBiten((o) => new Set(o).add(simdiki.id));
  };

  return (
    <div className="wa-kuyruk" role="dialog" aria-label={ig ? 'Instagram kuyruğu' : 'WhatsApp kuyruğu'}>
      <div className="wa-kuyruk-ust">
        <span className="kuyruk-sayac">
          {ig ? 'Instagram' : 'WhatsApp'} · {sira + 1} / {uygun.length}{sablon ? ` · ${sablon.title}` : ''}
        </span>
        <strong>{simdiki.name}{ig && <span className="cell-sub"> · @{simdiki.instagram}</span>}</strong>
        <div className="wa-onizleme">{mesajMetni(sablon, simdiki, kullanici.ad, marka) || '(boş mesaj)'}</div>
      </div>
      <div className="wa-kuyruk-eylem">
        <button type="button" className="btn btn-success"
                onClick={() => {
                  const gitti = ig
                    ? instagramGonder(simdiki, sablon, kullanici.ad, marka, kaydet)
                    : whatsappGonder(simdiki, sablon, kullanici.ad, marka, kaydet);
                  if (gitti) setGonderilen((v) => v + 1);
                  ilerle();
                }}>
          {ig ? 'Kopyala ve Instagram’ı aç' : 'WhatsApp’ı aç'}
        </button>
        <button type="button" className="btn btn-sm btn-secondary" onClick={ilerle}>Atla</button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={bitir}>Bitir</button>
      </div>
    </div>
  );
}
