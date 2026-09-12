'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { ALANLAR } from '@/lib/aktarim';
import type { AktarimSonuc } from '@/app/(app)/musteri-bulma/[marka]/actions';

function Gonder({ etiket, bekleyen }: { etiket: string; bekleyen: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? bekleyen : etiket}
    </button>
  );
}

const ORNEK = 'Kule Cafe\t0532 111 22 33\tKadıköy\nNar Restoran\t0533 123 45 67\tÜsküdar';

export default function IceAktarForm({
  action, geriAlAction, marka, markaAd, personel,
}: {
  action: (prev: AktarimSonuc | null, fd: FormData) => Promise<AktarimSonuc>;
  geriAlAction: (fd: FormData) => Promise<void>;
  marka: string;
  markaAd: string;
  personel: Array<{ id: number; display_name: string }>;
}) {
  const [sonuc, formAction] = useActionState(action, null);

  if (sonuc?.durum === 'bitti') {
    return (
      <div>
        <div className="alert alert-success">
          <span>
            <strong>{sonuc.eklenen} aday eklendi.</strong>
            {sonuc.atlanan > 0 && ` ${sonuc.atlanan} satır atlandı (numara zaten listedeydi).`}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
          <a className="btn btn-primary" href={`/musteri-bulma/${marka}`}>{markaAd} listesine git</a>
          {sonuc.eklenen > 0 && (
            <form action={geriAlAction}>
              <input type="hidden" name="marka" value={marka} />
              <input type="hidden" name="parti" value={sonuc.parti} />
              <button className="btn btn-secondary" type="submit"
                      title="Bu yapıştırmada eklenen, henüz aranmamış kayıtları siler">
                Bu aktarmayı geri al
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  const onizleme = sonuc?.durum === 'onizleme' ? sonuc : null;

  return (
    <form action={formAction}>
      <input type="hidden" name="marka" value={marka} />
      <input type="hidden" name="adim" value={onizleme ? 'kaydet' : 'onizle'} />
      {/* Sütun eşleştirmesi ve başlık kutusu doğrudan form alanı: istemci
          durumu yok, sayfa hidrasyonunu beklemeden doğru gönderiliyor. */}
      {onizleme && <input type="hidden" name="metin" value={onizleme.metin} />}

      {sonuc?.durum === 'hata' && <div className="alert alert-danger">{sonuc.mesaj}</div>}

      {!onizleme ? (
        <>
          <div className="form-group full">
            <label htmlFor="ia-metin">Excel&apos;den kopyaladığın satırlar *</label>
            <textarea id="ia-metin" name="metin" className="form-control" rows={10} required
                      defaultValue={sonuc?.durum === 'hata' ? (sonuc.metin ?? '') : ''}
                      placeholder={ORNEK} style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13 }} />
          </div>
          <div className="form-grid" style={{ marginTop: 14 }}>
            <div className="form-group">
              <label htmlFor="ia-kaynak">Kaynak (hepsine yazılır)</label>
              <input id="ia-kaynak" name="kaynak" className="form-control" maxLength={120}
                     placeholder="örn. Google Haritalar — Kadıköy" />
            </div>
            <div className="form-group">
              <label htmlFor="ia-sorumlu">Kime atansın</label>
              <select id="ia-sorumlu" name="sorumlu" className="form-control" defaultValue="">
                <option value="">— Atanmamış —</option>
                {personel.map((p) => <option key={p.id} value={p.id}>{p.display_name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <Gonder etiket="Önizle" bekleyen="Okunuyor…" />
          </div>
        </>
      ) : (
        <>
          <div className="aktarim-ozet">
            {[
              { e: 'Eklenecek', d: onizleme.ozet.eklenecek, s: 'b-success' },
              { e: 'Zaten listede', d: onizleme.ozet.zatenVar, s: 'b-muted' },
              { e: 'Yapıştırmada tekrar', d: onizleme.ozet.dosyadaTekrar, s: 'b-muted' },
              { e: 'Numara hatalı', d: onizleme.ozet.numaraGecersiz, s: 'b-warning' },
              { e: 'Numarası yok', d: onizleme.ozet.numarasiz, s: 'b-warning' },
              { e: 'Diğer listede de var', d: onizleme.ozet.digerListede, s: 'b-info' },
            ].filter((x) => x.d > 0).map((x) => (
              <span key={x.e} className={`badge ${x.s}`}>{x.e}: <b>{x.d}</b></span>
            ))}
          </div>

          <div className="secim-basligi" style={{ marginTop: 16 }}>Sütunlar doğru mu?</div>
          <div className="aktarim-eslesme">
            {onizleme.basliklar.map((baslik, i) => (
              <label className="form-group" key={i}>
                <span className="cell-sub">{baslik || `${i + 1}. sütun`}</span>
                <select className="form-control" name={`alan_${i}`}
                        defaultValue={onizleme.eslesme[i] ?? ''}>
                  <option value="">— Alma —</option>
                  {ALANLAR.map((a) => <option key={a.anahtar} value={a.anahtar}>{a.ad}</option>)}
                </select>
              </label>
            ))}
          </div>

          <label className="belirsiz-check" style={{ marginTop: 12 }}>
            <input type="checkbox" name="baslik_var" value="1" defaultChecked={onizleme.baslikVar} />
            <span>İlk satır başlık (veri değil) — işaretliyse o satır eklenmez.</span>
          </label>

          <div className="form-grid" style={{ marginTop: 14 }}>
            <div className="form-group">
              <label htmlFor="ia-kaynak2">Kaynak (hepsine yazılır)</label>
              <input id="ia-kaynak2" name="kaynak" className="form-control" maxLength={120}
                     defaultValue={onizleme.kaynak} placeholder="örn. Google Haritalar — Kadıköy" />
            </div>
            <div className="form-group">
              <label htmlFor="ia-sorumlu2">Kime atansın</label>
              <select id="ia-sorumlu2" name="sorumlu" className="form-control" defaultValue={onizleme.sorumlu}>
                <option value="">— Atanmamış —</option>
                {personel.map((p) => <option key={p.id} value={p.id}>{p.display_name}</option>)}
              </select>
            </div>
          </div>

          <div className="secim-basligi" style={{ marginTop: 16 }}>İlk satırlar</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>{Object.keys(onizleme.ornek[0] ?? { Durum: '', Ad: '' }).map((k) => <th key={k}>{k}</th>)}</tr>
              </thead>
              <tbody>
                {onizleme.ornek.map((satir, i) => (
                  <tr key={i}>
                    {Object.entries(satir).map(([k, v]) => (
                      <td key={k}>
                        {k === 'Durum'
                          ? <span className={`badge ${v === 'Eklenecek' ? 'b-success' : v.includes('hatalı') ? 'b-warning' : 'b-muted'}`}>{v}</span>
                          : (v || '—')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="form-actions">
            <a className="btn btn-secondary" href={`/musteri-bulma/${marka}/ice-aktar`}>Baştan başla</a>
            <Gonder etiket={`${onizleme.ozet.eklenecek} adayı ekle`} bekleyen="Ekleniyor…" />
          </div>
        </>
      )}
    </form>
  );
}
