/**
 * Excel / Google Sheets'ten yapıştırılan listeyi ayrıştırır.
 *
 * Excel'den kopyalanan satırlar SEKME ile ayrılır; dosyadan gelen CSV
 * noktalı virgül ya da virgül olabilir. Hücrelerde tırnak içinde satır
 * sonu da bulunabilir. Hepsini tek yerde çözüp alan eşleştirmesini
 * tahmin ediyoruz; kullanıcı önizlemede yanlış tahmini düzeltebiliyor.
 */

import { trFold } from './arama';

export type AlanAnahtari = 'name' | 'phone' | 'contact_person' | 'city' | 'source' | 'link' | 'note';

export const ALANLAR: Array<{ anahtar: AlanAnahtari; ad: string }> = [
  { anahtar: 'name', ad: 'Ad / Firma' },
  { anahtar: 'phone', ad: 'Telefon' },
  { anahtar: 'contact_person', ad: 'Yetkili' },
  { anahtar: 'city', ad: 'Şehir / İlçe' },
  { anahtar: 'source', ad: 'Kaynak' },
  { anahtar: 'link', ad: 'Instagram / Web' },
  { anahtar: 'note', ad: 'Not' },
];

/** Başlık satırındaki yazımlar → alan. Hepsi katlanmış (ASCII, küçük harf). */
const BASLIK_ESLERI: Array<[AlanAnahtari, string[]]> = [
  ['name', ['ad', 'isim', 'adsoyad', 'ad soyad', 'firma', 'isletme', 'unvan', 'musteri', 'işletme adı']],
  // 'no' bilerek yok: "Not" başlığı onunla başlıyor ve telefon sayılıyordu.
  ['phone', ['telefon', 'tel', 'numara', 'gsm', 'cep', 'iletisim', 'telefon no']],
  ['contact_person', ['yetkili', 'kisi', 'yetkili kisi', 'ilgili']],
  ['city', ['sehir', 'il', 'ilce', 'bolge', 'semt', 'konum', 'adres']],
  ['source', ['kaynak', 'nereden', 'bulundu']],
  ['link', ['instagram', 'web', 'site', 'link', 'profil', 'url']],
  ['note', ['not', 'notlar', 'aciklama', 'yorum']],
];

export const SATIR_SINIRI = 2000;

/**
 * Ayracı tahmin eder: aday ayraçları sayar, en çok geçeni seçer. Eskiden
 * "sekme varsa sekme" diyordu; notunda tek bir sekme olan noktalı virgüllü
 * bir CSV'de bütün satır tek hücre oluyordu.
 */
export function ayracBul(metin: string): string {
  const ilk = metin.split(/\r?\n/).slice(0, 20).join('\n');
  const say = (c: string) => ilk.split(c).length - 1;
  const adaylar: Array<[string, number]> = [['\t', say('\t')], [';', say(';')], [',', say(',')]];
  adaylar.sort((a, b) => b[1] - a[1]);
  return adaylar[0][1] > 0 ? adaylar[0][0] : '\t';
}

/** Tırnak içindeki ayraç ve satır sonlarını gözeten ayrıştırıcı. */
export function hucreleriAyikla(metin: string, ayrac: string): string[][] {
  const satirlar: string[][] = [];
  let satir: string[] = [];
  let hucre = '';
  let tirnakta = false;

  for (let i = 0; i < metin.length; i++) {
    const c = metin[i];
    if (tirnakta) {
      if (c === '"') {
        if (metin[i + 1] === '"') { hucre += '"'; i++; } else { tirnakta = false; }
      } else {
        hucre += c;
      }
      continue;
    }
    if (c === '"' && hucre === '') { tirnakta = true; continue; }
    if (c === ayrac) { satir.push(hucre); hucre = ''; continue; }
    if (c === '\n' || c === '\r') {
      if (c === '\r' && metin[i + 1] === '\n') i++;
      satir.push(hucre); hucre = '';
      satirlar.push(satir); satir = [];
      continue;
    }
    hucre += c;
  }
  satir.push(hucre);
  satirlar.push(satir);

  // Tamamen boş satırları at, hücreleri kırp.
  return satirlar
    .map((s) => s.map((h) => h.trim()))
    .filter((s) => s.some((h) => h !== ''));
}

/** Bir hücre telefon numarasına benziyor mu (en az 10 rakam). */
function telefonaBenzer(hucre: string): boolean {
  const rakam = hucre.replace(/\D/g, '');
  return rakam.length >= 10 && rakam.length <= 15;
}

export type Eslestirme = Array<AlanAnahtari | null>;

/**
 * İlk satır başlık mı, hangi sütun hangi alan? Başlık yoksa: en çok
 * telefon içeren sütun telefon, kalan ilk metin sütunu ad olur.
 */
export function otomatikEslestir(hucreler: string[][]): { baslikVar: boolean; eslesme: Eslestirme } {
  if (hucreler.length === 0) return { baslikVar: false, eslesme: [] };
  const sutunSayisi = Math.max(...hucreler.map((s) => s.length));
  const ilk = hucreler[0];

  // Başlık tahmini: ilk satırın hücreleri bilinen yazımlara uyuyor mu?
  // İki geçiş: önce tam eşleşme, sonra ön ek. Tek geçişte kısa bir yazım
  // ("tel") başka alanın başlığını kapabiliyor.
  const baslikEslesme: Eslestirme = Array.from({ length: sutunSayisi }, (_, i) => {
    const k = trFold(ilk[i] ?? '').replace(/[^a-z0-9 ]/g, '').trim();
    if (!k) return null;
    for (const [alan, yazimlar] of BASLIK_ESLERI) {
      if (yazimlar.includes(k)) return alan;
    }
    for (const [alan, yazimlar] of BASLIK_ESLERI) {
      if (yazimlar.some((y) => k.startsWith(y))) return alan;
    }
    return null;
  });
  // Tek sütunlu yapıştırmada bir eşleşme yeter; iki sütundan fazlasında
  // yanlış pozitifi önlemek için en az iki eşleşme isteniyor. İçinde
  // telefon görünen satır asla başlık sayılmaz.
  const eslesenBaslik = baslikEslesme.filter(Boolean).length;
  const baslikVar = (eslesenBaslik >= 2 || (sutunSayisi === 1 && eslesenBaslik === 1))
    && !ilk.some((h) => telefonaBenzer(h));

  if (baslikVar) return { baslikVar, eslesme: baslikEslesme };

  // Başlık yok: sütunları içeriğe göre tahmin et.
  const eslesme: Eslestirme = Array.from({ length: sutunSayisi }, () => null);
  let telSutun = -1;
  let enIyi = 0;
  for (let c = 0; c < sutunSayisi; c++) {
    const dolu = hucreler.filter((s) => (s[c] ?? '') !== '');
    if (dolu.length === 0) continue;
    const oran = dolu.filter((s) => telefonaBenzer(s[c])).length / dolu.length;
    if (oran > enIyi && oran >= 0.6) { enIyi = oran; telSutun = c; }
  }
  if (telSutun >= 0) eslesme[telSutun] = 'phone';
  for (let c = 0; c < sutunSayisi; c++) {
    if (eslesme[c]) continue;
    if (hucreler.some((s) => (s[c] ?? '') !== '')) { eslesme[c] = 'name'; break; }
  }
  return { baslikVar: false, eslesme };
}

/** Eşleştirmeyi uygulayıp kayıt nesnelerine çevirir. */
export function satirlariCevir(
  hucreler: string[][], eslesme: Eslestirme, baslikVar: boolean,
): Array<Partial<Record<AlanAnahtari, string>>> {
  return hucreler.slice(baslikVar ? 1 : 0).map((s) => {
    const kayit: Partial<Record<AlanAnahtari, string>> = {};
    eslesme.forEach((alan, i) => {
      if (!alan) return;
      const deger = (s[i] ?? '').trim();
      if (!deger) return;
      if (kayit[alan] === undefined) { kayit[alan] = deger; return; }
      // Telefon iki sütuna yayılmışsa ("Telefon 1" / "Telefon 2") birleştirmek
      // numarayı bozar: ilkini tut, ikinciyi nota yaz.
      if (alan === 'phone') {
        kayit.note = kayit.note ? `${kayit.note} · Diğer tel: ${deger}` : `Diğer tel: ${deger}`;
        return;
      }
      kayit[alan] = `${kayit[alan]} · ${deger}`;
    });
    return kayit;
  });
}
