'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { money, num, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/format';

export type HesapSecenek = {
  id: number; name: string; account_type: string; balance: string;
};

function Gonder({ tur }: { tur: 'gelir' | 'gider' }) {
  const { pending } = useFormStatus();
  return (
    <button
      className={`btn ${tur === 'gelir' ? 'btn-success' : 'btn-danger'}`}
      type="submit"
      disabled={pending}
    >
      {pending ? 'Kaydediliyor…' : tur === 'gelir' ? 'Geliri Kaydet' : 'Gideri Kaydet'}
    </button>
  );
}

/**
 * Gelir/gider girisi. Kasa hesaplari kart olarak burada secilir; tutar
 * yazildikca secili hesabin bakiyesinin nereye gidecegi anlik gosterilir --
 * "bu gideri hangi kasadan dusuyorum" sorusu form kapanmadan cevaplanir.
 */
export default function IslemForm({
  action, hesaplar, musteriler, bugun, varsayilanTur = 'gider',
}: {
  action: (prev: string | null, fd: FormData) => Promise<string | null>;
  hesaplar: HesapSecenek[];
  musteriler: Array<{ id: number; name: string }>;
  bugun: string;
  varsayilanTur?: 'gelir' | 'gider';
}) {
  const [sonuc, formAction] = useActionState(action, null);
  const [tur, setTur] = useState<'gelir' | 'gider'>(varsayilanTur);
  const [hesapId, setHesapId] = useState<number | null>(hesaplar[0]?.id ?? null);
  const [tutar, setTutar] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Aksiyon basarida "ok|<id>|<kasa etkisi>" dondurur; id sayesinde ayni
  // islem art arda girilse bile deger degisir ve efekt yeniden calisir.
  const ok = sonuc?.startsWith('ok|') ?? false;
  const detay = ok ? (sonuc!.split('|')[2] || null) : null;

  useEffect(() => {
    if (ok) { formRef.current?.reset(); setTutar(''); }
  }, [ok, sonuc]);

  const secili = hesaplar.find((h) => h.id === hesapId) ?? null;
  const miktar = parseFloat(tutar.replace(',', '.'));
  const gecerli = Number.isFinite(miktar) && miktar > 0;
  const sonraki = secili
    ? num(secili.balance) + (tur === 'gelir' ? miktar : -miktar)
    : 0;

  return (
    <form ref={formRef} action={formAction} className="islem-form">
      <input type="hidden" name="type" value={tur} />
      <input type="hidden" name="account_id" value={hesapId ?? ''} />

      {ok && (
        <div className="alert alert-success">
          <strong>{tur === 'gelir' ? 'Gelir' : 'Gider'} kaydedildi.</strong>
          {detay && <span>Kasa güncellendi: {detay}</span>}
        </div>
      )}
      {sonuc && !ok && <div className="alert alert-danger">{sonuc}</div>}

      <div className="segment" role="group" aria-label="İşlem türü">
        <button type="button" className={tur === 'gelir' ? 'aktif gelir' : ''}
                onClick={() => setTur('gelir')} aria-pressed={tur === 'gelir'}>
          ↓ Gelir
        </button>
        <button type="button" className={tur === 'gider' ? 'aktif gider' : ''}
                onClick={() => setTur('gider')} aria-pressed={tur === 'gider'}>
          ↑ Gider
        </button>
      </div>

      <div className="tutar-alani">
        <label htmlFor="if-amount">Tutar</label>
        <div className="tutar-kutu">
          <input id="if-amount" name="amount" inputMode="decimal" required
                 className="tutar-input" placeholder="0"
                 value={tutar} onChange={(e) => setTutar(e.target.value)} />
          <span className="tutar-birim">₺</span>
        </div>
      </div>

      <div className="secim-basligi">
        {tur === 'gelir' ? 'Hangi kasaya girdi?' : 'Hangi kasadan çıktı?'}
      </div>

      {hesaplar.length === 0 ? (
        <div className="alert alert-warning" style={{ marginBottom: 14 }}>
          Henüz kasa hesabı yok. Aşağıdan Nakit / Garanti / Akbank gibi hesaplarını
          ekleyince buradan seçebilirsin.
        </div>
      ) : (
        <div className="hesap-secim">
          {hesaplar.map((h) => (
            <button key={h.id} type="button"
                    className={`hesap-chip ${hesapId === h.id ? 'secili' : ''}`}
                    onClick={() => setHesapId(h.id)} aria-pressed={hesapId === h.id}>
              <span className="hesap-chip-ikon">{h.account_type === 'nakit' ? '💵' : '🏦'}</span>
              <span className="hesap-chip-govde">
                <span className="hesap-chip-ad">{h.name}</span>
                <span className="hesap-chip-bakiye">{money(h.balance)}</span>
              </span>
            </button>
          ))}
          <button type="button" className={`hesap-chip ${hesapId === null ? 'secili' : ''}`}
                  onClick={() => setHesapId(null)} aria-pressed={hesapId === null}>
            <span className="hesap-chip-ikon">∅</span>
            <span className="hesap-chip-govde">
              <span className="hesap-chip-ad">Kasaya işleme</span>
              <span className="hesap-chip-bakiye">bakiye değişmez</span>
            </span>
          </button>
        </div>
      )}

      {secili && gecerli && (
        <div className={`etki-satiri ${sonraki < 0 ? 'eksi' : ''}`}>
          <strong>{secili.name}</strong>
          <span className="etki-eski">{money(secili.balance)}</span>
          <span className="etki-ok">→</span>
          <span className="etki-yeni">{money(sonraki)}</span>
          {sonraki < 0 && <span className="etki-uyari">bakiye eksiye düşecek</span>}
        </div>
      )}

      <div className="form-grid" style={{ marginTop: 16 }}>
        <div className="form-group">
          <label htmlFor="if-category">Kategori</label>
          <select id="if-category" name="category" className="form-control"
                  key={tur} defaultValue={tur === 'gelir' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]}>
            {(tur === 'gelir' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="if-date">Tarih *</label>
          <input id="if-date" name="occurred_on" type="date" className="form-control"
                 defaultValue={bugun} required />
        </div>
        <div className="form-group">
          <label htmlFor="if-customer">Müşteri</label>
          <select id="if-customer" name="customer_id" className="form-control" defaultValue="">
            <option value="">— Yok —</option>
            {musteriler.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div className="form-group full">
          <label htmlFor="if-desc">Açıklama</label>
          <input id="if-desc" name="description" className="form-control" maxLength={300}
                 placeholder={tur === 'gelir' ? 'örn. Eylül ayı ödemesi' : 'örn. Adobe aboneliği'} />
        </div>
      </div>

      <div className="form-actions">
        <Gonder tur={tur} />
      </div>
    </form>
  );
}
