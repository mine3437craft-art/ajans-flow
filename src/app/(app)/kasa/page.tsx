import { Fragment } from 'react';
import { requirePageAccess } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import ConfirmButton from '@/components/ConfirmButton';
import AccountForm from './AccountForm';
import { money, num } from '@/lib/format';
import { createAccount, updateAccount, deleteAccount } from './actions';

export const dynamic = 'force-dynamic';

type Account = {
  id: number; name: string; account_type: string; balance: string; notes: string | null;
};

const TUR_ETIKET: Record<string, string> = { nakit: 'Nakit', banka: 'Banka Hesabı' };
const TUR_IKON: Record<string, string> = { nakit: '💵', banka: '🏦' };

export default async function KasaPage() {
  await requirePageAccess('kasa');

  const hesaplar = (await sql`
    SELECT id, name, account_type, balance, notes FROM cash_accounts ORDER BY account_type, name
  `) as Account[];

  const toplamVarlik = hesaplar.reduce((s, h) => s + num(h.balance), 0);

  const [borcOzet] = (await sql`
    SELECT
      COALESCE(SUM(amount - paid_amount) FILTER (WHERE direction = 'borc'), 0)   AS toplam_borc,
      COALESCE(SUM(amount - paid_amount) FILTER (WHERE direction = 'alacak'), 0) AS toplam_alacak
    FROM debts WHERE paid_amount < amount
  `) as Array<{ toplam_borc: string; toplam_alacak: string }>;

  const bekleyenBorc = num(borcOzet?.toplam_borc);
  const bekleyenAlacak = num(borcOzet?.toplam_alacak);
  const netDurum = toplamVarlik - bekleyenBorc + bekleyenAlacak;

  return (
    <>
      <PageHeader title="Kasa" />
      <div className="content">
        <div className="alert alert-info">
          <Icon name="wallet" style={{ width: 17, height: 17, flexShrink: 0 }} />
          <span>
            Elindeki nakit parayı ve banka hesaplarını (Garanti, Akbank, hatta annenin
            hesabı gibi) buraya ekleyip bakiyeyi güncel tut. Borç ve alacaklar
            <a href="/borclar" style={{ fontWeight: 600 }}> Borç &amp; Alacak</a> sayfasından
            yönetilir, buradaki Net Durum hesabına otomatik dahil olur.
          </span>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon i-success"><Icon name="wallet" /></div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>{money(toplamVarlik)}</div>
            <div className="stat-label">Toplam Nakit + Banka</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon i-danger"><Icon name="card" /></div>
            <div className="stat-value" style={{ color: 'var(--danger)' }}>{money(bekleyenBorc)}</div>
            <div className="stat-label">Bekleyen Borç</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon i-info"><Icon name="money" /></div>
            <div className="stat-value">{money(bekleyenAlacak)}</div>
            <div className="stat-label">Bekleyen Alacak</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon i-primary"><Icon name="chart" /></div>
            <div className="stat-value" style={{ color: netDurum >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              {money(netDurum)}
            </div>
            <div className="stat-label">Net Durum</div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Hesaplar <span className="badge b-muted">{hesaplar.length}</span></h2>
          </div>

          <details style={{ borderBottom: '1px solid var(--border)' }}>
            <summary style={{ padding: '13px 20px', cursor: 'pointer', fontWeight: 600, color: 'var(--primary)' }}>
              + Yeni Hesap Ekle
            </summary>
            <div style={{ padding: '0 20px 20px' }}>
              <AccountForm action={createAccount} gonderEtiketi="Kaydet" />
            </div>
          </details>

          {hesaplar.length === 0 ? (
            <EmptyState icon="👛" title="Henüz hesap eklenmemiş"
                        text="Yukarıdan nakit ya da banka hesabınızı ekleyin." />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Hesap</th><th>Tür</th><th className="num">Bakiye</th><th style={{ width: 1 }} />
                  </tr>
                </thead>
                <tbody>
                  {hesaplar.map((h) => (
                    <Fragment key={h.id}>
                      <tr>
                        <td>
                          <div className="cell-title">{h.name}</div>
                          {h.notes && <div className="cell-sub">{h.notes}</div>}
                        </td>
                        <td>
                          <span className="badge b-muted">{TUR_IKON[h.account_type]} {TUR_ETIKET[h.account_type]}</span>
                        </td>
                        <td className="num" style={{ fontWeight: 700, fontSize: 15 }}>{money(h.balance)}</td>
                        <td>
                          <form action={deleteAccount}>
                            <input type="hidden" name="id" value={h.id} />
                            <ConfirmButton soru={`"${h.name}" hesabı silinsin mi?`} title="Sil">
                              <Icon name="trash" />
                            </ConfirmButton>
                          </form>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={4} style={{ padding: 0, borderBottom: '1px solid var(--border)' }}>
                          <details>
                            <summary style={{ padding: '8px 20px', cursor: 'pointer',
                                              fontSize: 12.5, fontWeight: 600, color: 'var(--primary)' }}>
                              Düzenle
                            </summary>
                            <div style={{ padding: '4px 20px 18px' }}>
                              <AccountForm action={updateAccount} gonderEtiketi="Güncelle" hesap={h} />
                            </div>
                          </details>
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
