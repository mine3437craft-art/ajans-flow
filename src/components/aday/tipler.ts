import type { UcDurum, EkAlanAnahtari } from '@/lib/adaylar';

export type AdayRow = {
  id: number; name: string; contact_person: string | null; phone_raw: string | null;
  phone_norm: string | null; phone_kind: string; city: string | null; source: string | null;
  link: string | null; status: string; next_call_on: string | null; assigned_to: number | null;
  call_count: number; unreached_streak: number; last_call_at: string | null; last_note: string | null;
  has_website: UcDurum; worked_with_agency: UcDurum; social_active: UcDurum; created_at: string;
  sorumlu_ad: string | null;
  son_olay_id: number | null; son_olay_tur: string | null; son_olay_kanal: string | null;
  son_olay_zaman: string | null; son_olay_durum: string | null; son_olay_kisi: string | null;
  geri_alinabilir: boolean | null; baskasi_aradi: boolean | null; diger_listede: boolean | null;
  instagram: string | null; ig_followers: number | null; sector: string | null; gaps: string[];
  share_code: string | null; site_views: number; site_last_view_at: string | null;
};

export type Sablon = { id: number; title: string; body: string; sets_status: string | null };

export type Olay = {
  id: number; kind: string; channel: string | null; status_before: string | null;
  status_after: string | null; next_call_on: string | null; note: string | null;
  created_at: string; user_id: number | null; edited_at: string | null;
  kisi: string | null; duzenleyen: string | null;
};

export type Eylem = (fd: FormData) => Promise<void>;

export type Eylemler = {
  alanGuncelle: Eylem;
  sonucKaydet: Eylem;
  notEkle: Eylem;
  adaySil: Eylem;
  adayGuncelle: (prev: string | null, fd: FormData) => Promise<string | null>;
  geriAl: Eylem;
  sonNotDuzenle: Eylem;
  notDuzenle: Eylem;
  notSil: Eylem;
  tekrarAranacak: Eylem;
  topluGuncelle: Eylem;
  topluSil: Eylem;
  mesajKaydet: Eylem;
};

export type Marka = { yol: string; ad: string; ekAlanlar: EkAlanAnahtari[]; analiz: boolean };
export type Kullanici = { id: number; ad: string; yonetici: boolean };
export type Kisi = { id: number; display_name: string };

/** FormData'yı düz nesneden kurar — istemciden sunucu aksiyonu çağırırken. */
export function formVerisi(alanlar: Record<string, string | number | null | undefined>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(alanlar)) {
    if (v !== null && v !== undefined) fd.set(k, String(v));
  }
  return fd;
}
