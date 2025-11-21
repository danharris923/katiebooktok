# 📚 Katie's Gumball Chronicles - Fantasy Book Review Site

> v0 Next.js site with automated weekly Goodreads scraping via GitHub Actions

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/plaguedogs-1509f967/v0-fantasy-book-review)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/kp3i7GiaCx0)

---

## 🎯 Quick Links

- **v0 Editor:** https://v0.app/chat/kp3i7GiaCx0
- **Vercel Deployment:** https://vercel.com/plaguedogs-1509f967/v0-fantasy-book-review
- **Local Docker:** http://localhost:3000
- **Katie's Goodreads:** https://www.goodreads.com/user/show/162126255

**Documentation:**
- [KATIE_SETUP.md](./KATIE_SETUP.md) - Complete setup guide
- [SCRAPER_SETUP.md](./SCRAPER_SETUP.md) - Scraper configuration
- [INTEGRATION_EXAMPLE.tsx](./INTEGRATION_EXAMPLE.tsx) - Code examples

---

## 🚀 What's Been Set Up

### ✅ Docker Configuration
- **Multi-stage Dockerfile** optimized for Next.js 16
- **docker-compose.yml** for easy container management
- **Running at:** http://localhost:3000
- **Status:** Auto-restart enabled

**Docker Commands:**
```bash
# Start
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f web

# Restart
docker-compose restart

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build
```

### ✅ GitHub Actions Automation
- **Weekly scraper** runs every Sunday at 2 AM UTC
- **Manual trigger** available via GitHub UI
- **Auto-commit** scraped data back to repo
- **Auto-deploy** triggers Vercel rebuild on data updates

### ✅ Katie's Information (Pre-configured)
- **User ID:** 162126255
- **Affiliate Tag:** promopenguin-20
- **Amazon Region:** Amazon.ca (Canada)
- **Books:** 121+
- **Reviews:** 21+

### ✅ Data Structure
```
data/
└── katie_books.json          # Scraped Goodreads reviews (auto-updated weekly)
lib/
└── books.ts                  # Data access functions
scripts/
└── scrape-goodreads.js       # Scraper (needs your DO code)
```

---

## 🔧 Quick Setup

### 1. Add GitHub Secrets

**Go to:** Repository Settings → Secrets and variables → Actions

**Add these secrets:**
- `GOODREADS_EMAIL` - Katie's Goodreads login email
- `GOODREADS_PASSWORD` - Katie's Goodreads password

### 2. Add Your Scraper Code

Replace the placeholder in `scripts/scrape-goodreads.js` with your DigitalOcean scraper.

**Requirements:**
- Output to: `data/katie_books.json`
- Use Amazon.ca with affiliate tag: `promopenguin-20`
- Use environment variables for credentials

### 3. Test Locally

```bash
# Run scraper
node scripts/scrape-goodreads.js

# Check output
cat data/katie_books.json
```

### 4. Push and Deploy

```bash
git add .
git commit -m "Add Katie's scraper"
git push origin main
```

### 5. Trigger First Scrape

1. Go to: GitHub Actions tab
2. Click "Scrape Goodreads Weekly"
3. Click "Run workflow"
4. Watch the logs

---

## 📊 Using Scraped Data

### Import Helper Functions

```typescript
import { getAllBooks, getTopRatedBooks } from '@/lib/books';

export default function Page() {
  const books = getAllBooks();  // All 121+ books
  const top = getTopRatedBooks(5);  // Top 5 by rating

  return (
    <div>
      {books.map(book => (
        <BookReview
          key={book.id}
          title={book.title}
          author={book.author}
          rating={book.rating}
          coverImage={book.coverImage}
          review={book.description}
          affiliateLink={book.amazonUrl}  // Includes promopenguin-20!
        />
      ))}
    </div>
  );
}
```

### Available Functions (lib/books.ts)

```typescript
getAllBooks()              // All books
getTopRatedBooks(10)       // Top 10 by rating
getBooksByGenre('Fantasy') // Filter by genre
getBookById('123')         // Single book
getLatestBooks(5)          // 5 most recent
```

See [INTEGRATION_EXAMPLE.tsx](./INTEGRATION_EXAMPLE.tsx) for more examples.

---

## 📁 Project Structure

```
v0-fantasy-book-review/
├── .github/
│   └── workflows/
│       └── scrape-goodreads.yml    # Weekly automation
├── app/
│   ├── page.tsx                    # Main page
│   └── ...                         # Other pages
├── components/
│   ├── book-review.tsx             # Book review component
│   └── ...                         # Other components
├── data/
│   └── katie_books.json            # Scraped data (auto-updated)
├── lib/
│   └── books.ts                    # Data access layer
├── scripts/
│   └── scrape-goodreads.js         # Scraper script
├── docker-compose.yml              # Docker setup
├── Dockerfile                      # Multi-stage build
└── next.config.mjs                 # Next.js config
```

---

## ⏰ Automation Schedule

**GitHub Actions runs:**
- **Automatically:** Every Sunday at 2:00 AM UTC
- **Manually:** Via GitHub Actions UI anytime

**To change schedule:**

Edit `.github/workflows/scrape-goodreads.yml`:
```yaml
schedule:
  - cron: '0 2 * * 0'  # Every Sunday at 2 AM UTC
```

Use [crontab.guru](https://crontab.guru/) to customize.

---

## 🔗 Amazon.ca Affiliate Links

All affiliate links automatically include Katie's tag: `promopenguin-20`

**Format:**
```
https://www.amazon.ca/dp/{ISBN}?tag=promopenguin-20
```

**Search fallback (no ISBN):**
```
https://www.amazon.ca/s?k={BOOK_TITLE}&tag=promopenguin-20
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

**Already deployed at:** https://vercel.com/plaguedogs-1509f967/v0-fantasy-book-review

- Automatically deploys on every push
- When GitHub Actions updates data, Vercel auto-rebuilds
- Free hosting for personal projects

### Option 2: Docker (Local/VPS)

**Currently running at:** http://localhost:3000

**Update with latest data:**
```bash
git pull origin main
docker-compose up -d --build
```

---

## 🐛 Troubleshooting

### Docker won't start
```bash
# Check Docker Desktop is running
docker info

# Start Docker Desktop
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Rebuild
docker-compose up -d --build
```

### GitHub Actions fails
- Verify secrets are added (GOODREADS_EMAIL, GOODREADS_PASSWORD)
- Enable write permissions: Settings → Actions → "Read and write"
- Check logs in Actions tab

### Wrong Amazon region
Ensure scraper outputs `amazon.ca` not `.com`:
```javascript
// ❌ Wrong
amazonUrl: `https://www.amazon.com/...`

// ✅ Correct
amazonUrl: `https://www.amazon.ca/...?tag=promopenguin-20`
```

---

## 📚 Complete Documentation

| File | Description |
|------|-------------|
| [KATIE_SETUP.md](./KATIE_SETUP.md) | Complete setup guide for Katie's site |
| [SCRAPER_SETUP.md](./SCRAPER_SETUP.md) | General scraper configuration |
| [INTEGRATION_EXAMPLE.tsx](./INTEGRATION_EXAMPLE.tsx) | Code examples for using data |

---

## 🎉 Features

✅ **Automated weekly scraping** - Set it and forget it
✅ **Docker containerized** - Easy deployment
✅ **GitHub Actions** - Free automation
✅ **Amazon.ca affiliate** - Earn commissions
✅ **Static export** - Fast loading
✅ **Next.js 16** - Latest features
✅ **TypeScript** - Type safety
✅ **v0 components** - Beautiful UI

---

## ✅ Next Steps

1. [ ] Add GitHub secrets (GOODREADS_EMAIL, GOODREADS_PASSWORD)
2. [ ] Copy your DigitalOcean scraper to `scripts/scrape-goodreads.js`
3. [ ] Test scraper locally
4. [ ] Push to GitHub
5. [ ] Manually trigger workflow
6. [ ] Update `app/page.tsx` to use scraped data
7. [ ] Verify affiliate links work
8. [ ] Customize branding

---

## 📞 Katie's Info

**Brand:** Gumball Chronicles (Katie BookTok)

**Social Media:**
- Instagram: https://www.instagram.com/gumballchronicles
- TikTok: https://www.tiktok.com/@gumballchronicles_
- YouTube: https://www.youtube.com/@Gumballchronicles

**Stats:**
- 📚 121+ books on Goodreads
- ⭐ 21+ reviews
- 🎥 Growing on TikTok/Instagram
- 📖 Focus: Fantasy Romance

---

## 📄 Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui + Radix UI
- **Deployment:** Vercel + Docker
- **Automation:** GitHub Actions
- **Data Source:** Goodreads
- **Affiliate:** Amazon.ca (promopenguin-20)

---

**Built with v0 by Vercel** | **Enhanced with automated Goodreads scraping**
