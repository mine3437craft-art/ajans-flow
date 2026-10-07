/**
 * QR kod üreticisi — bayt kipi, M düzeltme seviyesi, sürüm 1-6.
 *
 * Dış paket kullanılmıyor (SITE-BRIEF §8: yeni npm paketi yok). Yalnız kısa
 * metinler (URL) için yeterli: en çok 106 bayt. Sürüm 7'den itibaren gereken
 * "sürüm bilgisi" blokları bu yüzden hiç yazılmıyor.
 *
 * Çıktı: her hücre için 0/1 veren kare matris. SVG'ye çeviren yer QrKod.tsx.
 * Sunucuda bir kez çalışır; istemciye hiç JS gitmez.
 *
 * Standart: ISO/IEC 18004. Yerleştirme ve maske sıralaması yaygın
 * uygulamalarla (kazuhikoarase / python-qrcode) birebir aynıdır.
 */

/* ------------------------------------------------------------------ */
/* GF(256) — ilkel polinom 0x11D                                       */
/* ------------------------------------------------------------------ */

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);

(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

function carp(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a] + LOG[b]];
}

/** Üreteç polinomu: (x - α^0)(x - α^1)…(x - α^(n-1)), katsayılar yüksek→düşük. */
function uretecPolinomu(n: number): Uint8Array {
  let g = Uint8Array.from([1]);
  for (let i = 0; i < n; i++) {
    const yeni = new Uint8Array(g.length + 1);
    for (let j = 0; j < g.length; j++) {
      yeni[j] ^= g[j];
      yeni[j + 1] ^= carp(g[j], EXP[i]);
    }
    g = yeni;
  }
  return g;
}

/** Reed-Solomon düzeltme kodları (polinom bölmesinden kalan). */
export function duzeltmeKodlari(veri: Uint8Array, ecSayisi: number): Uint8Array {
  const g = uretecPolinomu(ecSayisi);
  const kalan = new Uint8Array(veri.length + ecSayisi);
  kalan.set(veri);
  for (let i = 0; i < veri.length; i++) {
    const katsayi = kalan[i];
    if (katsayi === 0) continue;
    for (let j = 0; j < g.length; j++) kalan[i + j] ^= carp(g[j], katsayi);
  }
  return kalan.slice(veri.length);
}

/* ------------------------------------------------------------------ */
/* Sürüm tabloları — yalnız M seviyesi, sürüm 1-6                       */
/* ------------------------------------------------------------------ */

type SurumBilgisi = {
  /** Toplam kod sözcüğü (veri + düzeltme). */
  toplam: number;
  /** Blok başına düzeltme kod sözcüğü. */
  ecBlok: number;
  /** [blok sayısı, blok başına veri kod sözcüğü] çiftleri. */
  gruplar: [number, number][];
};

const SURUMLER: Record<number, SurumBilgisi> = {
  1: { toplam: 26, ecBlok: 10, gruplar: [[1, 16]] },
  2: { toplam: 44, ecBlok: 16, gruplar: [[1, 28]] },
  3: { toplam: 70, ecBlok: 26, gruplar: [[1, 44]] },
  4: { toplam: 100, ecBlok: 18, gruplar: [[2, 32]] },
  5: { toplam: 134, ecBlok: 24, gruplar: [[2, 43]] },
  6: { toplam: 172, ecBlok: 16, gruplar: [[4, 27]] },
};

/** Sürüm 2-6'da veri alanının sonunda 7 artık bit bulunur. */
function artikBit(surum: number): number {
  return surum === 1 ? 0 : 7;
}

function veriKodSayisi(s: SurumBilgisi): number {
  return s.gruplar.reduce((t, [blok, veri]) => t + blok * veri, 0);
}

/** M seviyesinde bayt kipi kapasitesi (bayt). Başlık 4 + 8 = 12 bit. */
function kapasite(surum: number): number {
  return Math.floor((veriKodSayisi(SURUMLER[surum]) * 8 - 12) / 8);
}

/** Verilen bayt uzunluğuna yeten en küçük sürüm (1-6) ya da null. */
export function surumSec(baytSayisi: number): number | null {
  for (let s = 1; s <= 6; s++) if (baytSayisi <= kapasite(s)) return s;
  return null;
}

/* ------------------------------------------------------------------ */
/* Bit tamponu                                                         */
/* ------------------------------------------------------------------ */

class BitTamponu {
  bitler: number[] = [];
  ekle(deger: number, uzunluk: number) {
    for (let i = uzunluk - 1; i >= 0; i--) this.bitler.push((deger >>> i) & 1);
  }
}

/* ------------------------------------------------------------------ */
/* Biçim bilgisi — BCH(15,5), üreteç 0x537, maske 0x5412                */
/* ------------------------------------------------------------------ */

const G15 = 0x537;
const G15_MASKE = 0x5412;

function bitBoyu(x: number): number {
  let n = 0;
  while (x !== 0) {
    n++;
    x >>>= 1;
  }
  return n;
}

/** ecBit: L=1 · M=0 · Q=3 · H=2. Burada her zaman M (0). */
export function bicimBilgisi(ecBit: number, maske: number): number {
  const veri = (ecBit << 3) | maske;
  let d = veri << 10;
  while (bitBoyu(d) - bitBoyu(G15) >= 0) d ^= G15 << (bitBoyu(d) - bitBoyu(G15));
  return ((veri << 10) | d) ^ G15_MASKE;
}

/* ------------------------------------------------------------------ */
/* Maske işlevleri (satır i, sütun j)                                  */
/* ------------------------------------------------------------------ */

const MASKELER: ((i: number, j: number) => boolean)[] = [
  (i, j) => (i + j) % 2 === 0,
  (i) => i % 2 === 0,
  (_i, j) => j % 3 === 0,
  (i, j) => (i + j) % 3 === 0,
  (i, j) => (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0,
  (i, j) => ((i * j) % 2) + ((i * j) % 3) === 0,
  (i, j) => (((i * j) % 2) + ((i * j) % 3)) % 2 === 0,
  (i, j) => (((i + j) % 2) + ((i * j) % 3)) % 2 === 0,
];

/* ------------------------------------------------------------------ */
/* Matris kurulumu                                                     */
/* ------------------------------------------------------------------ */

/** -1 = boş · 0 = açık · 1 = koyu */
type Matris = Int8Array[];

function bosMatris(boy: number): Matris {
  return Array.from({ length: boy }, () => new Int8Array(boy).fill(-1));
}

function gostergeDeseni(m: Matris, satir: number, sutun: number) {
  const boy = m.length;
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const y = satir + r;
      const x = sutun + c;
      if (y < 0 || x < 0 || y >= boy || x >= boy) continue;
      const koyu =
        (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
        (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
        (r >= 2 && r <= 4 && c >= 2 && c <= 4);
      m[y][x] = koyu ? 1 : 0;
    }
  }
}

function zamanDeseni(m: Matris) {
  const boy = m.length;
  for (let i = 8; i < boy - 8; i++) {
    const deger = i % 2 === 0 ? 1 : 0;
    if (m[6][i] === -1) m[6][i] = deger;
    if (m[i][6] === -1) m[i][6] = deger;
  }
}

/** Sürüm 2-6'da tek hizalama deseni: merkez (boy-7, boy-7). */
function hizalamaDeseni(m: Matris, surum: number) {
  if (surum < 2) return;
  const merkez = m.length - 7;
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const koyu = Math.max(Math.abs(r), Math.abs(c)) !== 1;
      m[merkez + r][merkez + c] = koyu ? 1 : 0;
    }
  }
}

function bicimYaz(m: Matris, maske: number) {
  const boy = m.length;
  const bitler = bicimBilgisi(0, maske);
  for (let i = 0; i < 15; i++) {
    const bit = ((bitler >> i) & 1) === 1 ? 1 : 0;
    // Dikey kopya (sol üst sütun 8 + sol alt)
    if (i < 6) m[i][8] = bit;
    else if (i < 8) m[i + 1][8] = bit;
    else m[boy - 15 + i][8] = bit;
    // Yatay kopya (sol üst satır 8 + sağ üst)
    if (i < 8) m[8][boy - i - 1] = bit;
    else if (i < 9) m[8][15 - i - 1 + 1] = bit;
    else m[8][15 - i - 1] = bit;
  }
  // Sabit koyu modül
  m[boy - 8][8] = 1;
}

/** Zikzak yerleştirme: sağ alttan başlar, 6. sütunu atlar. */
function veriYaz(m: Matris, bitler: number[], maskeNo: number) {
  const boy = m.length;
  const maske = MASKELER[maskeNo];
  let yon = -1;
  let satir = boy - 1;
  let indeks = 0;

  for (let sutun = boy - 1; sutun > 0; sutun -= 2) {
    const s = sutun <= 6 ? sutun - 1 : sutun;
    for (;;) {
      for (const c of [s, s - 1]) {
        if (m[satir][c] !== -1) continue;
        const bit = indeks < bitler.length ? bitler[indeks] : 0;
        indeks++;
        m[satir][c] = (maske(satir, c) ? bit ^ 1 : bit) as 0 | 1;
      }
      satir += yon;
      if (satir < 0 || satir >= boy) {
        satir -= yon;
        yon = -yon;
        break;
      }
    }
  }
}

/* ------------------------------------------------------------------ */
/* Maske puanlaması (ISO/IEC 18004 §8.8.2)                              */
/* ------------------------------------------------------------------ */

function ceza(m: Matris): number {
  const boy = m.length;
  let puan = 0;

  // 1) Aynı renkte 5+ ardışık modül
  for (let i = 0; i < boy; i++) {
    for (const yatay of [true, false]) {
      let sayac = 1;
      let onceki = -1;
      for (let j = 0; j < boy; j++) {
        const deger = yatay ? m[i][j] : m[j][i];
        if (deger === onceki) sayac++;
        else {
          if (sayac >= 5) puan += 3 + (sayac - 5);
          sayac = 1;
          onceki = deger;
        }
      }
      if (sayac >= 5) puan += 3 + (sayac - 5);
    }
  }

  // 2) 2x2 aynı renk blokları
  for (let i = 0; i < boy - 1; i++) {
    for (let j = 0; j < boy - 1; j++) {
      const d = m[i][j];
      if (d === m[i][j + 1] && d === m[i + 1][j] && d === m[i + 1][j + 1]) puan += 3;
    }
  }

  // 3) 1:1:3:1:1 oranlı gösterge benzeri desen
  const desen = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
  const desenTers = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
  const eslesir = (al: (k: number) => number, d: number[]) => d.every((v, k) => al(k) === v);
  for (let i = 0; i < boy; i++) {
    for (let j = 0; j + 11 <= boy; j++) {
      if (eslesir((k) => m[i][j + k], desen) || eslesir((k) => m[i][j + k], desenTers)) puan += 40;
      if (eslesir((k) => m[j + k][i], desen) || eslesir((k) => m[j + k][i], desenTers)) puan += 40;
    }
  }

  // 4) Koyu modül oranının %50'den sapması
  let koyu = 0;
  for (let i = 0; i < boy; i++) for (let j = 0; j < boy; j++) if (m[i][j] === 1) koyu++;
  const oran = (koyu * 100) / (boy * boy);
  puan += Math.floor(Math.abs(oran - 50) / 5) * 10;

  return puan;
}

/* ------------------------------------------------------------------ */
/* Dışa verilen üretici                                                */
/* ------------------------------------------------------------------ */

export type QrSonuc = {
  /** Kenar uzunluğu (modül sayısı). */
  boy: number;
  surum: number;
  /** satir[y][x] === 1 ise koyu modül. */
  matris: Int8Array[];
  maske: number;
};

/** Veri + düzeltme kod sözcüklerini araya geçirerek bit dizisine çevirir. */
function kodSozcukleri(metin: string, surum: number): number[] {
  const bilgi = SURUMLER[surum];
  const veri = new TextEncoder().encode(metin);
  const toplamVeri = veriKodSayisi(bilgi);

  const tampon = new BitTamponu();
  tampon.ekle(0b0100, 4); // bayt kipi
  tampon.ekle(veri.length, 8); // sürüm 1-9: 8 bitlik uzunluk
  for (const b of veri) tampon.ekle(b, 8);

  // Bitirici + bayta tamamlama
  const sinir = toplamVeri * 8;
  for (let i = 0; i < 4 && tampon.bitler.length < sinir; i++) tampon.bitler.push(0);
  while (tampon.bitler.length % 8 !== 0) tampon.bitler.push(0);

  // Dolgu baytları
  const dolgu = [0xec, 0x11];
  let d = 0;
  while (tampon.bitler.length < sinir) {
    tampon.ekle(dolgu[d % 2], 8);
    d++;
  }

  // Bayta çevir
  const baytlar: number[] = [];
  for (let i = 0; i < tampon.bitler.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | tampon.bitler[i + j];
    baytlar.push(b);
  }

  // Bloklara böl, her bloğa düzeltme kodu üret
  const veriBloklari: number[][] = [];
  const ecBloklari: number[][] = [];
  let p = 0;
  for (const [blokSayisi, blokVeri] of bilgi.gruplar) {
    for (let b = 0; b < blokSayisi; b++) {
      const dilim = Uint8Array.from(baytlar.slice(p, p + blokVeri));
      p += blokVeri;
      veriBloklari.push([...dilim]);
      ecBloklari.push([...duzeltmeKodlari(dilim, bilgi.ecBlok)]);
    }
  }

  // Araya geçirme
  const sira: number[] = [];
  const enUzunVeri = Math.max(...veriBloklari.map((b) => b.length));
  for (let i = 0; i < enUzunVeri; i++) {
    for (const blok of veriBloklari) if (i < blok.length) sira.push(blok[i]);
  }
  for (let i = 0; i < bilgi.ecBlok; i++) {
    for (const blok of ecBloklari) sira.push(blok[i]);
  }

  // Bit dizisi + artık bitler
  const bitler: number[] = [];
  for (const b of sira) for (let i = 7; i >= 0; i--) bitler.push((b >> i) & 1);
  for (let i = 0; i < artikBit(surum); i++) bitler.push(0);
  return bitler;
}

/**
 * Metni QR matrisine çevirir. Metin 106 bayttan uzunsa `null` döner —
 * çağıran yer o zaman QR'ı hiç basmaz (sayfa bozulmaz).
 */
export function qrUret(metin: string): QrSonuc | null {
  const baytSayisi = new TextEncoder().encode(metin).length;
  const surum = surumSec(baytSayisi);
  if (surum === null) return null;

  const bitler = kodSozcukleri(metin, surum);
  const boy = 17 + 4 * surum;

  let enIyi: QrSonuc | null = null;
  let enIyiPuan = Number.POSITIVE_INFINITY;

  for (let maske = 0; maske < 8; maske++) {
    const m = bosMatris(boy);
    gostergeDeseni(m, 0, 0);
    gostergeDeseni(m, boy - 7, 0);
    gostergeDeseni(m, 0, boy - 7);
    hizalamaDeseni(m, surum);
    zamanDeseni(m);
    bicimYaz(m, maske);
    veriYaz(m, bitler, maske);
    const puan = ceza(m);
    if (puan < enIyiPuan) {
      enIyiPuan = puan;
      enIyi = { boy, surum, matris: m, maske };
    }
  }

  return enIyi;
}

/**
 * SVG `d` niteliği. Yan yana koyu modüller tek dikdörtgende birleştirilir;
 * yol verisi yarıya iniyor, çizim aynı kalıyor.
 */
export function qrYolu(sonuc: QrSonuc, sessizKenar = 4): string {
  const parcalar: string[] = [];
  for (let y = 0; y < sonuc.boy; y++) {
    let x = 0;
    while (x < sonuc.boy) {
      if (sonuc.matris[y][x] !== 1) {
        x++;
        continue;
      }
      let uzunluk = 1;
      while (x + uzunluk < sonuc.boy && sonuc.matris[y][x + uzunluk] === 1) uzunluk++;
      parcalar.push(`M${x + sessizKenar} ${y + sessizKenar}h${uzunluk}v1h-${uzunluk}z`);
      x += uzunluk;
    }
  }
  return parcalar.join('');
}
