const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const GOODREADS_USER_ID = '162126255';
const AMAZON_AFFILIATE_TAG = 'promopenguin-20';
const AMAZON_REGION = 'ca';

function buildAmazonAffiliateLink(title, author) {
  const baseUrl = `https://www.amazon.${AMAZON_REGION}`;
  const tag = AMAZON_AFFILIATE_TAG;
  const query = encodeURIComponent(`${title} ${author}`);
  return `${baseUrl}/s?k=${query}&tag=${tag}`;
}

async function scrapeTBRShelf() {
  console.log('Starting TBR shelf scrape...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

  // Fetch first page of to-read shelf (get 20 books)
  const url = `https://www.goodreads.com/review/list/${GOODREADS_USER_ID}?shelf=to-read&per_page=20&page=1`;

  console.log('Fetching TBR books...');

  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    const books = await page.evaluate(() => {
      const rows = document.querySelectorAll('#booksBody tr.bookalike');
      return Array.from(rows).map(row => {
        try {
          const titleEl = row.querySelector('.field.title a');
          const title = titleEl?.textContent?.trim().replace(/\s+/g, ' ') || '';

          const authorEl = row.querySelector('.field.author a');
          const author = authorEl?.textContent?.trim().replace(/,\s*$/, '') || '';

          const coverImg = row.querySelector('.field.cover img');
          const coverImage = (coverImg?.src || '').replace(/_.*?_/, '_SY475_');

          const avgRatingEl = row.querySelector('.field.avg_rating .value');
          const avgRating = parseFloat(avgRatingEl?.textContent?.trim() || '0');

          return {
            title,
            author,
            coverImage,
            rating: avgRating,
            releaseInfo: 'Out Now'
          };
        } catch (e) {
          console.error('Error parsing row:', e.message);
          return null;
        }
      }).filter(b => b && b.title && b.author).slice(0, 6); // Get first 6 books
    });

    console.log(`✓ Found ${books.length} TBR books`);

    // Add Amazon affiliate links
    const booksWithLinks = books.map(book => ({
      ...book,
      affiliateLink: buildAmazonAffiliateLink(book.title, book.author)
    }));

    await browser.close();

    // Save to file
    const outputPath = path.join(__dirname, '../data/katie_tbr.json');
    fs.writeFileSync(outputPath, JSON.stringify(booksWithLinks, null, 2), 'utf8');

    console.log(`\n✅ Successfully scraped ${booksWithLinks.length} TBR books`);
    console.log(`💾 Saved to: ${outputPath}`);

    return booksWithLinks;

  } catch (error) {
    console.error('✗ Error scraping TBR:', error.message);
    await browser.close();
    process.exit(1);
  }
}

scrapeTBRShelf().catch(error => {
  console.error('❌ Scraping failed:', error);
  process.exit(1);
});
