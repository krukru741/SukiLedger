# 🏪 SukiLedger

> Isang simpleng Point-of-Sale (POS) at credit/utang management app para sa mga tindera sa Pilipinas.

---

## 📱 Unsa ang SukiLedger?

Ang **SukiLedger** usa ka web-based na tindahan management app nga nagtabang sa mga may-ari og tindahan nga:
- Mag-manage sa kanilang **imbentaryo** (stock)
- Mag-record sa mga **benta** (cash ug utang)
- Mag-track sa mga **suki** (regular customers) ug ilang balanse
- Makita ang **analytics** ug sales history

---

## ✨ Mga Features

### 🛒 Point of Sale (POS)
- Pagpili og items gikan sa inventory para mag-checkout
- **Pay Cash** — direkta og bayad, awtomatik ang sukli computation
- **Charge to Suki** — i-charge ang items sa credit ng isang suki

### 📦 Inventory / Stock Management
- Mag-add, edit, ug delete ng mga items
- Awtomatik na mag-minus ang stock kada benta
- **Low Stock Alert** — notification kung malapit na maubos ang item

### 📒 Suki Ledger (Utang Tracker)
- I-record ang mga utang ng bawat customer
- I-track ang payment history
- Mag-send ng **SMS reminder** gamit ang customizable na template

### 📊 Analytics
- Tingnan ang daily, weekly, at monthly na sales
- Top-selling products
- Suki debt rankings
- Overall business performance

### ⚙️ Settings
- **Store Info** — pangalan at logo ng tindahan
- **Starting Cash** — kasalukuyang pera sa kahon
- **SMS Template** — i-customize ang mensahe para sa mga suki

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Icons | Lucide React |
| Android | Capacitor JS |
| Animation | Custom CSS (Emil Kowalski design principles) |

---

## 🚀 Setup & Installation

### Requirements
- Node.js v18+
- Supabase account

### Steps

```bash
# 1. I-clone ang repo
git clone <your-repo-url>
cd SukiLedger/store-app

# 2. I-install ang dependencies
npm install

# 3. I-setup ang environment variables
# Gumawa ng .env file sa store-app/ folder:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 4. I-run ang development server
npm run dev
```

### Supabase Tables Required
- `inventory` — stock items
- `suki_accounts` — customer credit accounts
- `suki_history` — transaction records per suki
- `shift_history` — daily shift summary
- `shift_transactions` — individual transactions per shift

---

## 📲 Android Build (Play Store)

Ang app ay naka-setup na gamit ang **CapacitorJS** para sa Android deployment.

```bash
# I-build ang web app
npm run build

# I-sync sa Android
npx cap sync

# I-open sa Android Studio
npx cap open android
```

Sa Android Studio: **Build > Generate Signed Bundle / APK** → i-upload ang `.aab` file sa Google Play Console.

---

## 📁 Project Structure

```
store-app/
├── src/
│   ├── components/          # Main tab components (HomeTab, StockTab, etc.)
│   ├── features/            # Feature-specific components
│   │   ├── pos/             # Point of Sale (cart, modals, checkout)
│   │   ├── inventory/       # Stock management
│   │   ├── ledger/          # Suki credit/utang tracking
│   │   ├── analytics/       # Charts and reports
│   │   └── settings/        # App settings panels
│   ├── services/            # Business logic (statsService, sukiService, etc.)
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Supabase client setup
├── android/                 # Capacitor Android project
└── .agents/                 # AI agent skills (Emil design principles)
```

---

## 🎨 Design Principles

Ang UI animations ay sumusunod sa **Emil Kowalski's design engineering philosophy**:
- ✅ Proper easing curves (Apple-level physics)
- ✅ Button press feedback (`scale(0.97)` on active)
- ✅ Staggered list animations
- ✅ `prefers-reduced-motion` accessibility support

---

## 📋 Planned Features

- [x] Print receipt support
- [ ] Multiple cashier accounts
- [ ] Barcode scanner integration
- [ ] Offline mode (PWA)
- [ ] iOS build (Capacitor)

---

## 📄 License

Private project. All rights reserved.

---

*Gawa para sa mga Pilipinong negosyante. 🇵🇭*
