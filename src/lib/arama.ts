/**
 * Türkçe'ye uygun "kök" araması.
 *
 * Kullanıcı "seçme" yazınca "seçim", "seçili", "seçmek", "seçenek" de
 * bulunsun istiyor. Tam bir Türkçe kök çözümleyici yazmak yerine basit ama
 * işe yarayan bir yol: kelimenin sonundaki yaygın ekleri soy, kalan kökle
 * "bu kökle BAŞLAYAN kelime" ara. Not defteri araması için yanlış pozitif
 * ucuz, kaçırılan sonuç pahalıdır; o yüzden agresif soyuyoruz.
 *
 * Buradaki trFold, veritabanındaki tr_fold() SQL fonksiyonunun bire bir
 * aynısıdır (db/schema.sql). İkisi ayrı düşerse vurgulama ile sonuç
 * listesi birbirini tutmaz.
 */

const KAYNAK = 'İIıŞşĞğÜüÖöÇç';
const HEDEF = 'iiissgguuoocc';

export function trFold(metin: string): string {
  let sonuc = '';
  for (const ch of metin) {
    const i = KAYNAK.indexOf(ch);
    sonuc += i >= 0 ? HEDEF[i] : ch;
  }
  return sonuc.toLowerCase();
}

/**
 * Soyulacak ekler, katlanmış (ASCII) hâlleriyle. ı→i, ü→u, ö→o katlandığı
 * için ünlü uyumu çeşitleri tek forma iner (-ım/-im/-üm → "im"/"um").
 * Uzun ekler önce denenir.
 */
const EKLER = [
  'lerinden', 'larindan', 'lerinde', 'larinda', 'lerini', 'larini', 'lerine', 'larina',
  'lerden', 'lardan', 'lerde', 'larda', 'leri', 'lari', 'ler', 'lar',
  'iyor', 'uyor', 'ecek', 'acak', 'erek', 'arak', 'ince', 'unca', 'inca', 'unce',
  'imiz', 'umuz', 'iniz', 'unuz', 'miz', 'muz', 'niz', 'nuz',
  'mek', 'mak', 'mis', 'mus', 'dik', 'duk', 'tik', 'tuk', 'ken',
  'lik', 'luk', 'siz', 'suz', 'sel', 'sal',
  'nin', 'nun', 'den', 'dan', 'yla', 'yle', 'dir', 'dur', 'tir', 'tur',
  'la', 'le', 'de', 'da', 'te', 'ta', 'ci', 'cu', 'li', 'lu', 'ip', 'up',
  'im', 'um', 'in', 'un', 'si', 'su', 'yi', 'yu', 'ye', 'ya', 'me', 'ma',
  'di', 'du', 'ti', 'tu', 'se', 'sa', 'ir', 'ur', 'er', 'ar', 'en', 'an', 'ek', 'ak',
  'i', 'u', 'e', 'a',
];

const UNLU = new Set(['a', 'e', 'i', 'u', 'o']);
/** Ünsüz yumuşaması geri alınır: kitabı → kitap, rengi → renk. */
const SERTLES: Record<string, string> = { b: 'p', d: 't', g: 'k', c: 'c' };

const EN_KISA_KOK = 3;

/**
 * Bir kelimenin arama varyantları: kendisi, soyulmuş kökü ve (yumuşama
 * varsa) sertleştirilmiş kökü. Hepsi katlanmış ASCII.
 */
export function kokVaryantlari(kelime: string): string[] {
  const temiz = trFold(kelime).replace(/[^a-z0-9]/g, '');
  if (temiz.length < 2) return [];

  const varyantlar = new Set<string>([temiz]);
  let kok = temiz;

  for (let tur = 0; tur < 3; tur++) {
    const ek = EKLER.find((e) => kok.length - e.length >= EN_KISA_KOK && kok.endsWith(e));
    if (!ek) break;
    kok = kok.slice(0, -ek.length);
    varyantlar.add(kok);

    // Soyulan ek ünlüyle başlıyorsa kökün son ünsüzü yumuşamış olabilir
    // (çözünürlüğü → çözünürlük). Soymaya sert hâlden devam ediyoruz ki
    // "çözünürlüğü" ile "çözünürlük" aynı köke insin.
    const son = kok[kok.length - 1];
    if (UNLU.has(ek[0]) && son in SERTLES && SERTLES[son] !== son) {
      kok = kok.slice(0, -1) + SERTLES[son];
      varyantlar.add(kok);
    }
  }
  return [...varyantlar];
}

/**
 * pg_trgm'in similarity()'sine yakın bir üçlü-harf (trigram) benzerliği.
 * Vurgulama tarafında, veritabanının "bulanık" bulduğu kelimeyi ekranda da
 * işaretleyebilmek için. İki ucuna boşluk eklenir; pg_trgm de öyle yapar.
 */
export function ucluBenzerlik(a: string, b: string): number {
  const uclular = (m: string): Set<string> => {
    const d = `  ${m} `;
    const set = new Set<string>();
    for (let i = 0; i + 3 <= d.length; i++) set.add(d.slice(i, i + 3));
    return set;
  };
  const A = uclular(a);
  const B = uclular(b);
  let ortak = 0;
  for (const t of A) if (B.has(t)) ortak++;
  const birlesim = A.size + B.size - ortak;
  return birlesim === 0 ? 0 : ortak / birlesim;
}

/** Bulanık aramada veritabanına giden katlanmış kelimeler. */
export function katlanmisKelimeler(arama: string): string[] {
  return kelimeler(arama).map((k) => trFold(k).replace(/[^a-z0-9]/g, '')).filter((k) => k.length >= 3);
}

/** Veritabanındaki word_similarity eşiği ile aynı tutulmalı. */
export const BULANIK_ESIK = 0.45;

/** Arama kutusundaki metni kelimelere ayırır; 2 harften kısa parçalar atılır. */
export function kelimeler(arama: string): string[] {
  return arama.split(/[\s,;.!?()"']+/).map((k) => k.trim()).filter((k) => k.length >= 2);
}

/**
 * Postgres için desen dizisi: her kelime için `\m(varyant1|varyant2…)`.
 * Sorguda `tr_fold(metin) ~ ALL($1::text[])` ile kullanılır — bütün
 * kelimeler eşleşmeli. Boş dizi her şeyi eşler (ALL('{}') = TRUE).
 */
export function aramaDesenleri(arama: string): string[] {
  return kelimeler(arama)
    .map(kokVaryantlari)
    .filter((v) => v.length > 0)
    .map((v) => `\\m(${v.join('|')})`);
}

/** Vurgulama için: bir kelime katlanınca bu düzenli ifadelerden biriyle başlıyorsa işaretlenir. */
export function vurguDuzenleri(arama: string): RegExp[] {
  return kelimeler(arama)
    .map(kokVaryantlari)
    .filter((v) => v.length > 0)
    .map((v) => new RegExp(`^(${v.join('|')})`));
}

/** Kullanıcıya "seçme → seç…" gibi ne arandığını göstermek için. */
export function kokOzeti(arama: string): string[] {
  return kelimeler(arama).map((k) => {
    const v = kokVaryantlari(k);
    const enKisa = v.reduce((a, b) => (b.length < a.length ? b : a), v[0] ?? k);
    return enKisa;
  });
}
