/**
 * Google için JSON-LD basan tek bileşen.
 *
 * NEDEN AYRI BİR BİLEŞEN: `JSON.stringify(...)` çıktısını doğrudan
 * `dangerouslySetInnerHTML` ile basmak, veride `</script` dizisi geçtiği an
 * etiketi kapatır ve kalan metin HTML olarak yorumlanır. Sitenin metinleri
 * kendi dosyalarımızdan geliyor, yani bugün böyle bir dizi yok; ama rehber
 * yazılarının gövdesi HTML tutuyor ve iletişim formundan gelen bir metin
 * ileride yapısal veriye girerse delik açılır. `<` karakterini kaynakta
 * kaçırmak bu sınıfı tamamen kapatıyor ve JSON'u bozmuyor: JSON ayrıştırıcı
 * `<` dizisini `<` olarak okur, Google da öyle görür.
 */

/** JSON-LD metnini `<script>` içine güvenle gömülebilir hâle getirir. */
export function jsonLdMetni(veri: unknown): string {
  return JSON.stringify(veri)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function YapisalVeri({ veri }: { veri: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Kaçırma işi jsonLdMetni() içinde yapılıyor — açıklama yukarıda.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: jsonLdMetni(veri) }}
    />
  );
}
