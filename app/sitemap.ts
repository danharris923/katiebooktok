import { MetadataRoute } from 'next'
import { getAllBooks } from '@/lib/books'

export default function sitemap(): MetadataRoute.Sitemap {
  const books = getAllBooks()
  const baseUrl = 'https://katiebooktok.com'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ]

  // Individual book pages - all 144 books
  const bookPages = books.map((book) => ({
    url: `${baseUrl}/books/${book.slug}`,
    lastModified: new Date(book.scrapedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Combine static pages + all book pages
  return [...staticPages, ...bookPages]
}
