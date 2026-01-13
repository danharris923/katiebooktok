'use client';

import { Book } from '@/lib/books';

/**
 * JSON-LD Book Schema Component
 * Generates schema.org structured data for books to improve SEO and enable rich snippets
 *
 * This component creates a script tag with application/ld+json type that search engines
 * can parse to understand book information like title, author, rating, and reviews.
 *
 * Reference: https://schema.org/Book
 */

interface JsonLdBookSchemaProps {
  book: Book;
  /**
   * Optional review text to include in the schema
   * If not provided, the book's description will be used
   */
  reviewText?: string;
  /**
   * Optional URL where this review is published
   * Used for the url property of the Review object
   */
  reviewUrl?: string;
}

export function JsonLdBookSchema({
  book,
  reviewText,
  reviewUrl,
}: JsonLdBookSchemaProps) {
  /**
   * Construct the Book schema object
   * Includes all necessary properties for Google Rich Snippets and other schema implementations
   */
  const bookSchema = {
    '@context': 'https://schema.org',
    '@type': 'Book',

    // Basic book information
    name: book.title,

    // Author information
    author: {
      '@type': 'Person',
      name: book.author,
    },

    // Book cover image
    image: book.coverImage,

    // Genre/category
    genre: book.genre,

    // Publication year - only include if we have valid data
    ...(book.publishedYear && { datePublished: `${book.publishedYear}-01-01` }),

    // Katie's aggregate rating based on her 5-star rating
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: book.rating.toString(),
      bestRating: '5',
      worstRating: '1',
      // Use at least 1 for ratingCount to be valid schema
      ratingCount: Math.max(1, book.reviews).toString(),
    },

    // Katie's review of the book
    review: {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Katie',
        url: 'https://katiebooktok.com',
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: book.rating.toString(),
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: reviewText || book.description,
      ...(reviewUrl && { url: reviewUrl }),
    },

    // Additional useful properties
    url: book.goodreadsUrl,
    description: book.plot || book.description,
  };

  /**
   * Stringify the schema object and ensure proper JSON escaping
   * Escape forward slashes to prevent breaking out of script tags
   */
  const schemaJson = JSON.stringify(bookSchema).replace(/\//g, '\\/');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: schemaJson,
      }}
      suppressHydrationWarning
    />
  );
}

/**
 * BreadcrumbList JSON-LD Schema Component
 * Generates structured data for breadcrumb navigation
 */
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface JsonLdBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function JsonLdBreadcrumb({ items }: JsonLdBreadcrumbProps) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema),
      }}
      suppressHydrationWarning
    />
  );
}
