/**
 * Türk telefon numaraları için normalleştirme.
 *
 * Aynı numara listeye "0532 123 45 67", "+90 532 123 4567", "5321234567",
 * "0 (532) 123-45-67" diye girilebilir. Çift kayıt yakalamak, arama
 * bağlantısı (tel:) ve WhatsApp bağlantısı kurmak için hepsini tek bir
 * anahtara indiriyoruz.
 *
 *   anahtar  — karşılaştırma için: TR numarada ulusal 10 hane ("5321234567"),
 *              444'lü kısa numarada 7 hane ("4441234"), yabancı numarada
 *              "+" ve ülke koduyla ("+4915112345678").
 *   gorunum  — ekranda: "0532 123 45 67", "444 12 34", "+49 15112345678"
 *   tel      — tıklayınca arayan bağlantı: "tel:+905321234567"
 *   whatsapp — yalnızca TR cep numarasında: "https://wa.me/905321234567"
 *
 * Tanınmayan bir şey yazıldıysa (hane sayısı tutmuyor) `gecerli: false`
 * döner; kayıt yine alınır, yalnızca çift kontrolü ve bağlantılar yapılmaz.
 */

export type Telefon = {
  gecerli: boolean;
  anahtar: string | null;
  gorunum: string;
  tel: string | null;
  whatsapp: string | null;
  tur: 'cep' | 'sabit' | 'kurumsal' | 'yabanci' | 'bilinmiyor';
};

function grupla(hane: string, kaliplar: number[]): string {
  const parcalar: string[] = [];
  let i = 0;
  for (const n of kaliplar) {
    parcalar.push(hane.slice(i, i + n));
    i += n;
  }
  return parcalar.filter(Boolean).join(' ');
}

export function telefonCoz(ham: string | null | undefined): Telefon {
  const girdi = (ham ?? '').trim();
  const bos: Telefon = { gecerli: false, anahtar: null, gorunum: girdi, tel: null, whatsapp: null, tur: 'bilinmiyor' };
  if (!girdi) return bos;

  const artiIle = /^\s*(\+|00)/.test(girdi);
  let hane = girdi.replace(/\D/g, '');
  if (!hane) return bos;

  // Uluslararası önek: +90 / 0090 / 90 ile başlayan 12 hane
  if (hane.startsWith('00')) hane = hane.slice(2);
  const turkiyeOnekli = hane.startsWith('90') && hane.length === 12;
  if (artiIle && !hane.startsWith('90')) {
    // Yabancı numara: olduğu gibi, ülke koduyla sakla.
    if (hane.length < 8 || hane.length > 15) return bos;
    return {
      // Ülke kodu 1-3 hane olabildiği için bölmeye çalışmıyoruz.
      gecerli: true, anahtar: `+${hane}`, gorunum: `+${hane}`,
      tel: `tel:+${hane}`, whatsapp: `https://wa.me/${hane}`, tur: 'yabanci',
    };
  }
  if (turkiyeOnekli) hane = hane.slice(2);
  else if (artiIle && hane.startsWith('90')) hane = hane.slice(2);

  // 444 XX XX — kurumsal kısa numara, alan kodu almaz
  if (/^444\d{4}$/.test(hane)) {
    return {
      gecerli: true, anahtar: hane, gorunum: grupla(hane, [3, 2, 2]),
      tel: `tel:${hane}`, whatsapp: null, tur: 'kurumsal',
    };
  }

  // Baştaki tek 0'ı at: 0532... → 532...
  if (hane.length === 11 && hane.startsWith('0')) hane = hane.slice(1);

  if (hane.length !== 10) return bos;

  const ilk = hane[0];
  const gorunum = `0${grupla(hane, [3, 3, 2, 2])}`;
  if (ilk === '5') {
    return {
      gecerli: true, anahtar: hane, gorunum,
      tel: `tel:+90${hane}`, whatsapp: `https://wa.me/90${hane}`, tur: 'cep',
    };
  }
  if (hane.startsWith('850') || hane.startsWith('800') || hane.startsWith('900')) {
    return { gecerli: true, anahtar: hane, gorunum, tel: `tel:+90${hane}`, whatsapp: null, tur: 'kurumsal' };
  }
  if (ilk === '2' || ilk === '3' || ilk === '4') {
    return { gecerli: true, anahtar: hane, gorunum, tel: `tel:+90${hane}`, whatsapp: null, tur: 'sabit' };
  }
  return bos;
}
