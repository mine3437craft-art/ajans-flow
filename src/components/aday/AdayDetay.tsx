'use client';

import { startTransition, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import ConfirmButton from '@/components/ConfirmButton';
import {
  DURUM_HARITA, EK_ALANLAR, UC_DURUMLAR, EKSIKLER, SEKTORLER, ekAlanDegeri, gecenSure,
} from '@/lib/adaylar';
import { linkKopyala } from './acilir';
import { sunumAdresi, sunumYolu } from './WhatsAppMenu';
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
  arama: '📞 Arama', mesaj: '💬 Mesaj', not: '📝 Not', durum: '✎ Güncelleme',
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
        <span className="badge b-muted">
          {olay.kind === 'mesaj' && olay.channel === 'instagram' ? '📸 Instagram'
            : olay.kind === 'mesaj' ? '💬 WhatsApp' : TUR_ETIKET[olay.kind] ?? olay.kind}
        </span>
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
  const sunum = marka.analiz ? sunumYolu(aday) : null;

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
                <input key={`ad:${aday.name}`} id={`d-ad-${aday.id}`} name="name" className="form-control" required
                       maxLength={150} defaultValue={aday.name} />
              </div>
              <div className="form-group">
                <label htmlFor={`d-tel-${aday.id}`}>Telefon</label>
                <input key={`tel:${aday.phone_raw}`} id={`d-tel-${aday.id}`} name="phone" className="form-control" inputMode="tel"
                       defaultValue={aday.phone_raw ?? ''} />
              </div>
              <div className="form-group">
                <label htmlFor={`d-yet-${aday.id}`}>Yetkili</label>
                <input key={`yet:${aday.contact_person}`} id={`d-yet-${aday.id}`} name="contact_person" className="form-control"
                       maxLength={120} defaultValue={aday.contact_person ?? ''}
                       placeholder="Mesajda &ldquo;Merhaba …&rdquo; diye geçer" />
              </div>
              <div className="form-group">
                <label htmlFor={`d-seh-${aday.id}`}>Şehir / ilçe</label>
                <input key={`seh:${aday.city}`} id={`d-seh-${aday.id}`} name="city" className="form-control"
                       maxLength={80} defaultValue={aday.city ?? ''} />
              </div>
              <div className="form-group">
                <label htmlFor={`d-kay-${aday.id}`}>Kaynak</label>
                <input key={`kay:${aday.source}`} id={`d-kay-${aday.id}`} name="source" className="form-control"
                       maxLength={120} defaultValue={aday.source ?? ''} />
              </div>
              <div className="form-group">
                <label htmlFor={`d-ig-${aday.id}`}>Instagram</label>
                <input key={`ig:${aday.instagram}`} id={`d-ig-${aday.id}`} name="instagram" className="form-control" maxLength={120}
                       autoCapitalize="none" autoCorrect="off" spellCheck={false}
                       defaultValue={aday.instagram ? `@${aday.instagram}` : ''}
                       placeholder="@kullaniciadi ya da profil linki" />
              </div>
              <div className="form-group">
                <label htmlFor={`d-tk-${aday.id}`}>Takipçi sayısı</label>
                <input key={`tk:${aday.ig_followers}`} id={`d-tk-${aday.id}`} name="ig_followers"
                       className="form-control" autoCapitalize="none" maxLength={24}
                       defaultValue={aday.ig_followers ?? ''} placeholder="ör. 850, 1.2k, 12,5 B" />
              </div>
              <div className="form-group full">
                <label htmlFor={`d-lnk-${aday.id}`}>Web sitesi / diğer bağlantı</label>
                <input key={`lnk:${aday.link}`} id={`d-lnk-${aday.id}`} name="link" className="form-control"
                       maxLength={300} defaultValue={aday.link ?? ''} />
              </div>
              {marka.analiz && (
                <>
                  <input type="hidden" name="analiz_formu" value="1" />
                  <div className="form-group full">
                    <label htmlFor={`d-sek-${aday.id}`}>Sektör</label>
                    <select key={`sek:${aday.sector}`} id={`d-sek-${aday.id}`} name="sector" className="form-control"
                            defaultValue={aday.sector ?? ''}>
                      <option value="">— Seçilmedi —</option>
                      {SEKTORLER.map((s) => <option key={s.anahtar} value={s.anahtar}>{s.simge} {s.ad}</option>)}
                    </select>
                  </div>
                  {/* Tablodan eksik işaretlenince yalnızca bu bölüm yenilenir; eksik_once
                      ile sunucu yalnızca burada değiştirilenleri uygular. */}
                  <fieldset key={`eksik:${aday.gaps.join(',')}`} className="form-group full eksik-alani">
                    <legend>Eksikler <span className="cell-sub">— müşteriye gönderilen sunumda öneri olarak görünür</span></legend>
                    {aday.gaps.map((k) => <input key={k} type="hidden" name="eksik_once" value={k} />)}
                    <div className="eksik-secim">
                      {/* Web sitesi yokluğu aşağıdaki "Web sitesi var mı?" sorusundan */}
                      {EKSIKLER.filter((e) => !e.sanal).map((e) => (
                        <label key={e.anahtar} className="eksik-dugme">
                          <input type="checkbox" name="eksik" value={e.anahtar}
                                 defaultChecked={aday.gaps.includes(e.anahtar)} />
                          <span aria-hidden>{e.simge}</span> {e.ad}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </>
              )}
              {marka.ekAlanlar.map((anahtar) => {
                const alan = EK_ALANLAR[anahtar];
                return (
                  <div className="form-group" key={anahtar}>
                    <label htmlFor={`d-${anahtar}-${aday.id}`}>{alan.simge} {alan.soru}</label>
                    <select key={`${anahtar}:${ekAlanDegeri(aday, anahtar)}`}
                            id={`d-${anahtar}-${aday.id}`} name={alan.sutun} className="form-control"
                            defaultValue={ekAlanDegeri(aday, anahtar)}>
                      {UC_DURUMLAR.map((v) => <option key={v} value={v}>{alan.etiket[v].uzun}</option>)}
                    </select>
                  </div>
                );
              })}
            </div>
            <div className="form-actions"><Gonder etiket="Bilgileri kaydet" /></div>
          </form>
          {sunum && (
            <div className="analiz-sunum" style={{ marginTop: 12 }}>
              <div>
                <strong>Kişisel sunum linki</strong>
                <div className="cell-sub">
                  {aday.site_views > 0
                    ? `👀 ${aday.site_views} kez açıldı · son ${gecenSure(aday.site_last_view_at)}`
                    : 'Henüz açılmadı. Mesaj şablonundaki {site} bu linki koyar.'}
                </div>
              </div>
              <div className="analiz-sunum-eylem">
                <button type="button" className="btn btn-sm btn-secondary"
                        onClick={() => linkKopyala(sunumAdresi(aday) ?? sunum)}>
                  Kopyala
                </button>
                <a className="btn btn-sm btn-ghost" href={sunum} target="_blank" rel="noopener noreferrer">Aç ↗</a>
              </div>
            </div>
          )}
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
