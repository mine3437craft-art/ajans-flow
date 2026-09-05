import Link from 'next/link';
import { money, num } from '@/lib/format';
import type { Hesap } from '@/lib/kasa';

const TUR_ETIKET: Record<string, string> = { nakit: 'Nakit', banka: 'Banka hesabı' };

/**
 * Kasa hesaplari. Karta tiklamak asagidaki hareket listesini o hesaba
 * filtreler (hesap ekstresi); tekrar tiklamak filtreyi kaldirir.
 */
export default function HesapKartlari({
  hesaplar, seciliId, ay,
}: {
  hesaplar: Hesap[];
  seciliId: number | null;
  ay: string;
}) {
  return (
    <div className="hesap-grid">
      {hesaplar.map((h) => {
        const secili = seciliId === h.id;
        const bakiye = num(h.balance);
        const gelir = num(h.ay_gelir);
        const gider = num(h.ay_gider);
        return (
          <Link
            key={h.id}
            href={secili ? `/kasa?ay=${ay}` : `/kasa?ay=${ay}&hesap=${h.id}`}
            className={`hesap-karti ${secili ? 'secili' : ''} ${h.account_type === 'nakit' ? 'nakit' : ''}`}
            scroll={false}
            title={secili ? 'Filtreyi kaldır' : 'Bu hesabın hareketlerini gör'}
          >
            <div className="hesap-ust">
              <span className="hesap-rozet" aria-hidden>{h.account_type === 'nakit' ? '💵' : '🏦'}</span>
              <span className="hesap-kimlik">
                <span className="hesap-ad">{h.name}</span>
                <span className="hesap-tur">{TUR_ETIKET[h.account_type] ?? h.account_type}</span>
              </span>
            </div>

            <div className="hesap-bakiye" style={bakiye < 0 ? { color: 'var(--danger)' } : undefined}>
              {money(bakiye)}
            </div>

            <div className="hesap-akis">
              <span style={{ color: gelir > 0 ? 'var(--success)' : 'var(--text-muted)' }}>
                ↓ {money(gelir)}
              </span>
              <span style={{ color: gider > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
                ↑ {money(gider)}
              </span>
            </div>
            {h.notes && <div className="hesap-not">{h.notes}</div>}
          </Link>
        );
      })}
    </div>
  );
}
