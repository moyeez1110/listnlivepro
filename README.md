# చౌటుప్పల్ App — ListnLive 🏘️

**Live demo:** `https://moyeez1110.github.io/listnlive`

A hyper-local super app for Choutuppal, Telangana.  
Built with plain HTML/CSS/JS — hosted FREE on GitHub Pages.  
Data powered by Google Sheets — no coding needed to update!

---

## 🚀 Setup in 5 Steps

### Step 1 — Upload files to GitHub
1. Go to [github.com](https://github.com) → Sign in
2. Click **New Repository** → Name it `listnlive` → Public → Create
3. Upload all files (drag & drop or use Upload button)
4. Commit changes

### Step 2 — Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** → Folder: **/ (root)**
4. Click **Save**
5. Your site will be live at: `https://moyeez1110.github.io/listnlive`

### Step 3 — Create Google Sheets (3 sheets needed)

#### Sheet 1: Businesses
Create a Google Sheet with these column headers in Row 1:
```
name | category | description | phone | rating | badge
```
**badge** values: `Featured`, `New`, `Sale` (or leave blank)

#### Sheet 2: News
```
title | tag | date | emoji
```
**emoji** example: 🛣️ 📰 🏆 🚌

#### Sheet 3: Real Estate
```
name | category | description | phone | badge
```
**category** examples: `House for Sale`, `Shop for Rent`, `Land for Sale`, `Flat for Rent`

### Step 4 — Publish Google Sheets as CSV
For EACH sheet:
1. Open the Google Sheet
2. **File → Share → Publish to web**
3. Choose **Sheet1** (or relevant sheet) → **Comma-separated values (.csv)**
4. Click **Publish** → Copy the URL

### Step 5 — Connect Sheets to App
Open `js/app.js` and replace the URLs:
```javascript
const SHEET_URLS = {
  businesses: 'PASTE_YOUR_BUSINESSES_CSV_URL_HERE',
  news:       'PASTE_YOUR_NEWS_CSV_URL_HERE',
  realestate: 'PASTE_YOUR_REALESTATE_CSV_URL_HERE',
};
```
Save and commit — your app now shows live data from Google Sheets!

---

## ✏️ How to Add/Edit Data

Just edit your Google Sheets! Changes appear on the website within a few minutes.

- **Add a new business?** → Add a row to the Businesses sheet
- **Add news?** → Add a row to the News sheet
- **Add property?** → Add a row to the Real Estate sheet
- **No coding required!** ✅

---

## 📱 Features

- 🏪 Business Directory with search & category filter
- 📰 Local News section
- 🏠 Real Estate listings
- 🎡 Spin & Win wheel (daily, saves to device)
- 💎 Pricing Plans (Basic/Pro/Premium/Banner)
- 🚨 Emergency SOS buttons (108/100/104)
- 💬 WhatsApp integration
- 🏙️ Franchise & Agent signup
- 📱 Mobile responsive
- 🌙 Dark theme
- 🇮🇳 Telugu + English

---

## 🎨 Customization

| What to change | Where |
|---|---|
| Phone number | Search `9912353705` in all files |
| App name | `index.html` — `<title>` and logo |
| Colors | `css/style.css` — `:root` CSS variables |
| Categories | `js/app.js` — `CATEGORIES` array |
| Pricing | `index.html` — Pricing section |
| Testimonials | `js/app.js` — `TESTIMONIALS` array |

---

## 📞 Support

WhatsApp: +91 99123 53705  
Made with ❤️ in Telangana
