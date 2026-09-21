'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import { SONUCLAR, NOT_KALIPLARI, EK_ALANLAR, UC_DURUMLAR, ekAlanDegeri, type UcDurum } from '@/lib/adaylar';
import { telefonCoz } from '@/lib/telefon';
import WhatsAppMenu from './WhatsAppMenu';
import type { AdayRow, Eylem, Kullanici, Marka, Sablon } from './tipler';

const TARIH_SECENEKLERI = [
  { k: 'otomatik', l: 'Otomatik' }, { k: 'yarin', l: 'Yarın' },
  { k: '3gun', l: '3 gün sonra' }, { k: '1hafta', l: '1 hafta sonra' },
  { k: 'yok', l: 'Tarih yok' },
];

/**
 * Arama sonucu ekranı. Tek adayda ya da arama modunda (kuyruk) açılır;
 * sonuç düğmesine basınca kaydedip kapanır veya sıradakine geçer.
 */
export default function SonucEkrani({
  aday, kanalBaslangic, kuyrukta, kuyrukToplam, marka, kullanici, sablonlar, bugunTarih,
  kaydet, mesajKaydet, aramaIsaretle, kaydedildi, kapat,
}: {
  aday: AdayRow;
  kanalBaslangic: 'telefon' | 'whatsapp';
  kuyrukta: boolean;
  kuyrukToplam: number;
  marka: Marka;
  kullanici: Kullanici;
  sablonlar: Sablon[];
  bugunTarih: string;
  kaydet: Eylem;
  mesajKaydet: Eylem;
  aramaIsaretle: (id: number, kanal: 'telefon' | 'whatsapp') => void;
  /** Sonuç gönderildi: kuyruktaysa sıradakine geç, değilse kapat. */
  kaydedildi: (id: number) => void;
  kapat: () => void;
}) {
  const [kanal, setKanal] = useState(kanalBaslangic);
  const [not, setNot] = useState('');
  const [tarihSecim, setTarihSecim] = useState('otomatik');
  const [elleTarih, setElleTarih] = useState('');
  const [ek, setEk] = useState<Partial<Record<'web' | 'ajans' | 'sosyal', UcDurum>>>({});

  const tel = telefonCoz(aday.phone_raw);

  return (
    <>
      <div className="sonuc-perde" onClick={kapat} aria-hidden />
      <div className="sonuc-sayfa" role="dialog" aria-label="Arama sonucu">
        {/* Tarih alanında Enter'a basmak formu ilk submit düğmesiyle
            gönderiyordu; sonuç düğmesine basılmadan kayıt oluşmasın. */}
        <form
          action={kaydet}
          onSubmit={(e) => {
            const submitter = (e.nativeEvent as SubmitEvent).submitter;
            if (!submitter || !(submitter as HTMLButtonElement).name) { e.preventDefault(); return; }
            kaydedildi(aday.id);
          }}
        >
          <input type="hidden" name="id" value={aday.id} />
          <input type="hidden" name="kanal" value={kanal} />
          <input type="hidden" name="note" value={not} />
          <input type="hidden" name="tarih_secim" value={tarihSecim} />
          <input type="hidden" name="tarih" value={elleTarih} />
          <input type="hidden" name="web" value={ek.web ?? ''} />
          <input type="hidden" name="ajans" value={ek.ajans ?? ''} />
          <input type="hidden" name="sosyal" value={ek.sosyal ?? ''} />

          <div className="sonuc-baslik">
            <div style={{ minWidth: 0 }}>
              {kuyrukta && <div className="kuyruk-sayac">Arama modu · sırada {kuyrukToplam} aday</div>}
              <strong>{aday.name}</strong>
              <div className="cell-sub">
                {[aday.contact_person, aday.city, aday.source].filter(Boolean).join(' · ')
                  || (kanal === 'whatsapp' ? 'WhatsApp' : 'Telefon')}
                {aday.call_count > 0 && ` · ${aday.call_count + 1}. deneme`}
              </div>
            </div>
            <button type="button" className="btn-icon" onClick={kapat} aria-label="Kapat">
              <Icon name="close" />
            </button>
          </div>

          {aday.baskasi_aradi && (
            <div className="alert alert-warning" style={{ marginBottom: 12 }}>
              {aday.son_olay_kisi} bu adayla az önce ilgilendi — iki kez aramamak için kontrol et.
            </div>
          )}

          {tel.gecerli ? (
            <div className="sonuc-ara">
              <a href={tel.tel!} className="btn btn-success sonuc-ara-dugme"
                 onClick={() => aramaIsaretle(aday.id, 'telefon')}>
                📞 {tel.gorunum}
              </a>
              <span onClickCapture={() => setKanal('whatsapp')}>
                <WhatsAppMenu aday={aday} sablonlar={sablonlar} gonderen={kullanici.ad}
                              marka={marka.ad} kaydet={mesajKaydet} />
              </span>
            </div>
          ) : (
            <div className="alert alert-warning" style={{ marginBottom: 12 }}>
              Numara anlaşılamadı: {aday.phone_raw ?? 'boş'} — &ldquo;Yanlış No&rdquo; ile işaretleyebilirsin.
            </div>
          )}

          {aday.last_note && (
            <div className="sonuc-son-not">
              <span className="cell-sub">Son not</span> {aday.last_note}
            </div>
          )}

          <div className="not-kaliplari">
            {NOT_KALIPLARI.map((k) => (
              <button key={k} type="button" className="konu"
                      onClick={() => setNot((v) => (v ? `${v}, ${k}` : k))}>
                {k}
              </button>
            ))}
          </div>
          <textarea className="form-control" rows={2} value={not} maxLength={500}
                    onChange={(e) => setNot(e.target.value)}
                    placeholder="Not (isteğe bağlı)" aria-label="Not" />

          {marka.ekAlanlar.length > 0 && (
            <div className="sonuc-ek">
              {marka.ekAlanlar.map((anahtar) => {
                const alan = EK_ALANLAR[anahtar];
                const mevcut = ekAlanDegeri(aday, anahtar);
                const secili = ek[anahtar] ?? mevcut;
                return (
                  <div className="sonuc-ek-satir" key={anahtar}>
                    <span>{alan.simge} {alan.soru}</span>
                    <span className="segment">
                      {UC_DURUMLAR.map((v) => (
                        <button key={v} type="button" className={secili === v ? 'aktif' : ''}
                                onClick={() => setEk((o) => ({ ...o, [anahtar]: v }))}>
                          {v === 'bilinmiyor' ? 'Bilinmiyor' : v === 'var' ? 'Var' : 'Yok'}
                        </button>
                      ))}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="secim-basligi" style={{ marginTop: 14 }}>Sonraki arama</div>
          <div className="tarih-kaliplari">
            {TARIH_SECENEKLERI.map((t) => (
              <button key={t.k} type="button" className={`konu ${tarihSecim === t.k ? 'aktif' : ''}`}
                      onClick={() => setTarihSecim(t.k)}>
                {t.l}
              </button>
            ))}
            <input type="date" className="tarih-secim" value={elleTarih} min={bugunTarih}
                   aria-label="Tarih seç"
                   onChange={(e) => { setElleTarih(e.target.value); setTarihSecim('secili'); }} />
          </div>

          <div className="secim-basligi" style={{ marginTop: 14 }}>Sonuç — dokun ve kaydet</div>
          <div className="sonuc-dugmeleri">
            {SONUCLAR.map((d) => (
              <button key={d.anahtar} type="submit" name="durum" value={d.anahtar}
                      className={`sonuc-dugme s-${d.anahtar}`} title={d.aciklama}>
                {d.dugme}
              </button>
            ))}
          </div>
        </form>
      </div>
    </>
  );
}
