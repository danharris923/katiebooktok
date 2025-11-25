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

  // Individual book pages (if you add them in the future)
  // For now, all books are on the homepage, so we don't need separate URLs
  // But this structure is ready for when you want individual book pages

  return staticPages
}
