import { Fragment } from 'react';
import { requirePageAccess, getPageAccess } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import ConfirmButton from '@/components/ConfirmButton';
import HesapKartlari from '@/components/HesapKartlari';
import HareketListesi from '@/components/HareketListesi';
import IslemForm from '@/components/IslemForm';
import TransferForm from '@/components/TransferForm';
import AccountForm from './AccountForm';
import { money, num, bugunTR } from '@/lib/format';
import { ayBasi, hesaplariGetir, hareketleriGetir, kasaOzeti } from '@/lib/kasa';
import { createAccount, updateAccount, deleteAccount, createTransfer, deleteTransfer } from './actions';
import { createTransaction, deleteTransaction } from '../finans/actions';

export const dynamic = 'force-dynamic';

export default async function KasaPage({
  searchParams,
}: {
  searchParams: Promise<{ ay?: string; hesap?: string; tur?: string }>;
}) {
  const user = await requirePageAccess('kasa');
  const { ay, hesap, tur } = await searchParams;
  const { period, periodStart } = ayBasi(ay);

  const hesapId = /^\d+$/.test(hesap ?? '') ? parseInt(hesap!, 10) : null;

  // Gelir/gider kaydi acmak ayri bir yetki. Kasayi gorup deftere yazamayan
  // kullaniciya form hic gosterilmez (aksiyon tarafinda da ayrica engelli).
  const finansYetkisi =
    user.role === 'admin' || (await getPageAccess(user.id)).has('finans');

  const musteriler = (await sql`
    SELECT id, name FROM customers ORDER BY name
  `) as Array<{ id: number; name: string }>;

  const [hesaplar, hareketler, ozet] = await Promise.all([
    hesaplariGetir(periodStart),
    hareketleriGetir({ periodStart, hesapId, tur }),
    kasaOzeti(),
  ]);

  const secilenHesap = hesaplar.find((h) => h.id === hesapId) ?? null;
  const ayGelir = hareketler
    .filter((h) => h.tur === 'gelir').reduce((s, h) => s + num(h.amount), 0);
  const ayGider = hareketler
    .filter((h) => h.tur === 'gider').reduce((s, h) => s + num(h.amount), 0);

  const secenekler = hesaplar.map((h) => ({
    id: h.id, name: h.name, account_type: h.account_type, balance: h.balance,
  }));
  const bugun = bugunTR();

  return (
    <>
      <PageHeader title="Kasa" />
      <div className="content">
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon i-success"><Icon name="wallet" /></div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>{money(ozet.toplamVarlik)}</div>
            <div className="stat-label">Toplam Nakit + Banka</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon i-danger"><Icon name="card" /></div>
            <div className="stat-value" style={{ color: 'var(--danger)' }}>{money(ozet.bekleyenBorc)}</div>
            <div className="stat-label">Bekleyen Borç</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon i-info"><Icon name="money" /></div>
            <div className="stat-value">{money(ozet.bekleyenAlacak)}</div>
            <div className="stat-label">Bekleyen Alacak</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon i-primary"><Icon name="chart" /></div>
            <div className="stat-value" style={{ color: ozet.netDurum >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              {money(ozet.netDurum)}
            </div>
            <div className="stat-label">Net Durum</div>
          </div>
        </div>

        {/* ---- Hesaplar ---- */}
        <div className="card">
          <div className="card-head">
            <h2>Hesaplar <span className="badge b-muted">{hesaplar.length}</span></h2>
            <span className="card-not">Karta tıkla → o hesabın ekstresi aşağıda</span>
          </div>

          <div className="card-body">
            {hesaplar.length === 0 ? (
              <EmptyState icon="👛" title="Henüz hesap eklenmemiş"
                          text="Nakit, Garanti, Akbank… Aşağıdan ekle, sonra gider girerken hangisinden düştüğünü seç." />
            ) : (
              <HesapKartlari hesaplar={hesaplar} seciliId={hesapId} ay={period} />
            )}
          </div>

          <details style={{ borderTop: '1px solid var(--border)' }}>
            <summary className="acilir-baslik">+ Yeni hesap ekle</summary>
            <div style={{ padding: '0 20px 20px' }}>
              <AccountForm action={createAccount} gonderEtiketi="Kaydet" />
            </div>
          </details>

          {hesaplar.length > 0 && (
            <details style={{ borderTop: '1px solid var(--border)' }}>
              <summary className="acilir-baslik">Hesapları düzenle / sil</summary>
              <div style={{ padding: '0 20px 8px' }}>
                {hesaplar.map((h) => (
                  <Fragment key={h.id}>
                    <div className="hesap-duzen-satir">
                      <span className="cell-title">{h.name}</span>
                      <span className="num" style={{ fontWeight: 700 }}>{money(h.balance)}</span>
                      <form action={deleteAccount}>
                        <input type="hidden" name="id" value={h.id} />
                        <ConfirmButton
                          soru={`"${h.name}" hesabı silinsin mi? Bu hesaba işlenmiş gelir/gider kayıtları silinmez, yalnızca hesap bağlantısı kopar.`}
                          title="Sil"
                        >
                          <Icon name="trash" />
                        </ConfirmButton>
                      </form>
                    </div>
                    <div style={{ padding: '0 0 18px' }}>
                      <AccountForm action={updateAccount} gonderEtiketi="Güncelle" hesap={h} />
                    </div>
                  </Fragment>
                ))}
              </div>
            </details>
          )}
        </div>

        {/* ---- Para giris/cikis + transfer ---- */}
        <div className="grid-2">
          {finansYetkisi && (
            <div className="card">
              <div className="card-head"><h2>Para Girişi / Çıkışı</h2></div>
              <div className="card-body">
                <IslemForm action={createTransaction} hesaplar={secenekler}
                           musteriler={musteriler} bugun={bugun} varsayilanTur="gider" />
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-head">
              <h2>Hesaplar Arası Transfer</h2>
              <span className="card-not">Gelir/gidere yazılmaz</span>
            </div>
            <div className="card-body">
              <TransferForm action={createTransfer} hesaplar={secenekler} bugun={bugun} />
            </div>
          </div>
        </div>

        {/* ---- Hareketler ---- */}
        <div className="card">
          <div className="card-head">
            <h2>
              {secilenHesap ? `${secilenHesap.name} — Hareketler` : 'Tüm Hareketler'}
              <span className="badge b-muted">{hareketler.length}</span>
            </h2>
            <span className="card-ozet">
              <span style={{ color: 'var(--success)' }}>↓ {money(ayGelir)}</span>
              <span style={{ color: 'var(--danger)' }}>↑ {money(ayGider)}</span>
            </span>
          </div>

          <form className="filter-bar" method="get">
            <input type="month" name="ay" className="form-control" defaultValue={period} aria-label="Ay" />
            <select name="tur" className="form-control" defaultValue={tur ?? ''} aria-label="Tür">
              <option value="">Tümü</option>
              <option value="gelir">Gelir</option>
              <option value="gider">Gider</option>
              <option value="transfer">Transfer</option>
            </select>
            <select name="hesap" className="form-control" defaultValue={hesap ?? ''} aria-label="Hesap">
              <option value="">Tüm hesaplar</option>
              {hesaplar.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
            <button className="btn btn-secondary btn-sm" type="submit">Filtrele</button>
          </form>

          <HareketListesi
            hareketler={hareketler}
            silIslem={finansYetkisi ? deleteTransaction : undefined}
            silTransfer={deleteTransfer}
          />
        </div>
      </div>
    </>
  );
}
