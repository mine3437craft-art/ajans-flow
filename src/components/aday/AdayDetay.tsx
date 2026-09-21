'use client';

import { startTransition, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import ConfirmButton from '@/components/ConfirmButton';
import {
  DURUM_HARITA, EK_ALANLAR, UC_DURUMLAR, ekAlanDegeri, gecenSure,
} from '@/lib/adaylar';
import { formVerisi, type AdayRow, type Eylemler, type Kullanici, type Marka, type Olay } from './tipler';

function Gonder({ etiket }: { etiket: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-sm btn-primary" type="submit" disabled={pending}>
      {pending ? 'Kaydediliyor…' : etiket}
    </button>
  );
}

const TUR_ETIKET: Record<string, string> = {
  arama: '📞 Arama', mesaj: '💬 WhatsApp', not: '📝 Not', durum: '✎ Güncelleme',
};

/** Geçmişteki tek olay; notu yazan kişi ya da yönetici düzenleyip silebilir. */
function OlaySatiri({
  olay, kullanici, notDuzenle, notSil,
}: {
  olay: Olay;
  kullanici: Kullanici;
  notDuzenle: Eylemler['notDuzenle'];
  notSil: Eylemler['notSil'];
}) {
  const [duzenle, setDuzenle] = useState(false);
  const [taslak, setTaslak] = useState(olay.note ?? '');
  const [gosterilen, setGosterilen] = useState(olay.note);
  const yetkili = kullanici.yonetici || olay.user_id === kullanici.id;
  // Sistem notları (şablon adı, alan etiketi) düzenlenmez.
  const insanNotu = olay.kind === 'not' || olay.kind === 'arama';

  const kaydet = () => {
    const yeni = taslak.trim();
    setDuzenle(false);
    if (yeni === (gosterilen ?? '')) return;
    setGosterilen(yeni || null);
    startTransition(async () => { await notDuzenle(formVerisi({ olay_id: olay.id, note: yeni })); });
  };

  const durumAd = olay.status_after ? DURUM_HARITA[olay.status_after]?.ad : null;

  return (
    <div className="gecmis-satir">
      <div className="gecmis-ust">
        <strong>{olay.kisi ?? '—'}</strong>
        <span className="badge b-muted">{TUR_ETIKET[olay.kind] ?? olay.kind}</span>
        {durumAd && olay.status_after !== olay.status_before && (
          <span className={`badge ${DURUM_HARITA[olay.status_after!]?.rozet ?? 'b-muted'}`}>→ {durumAd}</span>
        )}
        <span className="cell-sub" style={{ marginLeft: 'auto' }}>{gecenSure(olay.created_at)}</span>
      </div>
      {duzenle ? (
        <div className="not-duzenle" style={{ marginTop: 6 }}>
          <textarea className="form-control" rows={2} maxLength={1000} value={taslak} autoFocus
                    onChange={(e) => setTaslak(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') { e.preventDefault(); setDuzenle(false); }
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); kaydet(); }
                    }} />
          <div className="not-duzenle-eylem">
            <button type="button" className="btn btn-sm btn-primary" onClick={kaydet}>Kaydet</button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => setDuzenle(false)}>Vazgeç</button>
          </div>
        </div>
      ) : gosterilen ? (
        <div className="gecmis-not">
          {gosterilen}
          {olay.edited_at && (
            <span className="cell-sub"> · düzenlendi{olay.duzenleyen ? ` (${olay.duzenleyen})` : ''}</span>
          )}
          {yetkili && insanNotu && (
            <span className="gecmis-not-eylem">
              <button type="button" className="btn-link" onClick={() => { setTaslak(gosterilen); setDuzenle(true); }}>
                düzenle
              </button>
              <button type="button" className="btn-link tehlike"
                      onClick={() => {
                        if (!window.confirm('Bu not silinsin mi?')) return;
                        setGosterilen(null);
                        startTransition(async () => { await notSil(formVerisi({ olay_id: olay.id })); });
                      }}>
                sil
              </button>
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
}

/** Açılan satır: geçmiş (düzenlenebilir notlarla) ve bilgi formu. */
export default function AdayDetay({
  aday, gecmis, marka, kullanici, eylemler,
}: {
  aday: AdayRow;
  gecmis: Olay[];
  marka: Marka;
  kullanici: Kullanici;
  eylemler: Pick<Eylemler, 'notEkle' | 'notDuzenle' | 'notSil' | 'adayGuncelle' | 'adaySil'>;
}) {
  const [sonuc, formAction] = useActionState(eylemler.adayGuncelle, null);
  const ok = sonuc?.startsWith('ok|') ?? false;

  return (
    <div className="aday-detay">
      <div className="grid-2">
        <div>
          <div className="rehber-blok-baslik">Geçmiş</div>
          <form action={eylemler.notEkle} className="not-ekle-satir" style={{ marginBottom: 10 }}>
            <input type="hidden" name="id" value={aday.id} />
            <input name="note" className="form-control" maxLength={500} required
                   placeholder="Not ekle… (durumu değiştirmez)" />
            <Gonder etiket="Ekle" />
          </form>
          {gecmis.length === 0 ? (
            <p className="cell-sub">Henüz kayıt yok.</p>
          ) : (
            <div className="aday-gecmis">
              {gecmis.map((g) => (
                <OlaySatiri key={`${g.id}:${g.edited_at ?? ''}:${g.note ?? ''}`} olay={g} kullanici={kullanici}
                            notDuzenle={eylemler.notDuzenle} notSil={eylemler.notSil} />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="rehber-blok-baslik">Bilgiler</div>
          <form action={formAction}>
            <input type="hidden" name="id" value={aday.id} />
            {ok && <div className="alert alert-success">Kaydedildi.</div>}
            {sonuc && !ok && <div className="alert alert-danger">{sonuc}</div>}
            <div className="form-grid">
              <div className="form-group full">
                <label htmlFor={`d-ad-${aday.id}`}>Ad / firma *</label>
                <input id={`d-ad-${aday.id}`} name="name" className="form-control" required
                       maxLength={150} defaultValue={aday.name} />
              </div>
              <div className="form-group">
                <label htmlFor={`d-tel-${aday.id}`}>Telefon</label>
                <input id={`d-tel-${aday.id}`} name="phone" className="form-control" inputMode="tel"
                       defaultValue={aday.phone_raw ?? ''} />
              </div>
              <div className="form-group">
                <label htmlFor={`d-yet-${aday.id}`}>Yetkili</label>
                <input id={`d-yet-${aday.id}`} name="contact_person" className="form-control"
                       maxLength={120} defaultValue={aday.contact_person ?? ''}
                       placeholder="Mesajda &ldquo;Merhaba …&rdquo; diye geçer" />
              </div>
              <div className="form-group">
                <label htmlFor={`d-seh-${aday.id}`}>Şehir / ilçe</label>
                <input id={`d-seh-${aday.id}`} name="city" className="form-control"
                       maxLength={80} defaultValue={aday.city ?? ''} />
              </div>
              <div className="form-group">
                <label htmlFor={`d-kay-${aday.id}`}>Kaynak</label>
                <input id={`d-kay-${aday.id}`} name="source" className="form-control"
                       maxLength={120} defaultValue={aday.source ?? ''} />
              </div>
              <div className="form-group full">
                <label htmlFor={`d-lnk-${aday.id}`}>Instagram / web</label>
                <input id={`d-lnk-${aday.id}`} name="link" className="form-control"
                       maxLength={300} defaultValue={aday.link ?? ''} />
              </div>
              {marka.ekAlanlar.map((anahtar) => {
                const alan = EK_ALANLAR[anahtar];
                return (
                  <div className="form-group" key={anahtar}>
                    <label htmlFor={`d-${anahtar}-${aday.id}`}>{alan.simge} {alan.soru}</label>
                    <select id={`d-${anahtar}-${aday.id}`} name={alan.sutun} className="form-control"
                            defaultValue={ekAlanDegeri(aday, anahtar)}>
                      {UC_DURUMLAR.map((v) => <option key={v} value={v}>{alan.etiket[v].uzun}</option>)}
                    </select>
                  </div>
                );
              })}
            </div>
            <div className="form-actions"><Gonder etiket="Bilgileri kaydet" /></div>
          </form>
          {kullanici.yonetici && (
            <form action={eylemler.adaySil} style={{ marginTop: 10 }}>
              <input type="hidden" name="id" value={aday.id} />
              <ConfirmButton className="btn btn-sm btn-danger"
                             soru={`"${aday.name}" adayı kalıcı olarak silinsin mi? Geçmişi de gider.`}
                             title="Sil">
                Adayı sil
              </ConfirmButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
