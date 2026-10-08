# VİDEO SERİSİ — İŞLETME SAHİBİNİN KARARLARI

Bu dosya, `video-serisi-brief.md` ve `video-serisi-brief-v2.md` içindeki
`[BİLİNMİYOR]` işaretli maddelerden **kapatılanları** tutuyor. Brief'i okuyan
yapay zekâ bu dosyayı da okuyacak; çelişki olursa **bu dosya geçerlidir**.

Karar tarihi: 7 Ekim 2026
Kararı veren: işletme sahibi (Eren), sohbette doğrudan

---

## 1) Kurucunun yüzü ve sesi — SERBEST

**Soru:** Videolarda kurucunun yüzü ve sesi kullanılabilir mi? Brief §6.5 ve §7.1 m.3,
§7.3 m.11 bunu `[BİLİNMİYOR]` olarak işaretlemişti.

**Karar: İkisi de serbest.** Hem yüz hem ses kullanılabilir.

**Sonuçları:**
- Brief'in sayfa boyunca geçen **"yüz görünmez"** kuralı *kurucunun kendisi için*
  kaldırıldı. **Müşteriler, çalışanlar ve üçüncü kişiler için kural AYNEN sürüyor** —
  onların yüzü kadraja girmez.
- `AJANS FLOW VİDEO.mp4` (35,8 sn) artık kullanılabilir hâle geldi: **19–26** ve
  **27–34**. saniyelerden iki temiz klip çıkarılabilir (kurucu kameraya konuşuyor).
- **6–18. saniye aralığı HÂLÂ KULLANILAMAZ.** Sebep yüz değil, üçüncü marka:
  Beşiktaş JK arması, "EFES Beşiktaş" sponsor panosu, "Beşiktaş JK Spor Okulları"
  logosu. Tescilli marka kullanımı ayrıca belgelenmedikçe bu aralık videoya girmez.
- Seslendirme kurucunun kendi sesiyle yapılabilir; yapay seslendirme zorunluluğu kalktı.
- Her videoda kurucunun kameraya konuştuğu bir açılış veya kapanış sahnesi mümkün.

---

## 2) Müşteri markalarının gösterimi — İZİN VAR

**Soru:** MAS Go Kart, Kule İstanbul, May Motors, Minik Starlar, Kök Cafe ve diğer
müşteri markaları sosyal medya tanıtım videolarında adıyla/logosuyla gösterilebilir mi?
Brief §7.2 m.5 bunu `[BİLİNMİYOR]` olarak işaretlemişti.

**Karar:** İşletme sahibi aynen şöyle söyledi: *"benim herkesten iznim var, izin almama
gerek yok."*

**Sonuçları:**
- Müşteri markaları **adıyla ve logosuyla** videolarda gösterilebilir. Ayrı yazılı izin
  turu beklenmeyecek.
- **Bu izin müşteri markalarını kapsıyor; başka hiçbir şeyi kapsamıyor.** Aşağıdakiler
  kararın dışında ve kuralları değişmedi:
  - **Üçüncü marka:** Beşiktaş JK, Efes, BMW, Mercedes, sahibinden.com logosu,
    Sparco/Arai gibi ekipman markaları. Bunlar ajansın müşterisi değil; kadraja girmez.
  - **Müzik hakları:** doğrulanmadı (brief §5.4, §7.2 m.6). Elimizdeki 15 klip
    **sessiz** alınacak, üstüne lisanslı müzik konacak. Müşteri izni bu konuyu çözmez.
  - **Çocuk fotoğrafları:** Minik Starlar afişlerindeki çocuklar (brief §7.2 m.9).
    Markanın izni velinin iznini vermez. Afişler kullanılabilir, çocuk yüzü görünen
    kare kullanılmaz.
  - **Kaskta kişi adı:** `mas-gokart-pist-marka-kapanis.mp4` içinde kaskta
    "SELİM ARAS" yazıyor (brief §7.2 m.8). Bu bir kişi adı, marka değil.
  - **Geçmiş kampanyalar:** Mançurya büfe kampanya görseli ve Kule "Frozen Kivi"
    kartı (brief §7.2 m.10) güncel teklif gibi sunulmaz.

---

## 3) Kapanış kartı — ÜÇÜ BİRLİKTE

**Soru:** Kapanış kartında hangi iletişim bilgisi verilecek? Brief §7.3 m.12
`flowajans.com` yayında olmadığı için bunu açık bırakmıştı.

**Karar:** Üçü birlikte — **Instagram hesabı + telefon/WhatsApp + flowajans.com**.

**Sonuçları ve ZORUNLU KOŞUL:**
- `flowajans.com` kapanış kartına **yalnızca alan adı Vercel'e bağlandıktan ve
  HTTPS'te açıldıktan sonra** girer. 7 Ekim 2026 itibarıyla alan adının A kaydı
  Natro'yu (85.159.66.93) gösteriyor ve **HTTPS yanıt vermiyor** — bu hâliyle kartta
  gösterilirse izleyici boş sayfaya düşer.
- Kapanış kartı bu yüzden **iki sürüm** olarak kurulacak:
  - **Sürüm A (alan adı bağlanmadan yayına girilirse):** Instagram + telefon/WhatsApp.
  - **Sürüm B (alan adı bağlandıktan sonra):** Instagram + telefon/WhatsApp +
    flowajans.com.
  Kurgu projesinde kapanış kartı ayrı bir katman olacak ki tek kare değişimiyle
  A'dan B'ye geçilebilsin.
- Kartta görünecek bilgiler (`src/lib/site.ts` → `ILETISIM`):
  - Telefon: **0532 479 63 37** · WhatsApp: aynı numara
  - E-posta: **ajansflow@gmail.com**
  - Konum: **İstanbul / 4.Levent**
  - Çalışma saati **YAZILMAYACAK** (işletme sahibinin kararı)

---

## Değişmeyen kurallar

Aşağıdakiler bu kararlardan etkilenmedi ve aynen geçerli:

- **Fiyat ve teslim süresi hiçbir videoda geçmez.**
- Uydurma yok: müşteri yorumu, ödül, memnuniyet oranı, "%X artış", ciro,
  takipçi sayısı, sertifika, kuruluş yılı, ekip sayısı.
- Gerçek müşteri verisi (plaka, kişi adı, telefon, bakiye, ilan numarası) ekranda
  görünmez. Yazılım ekranları yalnız demo veriyle gösterilir ve üzerinde
  **"örnek veri"** damgası olur.
- QR menü mevzuatında **korku dili yasak**. Karekod menü zorunlu DEĞİL.
- sahibinden konusunda temkinli dil: "ilan açıklaması ve görseli hazırlama, ilan
  yönetim akışı, fiyat araştırması". **Otomatik veri çekme / senkronizasyon
  iddia edilmez.**
- Maket olan şeye maket denir; arka ucu olmayan bir ürün için "bulut, çok cihaz,
  şubeler arası" denmez.

---

## Hâlâ açık kalanlar

Bu kararlar brief §7'nin tamamını kapatmıyor. Açık kalanlar:

| # | Konu | Neden önemli |
|---|---|---|
| 1 | Kule menüsündeki **besin değerleri yer tutucu** (rastgele üretilmiş kalori/protein/yağ) | Yanlış besin değeri göstermek tüketici mevzuatı açısından riskli. Mekâna bildirilmeli; o kareler düzeltilmeden videoya girmez. |
| 2 | Kule menüsünün **yabancı dil çevirileri** eksik ("Sahanda Egg", "Sınırsız Tea") | O kareler elden geçirilmeden gösterilemez. |
| 3 | **Nar POS / "MOLA KAFE"** hangi adla anılacak | Klasör adı `nar-pos`, arayüzdeki marka "MOLA KAFE". Videoda bir ada karar verilmeli. Ayrıca maket olduğu söylenmek zorunda. |
| 4 | **Coin Coffee** ve **Baraka Kanat** vektör logosu diskte yok | Müşteriden istenmeli, yoksa bu iki marka logo şeridinde görünemez. |
| 5 | **Lityum Servis** ve **Dent 50 Clinic** için hiç medya yok | Videoda anılacaklarsa dosya istenmeli. |
| 6 | **MAS Entertainment Platform** videoda anılacak mı | README "FAZ 0 → FAZ 1" diyor, henüz tamamlanmamış. Bitmiş ürün gibi anlatılamaz. |
| 7 | **maymotors.net** ve **minikstarlarligi.com** şu an yayında mı | Ekran kaydı alınacaksa önce açılıp kontrol edilmeli. |
