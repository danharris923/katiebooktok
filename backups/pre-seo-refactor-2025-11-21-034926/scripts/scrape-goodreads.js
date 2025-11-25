#!/usr/bin/env node

/**
 * ============================================
 * Katie's Goodreads Scraper
 * Gumball Chronicles (Katie BookTok)
 * ============================================
 *
 * Scrapes Katie's PUBLIC Goodreads profile
 * No login required!
 *
 * Katie's Goodreads: https://www.goodreads.com/user/show/162126255
 * Amazon Affiliate: promopenguin-20 (Amazon.ca)
 * ============================================
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ============================================
// Configuration
// ============================================
const GOODREADS_USER_ID = process.env.GOODREADS_USER_ID || '162126255';
const AMAZON_AFFILIATE_TAG = process.env.AMAZON_AFFILIATE_TAG || 'promopenguin-20';
const AMAZON_REGION = process.env.AMAZON_REGION || 'ca';
const DATA_FILE = path.join(__dirname, '../data/katie_books.json');

// ============================================
// Helper: Build Amazon.ca Affiliate Link
// ============================================
function buildAmazonAffiliateLink(title, author, isbn = null) {
  const baseUrl = `https://www.amazon.${AMAZON_REGION}`;
  const tag = AMAZON_AFFILIATE_TAG;

  if (isbn) {
    return `${baseUrl}/dp/${isbn}?tag=${tag}`;
  }

  // Search fallback
  const query = encodeURIComponent(`${title} ${author}`);
  return `${baseUrl}/s?k=${query}&tag=${tag}`;
}

// ============================================
// Main Scraper Function
// ============================================
async function scrapeKatiesGoodreads() {
  console.log('🕷️  Starting Katie\'s Goodreads scraper...');
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  console.log(`👤 User: Gumball Chronicles (${GOODREADS_USER_ID})`);
  console.log(`🔗 Affiliate: ${AMAZON_AFFILIATE_TAG} (Amazon.${AMAZON_REGION})`);
  console.log(`📖 Scraping PUBLIC profile (no login required)`);

  let browser;

  try {
    // Launch browser
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set user agent to avoid blocking
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Go to Katie's review list page
    const reviewUrl = `https://www.goodreads.com/review/list/${GOODREADS_USER_ID}?shelf=read&per_page=200`;
    console.log(`📚 Fetching: ${reviewUrl}`);

    await page.goto(reviewUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('✅ Page loaded successfully');

    // Extract book data from the page
    console.log('🔍 Extracting book data...');

    const books = await page.evaluate(() => {
      const bookRows = document.querySelectorAll('#booksBody tr.bookalike');
      const results = [];

      bookRows.forEach((row, index) => {
        try {
          // Book ID
          const bookId = row.id?.replace('review_', '') || `book_${index + 1}`;

          // Cover image
          const coverImg = row.querySelector('.field.cover img');
          const coverImage = coverImg?.src || '';

          // Title and author
          const titleEl = row.querySelector('.field.title a');
          const title = titleEl?.textContent?.trim() || '';
          const bookUrl = titleEl?.href || '';

          const authorEl = row.querySelector('.field.author a');
          const author = authorEl?.textContent?.trim() || '';

          // Rating
          const ratingEl = row.querySelector('.field.rating .staticStars');
          const ratingClass = ratingEl?.className || '';
          const ratingMatch = ratingClass.match(/staticStar p(\d+)/);
          const rating = ratingMatch ? parseInt(ratingMatch[1]) / 10 : 0;

          // Date read
          const dateEl = row.querySelector('.field.date_read .date_read_value');
          const dateRead = dateEl?.textContent?.trim() || '';

          // Review/description
          const reviewEl = row.querySelector('.field.review .value span:last-child');
          const description = reviewEl?.textContent?.trim() || '';

          // Only add if we have at least title and author
          if (title && author) {
            results.push({
              id: bookId,
              title,
              author,
              rating,
              reviews: 0, // Will need to get from book page
              coverImage: coverImage.replace(/_.*?_/, '_SY475_'), // Higher res
              description: description || `A review of ${title} by ${author}`,
              goodreadsUrl: bookUrl,
              genre: 'Fantasy', // Default, can enhance later
              publishedYear: null,
              dateRead,
              scrapedAt: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error(`Error parsing book row ${index}:`, error.message);
        }
      });

      return results;
    });

    console.log(`📖 Found ${books.length} books`);

    // Add Amazon affiliate links
    const booksWithLinks = books.map(book => ({
      ...book,
      amazonUrl: buildAmazonAffiliateLink(book.title, book.author),
    }));

    // Save to file
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(booksWithLinks, null, 2),
      'utf8'
    );

    console.log(`✅ Successfully scraped ${booksWithLinks.length} books`);
    console.log(`💾 Data saved to: ${DATA_FILE}`);

    // Show preview
    console.log('\n📚 Sample books:');
    booksWithLinks.slice(0, 3).forEach((book, i) => {
      console.log(`  ${i + 1}. ${book.title} by ${book.author} (${book.rating}★)`);
    });

  } catch (error) {
    console.error('❌ Scraping failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
      console.log('\n🔚 Browser closed');
    }
  }
}

// ============================================
// Run scraper
// ============================================
scrapeKatiesGoodreads();
