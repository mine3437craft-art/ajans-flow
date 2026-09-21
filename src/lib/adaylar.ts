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
    ekAlanlar: ['web', 'ajans'],
  },
  {
    anahtar: 'minikstarlar', yol: 'minikstarlar', ad: 'Minik Starlar',
    // Ekip "sosyal medyası aktif" notunu 15 kez elle yazmıştı.
    ekAlanlar: ['sosyal'],
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

export type EkAlanAnahtari = 'web' | 'ajans' | 'sosyal';

export type EkAlan = {
  anahtar: EkAlanAnahtari;
  /** prospects tablosundaki sütun */
  sutun: 'has_website' | 'worked_with_agency' | 'social_active';
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
  sosyal: {
    anahtar: 'sosyal', sutun: 'social_active', baslik: 'Sosyal Medya',
    soru: 'Sosyal medyası aktif mi?', simge: '📱',
    etiket: {
      bilinmiyor: { kisa: 'Sosyal ?', uzun: 'Sosyal medya: bakılmadı', rozet: 'b-muted' },
      var: { kisa: 'Sosyal ✓', uzun: 'Sosyal medyası aktif', rozet: 'b-info' },
      yok: { kisa: 'Sosyal ✕', uzun: 'Sosyal medyası yok / pasif', rozet: 'b-warning' },
    },
  },
};

/** Satırdaki ek alan değerini okur. */
export function ekAlanDegeri(
  satir: { has_website: UcDurum; worked_with_agency: UcDurum; social_active: UcDurum },
  ek: EkAlanAnahtari,
): UcDurum {
  return ek === 'web' ? satir.has_website : ek === 'ajans' ? satir.worked_with_agency : satir.social_active;
}

export function markaBul(yol: string | undefined): Marka | null {
  return MARKALAR.find((m) => m.yol === yol) ?? null;
}

export function digerMarka(anahtar: MarkaAnahtari): Marka {
  return MARKALAR.find((m) => m.anahtar !== anahtar)!;
}

/* ---------------- Durumlar ---------------- */

export type Durum =
  | 'aranmadi' | 'tekrar_aranacak' | 'ulasilamadi' | 'detay_iletildi' | 'dusunuyor'
  | 'olumlu' | 'musteri_oldu' | 'olumsuz' | 'yanlis_numara';

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
    anahtar: 'tekrar_aranacak', ad: 'Tekrar Aranacak', dugme: 'Tekrar Ara', rozet: 'b-primary', acik: true,
    varsayilanGun: 0, aciklama: 'Yeniden arama kuyruğuna alındı: "sonra ara", "ARANACAK".',
  },
  {
    anahtar: 'ulasilamadi', ad: 'Ulaşılamadı', dugme: 'Açmadı', rozet: 'b-warning', acik: true,
    varsayilanGun: 1, aciklama: 'Arandı ama ulaşılamadı (açmadı, meşgul, kapalı).',
  },
  {
    anahtar: 'detay_iletildi', ad: 'Detaylar İletildi', dugme: 'Detay İletildi', rozet: 'b-info', acik: true,
    varsayilanGun: 2, aciklama: 'Bilgi / mesaj gönderildi, cevap bekleniyor.',
  },
  {
    anahtar: 'dusunuyor', ad: 'Düşünüyor', dugme: 'Düşünüyor', rozet: 'b-violet', acik: true,
    varsayilanGun: 3, aciklama: 'Konuşuldu, ilgileniyor ama karar vermedi.',
  },
  {
    anahtar: 'olumlu', ad: 'Olumlu', dugme: 'Olumlu', rozet: 'b-success', acik: true,
    varsayilanGun: 1, aciklama: 'Olumlu: görüşme ya da teklif istiyor.',
  },
  {
    anahtar: 'musteri_oldu', ad: 'Müşteri Oldu', dugme: 'Müşteri Oldu', rozet: 'b-dolu-yesil', acik: false,
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
/**
 * Tarihi ne olursa olsun bugünün arama kuyruğuna giren durumlar: yalnızca
 * hiç aranmamış aday. "Tekrar aranacak" da dahil diğer açık durumlar
 * tarihine göre girer — "1 hafta sonra tekrar ara" denmiş aday bugün
 * listeyi doldurmasın. (Tekrar aranacak'a geçişte tarih boşsa bugün kurulur.)
 */
export const HEMEN_ARANACAK: Durum[] = ['aranmadi'];

/**
 * Açık bir duruma elle (tablodan / toplu) geçilince kurulacak tarih.
 * "Tekrar aranacak" her zaman bugün; diğer açık durumlarda mevcut tarih
 * yoksa durumun varsayılanı — aksi halde tarihsiz aday hiçbir kuyruğa
 * girmiyordu. Kapalı durumlarda tarih temizlenir.
 */
export function elleGecisTarihi(durum: Durum, mevcut: string | null): string | null {
  const tanim = DURUM_HARITA[durum];
  if (!tanim?.acik) return null;
  if (durum === 'tekrar_aranacak') return bugun();
  if (mevcut) return mevcut;
  return tanim.varsayilanGun === null ? null : gunSonra(tanim.varsayilanGun);
}
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

/* ---------------- WhatsApp şablonları ---------------- */

const BAGLACLAR = new Set(['ve', 'ile', 'de', 'da', 'ki', 'veya']);

/**
 * Tamamı büyük (ya da tamamı küçük) yazılmış firma adını mesaj için
 * düzeltir: "GALATASARAY KAĞITHANE FUTBOL OKULU" → "Galatasaray Kağıthane
 * Futbol Okulu". 3 harf ve altı kelimeler kısaltma sayılıp büyük kalır
 * (BJK, GS, FB). Karışık yazılmış ada dokunulmaz. Yalnızca mesaj içindir,
 * kayıttaki ad değişmez.
 */
export function mesajAdi(ad: string): string {
  const harfler = ad.replace(/[^\p{L}]/gu, '');
  const hepsiBuyuk = harfler === harfler.toLocaleUpperCase('tr');
  const hepsiKucuk = harfler === harfler.toLocaleLowerCase('tr');
  if (!hepsiBuyuk && !hepsiKucuk) return ad.trim();
  return ad.trim().split(/\s+/).map((k, i) => {
    const kucuk = k.toLocaleLowerCase('tr');
    // Bağlaçlar küçük ("Çiçek Kreş ve Anaokulu"); ilk kelime hariç.
    if (i > 0 && BAGLACLAR.has(kucuk)) return kucuk;
    // Kısaltma: 2 harf (GS, FB, TS) ya da ünlüsüz 3 harf (BJK). "EVİ" gibi
    // ünlülü 3 harfli kelime normal kelimedir.
    const unlusuz = !/[aeıioöuüAEIİOÖUÜ]/.test(k);
    if (k.length <= 2 || (k.length === 3 && unlusuz)) return k.toLocaleUpperCase('tr');
    return kucuk.charAt(0).toLocaleUpperCase('tr') + kucuk.slice(1);
  }).join(' ');
}

/**
 * Şablondaki yer tutucuları doldurur: {ad} {yetkili} {gonderen} {marka}.
 * Yetkili bilinmiyorsa "Merhaba {yetkili}," → "Merhaba," olur.
 */
export function sablonDoldur(
  govde: string,
  degerler: { ad: string; yetkili: string | null; gonderen: string; marka: string },
): string {
  // Değerler işlevle veriliyor: adda "$&" gibi bir dizi olsa replace onu
  // özel desen sanıp metni bozuyordu.
  const ad = mesajAdi(degerler.ad);
  const yetkili = (degerler.yetkili ?? '').trim();
  return govde
    .replace(/\{ad\}/g, () => ad)
    .replace(/\{yetkili\}/g, () => yetkili)
    .replace(/\{gonderen\}/g, () => degerler.gonderen)
    .replace(/\{marka\}/g, () => degerler.marka)
    .replace(/[ \t]+([,.!?])/g, '$1')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

/** Şablonda doldurulmamış "[…]" yeri kaldıysa onu döner (gönderim öncesi uyarı için). */
export function doldurulmamisYer(metin: string): string | null {
  const m = metin.match(/\[[^\]\n]{2,}\]/);
  return m ? m[0] : null;
}
