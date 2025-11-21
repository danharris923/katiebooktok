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

async function fetchBookPlot(page, goodreadsUrl) {
  try {
    await page.goto(goodreadsUrl, {
      waitUntil: 'networkidle2',
      timeout: 20000
    });

    const plot = await page.evaluate(() => {
      // Try multiple selectors for the book description/plot
      const descriptionEl =
        document.querySelector('.BookPageMetadataSection__description .Formatted') ||
        document.querySelector('[data-testid="description"] .Formatted') ||
        document.querySelector('.DetailsLayoutRightParagraph__widthConstrained') ||
        document.querySelector('#description span[style*="display:none"]') ||
        document.querySelector('#description span:last-child');

      return descriptionEl?.textContent?.trim() || '';
    });

    return plot;
  } catch (e) {
    console.error(`    ✗ Error fetching plot: ${e.message}`);
    return '';
  }
}

async function scrapeAllPages() {
  console.log('Starting complete Goodreads scrape with plot summaries...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

  const allBooks = [];
  const baseUrl = `https://www.goodreads.com/review/list/${GOODREADS_USER_ID}?shelf=read&per_page=20&page=`;

  // STEP 1: Scrape basic book info from all pages
  for (let pageNum = 1; pageNum <= 8; pageNum++) {
    console.log(`\nScraping page ${pageNum}/8...`);

    try {
      await page.goto(baseUrl + pageNum, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      const books = await page.evaluate(() => {
        const rows = document.querySelectorAll('#booksBody tr.bookalike');
        return Array.from(rows).map(row => {
          try {
            const viewLink = row.querySelector('.field.actions a[href*="/review/show/"]');
            const id = viewLink?.href?.split('/review/show/')[1] || '';

            const titleEl = row.querySelector('.field.title a');
            const title = titleEl?.textContent?.trim().replace(/\s+/g, ' ') || '';
            const goodreadsUrl = titleEl?.href || '';

            const authorEl = row.querySelector('.field.author a');
            const author = authorEl?.textContent?.trim().replace(/,\s*$/, '') || '';

            const avgRatingEl = row.querySelector('.field.avg_rating .value');
            const avgRating = parseFloat(avgRatingEl?.textContent?.trim() || '0');

            // Get Katie's personal rating text (e.g., "really liked it", "it was amazing")
            const myRatingEl = row.querySelector('.field.rating .staticStars');
            const myRatingClass = myRatingEl?.className || '';
            const myRatingMatch = myRatingClass.match(/staticStar p(\d+)/);
            const myRatingStars = myRatingMatch ? parseInt(myRatingMatch[1]) / 10 : 0;

            // Get Katie's rating description if she left one
            const ratingTextEl = row.querySelector('.field.rating .value .staticStars');
            const ratingText = ratingTextEl?.parentElement?.textContent?.trim()?.replace(/\s+/g, ' ') || '';

            const coverImg = row.querySelector('.field.cover img');
            const coverImage = (coverImg?.src || '').replace(/_.*?_/, '_SY475_');

            const dateEl = row.querySelector('.field.date_read .date_read_value');
            const dateRead = dateEl?.textContent?.trim() || '';

            const reviewEl = row.querySelector('.field.review .value span:last-child');
            let description = reviewEl?.textContent?.trim() || '';

            // If no review, add funny message
            if (!description || description.length < 20) {
              const funnyMessages = [
                "📚 Katie needs to finish her homework on this one! Check back soon for her thoughts.",
                "🎓 Review assignment pending... Katie's still processing this masterpiece!",
                "✍️ Katie's brain is still marinating on this one. Stay tuned!",
                "📝 Book report coming soon! Katie promises she's not procrastinating.",
                "🤔 Katie's still finding the perfect words for this beauty. Patience, young padawan!"
              ];
              const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
              description = ratingText ? `${ratingText}\n\n${randomMessage}` : randomMessage;
            }

            return {
              id,
              title,
              author,
              rating: myRatingStars || avgRating, // Use Katie's rating if available, fallback to avg
              avgRating: avgRating,
              ratingText: ratingText,
              reviews: 0,
              coverImage,
              description: description,
              goodreadsUrl,
              genre: 'Fantasy',
              publishedYear: null,
              dateRead,
              scrapedAt: new Date().toISOString()
            };
          } catch (e) {
            console.error('Error parsing row:', e.message);
            return null;
          }
        }).filter(b => b && b.title && b.author);
      });

      console.log(`  ✓ Found ${books.length} books`);
      allBooks.push(...books);

    } catch (error) {
      console.error(`  ✗ Error on page ${pageNum}:`, error.message);
    }
  }

  // STEP 2: Fetch plot summaries for each book
  console.log(`\n\n📖 Fetching plot summaries for ${allBooks.length} books...`);
  console.log('(This may take a while - about 2-3 minutes)\n');

  for (let i = 0; i < allBooks.length; i++) {
    const book = allBooks[i];
    console.log(`  [${i + 1}/${allBooks.length}] Fetching plot for: ${book.title}`);

    const plot = await fetchBookPlot(page, book.goodreadsUrl);
    book.plot = plot || 'Plot summary not available.';

    console.log(`    ✓ Plot length: ${book.plot.length} characters`);

    // Small delay to be respectful to Goodreads servers
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  await browser.close();

  // Add Amazon affiliate links
  const booksWithLinks = allBooks.map(book => ({
    ...book,
    amazonUrl: buildAmazonAffiliateLink(book.title, book.author)
  }));

  // Save to file
  const outputPath = path.join(__dirname, '../data/katie_books.json');
  fs.writeFileSync(outputPath, JSON.stringify(booksWithLinks, null, 2), 'utf8');

  console.log(`\n✅ Successfully scraped ${booksWithLinks.length} books`);
  console.log(`💾 Saved to: ${outputPath}`);

  return booksWithLinks;
}

scrapeAllPages().catch(error => {
  console.error('❌ Scraping failed:', error);
  process.exit(1);
});
