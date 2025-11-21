import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      crawlDelay: 0,
    },
    sitemap: 'https://katiebooktok.com/sitemap.xml',
  }
}
