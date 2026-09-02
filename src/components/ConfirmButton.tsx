'use client';

import { useFormStatus } from 'react-dom';

/**
 * Geri alınamayan işlemler için onay soran gönder düğmesi.
 * Onaylanmazsa form gönderilmez.
 */
export default function ConfirmButton({
  soru,
  className = 'btn-icon',
  title,
  children,
}: {
  soru: string;
  className?: string;
  title?: string;
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={className}
      title={title}
      aria-label={title}
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(soru)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
