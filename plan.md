Amaç
Bu case’te amaç, bozuk/tutarsız (glitch’li) ürün verisini yönetilebilir hale getiren küçük bir admin panel geliştirmen.
 Gerçek hayatta sık görülen “kirli veri + admin operasyonu” senaryosunu ölçüyoruz.


Teslim Şekli (Zorunlu)
Çalışma GitHub/GitLab üzerinde bir repo olarak teslim edilecek.


Repo içinde README olacak.


Çalışma boyunca:


Branch kullanmanı,


PR açmanı,


Düzenli commit atmanı bekliyoruz.


Git Kuralları (Zorunlu)
En az 3 feature branch:


feature/products-table


feature/product-detail


feature/edit-product


Her branch için PR açılacak (self-review açıklaması yaz).


En az 10 commit (tek committe her şeyi toplama).


Commit mesajları anlaşılır olmalı.



Teknoloji Kısıtları
React + TypeScript


React Router


React Query (TanStack Query)


Form: React Hook Form + (Zod veya Yup)


UI kütüphanesi serbest (Tailwind / MUI / Chakra / plain CSS…)


Data kaynağı: Mock API serbest (aşağıda öneri var)



Senaryo: Glitch’li Ürün Verisi
Ürün verileri “bozuk” gelebilir:
price bazen "12,90" gibi string formatında


stock bazen negatif


category bazen string, bazen array


updatedAt bazen geçersiz format


name içinde emoji / gereksiz karakterler olabilir


Bazı alanlar eksik gelebilir


Bu yüzden UI’ya basmadan önce normalize eden bir katman yazmanı istiyoruz.
Zorunlu Fonksiyon
normalizeProduct(raw: RawProduct): Product


Raw veriyi güvenli hale getirir


Dönüşte Product modeli her zaman tutarlı olmalı


Ek olarak:
getGlitchReport(raw): GlitchIssue[] gibi bir yapı önerilir (zorunlu değil ama iyi olur)



Önerilen Data Kaynağı (Mock)
Aşağıdaki iki yaklaşımdan birini seçebilirsin:
Seçenek A (Kolay): Repo içi JSON + Fake API
data/products.json dosyası oluştur


src/api/products.ts içinde setTimeout ile API simülasyonu yap:


getProducts()


getProductById(id)


updateProduct(id, patch)


Update işlemi “gerçek DB” olmasa da olur:


In-memory güncelle


veya LocalStorage’a yaz


veya “updated diye simulate et”


Seçenek B (İstersen): Basit json-server vb.
Serbest.
Not: Değerlendirmede asıl önemli olan UI + normalize + akış, backend değil.

Uygulama Ekranları (Zorunlu)
1) Products Table (Liste)
Tablo kolonları:


Name


Price


Stock


Category


GlitchScore


UpdatedAt


Actions (Detail / Edit)


Özellikler:


Arama (name içinde)


Filtre:


kategori


“Sadece glitch’li ürünler”


stok durumu (in-stock / out-of-stock / negative)


Sıralama (en az 2 kolon)


Pagination (client-side da olur)


2) Product Detail (Detay)
Ürün için iki sekme/tab:


Normalized View (temizlenmiş hali)


Raw JSON View (ham veri)


Ayrıca “Glitch açıklaması” alanı:


Bu ürün hangi sorunları içeriyor?


Kısa madde listesi


3) Edit Product (Düzenleme)
En az şu alanlar düzenlenebilir olmalı:


name


price


stock


category


Form validasyonu olmalı


Kaydet butonu ile “update” akışı çalışmalı


Kaydettikten sonra liste ve detayda güncel görünmeli



GlitchScore (Zorunlu)
Her ürüne 0–100 arası bir skor ver:
Amaç: verinin ne kadar “problemli” olduğunu tek sayı ile görmek


Örnek kural seti (sen düzenleyebilirsin):
price parse edilemiyorsa +30


stock < 0 ise +20


updatedAt geçersizse +20


category formatı yanlışsa +10


name boşsa +20


UI’da:
Listede skor görünsün


Skora göre basit badge/label göstermen bonus



Audit Log (Bonus ama güçlü artı)
Edit işlemlerinde local bir “audit log” tut:
“Şu field şu değerden şu değere değişti”


Ekrana koyman şart değil ama JSON olarak tutulması + README’de anlatılması iyi olur



README (Zorunlu)
README’de şu başlıklar mutlaka olsun:
Kurulum


npm install, npm run dev vb.


Kısa Mimari Açıklama


klasör yapısı


data akışı


normalize yaklaşımı


Glitch Handling Stratejin


hangi verileri nasıl normalize ettin?


edge-case yaklaşımın

Değerlendirme Kriterleri
Kirli veriyle başa çıkma (normalize + raporlama)


Kullanıcı akışı (liste → detay → edit)


Kod kalitesi (component organizasyonu, tekrar azaltma, type’lar)


Hata yönetimi (loading/error state)


Git disiplini (branch/PR/commit) + README kalitesi
