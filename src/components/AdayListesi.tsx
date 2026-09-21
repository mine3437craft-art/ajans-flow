'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Vurgu from './Vurgu';
import NotHucresi from './aday/NotHucresi';
import WhatsAppMenu from './aday/WhatsAppMenu';
import TopluCubuk, { WaKuyruk } from './aday/TopluCubuk';
import SonucEkrani from './aday/SonucEkrani';
import AdayDetay from './aday/AdayDetay';
import {
  DURUMLAR, DURUM_HARITA, EK_ALANLAR, HEMEN_ARANACAK, ekAlanDegeri, sonrakiUcDurum,
  tarihEtiketi, gecenSure,
} from '@/lib/adaylar';
import { telefonCoz } from '@/lib/telefon';
import { vurguDuzenleri, katlanmisKelimeler } from '@/lib/arama';
import type { AdayRow, Eylem, Eylemler, Kisi, Kullanici, Marka, Olay, Sablon } from './aday/tipler';

export type { AdayRow, Sablon } from './aday/tipler';

const DEPO = 'af-aday-arama';

/** Gönderim sürerken alanı soluklaştırır: dokunuşun boşa gitmediği görünsün. */
function Bekleyen({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <span className={pending ? 'alan-bekliyor' : undefined}>{children}</span>;
}

/** Değiştirilince kendiliğinden gönderilen tek alanlık form. */
function AlanFormu({ action, id, alan, children }: {
  action: Eylem; id: number; alan: string; children: React.ReactNode;
}) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form ref={ref} action={action}
          onChange={(e) => {
            // Formun onChange'i içindeki alandan kabarır; hedef o alan.
            const hedef = e.target as unknown as HTMLInputElement;
            if (hedef.tagName === 'BUTTON') return;
            // Tarih kutusuna elle yazarken tarayıcı her yıl hanesinde ara değer
            // yolluyor (0002-09-21, 0020-09-21…): tam ve makul bir yıl gelmeden
            // gönderme. Boşaltmak (tarihi silmek) serbest.
            if (hedef.type === 'date' && hedef.value && Number(hedef.value.slice(0, 4)) < 2020) return;
            ref.current?.requestSubmit();
          }}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="alan" value={alan} />
      <Bekleyen>{children}</Bekleyen>
    </form>
  );
}

function UcDurumDugmesi({ sinif, baslik, etiket }: { sinif: string; baslik: string; etiket: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`badge ${sinif} uc-durum${pending ? ' alan-bekliyor' : ''}`}
            title={baslik} disabled={pending}>
      {etiket}
    </button>
  );
}

function KucukGonder({ children, sinif, baslik }: { children: React.ReactNode; sinif: string; baslik: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`${sinif}${pending ? ' alan-bekliyor' : ''}`} title={baslik} disabled={pending}>
      {children}
    </button>
  );
}

const SON_ISLEM: Record<string, string> = { arama: '📞', mesaj: '💬', not: '📝', durum: '✎' };

/** "Son İşlem" sütunu: ekip çoğunlukla durum ve not kullanıyor, yalnızca aramaya bakmak yanıltıyordu. */
function sonIslem(s: AdayRow): { ust: string; alt: string } | null {
  if (!s.son_olay_tur || !s.son_olay_zaman) return null;
  const ikon = SON_ISLEM[s.son_olay_tur] ?? '•';
  const ne = s.son_olay_tur === 'mesaj' ? 'WhatsApp mesajı'
    : s.son_olay_tur === 'not' ? 'Not'
    : DURUM_HARITA[s.son_olay_durum ?? '']?.ad ?? (s.son_olay_tur === 'arama' ? 'Arama' : 'Güncelleme');
  return { ust: `${ikon} ${ne}`, alt: `${s.son_olay_kisi ?? '—'} · ${gecenSure(s.son_olay_zaman)}` };
}

export default function AdayListesi({
  satirlar, marka, personel, kullanici, sablonlar, arama, bugunTarih,
  acikSatir, baslangicSonuc, gecmis, adres, eylemler,
}: {
  satirlar: AdayRow[];
  marka: Marka;
  personel: Kisi[];
  kullanici: Kullanici;
  sablonlar: Sablon[];
  arama: string;
  bugunTarih: string;
  acikSatir: number | null;
  /** ?sonuc=<id> ile gelindiyse o adayın sonuç ekranı açık başlar. */
  baslangicSonuc: number | null;
  gecmis: Olay[];
  adres: string;
  eylemler: Eylemler;
}) {
  const [sonucId, setSonucId] = useState<number | null>(baslangicSonuc);
  const [kanal, setKanal] = useState<'telefon' | 'whatsapp'>('telefon');
  // Arama modu: sonuç kaydedilince sıradaki adaya geçilir.
  const [kuyruk, setKuyruk] = useState<number[]>([]);
  const [secili, setSecili] = useState<Set<number>>(new Set());
  const [waKuyruk, setWaKuyruk] = useState<{ sablon: Sablon | null; adaylar: AdayRow[] } | null>(null);
  // Sonuç ekranı açıldığı andaki satır: WhatsApp şablonu adayı süzgeçten
  // düşürürse ekran konuşmanın ortasında kapanmasın.
  const [sonucAnlik, setSonucAnlik] = useState<AdayRow | null>(null);

  const desenler = vurguDuzenleri(arama);
  const kelimeler = katlanmisKelimeler(arama);

  // Liste değişince (süzgeç, silme) artık görünmeyen seçimleri at.
  useEffect(() => {
    setSecili((onceki) => {
      const gorunen = new Set(satirlar.map((s) => s.id));
      const kalan = [...onceki].filter((id) => gorunen.has(id));
      return kalan.length === onceki.size ? onceki : new Set(kalan);
    });
  }, [satirlar]);

  const sonucAc = (id: number, k: 'telefon' | 'whatsapp') => {
    setSonucId(id);
    setKanal(k);
    setSonucAnlik(satirlar.find((s) => s.id === id) ?? null);
  };

  /**
   * Telefona basıp konuşup döndüğünde sonuç ekranı kendiliğinden açılır.
   * Bazı iOS/uygulama içi tarayıcılarda bu olay gelmeyebildiği için
   * "Arandı" düğmesi her zaman duruyor.
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
        // 10 dakika: aramadan hemen sonra dönüşü yakalar, saatler sonra açılmaz.
        if (!v.id || !v.t || Date.now() - v.t > 10 * 60 * 1000) return;
        if (!satirlar.some((s) => s.id === v.id)) return;
        // WhatsApp dönüşünde sonuç ekranı açılmaz: mesaj zaten kaydedildi.
        if (v.kanal === 'whatsapp') return;
        sonucAc(v.id, 'telefon');
      } catch { /* yoksay */ }
    };
    document.addEventListener('visibilitychange', kontrol);
    return () => document.removeEventListener('visibilitychange', kontrol);
  }, [satirlar]);

  const aramaIsaretle = (id: number, k: 'telefon' | 'whatsapp') => {
    try { sessionStorage.setItem(DEPO, JSON.stringify({ id, kanal: k, t: Date.now() })); } catch { /* gizli sekme */ }
  };

  /** Bugün aranacaklar: elle kuyruğa alınan / hiç aranmayan / tarihi gelen açık adaylar. */
  const bugunAranacak = satirlar.filter(
    (s) => DURUM_HARITA[s.status]?.acik
      && ((HEMEN_ARANACAK as string[]).includes(s.status) || (s.next_call_on ?? '9999') <= bugunTarih),
  );

  const aramayaBasla = () => {
    const sira = bugunAranacak.map((s) => s.id);
    if (sira.length === 0) return;
    setKuyruk(sira);
    sonucAc(sira[0], 'telefon');
  };

  const kaydedildi = (biten: number) => {
    if (!kuyruk.includes(biten)) { setSonucId(null); return; }
    const kalan = kuyruk.filter((id) => id !== biten);
    setKuyruk(kalan);
    const sonraki = kalan.find((id) => satirlar.some((s) => s.id === id));
    if (sonraki === undefined) setSonucId(null);
    else sonucAc(sonraki, 'telefon');
  };

  const secimDegistir = (id: number) => setSecili((o) => {
    const y = new Set(o);
    if (y.has(id)) y.delete(id); else y.add(id);
    return y;
  });
  const hepsiSecili = satirlar.length > 0 && satirlar.every((s) => secili.has(s.id));

  const sonucSatiri = sonucId === null ? null
    : satirlar.find((s) => s.id === sonucId) ?? (sonucAnlik?.id === sonucId ? sonucAnlik : null);
  const acikAday = acikSatir !== null ? satirlar.find((s) => s.id === acikSatir) ?? null : null;

  return (
    <>
      {bugunAranacak.length > 0 && (
        <div className="arama-modu-serit">
          <div>
            <strong>{bugunAranacak.length} aday aranacak</strong>
            <div className="cell-sub">Sırayla arar, sonucu girdikçe kendiliğinden sonrakine geçer.</div>
          </div>
          <button type="button" className="btn btn-primary" onClick={aramayaBasla}>📞 Aramaya başla</button>
        </div>
      )}

      <div className="secim-seridi">
        <label className="secim-hepsi">
          <input type="checkbox" checked={hepsiSecili}
                 onChange={() => setSecili(hepsiSecili ? new Set() : new Set(satirlar.map((s) => s.id)))} />
          <span>{hepsiSecili ? 'Seçimi kaldır' : `Görünen ${satirlar.length} adayı seç`}</span>
        </label>
        {secili.size > 0 && <span className="cell-sub">{secili.size} seçili</span>}
      </div>

      <div className="table-wrap">
        <table className="aday-tablo">
          <thead>
            <tr>
              <th className="secim-hucre">
                <input type="checkbox" aria-label="Görünen hepsini seç" checked={hepsiSecili}
                       onChange={() => setSecili(hepsiSecili ? new Set() : new Set(satirlar.map((s) => s.id)))} />
              </th>
              <th>Durum</th>
              <th>Ad / Firma</th>
              <th>Telefon</th>
              {marka.ekAlanlar.map((ek) => <th key={ek}>{EK_ALANLAR[ek].baslik}</th>)}
              <th>Arama Tarihi</th>
              <th>Son İşlem</th>
              <th>Not</th>
              <th>Kime Ait</th>
              <th style={{ width: 1 }} />
            </tr>
          </thead>
          <tbody>
            {satirlar.map((s) => {
              const tel = telefonCoz(s.phone_raw);
              const tanim = DURUM_HARITA[s.status];
              const tarih = tarihEtiketi(s.next_call_on);
              const acik = acikSatir === s.id;
              const islem = sonIslem(s);
              const siniflar = [
                tarih?.sinif === 'tarih-gecikti' ? 'satir-gecikti'
                  : tarih?.sinif === 'tarih-bugun' || s.status === 'tekrar_aranacak' ? 'satir-bugun' : '',
                acik ? 'satir-acik' : '',
                secili.has(s.id) ? 'satir-secili' : '',
              ].filter(Boolean).join(' ');
              return (
                <tr key={s.id} id={`aday-${s.id}`} className={siniflar || undefined}>
                  <td className="secim-hucre" data-etiket="">
                    <input type="checkbox" aria-label={`${s.name} seç`} checked={secili.has(s.id)}
                           onChange={() => secimDegistir(s.id)} />
                  </td>

                  <td data-etiket="Durum">
                    <AlanFormu action={eylemler.alanGuncelle} id={s.id} alan="durum">
                      <select key={s.status} name="deger" defaultValue={s.status} aria-label="Durum"
                              className={`durum-secim badge ${tanim?.rozet ?? 'b-muted'}`}>
                        {DURUMLAR.map((d) => <option key={d.anahtar} value={d.anahtar}>{d.ad}</option>)}
                      </select>
                    </AlanFormu>
                  </td>

                  <td data-etiket="Ad / Firma">
                    <a href={acik ? adres : `${adres}${adres.includes('?') ? '&' : '?'}ac=${s.id}`}
                       className="cell-title aday-ad" title="Geçmiş ve bilgiler">
                      <Vurgu metin={s.name} desenler={desenler} kelimeler={kelimeler} />
                    </a>
                    <div className="cell-sub">
                      {[s.contact_person, s.city, s.source].filter(Boolean).join(' · ') || ' '}
                      {s.link && (
                        <> · <a href={/^https?:\/\//i.test(s.link) ? s.link : `https://${s.link}`}
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
                        <WhatsAppMenu aday={s} sablonlar={sablonlar} gonderen={kullanici.ad}
                                      marka={marka.ad} kaydet={eylemler.mesajKaydet} />
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
                    const deger = ekAlanDegeri(s, ek);
                    const et = alan.etiket[deger];
                    return (
                      <td data-etiket={alan.baslik} key={ek}>
                        <form action={eylemler.alanGuncelle}>
                          <input type="hidden" name="id" value={s.id} />
                          <input type="hidden" name="alan" value={ek} />
                          <input type="hidden" name="deger" value={sonrakiUcDurum(deger)} />
                          <UcDurumDugmesi sinif={et.rozet} etiket={et.kisa}
                                          baslik={`${et.uzun} — değiştirmek için tıkla`} />
                        </form>
                      </td>
                    );
                  })}

                  <td data-etiket="Arama Tarihi">
                    <AlanFormu action={eylemler.alanGuncelle} id={s.id} alan="tarih">
                      <input key={s.next_call_on ?? 'bos'} type="date" name="deger"
                             defaultValue={s.next_call_on?.slice(0, 10) ?? ''}
                             className="tarih-secim" aria-label="Arama tarihi" />
                    </AlanFormu>
                    {tarih && <div className={`tarih-etiket ${tarih.sinif}`}>{tarih.metin}</div>}
                  </td>

                  <td data-etiket="Son İşlem">
                    {islem ? (
                      <>
                        <div className="son-islem">{islem.ust}</div>
                        <div className="cell-sub">{islem.alt}</div>
                      </>
                    ) : <span className="cell-sub">işlem yok</span>}
                    {s.unreached_streak >= 3 && (
                      <span className="badge b-warning">{s.unreached_streak} kez açmadı</span>
                    )}
                    {s.baskasi_aradi && <div className="uyari-mini">{s.son_olay_kisi} az önce ilgilendi</div>}
                  </td>

                  <td data-etiket="Not">
                    <NotHucresi adayId={s.id} not={s.last_note} desenler={desenler} kelimeler={kelimeler}
                                kaydet={eylemler.sonNotDuzenle} />
                  </td>

                  <td data-etiket="Kime Ait">
                    <AlanFormu action={eylemler.alanGuncelle} id={s.id} alan="sorumlu">
                      <select key={s.assigned_to ?? 'bos'} name="deger" defaultValue={s.assigned_to ?? ''}
                              className="sorumlu-secim" aria-label="Kime ait">
                        <option value="">Atanmamış</option>
                        {personel.map((p) => <option key={p.id} value={p.id}>{p.display_name}</option>)}
                      </select>
                    </AlanFormu>
                  </td>

                  <td data-etiket="">
                    <div className="satir-eylem">
                      <button type="button" className="btn btn-sm btn-primary"
                              onClick={() => sonucAc(s.id, 'telefon')}>Arandı</button>
                      {s.status !== 'tekrar_aranacak' && (
                        <form action={eylemler.tekrarAranacak}>
                          <input type="hidden" name="id" value={s.id} />
                          <KucukGonder sinif="btn btn-sm btn-secondary" baslik="Bugün yeniden aranacaklara al">
                            ↻ Tekrar ara
                          </KucukGonder>
                        </form>
                      )}
                      {s.geri_alinabilir && s.son_olay_id && (
                        <form action={eylemler.geriAl}>
                          <input type="hidden" name="olay_id" value={s.son_olay_id} />
                          <KucukGonder sinif="btn btn-sm btn-ghost" baslik="Son işlemi geri al">↩ Geri al</KucukGonder>
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

      {acikAday && (
        <AdayDetay
          key={`${acikAday.id}:${acikAday.has_website}:${acikAday.worked_with_agency}:${acikAday.social_active}:${acikAday.name}:${acikAday.phone_raw}`}
          aday={acikAday} gecmis={gecmis} marka={marka} kullanici={kullanici} eylemler={eylemler} />
      )}

      {sonucSatiri && (
        <SonucEkrani
          key={sonucSatiri.id}
          aday={sonucSatiri}
          kanalBaslangic={kanal}
          kuyrukta={kuyruk.includes(sonucSatiri.id)}
          kuyrukToplam={kuyruk.length}
          marka={marka}
          kullanici={kullanici}
          sablonlar={sablonlar}
          bugunTarih={bugunTarih}
          kaydet={eylemler.sonucKaydet}
          mesajKaydet={eylemler.mesajKaydet}
          aramaIsaretle={aramaIsaretle}
          kaydedildi={kaydedildi}
          kapat={() => { setKuyruk([]); setSonucId(null); }}
        />
      )}

      {secili.size > 0 && !waKuyruk && (
        <TopluCubuk
          secili={[...secili]}
          marka={marka}
          personel={personel}
          sablonlar={sablonlar}
          kullanici={kullanici}
          eylemler={eylemler}
          temizle={() => setSecili(new Set())}
          waBaslat={(sablon) => setWaKuyruk({ sablon, adaylar: satirlar.filter((s) => secili.has(s.id)) })}
        />
      )}

      {waKuyruk && (
        <WaKuyruk
          adaylar={waKuyruk.adaylar}
          sablon={waKuyruk.sablon}
          kullanici={kullanici}
          marka={marka}
          kaydet={eylemler.mesajKaydet}
          bitir={() => { setWaKuyruk(null); setSecili(new Set()); }}
        />
      )}
    </>
  );
}
