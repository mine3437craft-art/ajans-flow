/**
 * Yeni müşteri adayı listeleri (Ajans Flow, Minik Starlar) için ortak
 * tanımlar. Sunucu ve istemci birlikte kullandığı için düz modül —
 * veritabanına dokunmaz.
 */

export type MarkaAnahtari = 'ajansflow' | 'minikstarlar';

export type Marka = {
  anahtar: MarkaAnahtari;
  /** URL parçası: /musteri-bulma/<yol> */
  yol: string;
  ad: string;
  /** Sayfa erişim anahtarı (src/lib/permissions.ts PAGE_KEYS) */
  izin: 'aday_ajansflow' | 'aday_minikstarlar';
  /**
   * Bu listede gösterilecek ek işaretler. Ajans Flow'da satışı belirleyen
   * iki soru var: web sitesi var mı, daha önce ajansla çalışmış mı. Minik
   * Starlar'ın işi farklı olduğu için orada gösterilmiyor — istenirse
   * buraya eklemek yeterli, başka değişiklik gerekmiyor.
   */
  ekAlanlar: EkAlanAnahtari[];
};

export const MARKALAR: Marka[] = [
  {
    anahtar: 'ajansflow', yol: 'ajansflow', ad: 'Ajans Flow',
    izin: 'aday_ajansflow', ekAlanlar: ['web', 'ajans'],
  },
  {
    anahtar: 'minikstarlar', yol: 'minikstarlar', ad: 'Minik Starlar',
    izin: 'aday_minikstarlar', ekAlanlar: [],
  },
];

/* ---------------- Üç durumlu işaretler ---------------- */

export type UcDurum = 'bilinmiyor' | 'var' | 'yok';
export const UC_DURUMLAR: UcDurum[] = ['bilinmiyor', 'var', 'yok'];

export function gecerliUcDurum(v: unknown): v is UcDurum {
  return typeof v === 'string' && (UC_DURUMLAR as string[]).includes(v);
}

/** Tıklandıkça bilinmiyor → var → yok → bilinmiyor sırasıyla döner. */
export function sonrakiUcDurum(v: UcDurum): UcDurum {
  return v === 'bilinmiyor' ? 'var' : v === 'var' ? 'yok' : 'bilinmiyor';
}

export type EkAlanAnahtari = 'web' | 'ajans';

export type EkAlan = {
  anahtar: EkAlanAnahtari;
  /** prospects tablosundaki sütun */
  sutun: 'has_website' | 'worked_with_agency';
  /** Tablo başlığı */
  baslik: string;
  /** Soru hâli — sonuç ekranında ve düzenleme formunda */
  soru: string;
  simge: string;
  /** Her üç durumun ekrandaki hâli. */
  etiket: Record<UcDurum, { kisa: string; uzun: string; rozet: string }>;
};

export const EK_ALANLAR: Record<EkAlanAnahtari, EkAlan> = {
  web: {
    anahtar: 'web', sutun: 'has_website', baslik: 'Web Sitesi',
    soru: 'Web sitesi var mı?', simge: '🌐',
    etiket: {
      bilinmiyor: { kisa: 'Web ?', uzun: 'Web sitesi: sorulmadı', rozet: 'b-muted' },
      var: { kisa: 'Web ✓', uzun: 'Web sitesi var', rozet: 'b-info' },
      // Sitesi olmayan işletme bizim için fırsat: vurgulu gösteriliyor.
      yok: { kisa: 'Web ✕', uzun: 'Web sitesi yok', rozet: 'b-warning' },
    },
  },
  ajans: {
    anahtar: 'ajans', sutun: 'worked_with_agency', baslik: 'Ajans Geçmişi',
    soru: 'Daha önce sosyal medyacıyla çalıştı mı?', simge: '🤝',
    etiket: {
      bilinmiyor: { kisa: 'Ajans ?', uzun: 'Ajans geçmişi: sorulmadı', rozet: 'b-muted' },
      var: { kisa: 'Ajans ✓', uzun: 'Daha önce ajansla çalışmış', rozet: 'b-primary' },
      yok: { kisa: 'Ajans ✕', uzun: 'Daha önce ajansla çalışmamış', rozet: 'b-muted' },
    },
  },
};

export function markaBul(yol: string | undefined): Marka | null {
  return MARKALAR.find((m) => m.yol === yol) ?? null;
}

export function digerMarka(anahtar: MarkaAnahtari): Marka {
  return MARKALAR.find((m) => m.anahtar !== anahtar)!;
}

/* ---------------- Durumlar ---------------- */

export type Durum =
  | 'aranmadi' | 'ulasilamadi' | 'dusunuyor' | 'olumlu'
  | 'musteri_oldu' | 'olumsuz' | 'yanlis_numara';

export type DurumTanim = {
  anahtar: Durum;
  ad: string;
  /** Sonuç ekranındaki kısa düğme yazısı */
  dugme: string;
  rozet: string;
  /** Açık = hâlâ peşine düşülecek; kapalı = iş bitti */
  acik: boolean;
  /** Sonuç kaydedilince "tekrar ara" kaç gün sonraya kurulsun (null = tarih silinir) */
  varsayilanGun: number | null;
  aciklama: string;
};

export const DURUMLAR: DurumTanim[] = [
  {
    anahtar: 'aranmadi', ad: 'Aranmadı', dugme: 'Aranmadı', rozet: 'b-muted', acik: true,
    varsayilanGun: null, aciklama: 'Henüz kimse aramadı.',
  },
  {
    anahtar: 'ulasilamadi', ad: 'Ulaşılamadı', dugme: 'Açmadı', rozet: 'b-warning', acik: true,
    varsayilanGun: 1, aciklama: 'Arandı ama ulaşılamadı (açmadı, meşgul, kapalı).',
  },
  {
    anahtar: 'dusunuyor', ad: 'Düşünüyor', dugme: 'Düşünüyor', rozet: 'b-info', acik: true,
    varsayilanGun: 3, aciklama: 'Konuşuldu, ilgileniyor ama karar vermedi.',
  },
  {
    anahtar: 'olumlu', ad: 'Olumlu', dugme: 'Olumlu', rozet: 'b-success', acik: true,
    varsayilanGun: 1, aciklama: 'Olumlu: görüşme ya da teklif istiyor.',
  },
  {
    anahtar: 'musteri_oldu', ad: 'Müşteri Oldu', dugme: 'Müşteri Oldu', rozet: 'b-primary', acik: false,
    varsayilanGun: null, aciklama: 'Anlaşıldı. Müşteriler sayfasına eklemeyi unutma.',
  },
  {
    anahtar: 'olumsuz', ad: 'Olumsuz', dugme: 'Olumsuz', rozet: 'b-danger', acik: false,
    varsayilanGun: null, aciklama: 'İlgilenmiyor ya da bir daha aranmak istemiyor.',
  },
  {
    anahtar: 'yanlis_numara', ad: 'Yanlış Numara', dugme: 'Yanlış No', rozet: 'b-muted', acik: false,
    varsayilanGun: null, aciklama: 'Numara yanlış, kapanmış ya da başkasına ait.',
  },
];

export const DURUM_HARITA: Record<string, DurumTanim> =
  Object.fromEntries(DURUMLAR.map((d) => [d.anahtar, d]));

/** Sonuç ekranında gösterilen seçenekler — "Aranmadı" bir sonuç değil. */
export const SONUCLAR = DURUMLAR.filter((d) => d.anahtar !== 'aranmadi');
export const ACIK_DURUMLAR = DURUMLAR.filter((d) => d.acik).map((d) => d.anahtar);
export const DURUM_ANAHTARLARI = DURUMLAR.map((d) => d.anahtar);

export function gecerliDurum(v: unknown): v is Durum {
  return typeof v === 'string' && (DURUM_ANAHTARLARI as string[]).includes(v);
}

/** Sonuç ekranındaki tek dokunuşluk not parçaları. */
export const NOT_KALIPLARI = [
  'Meşgul', 'Yetkili yoktu', 'Sonra ara dedi', 'Bilgi istedi',
  'Fiyat sordu', 'İlgilenmiyor', 'Bir daha aranmasın',
];

/* ---------------- Tarih (Europe/Istanbul) ---------------- */
// Sunucu UTC'de çalışıyor. "Bugün", "yarın", "gecikmiş" hesapları Türkiye
// saatine göre yapılmazsa gece yarısından sonra bir gün kayıyor.

const ISTANBUL = 'Europe/Istanbul';

/** Türkiye'ye göre bugünün tarihi: YYYY-AA-GG */
export function bugun(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ISTANBUL, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
}

/** Bugünden n gün sonrası (YYYY-AA-GG). Pazara denk gelirse pazartesiye kayar. */
export function gunSonra(n: number, pazariAtla = true): string {
  const [y, a, g] = bugun().split('-').map(Number);
  const d = new Date(Date.UTC(y, a - 1, g));
  d.setUTCDate(d.getUTCDate() + n);
  if (pazariAtla && d.getUTCDay() === 0) d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Sonuç kaydedilince kurulacak "tekrar ara" tarihi.
 * Üst üste ulaşılamayan numaralarda aralık açılır: 1-2. denemede yarın,
 * 3-4'te 3 gün, 5'ten sonra 1 hafta. Böylece hiç açmayan numara her gün
 * kuyruğu doldurmaz.
 */
export function sonrakiAramaTarihi(durum: Durum, ulasilamadiSerisi: number): string | null {
  const tanim = DURUM_HARITA[durum];
  if (!tanim || tanim.varsayilanGun === null) return null;
  if (durum === 'ulasilamadi') {
    const seri = ulasilamadiSerisi + 1;
    return gunSonra(seri >= 5 ? 7 : seri >= 3 ? 3 : 1);
  }
  return gunSonra(tanim.varsayilanGun);
}

/** "Bugün", "Yarın", "Gecikti · 2 gün", "15 Eyl" gibi kısa etiket. */
export function tarihEtiketi(tarih: string | null): { metin: string; sinif: string } | null {
  if (!tarih) return null;
  const t = tarih.slice(0, 10);
  const b = bugun();
  if (t === b) return { metin: 'Bugün', sinif: 'tarih-bugun' };
  if (t === gunSonra(1, false)) return { metin: 'Yarın', sinif: 'tarih-yakin' };
  const fark = Math.round(
    (Date.parse(`${t}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`)) / 86_400_000,
  );
  if (fark < 0) {
    return { metin: `Gecikti · ${Math.abs(fark)} gün`, sinif: 'tarih-gecikti' };
  }
  const d = new Date(`${t}T00:00:00Z`);
  return {
    metin: new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(d),
    sinif: 'tarih-ileri',
  };
}

/** "2 gün önce", "dün 16:05" gibi son arama etiketi. */
export function gecenSure(zaman: string | null): string {
  if (!zaman) return '—';
  const d = new Date(zaman);
  if (Number.isNaN(d.getTime())) return '—';
  const dakika = Math.round((Date.now() - d.getTime()) / 60_000);
  if (dakika < 1) return 'az önce';
  if (dakika < 60) return `${dakika} dk önce`;
  const saat = Math.round(dakika / 60);
  if (saat < 24) return `${saat} saat önce`;
  const gun = Math.round(saat / 24);
  if (gun === 1) return 'dün';
  if (gun < 30) return `${gun} gün önce`;
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', timeZone: ISTANBUL }).format(d);
}
