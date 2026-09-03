'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateVideo } from './actions';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-sm btn-primary" type="submit" disabled={pending}>
      {pending ? 'Kaydediliyor…' : 'Güncelle'}
    </button>
  );
}

type Video = { id: number; title: string; notes: string | null };

export default function VideoEditForm({ video }: { video: Video }) {
  const [sonuc, formAction] = useActionState(updateVideo, null);
  const ok = sonuc === 'ok';

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={video.id} />
      {ok && <div className="alert alert-success">Video güncellendi.</div>}
      {sonuc && !ok && <div className="alert alert-danger">{sonuc}</div>}
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor={`vt-${video.id}`}>Video Adı</label>
          <input id={`vt-${video.id}`} name="title" className="form-control" required maxLength={200}
                 defaultValue={video.title} />
        </div>
        <div className="form-group full">
          <label htmlFor={`vn-${video.id}`}>Açıklama / Detay</label>
          <textarea id={`vn-${video.id}`} name="notes" className="form-control" rows={2}
                    defaultValue={video.notes ?? ''}
                    placeholder="örn. Hamburger tanıtım videosu, ızgara çekimi" />
        </div>
      </div>
      <div className="form-actions"><Submit /></div>
    </form>
  );
}
