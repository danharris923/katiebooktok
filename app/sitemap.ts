import { MetadataRoute } from 'next'
import { getAllBooks, getAllAuthors, getAllTagsWithCounts } from '@/lib/books'

export default function sitemap(): MetadataRoute.Sitemap {
  const books = getAllBooks()
  const authors = getAllAuthors()
  const tags = getAllTagsWithCounts()
  const baseUrl = 'https://katiebooktok.com'

  // Static pages (homepage + index pages)
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/books`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/authors`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  // Individual book pages - all 144 books
  const bookPages = books.map((book) => ({
    url: `${baseUrl}/books/${book.slug}`,
    lastModified: new Date(book.scrapedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Individual review pages - all 144 books
  const reviewPages = books.map((book) => ({
    url: `${baseUrl}/reviews/${book.slug}`,
    lastModified: new Date(book.scrapedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Individual author pages - all 55 authors
  const authorPages = authors.map((author) => ({
    url: `${baseUrl}/authors/${author.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Individual tag/category pages - 7 sub-genres
  const tagPages = tags.map((tag) => ({
    url: `${baseUrl}/tags/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Combine all pages
  // Total: 1 home + 4 indexes + 144 books + 144 reviews + 55 authors + 7 tags = ~355 URLs
  return [...staticPages, ...bookPages, ...reviewPages, ...authorPages, ...tagPages]
}
