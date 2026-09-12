'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Icon from './Icon';
import ConfirmButton from './ConfirmButton';
import Vurgu from './Vurgu';
import {
  DURUMLAR, DURUM_HARITA, SONUCLAR, NOT_KALIPLARI, EK_ALANLAR, UC_DURUMLAR,
  sonrakiUcDurum, tarihEtiketi, gecenSure, type UcDurum, type EkAlanAnahtari,
} from '@/lib/adaylar';
import { telefonCoz } from '@/lib/telefon';
import { vurguDuzenleri, katlanmisKelimeler } from '@/lib/arama';

export type AdayRow = {
  id: number; name: string; contact_person: string | null; phone_raw: string | null;
  phone_norm: string | null; phone_kind: string; city: string | null; source: string | null;
  link: string | null; status: string; next_call_on: string | null; assigned_to: number | null;
  call_count: number; unreached_streak: number; last_call_at: string | null; last_note: string | null;
  has_website: UcDurum; worked_with_agency: UcDurum; created_at: string;
  sorumlu_ad: string | null; son_arayan: string | null;
  son_olay_id: number | null; son_olay_tur: string | null; son_olay_kisi: string | null;
  geri_alinabilir: boolean | null; baskasi_aradi: boolean | null; diger_listede: boolean | null;
};

type Olay = {
  id: number; kind: string; channel: string | null; status_before: string | null;
  status_after: string | null; next_call_on: string | null; note: string | null;
  created_at: string; kisi: string | null;
};

type Eylem = (fd: FormData) => Promise<void>;

const DEPO = 'af-aday-arama';

function Kaydediliyor({ etiket }: { etiket: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? 'Kaydediliyor…' : etiket}
    </button>
  );
}

/** Değiştirilince kendiliğinden gönderilen tek alanlık form. */
function AlanFormu({
  action, id, alan, children,
}: {
  action: Eylem; id: number; alan: string; children: React.ReactNode;
}) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      action={action}
      onChange={(e) => {
        if ((e.target as HTMLElement).tagName !== 'BUTTON') ref.current?.requestSubmit();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="alan" value={alan} />
      {children}
    </form>
  );
}

export default function AdayListesi({
  satirlar, marka, personel, kullaniciId, isAdmin, arama, bugunTarih,
  acikSatir, baslangicSonuc, gecmis, adres,
  alanGuncelle, sonucKaydet, notEkle, adaySil, adayGuncelle, geriAl,
}: {
  satirlar: AdayRow[];
  marka: { yol: string; ad: string; ekAlanlar: EkAlanAnahtari[] };
  personel: Array<{ id: number; display_name: string }>;
  kullaniciId: number;
  isAdmin: boolean;
  arama: string;
  bugunTarih: string;
  acikSatir: number | null;
  /** ?sonuc=<id> ile gelindiyse o adayın sonuç ekranı açık başlar. */
  baslangicSonuc: number | null;
  gecmis: Olay[];
  adres: string;
  alanGuncelle: Eylem;
  sonucKaydet: Eylem;
  notEkle: Eylem;
  adaySil: Eylem;
  adayGuncelle: (prev: string | null, fd: FormData) => Promise<string | null>;
  geriAl: Eylem;
}) {
  const [sonucId, setSonucId] = useState<number | null>(baslangicSonuc);
  // Arama modu: sırayla aranacak adayların kimlikleri. Sonuç kaydedilince
  // ekran kapanmaz, sıradaki adaya geçer.
  const [kuyruk, setKuyruk] = useState<number[]>([]);
  const [kanal, setKanal] = useState<'telefon' | 'whatsapp'>('telefon');
  const [not, setNot] = useState('');
  const [tarihSecim, setTarihSecim] = useState('otomatik');
  const [elleTarih, setElleTarih] = useState('');
  const [web, setWeb] = useState<UcDurum | ''>('');
  const [ajans, setAjans] = useState<UcDurum | ''>('');

  const desenler = vurguDuzenleri(arama);
  const kelimeler = katlanmisKelimeler(arama);

  const sonucAc = (id: number, k: 'telefon' | 'whatsapp') => {
    setSonucId(id); setKanal(k); setNot(''); setTarihSecim('otomatik');
    setElleTarih(''); setWeb(''); setAjans('');
  };

  /**
   * Telefona basıp konuşup döndüğünde sonuç ekranı kendiliğinden açılır —
   * arama kaydetmek iki dokunuşa iner. Bazı iOS/uygulama içi tarayıcılarda
   * bu olay gelmeyebildiği için "Arandı" düğmesi her zaman duruyor.
   */
  useEffect(() => {
    const kontrol = () => {
      if (document.visibilityState !== 'visible') return;
      let ham: string | null = null;
      try { ham = sessionStorage.getItem(DEPO); } catch { return; }
      if (!ham) return;
      try { sessionStorage.removeItem(DEPO); } catch { /* yoksay */ }
      try {
        const v = JSON.parse(ham) as { id?: number; kanal?: string; t?: number };
        // 10 dakika: aramadan hemen sonra dönüşü yakalar, saatler sonra
        // sekmeye dönüldüğünde alakasız yerde açılmaz.
        if (!v.id || !v.t || Date.now() - v.t > 10 * 60 * 1000) return;
        if (!satirlar.some((s) => s.id === v.id)) return;
        sonucAc(v.id, v.kanal === 'whatsapp' ? 'whatsapp' : 'telefon');
      } catch { /* yoksay */ }
    };
    document.addEventListener('visibilitychange', kontrol);
    return () => document.removeEventListener('visibilitychange', kontrol);
  }, [satirlar]);

  const aramaIsaretle = (id: number, k: 'telefon' | 'whatsapp') => {
    try {
      sessionStorage.setItem(DEPO, JSON.stringify({ id, kanal: k, t: Date.now() }));
    } catch { /* gizli sekmede çalışmayabilir, sorun değil */ }
  };

  /** Bugün aranacaklar: tarihi gelmiş/geçmiş ya da hiç aranmamış, açık olanlar. */
  const bugunAranacak = satirlar.filter(
    (s) => DURUM_HARITA[s.status]?.acik
      && (s.status === 'aranmadi' || (s.next_call_on ?? '9999') <= bugunTarih),
  );

  const aramayaBasla = () => {
    const sira = bugunAranacak.map((s) => s.id);
    if (sira.length === 0) return;
    setKuyruk(sira);
    sonucAc(sira[0], 'telefon');
  };

  /** Sonuç kaydedildikten sonra: kuyrukta sıradaki adaya geç, yoksa kapat. */
  const sonrakiAday = (biten: number) => {
    const kalan = kuyruk.filter((id) => id !== biten);
    setKuyruk(kalan);
    const sonraki = kalan.find((id) => satirlar.some((s) => s.id === id));
    if (sonraki === undefined) { setSonucId(null); return; }
    sonucAc(sonraki, 'telefon');
  };

  const sonucSatiri = satirlar.find((s) => s.id === sonucId) ?? null;
  const kuyruktaMi = sonucSatiri !== null && kuyruk.includes(sonucSatiri.id);
  const kuyrukToplam = kuyruk.length;

  return (
    <>
      {bugunAranacak.length > 0 && (
        <div className="arama-modu-serit">
          <div>
            <strong>{bugunAranacak.length} aday aranacak</strong>
            <div className="cell-sub">
              Sırayla arar, sonucu girdikçe kendiliğinden sonrakine geçer.
            </div>
          </div>
          <button type="button" className="btn btn-primary" onClick={aramayaBasla}>
            📞 Aramaya başla
          </button>
        </div>
      )}

      <div className="table-wrap">
        <table className="aday-tablo">
          <thead>
            <tr>
              <th>Durum</th>
              <th>Ad / Firma</th>
              <th>Telefon</th>
              {marka.ekAlanlar.map((ek) => <th key={ek}>{EK_ALANLAR[ek].baslik}</th>)}
              <th>Tekrar Ara</th>
              <th>Son Arama</th>
              <th>Son Not</th>
              <th>Kime Ait</th>
              <th style={{ width: 1 }} />
            </tr>
          </thead>
          <tbody>
            {satirlar.map((s) => {
              const tel = telefonCoz(s.phone_raw);
              const tanim = DURUM_HARITA[s.status];
              const tarih = tarihEtiketi(s.next_call_on);
              const gecikti = tarih?.sinif === 'tarih-gecikti';
              const acik = acikSatir === s.id;
              return (
                <tr key={s.id} id={`aday-${s.id}`}
                    className={`${gecikti ? 'satir-gecikti' : tarih?.sinif === 'tarih-bugun' ? 'satir-bugun' : ''}${acik ? ' satir-acik' : ''}`}>
                  <td data-etiket="Durum">
                    <AlanFormu action={alanGuncelle} id={s.id} alan="durum">
                      <select key={s.status} name="deger" defaultValue={s.status} aria-label="Durum"
                              className={`durum-secim badge ${tanim?.rozet ?? 'b-muted'}`}>
                        {DURUMLAR.map((d) => <option key={d.anahtar} value={d.anahtar}>{d.ad}</option>)}
                      </select>
                    </AlanFormu>
                  </td>

                  <td data-etiket="Ad / Firma">
                    <a href={acik ? adres : `${adres}${adres.includes('?') ? '&' : '?'}ac=${s.id}`}
                       className="cell-title aday-ad">
                      <Vurgu metin={s.name} desenler={desenler} kelimeler={kelimeler} />
                    </a>
                    <div className="cell-sub">
                      {[s.contact_person, s.city, s.source].filter(Boolean).join(' · ') || '—'}
                      {s.link && (
                        <> · <a href={s.link.startsWith('http') ? s.link : `https://${s.link}`}
                                target="_blank" rel="noopener noreferrer">bağlantı</a></>
                      )}
                    </div>
                  </td>

                  <td data-etiket="Telefon">
                    {tel.gecerli ? (
                      <div className="aday-telefon">
                        <a href={tel.tel!} className="tel-bag" onClick={() => aramaIsaretle(s.id, 'telefon')}>
                          📞 {tel.gorunum}
                        </a>
                        {tel.whatsapp && (
                          <a href={tel.whatsapp} target="_blank" rel="noopener noreferrer"
                             className="wa-bag" title="WhatsApp"
                             onClick={() => aramaIsaretle(s.id, 'whatsapp')}>WA</a>
                        )}
                      </div>
                    ) : (
                      <span className="badge b-warning" title="Numara anlaşılamadı">
                        {s.phone_raw ? `${s.phone_raw} · kontrol et` : 'numara yok'}
                      </span>
                    )}
                    {s.diger_listede && <div className="cell-sub">diğer listede de var</div>}
                  </td>

                  {marka.ekAlanlar.map((ek) => {
                    const alan = EK_ALANLAR[ek];
                    const deger = (ek === 'web' ? s.has_website : s.worked_with_agency) as UcDurum;
                    const et = alan.etiket[deger];
                    return (
                      <td data-etiket={alan.baslik} key={ek}>
                        <form action={alanGuncelle}>
                          <input type="hidden" name="id" value={s.id} />
                          <input type="hidden" name="alan" value={ek} />
                          <input type="hidden" name="deger" value={sonrakiUcDurum(deger)} />
                          <button type="submit" className={`badge ${et.rozet} uc-durum`} title={`${et.uzun} — değiştirmek için tıkla`}>
                            {et.kisa}
                          </button>
                        </form>
                      </td>
                    );
                  })}

                  <td data-etiket="Tekrar Ara">
                    <AlanFormu action={alanGuncelle} id={s.id} alan="tarih">
                      <input key={s.next_call_on ?? 'bos'} type="date" name="deger"
                             defaultValue={s.next_call_on?.slice(0, 10) ?? ''}
                             className="tarih-secim" aria-label="Tekrar arama tarihi" />
                    </AlanFormu>
                    {tarih && <div className={`tarih-etiket ${tarih.sinif}`}>{tarih.metin}</div>}
                  </td>

                  <td data-etiket="Son Arama">
                    {s.last_call_at ? (
                      <>
                        <div>{gecenSure(s.last_call_at)}</div>
                        <div className="cell-sub">
                          {s.son_arayan ?? '—'} · {s.call_count}. arama
                        </div>
                        {s.unreached_streak >= 3 && (
                          <span className="badge b-warning">{s.unreached_streak} kez açmadı</span>
                        )}
                      </>
                    ) : <span className="cell-sub">hiç aranmadı</span>}
                    {s.baskasi_aradi && (
                      <div className="uyari-mini">{s.son_olay_kisi} az önce aradı</div>
                    )}
                  </td>

                  <td data-etiket="Son Not">
                    <div className="son-not">
                      {s.last_note
                        ? <Vurgu metin={s.last_note} desenler={desenler} kelimeler={kelimeler} />
                        : <span className="cell-sub">—</span>}
                    </div>
                  </td>

                  <td data-etiket="Kime Ait">
                    <AlanFormu action={alanGuncelle} id={s.id} alan="sorumlu">
                      <select key={s.assigned_to ?? 'bos'} name="deger" defaultValue={s.assigned_to ?? ''} className="sorumlu-secim"
                              aria-label="Kime ait">
                        <option value="">Atanmamış</option>
                        {personel.map((p) => <option key={p.id} value={p.id}>{p.display_name}</option>)}
                      </select>
                    </AlanFormu>
                  </td>

                  <td data-etiket="">
                    <div className="satir-eylem">
                      <button type="button" className="btn btn-sm btn-primary"
                              onClick={() => sonucAc(s.id, 'telefon')}>Arandı</button>
                      {s.geri_alinabilir && s.son_olay_id && (
                        <form action={geriAl}>
                          <input type="hidden" name="olay_id" value={s.son_olay_id} />
                          <button type="submit" className="btn btn-sm btn-ghost" title="Son kaydı geri al">
                            ↩ Geri al
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Açılan satırın geçmişi ve düzenleme formu */}
      {acikSatir !== null && (() => {
        const s = satirlar.find((x) => x.id === acikSatir);
        if (!s) return null;
        return (
          <div className="aday-detay">
            <div className="grid-2">
              <div>
                <div className="rehber-blok-baslik">Geçmiş</div>
                {gecmis.length === 0 ? (
                  <p className="cell-sub">Henüz kayıt yok.</p>
                ) : (
                  <div className="aday-gecmis">
                    {gecmis.map((g) => (
                      <div className="gecmis-satir" key={g.id}>
                        <div className="gecmis-ust">
                          <strong>{g.kisi ?? '—'}</strong>
                          <span className="cell-sub">{gecenSure(g.created_at)}</span>
                          {g.kind === 'arama' && (
                            <span className={`badge ${DURUM_HARITA[g.status_after ?? '']?.rozet ?? 'b-muted'}`}>
                              {g.channel === 'whatsapp' ? 'WhatsApp · ' : ''}
                              {DURUM_HARITA[g.status_after ?? '']?.ad ?? g.status_after}
                            </span>
                          )}
                          {g.kind === 'not' && <span className="badge b-muted">not</span>}
                          {g.kind === 'durum' && <span className="badge b-muted">düzeltme</span>}
                        </div>
                        {g.note && <div className="gecmis-not">{g.note}</div>}
                      </div>
                    ))}
                  </div>
                )}
                <form action={notEkle} className="not-ekle-satir">
                  <input type="hidden" name="id" value={s.id} />
                  <input name="note" className="form-control" maxLength={500} required
                         placeholder="Not ekle… (aramayı etkilemez)" />
                  <button type="submit" className="btn btn-sm btn-secondary">Not Ekle</button>
                </form>
              </div>

              <div>
                <div className="rehber-blok-baslik">Bilgiler</div>
                <DuzenleFormu action={adayGuncelle} aday={s} ekAlanlar={marka.ekAlanlar} />
                {isAdmin && (
                  <form action={adaySil} style={{ marginTop: 10 }}>
                    <input type="hidden" name="id" value={s.id} />
                    <ConfirmButton
                      className="btn btn-sm btn-danger"
                      soru={`"${s.name}" adayı kalıcı olarak silinsin mi? Arama geçmişi de gider.`}
                      title="Sil"
                    >
                      Adayı sil
                    </ConfirmButton>
                  </form>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Sonuç ekranı */}
      {sonucSatiri && (
        <>
          <div className="sonuc-perde" onClick={() => setSonucId(null)} aria-hidden />
          <div className="sonuc-sayfa" role="dialog" aria-label="Arama sonucu">
            {/* Tarih alanında Enter'a basmak formu ilk submit düğmesiyle
                ("Açmadı") gönderiyordu; sonuç düğmesine basılmadan kayıt
                oluşmasın diye submitter zorunlu. */}
            <form
              action={sonucKaydet}
              onSubmit={(e) => {
                const submitter = (e.nativeEvent as SubmitEvent).submitter;
                if (!submitter || !(submitter as HTMLButtonElement).name) {
                  e.preventDefault();
                  return;
                }
                if (kuyruktaMi && sonucSatiri) sonrakiAday(sonucSatiri.id);
                else setSonucId(null);
              }}
            >
              <input type="hidden" name="id" value={sonucSatiri.id} />
              <input type="hidden" name="kanal" value={kanal} />
              <input type="hidden" name="note" value={not} />
              <input type="hidden" name="tarih_secim" value={tarihSecim} />
              <input type="hidden" name="tarih" value={elleTarih} />
              <input type="hidden" name="web" value={web} />
              <input type="hidden" name="ajans" value={ajans} />

              <div className="sonuc-baslik">
                <div style={{ minWidth: 0 }}>
                  {kuyruktaMi && (
                    <div className="kuyruk-sayac">
                      Arama modu · sırada {kuyrukToplam} aday
                    </div>
                  )}
                  <strong>{sonucSatiri.name}</strong>
                  <div className="cell-sub">
                    {[
                      sonucSatiri.contact_person, sonucSatiri.city, sonucSatiri.source,
                    ].filter(Boolean).join(' · ') || (kanal === 'whatsapp' ? 'WhatsApp' : 'Telefon')}
                    {sonucSatiri.call_count > 0 && ` · ${sonucSatiri.call_count + 1}. deneme`}
                  </div>
                </div>
                <button type="button" className="btn-icon" onClick={() => { setKuyruk([]); setSonucId(null); }}
                        aria-label="Kapat">
                  <Icon name="close" />
                </button>
              </div>

              {/* Arama modunda numara ekranın en görünür yerinde: dokun, konuş, dön, sonucu bas. */}
              {(() => {
                const t = telefonCoz(sonucSatiri.phone_raw);
                if (!t.gecerli) {
                  return (
                    <div className="alert alert-warning" style={{ marginBottom: 12 }}>
                      Numara anlaşılamadı: {sonucSatiri.phone_raw ?? 'boş'} — &ldquo;Yanlış No&rdquo; ile işaretleyebilirsin.
                    </div>
                  );
                }
                return (
                  <div className="sonuc-ara">
                    <a href={t.tel!} className="btn btn-success sonuc-ara-dugme"
                       onClick={() => aramaIsaretle(sonucSatiri.id, 'telefon')}>
                      📞 {t.gorunum}
                    </a>
                    {t.whatsapp && (
                      <a href={t.whatsapp} target="_blank" rel="noopener noreferrer"
                         className="btn btn-secondary"
                         onClick={() => { setKanal('whatsapp'); aramaIsaretle(sonucSatiri.id, 'whatsapp'); }}>
                        WhatsApp
                      </a>
                    )}
                  </div>
                );
              })()}

              {sonucSatiri.last_note && (
                <div className="sonuc-son-not">
                  <span className="cell-sub">Son not</span> {sonucSatiri.last_note}
                </div>
              )}

              {sonucSatiri.baskasi_aradi && (
                <div className="alert alert-warning" style={{ marginBottom: 12 }}>
                  {sonucSatiri.son_olay_kisi} bu adayı az önce aradı — iki kez aramamak için kontrol et.
                </div>
              )}

              <div className="not-kaliplari">
                {NOT_KALIPLARI.map((k) => (
                  <button key={k} type="button" className="konu"
                          onClick={() => setNot((v) => (v ? `${v}, ${k}` : k))}>
                    {k}
                  </button>
                ))}
              </div>
              <textarea className="form-control" rows={2} value={not} maxLength={500}
                        onChange={(e) => setNot(e.target.value)}
                        placeholder="Not (isteğe bağlı)" aria-label="Not" />

              {marka.ekAlanlar.length > 0 && (
                <div className="sonuc-ek">
                  {marka.ekAlanlar.map((ek) => {
                    const alan = EK_ALANLAR[ek];
                    const deger = ek === 'web' ? web : ajans;
                    const ayarla = ek === 'web' ? setWeb : setAjans;
                    const mevcut = (ek === 'web' ? sonucSatiri.has_website : sonucSatiri.worked_with_agency) as UcDurum;
                    return (
                      <div className="sonuc-ek-satir" key={ek}>
                        <span>{alan.simge} {alan.soru}</span>
                        <span className="segment">
                          {UC_DURUMLAR.map((v) => (
                            <button key={v} type="button"
                                    className={deger === v || (deger === '' && mevcut === v) ? 'aktif' : ''}
                                    onClick={() => ayarla(v)}>
                              {v === 'bilinmiyor' ? 'Bilinmiyor' : v === 'var' ? 'Var' : 'Yok'}
                            </button>
                          ))}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="secim-basligi" style={{ marginTop: 14 }}>Tekrar ara</div>
              <div className="tarih-kaliplari">
                {[
                  { k: 'otomatik', l: 'Otomatik' }, { k: 'yarin', l: 'Yarın' },
                  { k: '3gun', l: '3 gün sonra' }, { k: '1hafta', l: '1 hafta sonra' },
                  { k: 'yok', l: 'Tarih yok' },
                ].map((t) => (
                  <button key={t.k} type="button"
                          className={`konu ${tarihSecim === t.k ? 'aktif' : ''}`}
                          onClick={() => setTarihSecim(t.k)}>
                    {t.l}
                  </button>
                ))}
                <input type="date" className="tarih-secim" value={elleTarih} min={bugunTarih}
                       aria-label="Tarih seç"
                       onChange={(e) => { setElleTarih(e.target.value); setTarihSecim('secili'); }} />
              </div>

              <div className="secim-basligi" style={{ marginTop: 14 }}>Sonuç — dokun ve kaydet</div>
              <div className="sonuc-dugmeleri">
                {SONUCLAR.map((d) => (
                  <button key={d.anahtar} type="submit" name="durum" value={d.anahtar}
                          className={`sonuc-dugme s-${d.anahtar}`} title={d.aciklama}>
                    {d.dugme}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}

/** Açılan satırdaki bilgi düzenleme formu. */
function DuzenleFormu({
  action, aday, ekAlanlar,
}: {
  action: (prev: string | null, fd: FormData) => Promise<string | null>;
  aday: AdayRow;
  ekAlanlar: EkAlanAnahtari[];
}) {
  const [sonuc, formAction] = useActionState(action, null);
  const ok = sonuc?.startsWith('ok|') ?? false;
  return (
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
                 maxLength={120} defaultValue={aday.contact_person ?? ''} />
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
        {ekAlanlar.map((ek) => {
          const alan = EK_ALANLAR[ek];
          const deger = (ek === 'web' ? aday.has_website : aday.worked_with_agency) as UcDurum;
          return (
            <div className="form-group" key={ek}>
              <label htmlFor={`d-${ek}-${aday.id}`}>{alan.simge} {alan.soru}</label>
              <select id={`d-${ek}-${aday.id}`} name={alan.sutun} className="form-control" defaultValue={deger}>
                {UC_DURUMLAR.map((v) => <option key={v} value={v}>{alan.etiket[v].uzun}</option>)}
              </select>
            </div>
          );
        })}
      </div>
      <div className="form-actions"><Kaydediliyor etiket="Kaydet" /></div>
    </form>
  );
}
