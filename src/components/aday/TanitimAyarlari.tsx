'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { linkKopyala } from './acilir';

function Gonder() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-sm btn-primary" type="submit" disabled={pending}>
      {pending ? 'Kaydediliyor…' : 'Kaydet'}
    </button>
  );
}

/**
 * Tanıtım sitesi kartı: genel site linki (herkes) ve sitede gösterilecek
 * WhatsApp numarası (yalnızca yönetici değiştirebilir).
 */
export default function TanitimAyarlari({
  whatsapp, yonetici, kaydet,
}: {
  whatsapp: string | null;
  yonetici: boolean;
  kaydet: (prev: string | null, fd: FormData) => Promise<string | null>;
}) {
  const [sonuc, formAction] = useActionState(kaydet, null);
  const ok = sonuc?.startsWith('ok|') ?? false;

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-head">
        <h2>🌐 Tanıtım sitesi</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-sm btn-secondary"
                  onClick={() => linkKopyala(`${window.location.origin}/tanitim`)}>
            Linki kopyala
          </button>
          <a href="/tanitim" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">Siteyi aç ↗</a>
        </div>
      </div>
      <div className="card-body">
        <p className="cell-sub" style={{ marginBottom: 10 }}>
          Genel site herkese gönderilebilir. Her adayın ayrıca <strong>kişisel sunum linki</strong> var
          (<code>{'{site}'}</code>): adıyla karşılar ve işaretlediğin eksikleri öneri olarak gösterir.
          Aday linki açınca listede &ldquo;👀 Sunuma baktı&rdquo; görünür.
        </p>
        {yonetici ? (
          <form action={formAction} className="not-ekle-satir" style={{ maxWidth: 520 }}>
            <input name="whatsapp" className="form-control" inputMode="tel" defaultValue={whatsapp ?? ''}
                   placeholder="Sitedeki WhatsApp numarası (boş = yalnızca Instagram)"
                   aria-label="Sitedeki WhatsApp numarası" />
            <Gonder />
          </form>
        ) : (
          <p className="cell-sub">
            Sitedeki WhatsApp numarası: {whatsapp ?? 'girilmedi (yalnızca Instagram DM)'}
          </p>
        )}
        {ok && <div className="alert alert-success" style={{ marginTop: 10 }}>Kaydedildi.</div>}
        {sonuc && !ok && <div className="alert alert-danger" style={{ marginTop: 10 }}>{sonuc}</div>}
      </div>
    </div>
  );
}
