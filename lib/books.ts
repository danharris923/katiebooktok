/**
 * ============================================
 * Books Data Layer
 * Provides access to scraped Goodreads data
 * Katie's Goodreads: https://www.goodreads.com/user/show/162126255
 * ============================================
 */

import booksData from '@/data/katie_books.json';

/**
 * Generate URL-friendly slug from book title
 * - Converts to lowercase
 * - Removes special characters (keeps a-z, 0-9, spaces, hyphens)
 * - Replaces spaces with hyphens
 * - Removes multiple consecutive hyphens
 * - Trims leading/trailing hyphens
 *
 * Examples:
 * "Punk 57" → "punk-57"
 * "Hideaway (Devil's Night, #2)" → "hideaway-devils-night-2"
 * "The Exorcism of Faeries (Morbid Realities, #1)" → "the-exorcism-of-faeries-morbid-realities-1"
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // Remove special characters
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/-+/g, '-')            // Remove consecutive hyphens
    .replace(/^-+|-+$/g, '');       // Trim leading/trailing hyphens
}

export interface Book {
  id: string;
  title: string;
  author: string;
  rating: number;
  reviews: number;
  coverImage: string;
  description: string;  // Katie's personal review
  plot?: string;  // Book plot/blurb from Goodreads
  goodreadsUrl: string;
  genre: string;
  publishedYear: number;
  amazonUrl: string;
  scrapedAt: string;
  slug?: string;  // URL-friendly slug generated from title
}

/**
 * Get all books from scraped data with generated slugs
 */
export function getAllBooks(): Book[] {
  return (booksData as Book[]).map(book => ({
    ...book,
    slug: generateSlug(book.title),
  }));
}

/**
 * Get books sorted by rating
 */
export function getTopRatedBooks(limit = 10): Book[] {
  return [...booksData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
    .map(book => ({
      ...book,
      slug: generateSlug(book.title),
    })) as Book[];
}

/**
 * Get books by genre
 */
export function getBooksByGenre(genre: string): Book[] {
  return booksData
    .filter((book) => book.genre.toLowerCase() === genre.toLowerCase())
    .map(book => ({
      ...book,
      slug: generateSlug(book.title),
    })) as Book[];
}

/**
 * Get a single book by ID
 */
export function getBookById(id: string): Book | undefined {
  const book = booksData.find((book) => book.id === id) as Book | undefined;
  if (!book) return undefined;
  return {
    ...book,
    slug: generateSlug(book.title),
  };
}

/**
 * Get a single book by slug
 */
export function getBookBySlug(slug: string): Book | undefined {
  const book = booksData.find((book) => generateSlug(book.title) === slug) as Book | undefined;
  if (!book) return undefined;
  return {
    ...book,
    slug: generateSlug(book.title),
  };
}

/**
 * Get latest scraped books (most recently updated)
 */
export function getLatestBooks(limit = 10): Book[] {
  return [...booksData]
    .sort((a, b) =>
      new Date(b.scrapedAt).getTime() - new Date(a.scrapedAt).getTime()
    )
    .slice(0, limit)
    .map(book => ({
      ...book,
      slug: generateSlug(book.title),
    })) as Book[];
}

/**
 * Get similar books based on author and rating
 * Excludes the current book
 */
export function getSimilarBooks(bookId: string, limit = 6): Book[] {
  const currentBook = getBookById(bookId);
  if (!currentBook) return [];

  // Find books by same author or with similar ratings (±0.5 stars)
  const similarBooks = booksData.filter((book) => {
    if (book.id === bookId) return false; // Exclude current book

    // Same author = highest priority
    if (book.author === currentBook.author) return true;

    // Similar rating (within 0.5 stars)
    const ratingDiff = Math.abs(book.rating - currentBook.rating);
    return ratingDiff <= 0.5;
  }) as Book[];

  // Sort by: same author first, then by rating (highest first)
  return similarBooks
    .sort((a, b) => {
      // Prioritize same author
      const aIsSameAuthor = a.author === currentBook.author;
      const bIsSameAuthor = b.author === currentBook.author;

      if (aIsSameAuthor && !bIsSameAuthor) return -1;
      if (!aIsSameAuthor && bIsSameAuthor) return 1;

      // Then sort by rating
      return b.rating - a.rating;
    })
    .slice(0, limit)
    .map(book => ({
      ...book,
      slug: generateSlug(book.title),
    }));
}
