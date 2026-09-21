'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import ConfirmButton from '@/components/ConfirmButton';
import { sablonDoldur, DURUM_HARITA } from '@/lib/adaylar';

type SablonKaydi = {
  id: number; title: string; body: string; sets_status: string | null; yazan?: string | null;
};

function Gonder({ yeni }: { yeni: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-sm btn-primary" type="submit" disabled={pending}>
      {pending ? 'Kaydediliyor…' : yeni ? 'Şablonu ekle' : 'Kaydet'}
    </button>
  );
}

const YER_TUTUCULAR = ['{ad}', '{yetkili}', '{gonderen}', '{marka}'];

/** Tek şablon kartı: solda metin, sağda bir adayla doldurulmuş ön izleme. */
export default function SablonDuzenleyici({
  sablon, marka, ornek, gonderen, silebilir, kaydet, sil,
}: {
  sablon: SablonKaydi | null;
  marka: { yol: string; ad: string };
  ornek: { name: string; contact_person: string | null };
  gonderen: string;
  silebilir: boolean;
  kaydet: (prev: string | null, fd: FormData) => Promise<string | null>;
  sil: (fd: FormData) => Promise<void>;
}) {
  const yeni = sablon === null;
  const [sonuc, formAction] = useActionState(kaydet, null);
  const [acik, setAcik] = useState(!yeni);
  const [govde, setGovde] = useState(sablon?.body ?? '');
  const alan = useRef<HTMLTextAreaElement>(null);
  const ok = sonuc?.startsWith('ok|') ?? false;

  // Yeni şablon eklendiyse formu boşalt ve kapat.
  useEffect(() => {
    if (ok && yeni) { setGovde(''); setAcik(false); }
  }, [ok, sonuc, yeni]);

  const ekle = (yt: string) => {
    const t = alan.current;
    if (!t) { setGovde((g) => g + yt); return; }
    const bas = t.selectionStart ?? govde.length;
    const son = t.selectionEnd ?? govde.length;
    const y = govde.slice(0, bas) + yt + govde.slice(son);
    setGovde(y);
    requestAnimationFrame(() => { t.focus(); t.setSelectionRange(bas + yt.length, bas + yt.length); });
  };

  if (yeni && !acik) {
    return (
      <button type="button" className="acilir-baslik sablon-yeni" onClick={() => setAcik(true)}>
        + Yeni şablon
      </button>
    );
  }

  const onizleme = sablonDoldur(govde || ' ', {
    ad: ornek.name, yetkili: ornek.contact_person, gonderen, marka: marka.ad,
  });

  return (
    <div className="sablon-kart">
      <form action={formAction} className="sablon-form">
        <input type="hidden" name="marka" value={marka.yol} />
        {sablon && <input type="hidden" name="id" value={sablon.id} />}
        {ok && !yeni && <div className="alert alert-success">Kaydedildi.</div>}
        {sonuc && !ok && <div className="alert alert-danger">{sonuc}</div>}

        <div className="sablon-ust">
          <input name="title" className="form-control sablon-baslik" required maxLength={60}
                 defaultValue={sablon?.title ?? ''} placeholder="Şablon adı (ör. Tanışma)" aria-label="Şablon adı" />
          <select name="sets_status" className="form-control" defaultValue={sablon?.sets_status ?? ''}
                  aria-label="Gönderilince durum" title="Mesaj gönderilince aday bu duruma geçer (henüz konuşulmamışsa)">
            <option value="">Durum değişmesin</option>
            <option value="detay_iletildi">→ {DURUM_HARITA.detay_iletildi.ad}</option>
            <option value="tekrar_aranacak">→ {DURUM_HARITA.tekrar_aranacak.ad}</option>
            <option value="dusunuyor">→ {DURUM_HARITA.dusunuyor.ad}</option>
          </select>
        </div>

        <div className="sablon-govde">
          <div>
            <textarea ref={alan} name="body" className="form-control" rows={7} maxLength={2000} required
                      value={govde} onChange={(e) => setGovde(e.target.value)}
                      placeholder="Merhaba {yetkili}, ben {gonderen}…" aria-label="Mesaj metni" />
            <div className="yer-tutucular">
              <span className="cell-sub">Ekle:</span>
              {YER_TUTUCULAR.map((y) => (
                <button key={y} type="button" className="konu" onClick={() => ekle(y)}>{y}</button>
              ))}
            </div>
          </div>
          <div className="wa-balon-kutu" aria-label="Ön izleme">
            <div className="cell-sub" style={{ marginBottom: 6 }}>
              Ön izleme — {ornek.name}
            </div>
            <div className="wa-balon">{onizleme}</div>
            {/\[[^\]]+\]/.test(govde) && (
              <div className="uyari-mini" style={{ marginTop: 6 }}>
                Köşeli parantezli yeri doldurmayı unutma.
              </div>
            )}
          </div>
        </div>

        <div className="sablon-eylem">
          {sablon?.yazan && <span className="cell-sub">Yazan: {sablon.yazan}</span>}
          <span style={{ flex: 1 }} />
          {yeni && <button type="button" className="btn btn-sm btn-ghost" onClick={() => setAcik(false)}>Vazgeç</button>}
          <Gonder yeni={yeni} />
        </div>
      </form>
      {sablon && silebilir && (
        <form action={sil} className="sablon-sil">
          <input type="hidden" name="marka" value={marka.yol} />
          <input type="hidden" name="id" value={sablon.id} />
          <ConfirmButton className="btn btn-sm btn-ghost" soru={`"${sablon.title}" şablonu silinsin mi?`} title="Sil">
            Sil
          </ConfirmButton>
        </form>
      )}
    </div>
  );
}
