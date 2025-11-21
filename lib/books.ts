/**
 * ============================================
 * Books Data Layer
 * Provides access to scraped Goodreads data
 * Katie's Goodreads: https://www.goodreads.com/user/show/162126255
 * ============================================
 */

import booksData from '@/data/katie_books.json';

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
}

/**
 * Get all books from scraped data
 */
export function getAllBooks(): Book[] {
  return booksData as Book[];
}

/**
 * Get books sorted by rating
 */
export function getTopRatedBooks(limit = 10): Book[] {
  return [...booksData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit) as Book[];
}

/**
 * Get books by genre
 */
export function getBooksByGenre(genre: string): Book[] {
  return booksData.filter(
    (book) => book.genre.toLowerCase() === genre.toLowerCase()
  ) as Book[];
}

/**
 * Get a single book by ID
 */
export function getBookById(id: string): Book | undefined {
  return booksData.find((book) => book.id === id) as Book | undefined;
}

/**
 * Get latest scraped books (most recently updated)
 */
export function getLatestBooks(limit = 10): Book[] {
  return [...booksData]
    .sort((a, b) =>
      new Date(b.scrapedAt).getTime() - new Date(a.scrapedAt).getTime()
    )
    .slice(0, limit) as Book[];
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
    .slice(0, limit);
}
