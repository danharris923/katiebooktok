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
 * Generate URL-friendly slug from author name
 */
export function generateAuthorSlug(author: string): string {
  return author
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get all unique authors with their book counts
 */
export interface Author {
  name: string;
  slug: string;
  bookCount: number;
  avgRating: number;
  books: Book[];
}

export function getAllAuthors(): Author[] {
  const books = getAllBooks();
  const authorMap = new Map<string, Book[]>();

  // Group books by author
  books.forEach(book => {
    const existing = authorMap.get(book.author) || [];
    authorMap.set(book.author, [...existing, book]);
  });

  // Convert to Author objects
  return Array.from(authorMap.entries())
    .map(([name, authorBooks]) => ({
      name,
      slug: generateAuthorSlug(name),
      bookCount: authorBooks.length,
      avgRating: authorBooks.reduce((sum, b) => sum + b.rating, 0) / authorBooks.length,
      books: authorBooks.sort((a, b) => b.rating - a.rating),
    }))
    .sort((a, b) => b.bookCount - a.bookCount || b.avgRating - a.avgRating);
}

/**
 * Get a single author by slug
 */
export function getAuthorBySlug(slug: string): Author | undefined {
  return getAllAuthors().find(a => a.slug === slug);
}

/**
 * Get books by author name
 */
export function getBooksByAuthor(authorName: string): Book[] {
  return getAllBooks().filter(b => b.author === authorName);
}

/**
 * Sub-genre/tag definitions with keywords to match
 */
export interface Tag {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
}

export const TAGS: Tag[] = [
  {
    slug: 'dark-romance',
    name: 'Dark Romance',
    description: 'Intense, morally grey romances with darker themes',
    keywords: ['dark romance', 'dark verse', 'bully romance', 'enemies to lovers', 'morally grey', 'villain'],
  },
  {
    slug: 'dragons',
    name: 'Dragon Fantasy',
    description: 'Epic fantasy featuring dragons and dragon riders',
    keywords: ['dragon', 'wyrm', 'dragonrider', 'fourth wing'],
  },
  {
    slug: 'fae',
    name: 'Fae & Faerie',
    description: 'Stories featuring the fair folk and fae courts',
    keywords: ['fae', 'faerie', 'faery', 'court of', 'folk of the air', 'sidhe'],
  },
  {
    slug: 'vampires',
    name: 'Vampires',
    description: 'Vampire romance and dark vampire fantasy',
    keywords: ['vampire', 'blood', 'immortal', 'fangs'],
  },
  {
    slug: 'witches',
    name: 'Witches & Magic',
    description: 'Stories featuring witches, witchcraft, and magic users',
    keywords: ['witch', 'witchcraft', 'coven', 'magic', 'spell'],
  },
  {
    slug: 'enemies-to-lovers',
    name: 'Enemies to Lovers',
    description: 'Romance where characters start as rivals or enemies',
    keywords: ['enemies to lovers', 'hate to love', 'rivals', 'forbidden'],
  },
  {
    slug: 'high-fantasy',
    name: 'High Fantasy',
    description: 'Epic world-building with extensive fantasy settings',
    keywords: ['kingdom', 'throne', 'empire', 'realm', 'court', 'crown', 'prince', 'princess', 'king', 'queen'],
  },
];

/**
 * Get tags that match a book based on title, description, and plot
 */
export function getBookTags(book: Book): Tag[] {
  const searchText = `${book.title} ${book.description} ${book.plot || ''}`.toLowerCase();

  return TAGS.filter(tag =>
    tag.keywords.some(keyword => searchText.includes(keyword.toLowerCase()))
  );
}

/**
 * Get all books matching a specific tag
 */
export function getBooksByTag(tagSlug: string): Book[] {
  const tag = TAGS.find(t => t.slug === tagSlug);
  if (!tag) return [];

  return getAllBooks().filter(book => {
    const searchText = `${book.title} ${book.description} ${book.plot || ''}`.toLowerCase();
    return tag.keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
  });
}

/**
 * Get tag by slug
 */
export function getTagBySlug(slug: string): Tag | undefined {
  return TAGS.find(t => t.slug === slug);
}

/**
 * Get all tags with book counts
 */
export function getAllTagsWithCounts(): (Tag & { bookCount: number })[] {
  return TAGS.map(tag => ({
    ...tag,
    bookCount: getBooksByTag(tag.slug).length,
  })).filter(tag => tag.bookCount > 0).sort((a, b) => b.bookCount - a.bookCount);
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
