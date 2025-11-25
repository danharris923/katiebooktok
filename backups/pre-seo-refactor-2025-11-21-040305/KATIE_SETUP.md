# 📚 Katie's Gumball Chronicles - Setup Guide

## Katie's Information

**Brand:** Gumball Chronicles (Katie BookTok)

**Goodreads:**
- User ID: `162126255`
- Profile: https://www.goodreads.com/user/show/162126255
- Books: 121+
- Reviews: 21+

**Social Media:**
- Instagram: https://www.instagram.com/gumballchronicles
- TikTok: https://www.tiktok.com/@gumballchronicles_
- YouTube: https://www.youtube.com/@Gumballchronicles

**Amazon Affiliate:**
- Tag: `promopenguin-20`
- Region: **Amazon.ca (Canada)** - NOT Amazon.com!

---

## 🚀 Quick Setup

### 1. Add GitHub Secrets

Go to: `https://github.com/YOUR_USERNAME/v0-fantasy-book-review/settings/secrets/actions`

**Add these two secrets:**

| Name | Value |
|------|-------|
| `GOODREADS_EMAIL` | Katie's Goodreads login email |
| `GOODREADS_PASSWORD` | Katie's Goodreads password |

**Note:** User ID and affiliate tag are already hardcoded in the workflow (safe to expose).

---

### 2. Copy Your DigitalOcean Scraper

Replace the placeholder in:
```
scripts/scrape-goodreads.js
```

**Your scraper must:**
- Read from environment variables:
  - `process.env.GOODREADS_EMAIL`
  - `process.env.GOODREADS_PASSWORD`
  - `process.env.GOODREADS_USER_ID` (162126255)
  - `process.env.AMAZON_AFFILIATE_TAG` (promopenguin-20)
  - `process.env.AMAZON_REGION` (ca)

- Write output to: `data/katie_books.json`

**Example scraper structure:**
```javascript
const fs = require('fs');
const path = require('path');

// Environment variables (automatically set by GitHub Actions)
const GOODREADS_USER_ID = process.env.GOODREADS_USER_ID; // "162126255"
const GOODREADS_EMAIL = process.env.GOODREADS_EMAIL;
const GOODREADS_PASSWORD = process.env.GOODREADS_PASSWORD;
const AMAZON_TAG = process.env.AMAZON_AFFILIATE_TAG; // "promopenguin-20"
const AMAZON_REGION = process.env.AMAZON_REGION; // "ca"

const OUTPUT_FILE = path.join(__dirname, '../data/katie_books.json');

async function scrapeKatiesBooks() {
  console.log(`🕷️  Scraping Katie's Goodreads (${GOODREADS_USER_ID})`);

  // YOUR DIGITALOCEAN SCRAPER CODE HERE
  // ...

  // Build Amazon.ca affiliate links
  const books = scrapedBooks.map(book => ({
    ...book,
    amazonUrl: `https://www.amazon.ca/dp/${book.isbn}?tag=${AMAZON_TAG}`,
    // or search fallback:
    // amazonUrl: `https://www.amazon.ca/s?k=${encodeURIComponent(book.title)}&tag=${AMAZON_TAG}`,
  }));

  // Write to output file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(books, null, 2));
  console.log(`✅ Saved ${books.length} books to ${OUTPUT_FILE}`);
}

scrapeKatiesBooks();
```

---

### 3. Expected JSON Format

Your scraper should output to `data/katie_books.json`:

```json
[
  {
    "id": "string",
    "title": "Fourth Wing",
    "author": "Rebecca Yarros",
    "rating": 4.5,
    "reviews": 1250,
    "coverImage": "https://images-na.ssl-images-amazon.com/...",
    "description": "Dragons, romance, and military academy...",
    "goodreadsUrl": "https://www.goodreads.com/book/show/...",
    "genre": "Fantasy Romance",
    "publishedYear": 2023,
    "amazonUrl": "https://www.amazon.ca/dp/1649374046?tag=promopenguin-20",
    "scrapedAt": "2025-11-20T10:00:00.000Z"
  }
]
```

**Important:**
- Use `amazon.ca` (not `.com`)
- Include affiliate tag: `?tag=promopenguin-20`
- All URLs must be valid and accessible

---

## 📅 Automation Schedule

**GitHub Actions runs:**
- Every **Sunday at 2:00 AM UTC**
- Manual trigger available anytime

**To change schedule:**

Edit `.github/workflows/scrape-goodreads.yml` line 18:

```yaml
schedule:
  # Current: Every Sunday at 2 AM UTC
  - cron: '0 2 * * 0'

  # Examples:
  # - cron: '0 0 * * 1'     # Every Monday at midnight
  # - cron: '0 12 * * *'    # Every day at noon
  # - cron: '0 8 * * 1,4'   # Monday & Thursday at 8 AM
```

Use [crontab.guru](https://crontab.guru/) to test schedules.

---

## 🧪 Testing

### Test Locally

```bash
# Set environment variables
export GOODREADS_USER_ID="162126255"
export GOODREADS_EMAIL="katie@example.com"
export GOODREADS_PASSWORD="password123"
export AMAZON_AFFILIATE_TAG="promopenguin-20"
export AMAZON_REGION="ca"

# Run scraper
node scripts/scrape-goodreads.js

# Check output
cat data/katie_books.json
```

### Test on GitHub

1. Push your scraper code:
   ```bash
   git add scripts/scrape-goodreads.js
   git commit -m "Add Katie's Goodreads scraper"
   git push origin main
   ```

2. Go to: `https://github.com/YOUR_USERNAME/v0-fantasy-book-review/actions`

3. Click **"Scrape Goodreads Weekly"**

4. Click **"Run workflow"** → Select `main` → **"Run workflow"**

5. Watch the logs for any errors

6. Check if `data/katie_books.json` was updated

---

## 🔗 Affiliate Links

### Amazon.ca Format

**With ISBN:**
```
https://www.amazon.ca/dp/{ISBN}?tag=promopenguin-20
```

**Search Fallback (no ISBN):**
```
https://www.amazon.ca/s?k={BOOK_TITLE}&tag=promopenguin-20
```

**Example:**
```javascript
function buildAffiliateLink(book) {
  const tag = 'promopenguin-20';

  if (book.isbn) {
    return `https://www.amazon.ca/dp/${book.isbn}?tag=${tag}`;
  } else {
    const query = encodeURIComponent(`${book.title} ${book.author}`);
    return `https://www.amazon.ca/s?k=${query}&tag=${tag}`;
  }
}
```

---

## 📊 Using the Data in Next.js

### Import Helper Functions

```typescript
import { getAllBooks, getTopRatedBooks } from '@/lib/books';

export default function Page() {
  const books = getAllBooks();
  const topBooks = getTopRatedBooks(5);

  return (
    <div>
      {books.map(book => (
        <BookCard
          key={book.id}
          title={book.title}
          author={book.author}
          rating={book.rating}
          coverImage={book.coverImage}
          amazonUrl={book.amazonUrl}  // Already has affiliate tag!
        />
      ))}
    </div>
  );
}
```

### Available Functions

From `lib/books.ts`:

```typescript
getAllBooks()              // All books from katie_books.json
getTopRatedBooks(10)       // Top 10 by rating
getBooksByGenre('Fantasy') // Filter by genre
getBookById('123')         // Get single book
getLatestBooks(5)          // 5 most recently scraped
```

---

## 🎨 Brand Integration

Update the site to match Katie's branding:

### Site Title
```tsx
<h1>Gumball Chronicles</h1>
<p>Your guide to fantasy, dragons, and swoon-worthy romance</p>
```

### Social Links
```tsx
<SocialLinks
  instagram="https://www.instagram.com/gumballchronicles"
  tiktok="https://www.tiktok.com/@gumballchronicles_"
  youtube="https://www.youtube.com/@Gumballchronicles"
  goodreads="https://www.goodreads.com/user/show/162126255"
/>
```

### Footer
```tsx
<footer>
  <p>© 2025 Gumball Chronicles. All affiliate links support this blog.</p>
  <p>Amazon.ca affiliate: promopenguin-20</p>
</footer>
```

---

## 🚨 Troubleshooting

### "Cannot find module 'axios'" (or similar)

**Solution:** Add dependencies to `package.json`:
```bash
pnpm add axios cheerio puppeteer
git add package.json pnpm-lock.yaml
git commit -m "Add scraper dependencies"
git push
```

### Workflow runs but no commit

**Normal behavior!** Workflow only commits if `katie_books.json` changed.

To force a test commit, modify the JSON manually and push.

### "Permission denied" on commit

**Fix:** Enable write permissions

1. Go to: Settings → Actions → General
2. Workflow permissions → **"Read and write permissions"**
3. Save

### Wrong Amazon region (.com instead of .ca)

**Check your scraper:**
```javascript
// ❌ Wrong
amazonUrl: `https://www.amazon.com/dp/${isbn}?tag=promopenguin-20`

// ✅ Correct
amazonUrl: `https://www.amazon.ca/dp/${isbn}?tag=promopenguin-20`
```

---

## 📦 Deployment

### Vercel (Automatic)

1. Connect repo to Vercel
2. Every commit triggers auto-deploy
3. When GitHub Actions updates `katie_books.json`, Vercel rebuilds automatically

### Docker (Manual)

After GitHub Actions updates the data:

```bash
git pull origin main
docker-compose up -d --build
```

Or set up a webhook for automatic Docker rebuilds.

---

## ✅ Checklist

- [ ] Add `GOODREADS_EMAIL` secret to GitHub
- [ ] Add `GOODREADS_PASSWORD` secret to GitHub
- [ ] Copy DigitalOcean scraper to `scripts/scrape-goodreads.js`
- [ ] Update scraper to use environment variables
- [ ] Verify output file is `data/katie_books.json`
- [ ] Test scraper locally
- [ ] Push to GitHub
- [ ] Manually trigger workflow to test
- [ ] Verify `katie_books.json` was updated
- [ ] Update Next.js components to use `lib/books.ts`
- [ ] Deploy to Vercel/Docker
- [ ] Verify affiliate links use Amazon.ca
- [ ] Test affiliate tag: `promopenguin-20`

---

## 📞 Support

**Need help?**
- Check GitHub Actions logs for errors
- Review `SCRAPER_SETUP.md` for general guidance
- Check `INTEGRATION_EXAMPLE.tsx` for code examples

**Katie's Stats:**
- 121+ books on Goodreads
- 21+ reviews
- Growing TikTok/Instagram following
- Focus: Fantasy Romance 📚✨

Ready to automate Katie's book reviews! 🎉
