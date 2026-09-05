'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { GORSEL_SECENEKLERI } from './RehberGorsel';

export type Rehber = {
  id: number; category: string; icon: string; title: string;
  summary: string; body: string; steps: string[]; tips: string[];
  visual: string | null;
};

const KATEGORILER = ['Photoshop', 'Premiere', 'Instagram', 'Çekim', 'Genel'];

function Gonder({ etiket }: { etiket: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? 'Kaydediliyor…' : etiket}
    </button>
  );
}

export default function RehberForm({
  action, etiket, kayit,
}: {
  action: (prev: string | null, fd: FormData) => Promise<string | null>;
  etiket: string;
  kayit?: Rehber;
}) {
  const [sonuc, formAction] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);
  const ok = sonuc?.startsWith('ok|') ?? false;
  const k = kayit ? `-${kayit.id}` : '-yeni';

  useEffect(() => {
    if (ok && !kayit) formRef.current?.reset();
  }, [ok, sonuc, kayit]);

  return (
    <form ref={formRef} action={formAction}>
      {kayit && <input type="hidden" name="id" value={kayit.id} />}

      {ok && (
        <div className="alert alert-success">
          {kayit ? 'Kayıt güncellendi.' : 'Yeni anlatım eklendi.'}
        </div>
      )}
      {sonuc && !ok && <div className="alert alert-danger">{sonuc}</div>}

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor={`r-icon${k}`}>Simge</label>
          <input id={`r-icon${k}`} name="icon" className="form-control" maxLength={4}
                 defaultValue={kayit?.icon ?? '📘'} placeholder="📘" />
        </div>
        <div className="form-group">
          <label htmlFor={`r-cat${k}`}>Kategori</label>
          <select id={`r-cat${k}`} name="category" className="form-control"
                  defaultValue={kayit?.category ?? 'Photoshop'}>
            {KATEGORILER.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group full">
          <label htmlFor={`r-title${k}`}>Başlık *</label>
          <input id={`r-title${k}`} name="title" className="form-control" required maxLength={200}
                 defaultValue={kayit?.title} />
        </div>
        <div className="form-group full">
          <label htmlFor={`r-sum${k}`}>Tek cümlelik özet</label>
          <input id={`r-sum${k}`} name="summary" className="form-control" maxLength={300}
                 defaultValue={kayit?.summary}
                 placeholder="Kartın üstünde görünen kısa açıklama" />
        </div>
        <div className="form-group full">
          <label htmlFor={`r-body${k}`}>Uzun anlatım</label>
          <textarea id={`r-body${k}`} name="body" className="form-control" rows={7}
                    defaultValue={kayit?.body}
                    placeholder="Boş satır bırakarak paragraflara ayır." />
        </div>
        <div className="form-group full">
          <label htmlFor={`r-steps${k}`}>Adım adım — her satır bir adım</label>
          <textarea id={`r-steps${k}`} name="steps" className="form-control" rows={5}
                    defaultValue={kayit?.steps.join('\n')}
                    placeholder={'Window menüsünü aç\nWorkspace > Reset Essentials'} />
        </div>
        <div className="form-group full">
          <label htmlFor={`r-tips${k}`}>İpuçları — her satır bir ipucu</label>
          <textarea id={`r-tips${k}`} name="tips" className="form-control" rows={4}
                    defaultValue={kayit?.tips.join('\n')} />
        </div>
        <div className="form-group full">
          <label htmlFor={`r-vis${k}`}>Görsel anlatım</label>
          <select id={`r-vis${k}`} name="visual" className="form-control"
                  defaultValue={kayit?.visual ?? ''}>
            {GORSEL_SECENEKLERI.map((g) => <option key={g.k} value={g.k}>{g.l}</option>)}
          </select>
        </div>
      </div>

      <div className="form-actions"><Gonder etiket={etiket} /></div>
    </form>
  );
}
