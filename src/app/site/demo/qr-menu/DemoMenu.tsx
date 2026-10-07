'use client';

/**
 * Çalışan QR menü demosu.
 *
 * Hiçbir veri gönderilmez, kaydedilmez ve hiçbir isteğe çıkılmaz: sipariş ve
 * rezervasyon düğmeleri yalnızca ekranda bir bildirim gösterir. Bu yüzden
 * <form> KULLANILMIYOR — JavaScript olmasa bile tarayıcı hiçbir şey
 * gönderemesin diye bütün düğmeler type="button".
 *
 * Menü içeriği sunucuda da basılır (varsayılan durum: Türkçe, tüm kategoriler),
 * böylece JavaScript gelmezse de menü okunur kalır.
 */

import { useId, useMemo, useState } from 'react';

import Dugme from '@/components/site/Dugme';
import { IkonArama, IkonKapat, IkonTik } from '@/components/site/Ikonlar';
import { siteYolu } from '@/lib/site';

import {
  ALERJEN_ADLARI,
  DILLER,
  DIYET_FILTRELERI,
  KATEGORILER,
  MALZEMELER,
  METINLER,
  URUNLER,
  diyetleri,
  fiyatYaz,
  rtlMi,
  urunGecer,
  type DemoDil,
  type DemoUrun,
  type DiyetFiltre,
  type KategoriAnahtari,
} from './demo-menu';

type Sekme = 'menu' | 'siparis' | 'rezervasyon';

export default function DemoMenu() {
  const [dil, setDil] = useState<DemoDil>('tr');
  const [kategori, setKategori] = useState<KategoriAnahtari | 'tumu'>('tumu');
  const [arama, setArama] = useState('');
  const [filtreler, setFiltreler] = useState<DiyetFiltre[]>([]);
  const [acikUrun, setAcikUrun] = useState<string | null>(null);
  const [sekme, setSekme] = useState<Sekme>('menu');
  const [sepet, setSepet] = useState<Record<string, number>>({});
  const [siparisBildirim, setSiparisBildirim] = useState(false);
  const [rezBildirim, setRezBildirim] = useState(false);

  const kimlik = useId();
  const m = METINLER[dil];
  const rtl = rtlMi(dil);

  const suzulmus = useMemo(
    () => URUNLER.filter((u) => urunGecer(u, dil, kategori, arama, filtreler)),
    [dil, kategori, arama, filtreler],
  );

  /** Süzülen ürünleri kategori sırasına göre gruplar. */
  const gruplar = useMemo(
    () =>
      KATEGORILER.map((k) => ({
        kategori: k,
        urunler: suzulmus.filter((u) => u.kategori === k.anahtar),
      })).filter((g) => g.urunler.length > 0),
    [suzulmus],
  );

  const sepetSatirlari = URUNLER.filter((u) => (sepet[u.id] ?? 0) > 0);
  const sepetAdedi = sepetSatirlari.reduce((t, u) => t + (sepet[u.id] ?? 0), 0);
  const sepetToplami = sepetSatirlari.reduce((t, u) => t + u.fiyat * (sepet[u.id] ?? 0), 0);

  const filtreDegistir = (f: DiyetFiltre) => {
    setFiltreler((o) => (o.includes(f) ? o.filter((x) => x !== f) : [...o, f]));
  };

  const adetDegistir = (id: string, fark: number) => {
    setSiparisBildirim(false);
    setSepet((o) => {
      const yeni = Math.max(0, (o[id] ?? 0) + fark);
      const kopya = { ...o };
      if (yeni === 0) delete kopya[id];
      else kopya[id] = yeni;
      return kopya;
    });
  };

  const sekmeler: { anahtar: Sekme; etiket: string; sayi?: number }[] = [
    { anahtar: 'menu', etiket: m.sekmeMenu },
    { anahtar: 'siparis', etiket: m.sekmeSiparis, sayi: sepetAdedi },
    { anahtar: 'rezervasyon', etiket: m.sekmeRezervasyon },
  ];

  return (
    <div className="af-demo" lang={dil} dir={rtl ? 'rtl' : 'ltr'}>
      {/* Kapatılamayan demo şeridi — kullanıcı gizleyemez, düğmesi yok. */}
      <p className="af-demo-serit">
        <span className="af-demo-serit-nokta" aria-hidden="true" />
        {m.demoSerit}
      </p>

      <div className="af-demo-ust">
        <div className="af-demo-marka">
          <div>
            <p className="af-demo-marka-ad">{m.marka}</p>
            <p className="af-demo-marka-not">{m.markaNot}</p>
          </div>
          <div className="af-demo-diller" role="group" aria-label={m.dilSecimi}>
            {DILLER.map((d) => (
              <button
                key={d.kod}
                type="button"
                className="af-cip af-cip--mono"
                aria-pressed={dil === d.kod}
                lang={d.kod}
                onClick={() => setDil(d.kod)}
              >
                {d.kisa}
                <span className="af-gizli-metin">{` ${d.ad}`}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="af-demo-arama">
          <label className="af-gizli-metin" htmlFor={`${kimlik}-arama`}>
            {m.aramaEtiketi}
          </label>
          <span className="af-demo-arama-ikon" aria-hidden="true">
            <IkonArama />
          </span>
          <input
            className="af-girdi"
            id={`${kimlik}-arama`}
            type="search"
            inputMode="search"
            autoComplete="off"
            placeholder={m.aramaYerTutucu}
            value={arama}
            onChange={(e) => setArama(e.target.value)}
          />
          {arama ? (
            <button type="button" className="af-ikon-dugme af-demo-arama-sil" onClick={() => setArama('')}>
              <IkonKapat />
              <span className="af-gizli-metin">{m.aramaTemizle}</span>
            </button>
          ) : null}
        </div>

        <div className="af-demo-kategoriler" role="group" aria-label={m.kategoriler}>
          <button
            type="button"
            className="af-cip"
            aria-pressed={kategori === 'tumu'}
            onClick={() => setKategori('tumu')}
          >
            {m.tumu}
          </button>
          {KATEGORILER.map((k) => (
            <button
              key={k.anahtar}
              type="button"
              className="af-cip"
              aria-pressed={kategori === k.anahtar}
              onClick={() => setKategori(k.anahtar)}
            >
              {k.ad[dil]}
            </button>
          ))}
        </div>

        <div className="af-demo-filtreler" role="group" aria-label={m.filtreBaslik}>
          {DIYET_FILTRELERI.map((f) => (
            <button
              key={f}
              type="button"
              className="af-cip af-cip--nokta"
              aria-pressed={filtreler.includes(f)}
              onClick={() => filtreDegistir(f)}
            >
              {METINLER[dil][f]}
            </button>
          ))}
          {filtreler.length ? (
            <button type="button" className="af-cip" onClick={() => setFiltreler([])}>
              {m.filtreTemizle}
            </button>
          ) : null}
        </div>

        <nav className="af-demo-sekmeler" aria-label={m.marka}>
          {sekmeler.map((s) => (
            <button
              key={s.anahtar}
              type="button"
              className="af-cip"
              aria-current={sekme === s.anahtar ? 'true' : undefined}
              onClick={() => setSekme(s.anahtar)}
            >
              {s.etiket}
              {s.sayi ? <span className="af-demo-sayi">{s.sayi}</span> : null}
            </button>
          ))}
        </nav>
      </div>

      {/* ---------------- Menü ---------------- */}
      {sekme === 'menu' ? (
        <section className="af-demo-govde" aria-label={m.sekmeMenu}>
          <p className="af-demo-ozet">
            <span className="af-mono">{`${suzulmus.length} ${m.urunSayisi}`}</span>
            <span className="af-ornek-damga">{m.ornek}</span>
          </p>

          {gruplar.length === 0 ? (
            <p className="af-demo-bos">{m.sonucYok}</p>
          ) : (
            gruplar.map((g) => (
              <div className="af-demo-grup" key={g.kategori.anahtar}>
                <h3 className="af-demo-grup-bas">{g.kategori.ad[dil]}</h3>
                <ul className="af-demo-liste">
                  {g.urunler.map((u) => (
                    <UrunSatiri
                      key={u.id}
                      urun={u}
                      dil={dil}
                      acik={acikUrun === u.id}
                      adet={sepet[u.id] ?? 0}
                      kimlik={`${kimlik}-${u.id}`}
                      ac={() => setAcikUrun(acikUrun === u.id ? null : u.id)}
                      ekle={() => adetDegistir(u.id, 1)}
                    />
                  ))}
                </ul>
              </div>
            ))
          )}

          <div className="af-demo-notlar">
            <p>{m.fiyatNotu}</p>
            <p>{m.karekodNotu}</p>
            <p>{m.fotoNotu}</p>
          </div>
        </section>
      ) : null}

      {/* ---------------- Sipariş ---------------- */}
      {sekme === 'siparis' ? (
        <section className="af-demo-govde" aria-label={m.sekmeSiparis}>
          {sepetSatirlari.length === 0 ? (
            <p className="af-demo-bos">{m.siparisBos}</p>
          ) : (
            <>
              <ul className="af-demo-liste">
                {sepetSatirlari.map((u) => (
                  <li className="af-demo-sepet-satir" key={u.id}>
                    <div>
                      <p className="af-demo-urun-ad">{u.ad[dil]}</p>
                      <p className="af-demo-urun-fiyat af-mono">{fiyatYaz(u.fiyat)}</p>
                    </div>
                    <div className="af-demo-adet">
                      <button type="button" className="af-ikon-dugme af-ikon-dugme--cerceveli" onClick={() => adetDegistir(u.id, -1)}>
                        <span aria-hidden="true">−</span>
                        <span className="af-gizli-metin">{`${m.azalt}: ${u.ad[dil]}`}</span>
                      </button>
                      <span className="af-mono" aria-label={`${m.adet}: ${sepet[u.id]}`}>
                        {sepet[u.id]}
                      </span>
                      <button type="button" className="af-ikon-dugme af-ikon-dugme--cerceveli" onClick={() => adetDegistir(u.id, 1)}>
                        <span aria-hidden="true">+</span>
                        <span className="af-gizli-metin">{`${m.artir}: ${u.ad[dil]}`}</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="af-demo-toplam">
                <span>{m.toplam}</span>
                <span className="af-mono">{fiyatYaz(sepetToplami)}</span>
                <span className="af-ornek-damga">{m.ornek}</span>
              </p>

              <div className="af-demo-alanlar" role="group" aria-label={m.sekmeSiparis}>
                <p className="af-alan">
                  <label className="af-etiket" htmlFor={`${kimlik}-masa`}>
                    {m.masaNo}
                  </label>
                  <input className="af-girdi" id={`${kimlik}-masa`} type="text" inputMode="numeric" autoComplete="off" />
                </p>
                <p className="af-alan">
                  <label className="af-etiket" htmlFor={`${kimlik}-not`}>
                    {m.siparisNotu}
                  </label>
                  <textarea className="af-girdi" id={`${kimlik}-not`} rows={2} placeholder={m.siparisNotuYer} />
                </p>
              </div>

              <Dugme blok type="button" onClick={() => setSiparisBildirim(true)}>
                {m.siparisGonder}
              </Dugme>
              {siparisBildirim ? (
                <p className="af-demo-bildirim" role="status">
                  <IkonTik />
                  {m.siparisSonuc}
                </p>
              ) : null}
            </>
          )}

          <button type="button" className="af-cip af-ust-16" onClick={() => setSekme('menu')}>
            {m.menuyeDon}
          </button>
        </section>
      ) : null}

      {/* ---------------- Rezervasyon ---------------- */}
      {sekme === 'rezervasyon' ? (
        <section className="af-demo-govde" aria-label={m.sekmeRezervasyon}>
          <p className="af-demo-ozet">{m.rezervasyonGiris}</p>

          <div className="af-demo-alanlar" role="group" aria-label={m.sekmeRezervasyon}>
            <p className="af-alan">
              <label className="af-etiket" htmlFor={`${kimlik}-tarih`}>
                {m.tarih}
              </label>
              <input className="af-girdi" id={`${kimlik}-tarih`} type="date" />
            </p>
            <p className="af-alan">
              <label className="af-etiket" htmlFor={`${kimlik}-saat`}>
                {m.saat}
              </label>
              <input className="af-girdi" id={`${kimlik}-saat`} type="time" />
            </p>
            <p className="af-alan">
              <label className="af-etiket" htmlFor={`${kimlik}-kisi`}>
                {m.kisi}
              </label>
              <input className="af-girdi" id={`${kimlik}-kisi`} type="number" min={1} max={20} inputMode="numeric" />
            </p>
            <p className="af-alan">
              <label className="af-etiket" htmlFor={`${kimlik}-isim`}>
                {m.isim}
              </label>
              <input className="af-girdi" id={`${kimlik}-isim`} type="text" autoComplete="off" />
            </p>
            <p className="af-alan af-alan--tam">
              <label className="af-etiket" htmlFor={`${kimlik}-telefon`}>
                {m.telefon}
              </label>
              <input className="af-girdi" id={`${kimlik}-telefon`} type="tel" inputMode="tel" autoComplete="off" />
            </p>
          </div>

          <label className="af-onay">
            <input type="checkbox" />
            <span>
              {m.onay} <a href={siteYolu('/kvkk')}>KVKK</a>
            </span>
          </label>

          <Dugme blok type="button" onClick={() => setRezBildirim(true)}>
            {m.rezGonder}
          </Dugme>
          {rezBildirim ? (
            <p className="af-demo-bildirim" role="status">
              <IkonTik />
              {m.rezSonuc}
            </p>
          ) : null}

          <button type="button" className="af-cip af-ust-16" onClick={() => setSekme('menu')}>
            {m.menuyeDon}
          </button>
        </section>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tek ürün satırı + detay (içindekiler, alerjen, enerji)              */
/* ------------------------------------------------------------------ */

function UrunSatiri({
  urun,
  dil,
  acik,
  adet,
  kimlik,
  ac,
  ekle,
}: {
  urun: DemoUrun;
  dil: DemoDil;
  acik: boolean;
  adet: number;
  kimlik: string;
  ac: () => void;
  ekle: () => void;
}) {
  const m = METINLER[dil];
  const diyet = diyetleri(urun);

  return (
    <li className="af-demo-urun">
      <div className="af-demo-urun-bas">
        <div className="af-demo-urun-metin">
          <p className="af-demo-urun-ad">{urun.ad[dil]}</p>
          <p className="af-demo-urun-aciklama">{urun.aciklama[dil]}</p>
          {diyet.length ? (
            <p className="af-demo-rozetler">
              {diyet.map((d) => (
                <span className="af-mono-etiket af-mono-etiket--vurgu" key={d}>
                  {METINLER[dil][d]}
                </span>
              ))}
            </p>
          ) : null}
        </div>
        <p className="af-demo-urun-fiyat af-mono">{fiyatYaz(urun.fiyat)}</p>
      </div>

      <div className="af-demo-urun-eylem">
        <button type="button" className="af-cip" aria-expanded={acik} aria-controls={kimlik} onClick={ac}>
          {acik ? m.detayKapat : m.detayAc}
        </button>
        <Dugme tur="ikincil" type="button" onClick={ekle}>
          {adet > 0 ? `${m.ekle} (${adet})` : m.ekle}
        </Dugme>
      </div>

      {acik ? (
        <div className="af-demo-detay" id={kimlik}>
          <dl>
            <dt>{m.icindekiler}</dt>
            <dd>{urun.icindekiler.map((i) => MALZEMELER[i][dil]).join(', ')}</dd>
            <dt>{m.alerjenler}</dt>
            <dd>
              {urun.alerjenler.length
                ? urun.alerjenler.map((a) => ALERJEN_ADLARI[a][dil]).join(' · ')
                : m.alerjenYok}
            </dd>
            <dt>{m.enerji}</dt>
            <dd>
              <span className="af-mono">{`${urun.enerji} kcal`}</span>{' '}
              <span className="af-ornek-damga">{m.ornek}</span>
            </dd>
          </dl>
        </div>
      ) : null}
    </li>
  );
}
