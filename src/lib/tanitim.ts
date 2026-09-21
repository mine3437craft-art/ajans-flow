import 'server-only';
import { cache } from 'react';
import { sql } from './db';
import { telefonCoz } from './telefon';
import {
  adayEksikleri, mesajAdi, SEKTOR_HARITA, type UcDurum,
} from './adaylar';
import type { Iletisim, Kisisel } from '@/components/tanitim/tipler';

/** Tanıtım sitesindeki Instagram hesabı (DM ve profil bağlantıları). */
export const TANITIM_INSTAGRAM = 'ajansflow';

/**
 * Herkese açık sayfa veritabanını en çok bu kadar bekler; bağlantı zaman
 * aşımı 15 sn — müşteri o kadar boş ekran görmesin.
 */
function sureli<T>(is: Promise<T>, ms: number): Promise<T | 'zaman'> {
  return Promise.race([is, new Promise<'zaman'>((coz) => setTimeout(() => coz('zaman'), ms))]);
}

/** app_config anahtarı: sitede gösterilecek WhatsApp numarası (yönetici girer). */
export const TANITIM_WHATSAPP_ANAHTARI = 'tanitim_whatsapp';

/**
 * Sitedeki iletişim bilgileri. WhatsApp numarası yönetici tarafından
 * Mesaj şablonları sayfasından girilir; girilmemişse sitede WhatsApp
 * düğmeleri gizlenir, Instagram DM kalır. Veritabanına ulaşılamazsa da
 * site açılır — yalnızca WhatsApp düğmesi çıkmaz.
 */
export const tanitimIletisim = cache(async (): Promise<Iletisim> => {
  let whatsapp: string | null = null;
  try {
    const rows = await sureli(sql`
      SELECT deger FROM app_config WHERE anahtar = ${TANITIM_WHATSAPP_ANAHTARI}
    ` as Promise<Array<{ deger: string }>>, 1500);
    const wa = rows === 'zaman' ? null : telefonCoz(rows[0]?.deger ?? null).whatsapp;
    whatsapp = wa ? wa.replace(/^https:\/\/wa\.me\//, '') : null;
  } catch {
    whatsapp = null;
  }
  return { instagram: TANITIM_INSTAGRAM, whatsapp };
});

/** Kişisel tanıtım kodu: 12 haneli onaltılık (schema.sql share_code). */
export function kodGecerli(kod: string): boolean {
  return /^[0-9a-f]{12}$/.test(kod);
}

type SunumSatiri = {
  id: number; name: string; sector: string | null; gaps: string[]; has_website: UcDurum;
};

/**
 * Koda ait adayın müşteriye gösterilecek bilgileri. Yalnızca analizli
 * listeden (Ajans Flow) ve yalnızca ad, sektör ve işaretlenen eksikler —
 * ekibin notları, telefon, durum gibi iç bilgiler bu sayfaya hiç gelmez.
 * null: böyle bir kod yok. 'hata': veritabanına ulaşılamadı (sayfa genel
 * sürümü gösterir, yönetim panelinin hata ekranı müşteriye çıkmaz).
 */
export const kisiselSunum = cache(async (
  kod: string,
): Promise<{ id: number; kisisel: Kisisel } | null | 'hata'> => {
  if (!kodGecerli(kod)) return null;
  let rows: SunumSatiri[] | 'zaman';
  try {
    rows = await sureli(sql`
      SELECT id::int AS id, name, sector, gaps, has_website
      FROM prospects WHERE share_code = ${kod} AND brand = 'ajansflow'
    ` as Promise<SunumSatiri[]>, 4000);
  } catch (hata) {
    console.error('[tanitim] kişisel sunum okunamadı', hata);
    return 'hata';
  }
  if (rows === 'zaman') return 'hata';
  const a = rows[0];
  if (!a) return null;
  return {
    id: a.id,
    kisisel: {
      ad: mesajAdi(a.name),
      // "Diğer" bir sektör sayılmaz: sayfada sektöre özel cümle çıkmasın.
      sektor: a.sector && a.sector !== 'diger' ? SEKTOR_HARITA[a.sector]?.ad ?? null : null,
      firsatlar: adayEksikleri(a).map((e) => ({
        anahtar: e.anahtar, baslik: e.baslik, aciklama: e.aciklama, hizmet: e.hizmet, simge: e.simge,
      })),
    },
  };
});

/**
 * Önizleme botları (WhatsApp / Instagram / Telegram bağlantı kartı
 * oluştururken sayfayı çeker) ve otomatik istemciler sayılmaz. Instagram'ın
 * uygulama içi tarayıcısı gerçek bir kişidir; o sayılır.
 */
// (?<!cu)bot: "CUBOT" marka telefonların tarayıcısı bot sayılmasın. Telegram'ın
// uygulama içi tarayıcısı gerçek kişi; önizleme botu "TelegramBot".
const BOT = /(?<!cu)bot\b|crawl|spider|slurp|facebookexternalhit|facebookcatalog|whatsapp|telegrambot|twitterbot|slackbot|discord|skypeuripreview|linkedinbot|embedly|preview|headless|curl|wget|python|node-fetch|axios|go-http|vercel/i;

export function gercekZiyaretci(userAgent: string | null): boolean {
  return Boolean(userAgent) && !BOT.test(userAgent!);
}

/** Sunumun açıldığını kaydeder (ekip ve botlar hariç — çağıran kontrol eder). */
export async function ziyaretKaydet(id: number) {
  await sql`
    UPDATE prospects SET site_views = site_views + 1, site_last_view_at = NOW()
    WHERE id = ${id}
  `;
}
