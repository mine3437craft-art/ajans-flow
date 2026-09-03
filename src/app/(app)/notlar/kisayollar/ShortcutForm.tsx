'use client';

import { useActionState, useEffect, useMemo, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createShortcut } from './actions';

const PROGRAMLAR = ['Photoshop', 'Premiere Pro', 'Illustrator', 'After Effects', 'Diğer'];

/** Değiştirici tuşlar — tıklanır, yazmaya gerek yok. Sembol + isim birlikte. */
const DEGISTIRICILER = [
  { id: 'Ctrl', sembol: '⌃', ad: 'Ctrl' },
  { id: 'Shift', sembol: '⇧', ad: 'Shift' },
  { id: 'Alt', sembol: '⌥', ad: 'Alt' },
  { id: 'Cmd', sembol: '⌘', ad: 'Cmd' },
] as const;

/** Sık kullanılan özel tuşlar — tek tıkla seçilir, klavyeden yazmaya gerek yok. */
const OZEL_TUSLAR = [
  { id: 'Enter', sembol: '⏎' },
  { id: 'Esc', sembol: '⎋' },
  { id: 'Tab', sembol: '⇥' },
  { id: 'Space', sembol: '␣' },
  { id: 'Delete', sembol: '⌫' },
  { id: '↑', sembol: '↑' },
  { id: '↓', sembol: '↓' },
  { id: '←', sembol: '←' },
  { id: '→', sembol: '→' },
] as const;

/** Kısayol tuşlarını görsel kutucuklar halinde çizer — sayfadaki listeyle aynı görünüm. */
export function TusGorunumu({ keys }: { keys: string }) {
  const parcalar = keys.split('+').filter(Boolean);
  if (parcalar.length === 0) {
    return <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Önce tuş seçin</span>;
  }
  return (
    <div className="key-combo">
      {parcalar.map((tus, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <kbd className="key">{tus}</kbd>
          {i < parcalar.length - 1 && <span style={{ color: 'var(--text-muted)' }}>+</span>}
        </span>
      ))}
    </div>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? 'Kaydediliyor…' : 'Kısayolu Ekle'}
    </button>
  );
}

export default function ShortcutForm() {
  const [sonuc, formAction] = useActionState(createShortcut, null);
  const ok = sonuc === 'ok';
  const formRef = useRef<HTMLFormElement>(null);

  const [program, setProgram] = useState('Photoshop');
  const [secili, setSecili] = useState<Set<string>>(new Set());
  const [anaTus, setAnaTus] = useState('');
  const [aciklama, setAciklama] = useState('');

  const keys = useMemo(() => {
    const parcalar: string[] = DEGISTIRICILER.filter((d) => secili.has(d.id)).map((d) => d.id);
    if (anaTus) parcalar.push(anaTus);
    return parcalar.join('+');
  }, [secili, anaTus]);

  function degistiriciyiAcKapat(id: string) {
    setSecili((prev) => {
      const yeni = new Set(prev);
      yeni.has(id) ? yeni.delete(id) : yeni.add(id);
      return yeni;
    });
  }

  function temizle() {
    setSecili(new Set());
    setAnaTus('');
    setAciklama('');
    setProgram('Photoshop');
  }

  // Kayıt başarılı olunca formu sıfırla — kullanıcı art arda kısayol eklerken
  // bir önceki seçimler ekranda kalıp kafa karıştırmasın.
  useEffect(() => {
    if (ok) temizle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ok]);

  return (
    <form
      ref={formRef}
      action={(fd) => {
        fd.set('keys', keys);
        formAction(fd);
      }}
    >
      {ok && <div className="alert alert-success">Kısayol eklendi.</div>}
      {sonuc && !ok && <div className="alert alert-danger">{sonuc}</div>}

      <div className="form-group" style={{ marginBottom: 16 }}>
        <label htmlFor="sf-program">Program</label>
        <select
          id="sf-program" className="form-control" value={program}
          onChange={(e) => setProgram(e.target.value)}
          style={{ maxWidth: 220 }}
        >
          {PROGRAMLAR.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input type="hidden" name="program" value={program} />
      </div>

      <div className="form-group" style={{ marginBottom: 16 }}>
        <label>Değiştirici Tuşlar <span style={{ textTransform: 'none', fontWeight: 400 }}>(isteğe bağlı, birden fazla seçilebilir)</span></label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
          {DEGISTIRICILER.map((d) => (
            <button
              key={d.id} type="button"
              className={`mod-toggle${secili.has(d.id) ? ' active' : ''}`}
              onClick={() => degistiriciyiAcKapat(d.id)}
              aria-pressed={secili.has(d.id)}
            >
              <span className="mod-sembol">{d.sembol}</span> {d.ad}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 16 }}>
        <label htmlFor="sf-anatus">Ana Tuş *</label>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            id="sf-anatus" className="form-control" style={{ width: 90, textAlign: 'center', fontWeight: 700, fontSize: 16 }}
            maxLength={8} placeholder="örn. E" value={anaTus.length <= 1 ? anaTus : ''}
            onChange={(e) => setAnaTus(e.target.value.toLocaleUpperCase('tr-TR').slice(0, 1))}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>veya hazır seçin:</span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {OZEL_TUSLAR.map((t) => (
              <button
                key={t.id} type="button"
                className={`special-key${anaTus === t.id ? ' active' : ''}`}
                onClick={() => setAnaTus(t.id)}
                title={t.id}
              >
                {t.sembol}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 16 }}>
        <label>Önizleme</label>
        <div className="shortcut-onizleme">
          <TusGorunumu keys={keys} />
        </div>
      </div>

      <div className="form-group full" style={{ marginBottom: 4 }}>
        <label htmlFor="sf-aciklama">Ne İşe Yarar? *</label>
        <input
          id="sf-aciklama" name="aciklama" className="form-control" required maxLength={200}
          placeholder="örn. Görünür katmanları birleştir"
          value={aciklama} onChange={(e) => setAciklama(e.target.value)}
        />
      </div>

      <div className="form-actions" style={{ justifyContent: 'space-between' }}>
        <button type="button" className="btn btn-ghost btn-sm" onClick={temizle}>Temizle</button>
        <Submit />
      </div>
    </form>
  );
}
