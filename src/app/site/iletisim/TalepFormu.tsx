'use client';

import { useActionState, useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dugme from '@/components/site/Dugme';
import { talepGonder, type TalepSonucu } from './actions';
import { akisDinle, akisOku, panelSektoru } from './akis-durumu';
import './form.css';

export type SektorSecenegi = { anahtar: string; ad: string };
export type EksikSecenegi = { anahtar: string; ad: string };

type Props = {
  /** Panel sözlüğündeki sektörler (adaylar.ts SEKTORLER) — sunucudan gelir. */
  sektorler: readonly SektorSecenegi[];
  /** Eksik seçenekleri (adaylar.ts EKSIKLER) — sunucudan gelir. */
  eksikler: readonly EksikSecenegi[];
  /** Adres çubuğundaki `?sektor=` değerinin panel karşılığı. */
  baslangicSektoru?: string | null;
  tesekkurYolu: string;
  kvkkYolu: string;
  /**
   * Analiz kipi: sektör ve eksikler sayfanın üstündeki adımlardan geliyor.
   * Form onları tekrar sormaz; sektörü gizli alana, eksikleri ise sayfadaki
   * kutular `form="…"` niteliğiyle doğrudan bu forma gönderir.
   */
  akisModu?: boolean;
  /** Dışarıdaki kutuların bağlandığı form kimliği. */
  formId?: string;
  gonderEtiketi?: string;
};

/**
 * İletişim / ücretsiz analiz formu.
 *
 * Sunucu tarafı `./actions.ts` içindeki `talepGonder`: bal küpü, en az 3
 * saniye doldurma süresi, IP başına saatlik sınır ve KVKK onayı kontrolü
 * orada yapılıyor. Burada yalnız alanlar, ön dolum ve hata gösterimi var.
 *
 * JavaScript olmadan da çalışır: form sunucu eylemine gönderilir, dönen
 * sonuç sayfada yazıyla görünür. JS varsa başarıda /tesekkurler'e geçilir.
 */
export default function TalepFormu({
  sektorler,
  eksikler,
  baslangicSektoru,
  tesekkurYolu,
  kvkkYolu,
  akisModu = false,
  formId,
  gonderEtiketi = 'Ücretsiz analiz iste',
}: Props) {
  const [sonuc, gonder, bekliyor] = useActionState<TalepSonucu | null, FormData>(
    talepGonder,
    null,
  );
  const yonlendirici = useRouter();
  const on = useId();

  const [sektor, setSektor] = useState<string>(baslangicSektoru ?? '');
  const [secilenEksikler, setSecilenEksikler] = useState<string[]>([]);
  const acilisRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const bildirimRef = useRef<HTMLParagraphElement>(null);

  // Formun açıldığı an: bot kontrolü için. Sunucuda basılan sayfa önbelleğe
  // girebileceği için değeri tarayıcı yazıyor; JS yoksa boş kalır ve sunucu
  // bu kontrolü atlar.
  useEffect(() => {
    if (acilisRef.current) acilisRef.current.value = String(Date.now());
  }, []);

  // Akış Kartı'ndan ön dolum. `?sektor=` varsa o kazanır (bağlantı açık bir
  // niyet bildirir); yoksa depodaki seçim kullanılır.
  useEffect(() => {
    const uygula = (durum: { sektor: string | null; eksikler: string[] }) => {
      const panel = panelSektoru(durum.sektor);
      if (!baslangicSektoru && panel && sektorler.some((s) => s.anahtar === panel)) {
        setSektor(panel);
      }
      setSecilenEksikler(durum.eksikler.filter((e) => eksikler.some((x) => x.anahtar === e)));
    };
    uygula(akisOku());
    return akisDinle(uygula);
  }, [baslangicSektoru, sektorler, eksikler]);

  // Başarıda teşekkür sayfasına geç; geri tuşu formu yeniden göndermesin.
  useEffect(() => {
    if (sonuc?.durum === 'ok') yonlendirici.replace(tesekkurYolu);
  }, [sonuc, yonlendirici, tesekkurYolu]);

  /* HATA NET OLSUN: sunucu bir alanı reddettiyse imleç DOĞRUDAN o alana
     gider ve alan görünür olana kadar kaydırılır; alan adı yoksa genel
     bildirime odaklanılır (`tabIndex={-1}` bu yüzden var). Uzun formda
     "gönderilemedi" yazısının ekranın dışında kalması en sık görülen
     erişilebilirlik hatası — bu etki onu kapatıyor.
     `prefers-reduced-motion` altında yumuşak kaydırma istenmez. */
  useEffect(() => {
    if (sonuc?.durum !== 'hata') return;
    const bozukAlan = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    const hedef = bozukAlan ?? bildirimRef.current;
    if (!hedef) return;
    hedef.focus({ preventScroll: true });
    const yumusak = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    hedef.scrollIntoView({ block: 'center', behavior: yumusak ? 'smooth' : 'auto' });
  }, [sonuc]);

  const hata = sonuc?.durum === 'hata' ? sonuc : null;
  const alanHatasi = (ad: string) => (hata?.alan === ad ? hata.mesaj : null);
  const bozuk = (ad: string) => (hata?.alan === ad ? true : undefined);

  const seciliSektorAdi = sektorler.find((s) => s.anahtar === sektor)?.ad ?? null;
  const seciliEksikAdlari = eksikler
    .filter((e) => secilenEksikler.includes(e.anahtar))
    .map((e) => e.ad);

  const eksikDegistir = (anahtar: string) =>
    setSecilenEksikler((onceki) =>
      onceki.includes(anahtar) ? onceki.filter((e) => e !== anahtar) : [...onceki, anahtar],
    );

  return (
    <form className="af-form af-tf" action={gonder} id={formId} ref={formRef}>
      {/* Bal küpü: gerçek kullanıcı görmez, ekran okuyucu da okumaz. */}
      <input
        className="af-balkupu"
        type="text"
        name="web_adresi"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <input type="hidden" name="acilis" ref={acilisRef} defaultValue="" />

      {sonuc?.durum === 'ok' ? (
        <p className="af-tf-bildirim af-tf-bildirim--olumlu" role="status">
          <strong>Talebiniz bize ulaştı.</strong>
          <span>{sonuc.mesaj} Teşekkür sayfasına geçiliyor.</span>
        </p>
      ) : null}

      {hata && !hata.alan ? (
        <p
          className="af-tf-bildirim af-tf-bildirim--hata"
          role="alert"
          ref={bildirimRef}
          tabIndex={-1}
        >
          <strong>Gönderilemedi.</strong>
          <span>{hata.mesaj}</span>
        </p>
      ) : null}

      {/* Analiz kipi: sektör ve eksikler 1. ve 2. adımdan geliyor; ziyaretçi
          ne göndereceğini formun içinde de görür. */}
      {akisModu ? (
        <div className="af-tf-ozet">
          <dl>
            <div className="af-tf-ozet-satir">
              <dt>Sektör</dt>
              <dd>{seciliSektorAdi ?? 'seçilmedi'}</dd>
            </div>
            <div className="af-tf-ozet-satir">
              <dt>Eksikler</dt>
              <dd>
                {seciliEksikAdlari.length ? seciliEksikAdlari.join(', ') : 'işaretlenmedi'}
              </dd>
            </div>
          </dl>
          <p className="af-yardim">
            Değiştirmek isterseniz{' '}
            <a className="af-bag" href="#adim-1">
              1. adıma
            </a>{' '}
            dönebilirsiniz.
          </p>
        </div>
      ) : null}

      <div className="af-form-izgara">
        <p className="af-alan">
          <label className="af-etiket" htmlFor={`${on}-isletme`}>
            İşletme adı<span className="af-etiket-zorunlu">*</span>
          </label>
          <input
            className="af-girdi"
            id={`${on}-isletme`}
            name="isletme"
            type="text"
            required
            maxLength={150}
            autoComplete="organization"
            placeholder="Kök Cafe Lounge"
          />
        </p>

        <p className="af-alan">
          <label className="af-etiket" htmlFor={`${on}-ad`}>
            Ad soyad<span className="af-etiket-zorunlu">*</span>
          </label>
          <input
            className="af-girdi"
            id={`${on}-ad`}
            name="ad"
            type="text"
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            aria-invalid={bozuk('ad')}
            aria-describedby={alanHatasi('ad') ? `${on}-ad-hata` : undefined}
            placeholder="Adınız ve soyadınız"
          />
          {alanHatasi('ad') ? (
            <span className="af-hata-metin" id={`${on}-ad-hata`}>
              {alanHatasi('ad')}
            </span>
          ) : null}
        </p>

        <p className="af-alan">
          <label className="af-etiket" htmlFor={`${on}-telefon`}>
            Telefon<span className="af-etiket-zorunlu">*</span>
          </label>
          <input
            className="af-girdi"
            id={`${on}-telefon`}
            name="telefon"
            type="tel"
            inputMode="tel"
            required
            maxLength={40}
            autoComplete="tel"
            aria-invalid={bozuk('telefon')}
            aria-describedby={alanHatasi('telefon') ? `${on}-tel-hata` : `${on}-tel-yardim`}
            placeholder="05__ ___ __ __"
          />
          {alanHatasi('telefon') ? (
            <span className="af-hata-metin" id={`${on}-tel-hata`}>
              {alanHatasi('telefon')}
            </span>
          ) : (
            <span className="af-yardim" id={`${on}-tel-yardim`}>
              Yalnız size dönmek için kullanılır.
            </span>
          )}
        </p>

        <p className="af-alan">
          <label className="af-etiket" htmlFor={`${on}-eposta`}>
            E-posta
          </label>
          <input
            className="af-girdi"
            id={`${on}-eposta`}
            name="eposta"
            type="email"
            maxLength={160}
            autoComplete="email"
            aria-invalid={bozuk('eposta')}
            aria-describedby={alanHatasi('eposta') ? `${on}-eposta-hata` : undefined}
            placeholder="ornek@isletmeniz.com"
          />
          {alanHatasi('eposta') ? (
            <span className="af-hata-metin" id={`${on}-eposta-hata`}>
              {alanHatasi('eposta')}
            </span>
          ) : null}
        </p>

        {akisModu ? null : (
          <p className="af-alan">
            <label className="af-etiket" htmlFor={`${on}-sektor`}>
              Sektör
            </label>
            <select
              className="af-girdi"
              id={`${on}-sektor`}
              name="sektor"
              value={sektor}
              onChange={(e) => setSektor(e.target.value)}
            >
              <option value="">Seçmek istemiyorum</option>
              {sektorler.map((s) => (
                <option key={s.anahtar} value={s.anahtar}>
                  {s.ad}
                </option>
              ))}
            </select>
          </p>
        )}

        <p className="af-alan af-alan--tam">
          <label className="af-etiket" htmlFor={`${on}-mesaj`}>
            Kısaca ne istiyorsunuz?
          </label>
          <textarea
            className="af-girdi"
            id={`${on}-mesaj`}
            name="mesaj"
            maxLength={1500}
            rows={4}
            placeholder="Örnek: Menümüz basılı, QR menüye geçmek istiyoruz. Instagram hesabımız da uzun süredir güncellenmiyor."
          />
        </p>
      </div>

      {akisModu ? (
        // Analiz kipinde sektör gizli alandan gider; eksikleri sayfadaki
        // kutular `form=` niteliğiyle doğrudan gönderiyor.
        sektor ? <input type="hidden" name="sektor" value={sektor} /> : null
      ) : (
        <fieldset className="af-tf-grup">
          <legend className="af-etiket">Sizce neyin eksiği var? (birkaçını seçebilirsiniz)</legend>
          <div className="af-cipler">
            {eksikler.map((e) => (
              <label className="af-secenek" key={e.anahtar}>
                <input
                  type="checkbox"
                  name="eksik"
                  value={e.anahtar}
                  checked={secilenEksikler.includes(e.anahtar)}
                  onChange={() => eksikDegistir(e.anahtar)}
                />
                {e.ad}
              </label>
            ))}
          </div>
          <p className="af-yardim">
            Emin değilseniz boş bırakın; analizde zaten hepsine bakıyoruz.
          </p>
        </fieldset>
      )}

      <div className="af-tf-onaylar">
        <label className="af-onay">
          <input
            type="checkbox"
            name="kvkk"
            value="evet"
            required
            aria-invalid={bozuk('kvkk')}
            aria-describedby={alanHatasi('kvkk') ? `${on}-kvkk-hata` : undefined}
          />
          <span>
            <a href={kvkkYolu}>KVKK aydınlatma metnini</a> okudum; talebime dönülmesi için ad,
            telefon ve yazdığım bilgilerin işlenmesini kabul ediyorum.
            <span className="af-etiket-zorunlu">*</span>
          </span>
        </label>
        {alanHatasi('kvkk') ? (
          <span className="af-hata-metin" id={`${on}-kvkk-hata`}>
            {alanHatasi('kvkk')}
          </span>
        ) : null}

        <label className="af-onay">
          <input type="checkbox" name="ticari" value="evet" />
          <span>
            Kampanya ve bilgilendirme mesajı almak istiyorum. (isteğe bağlı — işaretlemeseniz de
            talebinize dönüyoruz)
          </span>
        </label>
      </div>

      <div className="af-tf-gonder">
        <Dugme buyuk type="submit" disabled={bekliyor}>
          {bekliyor ? 'Gönderiliyor…' : gonderEtiketi}
        </Dugme>
        <p className="af-dugme-not">
          Bağlayıcı değil, ücretsiz. Aynı gün içinde dönüyoruz.
        </p>
      </div>
    </form>
  );
}
