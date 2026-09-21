/**
 * Tanıtım sitesinin (/tanitim ve kişiye özel /t/[kod]) dış sözleşmesi.
 * TanitimSayfasi bileşeni bu tiplerle çağrılır; burayı değiştirirken
 * iki rotayı da düşünün.
 */

export type Firsat = {
  anahtar: string;
  baslik: string;
  aciklama: string;
  hizmet: string;
  /** Emoji, ör. "📸" */
  simge: string;
};

export type Kisisel = {
  /** Business name, already nicely cased, e.g. "Dent4 Levent" */
  ad: string;
  /** Sector label or null, e.g. "Kafe / Restoran" */
  sektor: string | null;
  /** Opportunities we noticed for THIS business (0..11 items). */
  firsatlar: Firsat[];
};

export type Iletisim = {
  /** Instagram username without @ */
  instagram: string; // 'ajansflow'
  /** WhatsApp number digits in international format e.g. '905321234567', or null = hide WhatsApp buttons */
  whatsapp: string | null;
};

export type TanitimSayfasiProps = {
  iletisim: Iletisim;
  kisisel?: Kisisel | null;
};
