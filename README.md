# GlitchMarket Admin Panel

Bozuk/tutarsız ürün verisini yöneten küçük bir admin panel. Veri normalizasyonu, glitch raporlama ve mock API üzerinde tam bir CRUD akışı içeriyor.

> Bu proje geliştirme sürecinde [Claude](https://claude.ai) (Anthropic AI) kod asistanı olarak kullanıldı. Branch stratejisi, commit planlaması ve bileşen mimarisi Claude ile birlikte tasarlandı.

---

## Kurulum

```bash
npm install
npm run dev
```

Uygulama `http://localhost:5173` adresinde açılır.

---

## Kısa Mimari Açıklama

### Klasör Yapısı

```
glitchmarket/
├── data/
│   └── products.json          # 20 glitch'li ham ürün verisi
└── src/
    ├── api/
    │   └── products.ts        # Mock API (setTimeout + in-memory overrides)
    ├── components/
    │   ├── edit/              # EditProductForm, AuditLogPanel
    │   ├── layout/            # AppShell (header + navigation)
    │   ├── product/           # ProductTabs, NormalizedView, RawJsonView, GlitchReport
    │   ├── products/          # ProductsTable, ProductsFilters, Pagination
    │   └── ui/                # GlitchBadge, LoadingSpinner, ErrorAlert
    ├── hooks/                 # useProducts, useProduct, useUpdateProduct
    ├── lib/
    │   ├── normalize.ts       # normalizeProduct + getGlitchReport
    │   ├── glitchScore.ts     # calculateGlitchScore
    │   ├── auditLog.ts        # localStorage audit log
    │   └── schemas.ts         # Zod edit form schema
    ├── pages/                 # ProductsPage, ProductDetailPage, EditProductPage
    └── types/
        ├── raw.ts             # RawProduct (loose union types)
        └── product.ts         # Product, GlitchIssue, AuditLogEntry
```

### Veri Akışı

```
data/products.json
  → getProducts() / getProductById()   [setTimeout simülasyonu: 300-400ms]
  → normalizeProduct(raw)              [parse + temizle + skor hesapla]
  → overrides Map ile birleştir        [session içi güncellemeler]
  → TanStack Query cache
  → UI bileşenleri
       → Edit → updateProduct() → invalidateQueries → re-render
```

### Routing (React Router v6)

| URL | Sayfa |
|---|---|
| `/` | Products Table |
| `/products/:id` | Product Detail |
| `/products/:id/edit` | Edit Product |

---

## Normalize Yaklaşımı

Tüm ham veriler `normalizeProduct(raw: RawProduct): Product` fonksiyonundan geçer:

| Alan | Sorun | Strateji |
|---|---|---|
| `price` | `"12,90"`, `"€89.99"`, `"12.90 USD"` | Semboller temizlenir, virgül → nokta, `parseFloat`. Başarısız → `null` |
| `stock` | Negatif veya `"seven"` gibi string | `parseInt`, NaN ise `0` |
| `name` | `null`, boşluk, emoji | Emoji regex ile soyulur, trim. Boşsa `[No Name]` |
| `category` | `string` veya `string[]` veya `null` | Her zaman `string[]` döner |
| `updatedAt` | `"yesterday"`, boş string | `new Date()` parse, NaN ise `null` |

---

## Glitch Handling Stratejisi

### getGlitchReport(raw): GlitchIssue[]

| Sorun Tipi | Kural | Ceza |
|---|---|---|
| `PRICE_UNPARSEABLE` | parsePrice → null | +30 |
| `STOCK_NEGATIVE` | stock < 0 | +20 |
| `UPDATED_AT_INVALID` | new Date() → NaN | +20 |
| `CATEGORY_FORMAT_WRONG` | array veya null | +10 |
| `NAME_EMPTY` | emoji soyulunca boş | +20 |
| `NAME_HAS_GARBAGE` | emoji var, boş değil | +5 |

**GlitchScore** → tüm cezalar toplanır, max 100. Badge renkleri: yeşil (0) / sarı (1-29) / turuncu (30-59) / kırmızı (60-100).

---

## Audit Log

Edit işlemlerinde değişen alanlar `localStorage`'a yazılır:

```
Key: "glitchmarket_audit"
Shape: Record<productId, AuditLogEntry[]>
```

Edit sayfasında "Edit History" paneli olarak görünür, sayfa yenilenince silinmez.

---

## Teknoloji Stack

| Teknoloji | Versiyon |
|---|---|
| React | 19 |
| TypeScript | 5 |
| Vite | 6 |
| React Router | 7 |
| TanStack Query | 5 |
| React Hook Form | 7 |
| Zod | 3 |
| Tailwind CSS | 4 |
