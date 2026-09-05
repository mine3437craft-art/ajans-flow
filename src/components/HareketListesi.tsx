import EmptyState from './EmptyState';
import ConfirmButton from './ConfirmButton';
import Icon from './Icon';
import { money, dateShort } from '@/lib/format';
import type { Hareket } from '@/lib/kasa';

const IKON: Record<string, string> = { gelir: '↓', gider: '↑', transfer: '⇄' };

/**
 * Gelir, gider ve transferlerin ortak "hesap ekstresi" gorunumu.
 * Silme aksiyonlari disaridan verilir; verilmezse satir salt okunur olur --
 * kasa yetkisi olup gelir/gider yetkisi olmayan kullanici silemesin diye.
 */
export default function HareketListesi({
  hareketler, silIslem, silTransfer,
}: {
  hareketler: Hareket[];
  silIslem?: (fd: FormData) => Promise<void>;
  silTransfer?: (fd: FormData) => Promise<void>;
}) {
  if (hareketler.length === 0) {
    return (
      <EmptyState icon="🧾" title="Bu ay hareket yok"
                  text="Yukarıdan gelir, gider veya transfer ekleyerek başla." />
    );
  }

  return (
    <div>
      {hareketler.map((h) => {
        const sil = h.kaynak === 'islem' ? silIslem : silTransfer;
        return (
          <div className="hareket" key={`${h.kaynak}-${h.id}`}>
            <div className={`hareket-ikon h-${h.tur}`} aria-hidden>{IKON[h.tur]}</div>

            <div className="hareket-govde">
              <div className="hareket-baslik">
                {h.tur === 'transfer'
                  ? <>{h.hesap} <span className="hareket-ok">→</span> {h.hedef_hesap}</>
                  : (h.description || h.category)}
              </div>
              <div className="hareket-alt">
                <span>{dateShort(h.occurred_on)}</span>
                {h.tur !== 'transfer' && <span>· {h.category}</span>}
                {h.musteri && <span>· {h.musteri}</span>}
                {h.tur !== 'transfer' && (
                  <span className="hareket-hesap">
                    · {h.hesap ? `${h.hesap} kasası` : 'kasaya işlenmedi'}
                  </span>
                )}
                {h.tur === 'transfer' && h.description && <span>· {h.description}</span>}
              </div>
            </div>

            <div className={`hareket-tutar t-${h.tur}`}>
              {h.tur === 'gelir' ? '+' : h.tur === 'gider' ? '−' : ''}{money(h.amount)}
            </div>

            {sil ? (
              <form action={sil}>
                <input type="hidden" name="id" value={h.id} />
                <ConfirmButton
                  soru={
                    h.tur === 'transfer'
                      ? `Bu transfer silinsin mi? İki hesabın bakiyesi eski haline döner.`
                      : `${h.category} — ${money(h.amount)} kaydı silinsin mi? Kasa bakiyesi geri alınır.`
                  }
                  title="Sil"
                >
                  <Icon name="trash" />
                </ConfirmButton>
              </form>
            ) : (
              <span style={{ width: 30 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
