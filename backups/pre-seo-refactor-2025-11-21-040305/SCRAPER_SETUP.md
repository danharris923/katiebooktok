# 🕷️ Goodreads Scraper Setup Guide

## Overview

This guide explains how to integrate your DigitalOcean Goodreads scraper with GitHub Actions for automated weekly data updates.

---

## 📁 Project Structure

```
v0-fantasy-book-review/
├── .github/
│   └── workflows/
│       └── scrape-goodreads.yml     # GitHub Actions workflow (runs weekly)
├── data/
│   └── books.json                   # Scraped book data (auto-updated)
├── scripts/
│   └── scrape-goodreads.js          # Your scraper code goes here
├── lib/
│   └── books.ts                     # Data access functions
└── app/
    └── page.tsx                      # Main page (use scraped data here)
```

---

## 🔧 Setup Instructions

### 1. Replace Scraper Code

**Copy your DigitalOcean scraper code into:**
```
scripts/scrape-goodreads.js
```

**Requirements:**
- Script must write output to `data/books.json`
- Must use Node.js (GitHub Actions runs Node 20)
- Must match the JSON schema below

**JSON Schema:**
```json
[
  {
    "id": "string",
    "title": "string",
    "author": "string",
    "rating": 4.5,
    "reviews": 1234,
    "coverImage": "https://...",
    "description": "string",
    "goodreadsUrl": "https://www.goodreads.com/...",
    "genre": "Fantasy",
    "publishedYear": 2024,
    "amazonUrl": "https://www.amazon.com/...",
    "scrapedAt": "2025-11-20T10:00:00.000Z"
  }
]
```

### 2. Install Scraper Dependencies

If your scraper needs extra packages (axios, cheerio, puppeteer, etc.):

**Add to `package.json`:**
```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "cheerio": "^1.0.0-rc.12",
    "puppeteer": "^21.5.0"
  }
}
```

**Or install directly:**
```bash
pnpm add axios cheerio puppeteer
```

### 3. Test Scraper Locally

```bash
# Run scraper manually
node scripts/scrape-goodreads.js

# Check output
cat data/books.json
```

### 4. Push to GitHub

```bash
git add .
git commit -m "Add Goodreads scraper with GitHub Actions"
git push origin main
```

---

## ⏰ GitHub Actions Schedule

**Workflow runs:**
- **Automatically:** Every Sunday at 2:00 AM UTC
- **Manually:** Via GitHub Actions UI

**Cron schedule:**
```yaml
schedule:
  - cron: '0 2 * * 0'  # Every Sunday at 2 AM UTC
```

**Change schedule:**
Edit `.github/workflows/scrape-goodreads.yml` line 18:
```yaml
- cron: '0 0 * * 1'  # Every Monday at midnight UTC
- cron: '0 12 * * *' # Every day at noon UTC
- cron: '0 8 * * 1,4' # Monday and Thursday at 8 AM UTC
```

[Cron helper tool](https://crontab.guru/)

---

## 🚀 Manual Trigger

**Run scraper manually via GitHub UI:**

1. Go to: `https://github.com/YOUR_USERNAME/v0-fantasy-book-review/actions`
2. Click **"Scrape Goodreads Weekly"**
3. Click **"Run workflow"** button
4. Select branch (usually `main`)
5. Click green **"Run workflow"** button

The scraper will run immediately and commit results if data changed.

---

## 🔐 Adding Secrets

If your scraper needs API keys or credentials:

**1. Go to GitHub Repository Settings**
- Settings → Secrets and variables → Actions
- Click **"New repository secret"**

**2. Add secrets:**
```
Name: GOODREADS_API_KEY
Value: your-api-key-here
```

**3. Use in workflow:**

Edit `.github/workflows/scrape-goodreads.yml`:
```yaml
- name: 🕷️ Run Goodreads scraper
  env:
    GOODREADS_API_KEY: ${{ secrets.GOODREADS_API_KEY }}
    AMAZON_ASSOCIATE_ID: ${{ secrets.AMAZON_ASSOCIATE_ID }}
  run: node scripts/scrape-goodreads.js
```

**4. Access in scraper:**
```javascript
const apiKey = process.env.GOODREADS_API_KEY;
```

---

## 📊 Using Scraped Data in Next.js

### Option 1: Import Helper Functions

**In any component:**
```typescript
import { getAllBooks, getTopRatedBooks } from '@/lib/books';

export default function Page() {
  const books = getAllBooks();
  const topBooks = getTopRatedBooks(5);

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
          affiliateLink={book.amazonUrl}
        />
      ))}
    </div>
  );
}
```

### Option 2: Direct JSON Import

```typescript
import booksData from '@/data/books.json';

export default function Page() {
  return (
    <div>
      {booksData.map(book => (
        <div key={book.id}>
          <h2>{book.title}</h2>
          <p>by {book.author}</p>
        </div>
      ))}
    </div>
  );
}
```

### Available Helper Functions

**In `lib/books.ts`:**
```typescript
getAllBooks()              // Get all books
getTopRatedBooks(10)       // Get top 10 by rating
getBooksByGenre('Fantasy') // Filter by genre
getBookById('123')         // Get single book
getLatestBooks(5)          // Get 5 most recently scraped
```

---

## 🔄 Automatic Deployment

**After GitHub Actions commits new data:**

✅ **Vercel (automatic):**
- Vercel detects the commit
- Triggers automatic rebuild
- Deploys new version with updated data

✅ **Docker (manual):**
Option 1: Pull and rebuild manually
```bash
git pull origin main
docker-compose up -d --build
```

Option 2: Add webhook to GitHub Actions
```yaml
- name: Deploy to Docker
  run: |
    curl -X POST https://your-server.com/webhook/deploy
```

---

## 🧪 Testing the Workflow

**Test the complete flow:**

1. **Make a small change to `scripts/scrape-goodreads.js`**
2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Test scraper workflow"
   git push
   ```

3. **Manually trigger workflow:**
   - Go to GitHub Actions tab
   - Click "Scrape Goodreads Weekly"
   - Click "Run workflow"

4. **Check logs:**
   - Click on the running workflow
   - Expand steps to see output
   - Verify `data/books.json` was updated

5. **Verify auto-commit:**
   - Check repository commits
   - Should see: "🤖 Auto-update: Weekly Goodreads scrape (2025-11-20)"

---

## 📝 Workflow Steps Explained

```yaml
1. 📥 Checkout repository        # Clone repo code
2. 🟢 Setup Node.js              # Install Node 20
3. 📦 Enable pnpm                # Enable pnpm package manager
4. 📚 Install dependencies       # pnpm install
5. 🕷️ Run Goodreads scraper      # node scripts/scrape-goodreads.js
6. 🔍 Check for data changes     # git diff data/books.json
7. 💾 Commit scraped data        # git commit & push (if changed)
8. 🚀 Deployment triggered       # Vercel auto-deploys
9. 📧 Send notification          # Optional (Discord/Slack)
```

---

## ❓ Troubleshooting

### Workflow fails at "Run scraper" step

**Check:**
- Does `scripts/scrape-goodreads.js` exist?
- Are all dependencies in `package.json`?
- Does scraper exit with code 0 on success?

**Debug:**
```bash
# Test locally
node scripts/scrape-goodreads.js
echo $?  # Should print 0
```

### Scraper runs but no commit

**Reason:** Data didn't change (git diff found no changes)

**This is normal!** The workflow only commits if `data/books.json` changed.

### Permission denied errors

**Check workflow permissions:**

`.github/workflows/scrape-goodreads.yml`:
```yaml
permissions:
  contents: write  # Required to commit
```

**Enable in repo settings:**
- Settings → Actions → General
- Workflow permissions → Read and write

### Missing dependencies

**Error:** `Cannot find module 'axios'`

**Fix:** Add to `package.json` and push:
```bash
pnpm add axios
git add package.json pnpm-lock.yaml
git commit -m "Add scraper dependencies"
git push
```

---

## 📚 Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Cron Schedule Helper](https://crontab.guru/)
- [Vercel Deployment](https://vercel.com/docs/deployments/overview)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

---

## 🎯 Next Steps

1. ✅ Replace `scripts/scrape-goodreads.js` with your DO scraper code
2. ✅ Add any required dependencies to `package.json`
3. ✅ Test scraper locally: `node scripts/scrape-goodreads.js`
4. ✅ Push to GitHub and trigger workflow manually
5. ✅ Update `app/page.tsx` to use `lib/books.ts` functions
6. ✅ Verify automatic weekly runs

**Questions?** Check the troubleshooting section or GitHub Actions logs!
