import { Metadata } from 'next'
import { getAllTagsWithCounts } from '@/lib/books'
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { SiteNav } from '@/components/site-nav'

export const metadata: Metadata = {
  title: "Book Categories | Katie Booktok - Fantasy & Romance Sub-genres",
  description: "Browse fantasy and romance books by category. Find dark romance, dragon fantasy, fae stories, vampire novels, and more. Discover your next read by sub-genre!",
  keywords: [
    "fantasy sub-genres",
    "romance categories",
    "dark romance books",
    "dragon fantasy",
    "fae romance",
    "vampire books",
    "booktok categories"
  ],
  openGraph: {
    title: "Book Categories | Katie Booktok",
    description: "Browse books by sub-genre: Dark Romance, Dragons, Fae, Vampires & more",
    url: "https://katiebooktok.com/tags",
    type: "website",
  },
  alternates: {
    canonical: "https://katiebooktok.com/tags",
  },
}

export default function TagsPage() {
  const tags = getAllTagsWithCounts()

  return (
    <main className="min-h-screen bg-background">
      <SiteNav />
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book Categories
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse Katie's book reviews by sub-genre and category.
            Find exactly the type of fantasy or romance you're craving.
          </p>
        </div>

        {/* Tags Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tags.map((tag) => (
            <Link key={tag.slug} href={`/tags/${tag.slug}`}>
              <Card className="overflow-hidden h-full hover:ring-2 hover:ring-primary transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {tag.name}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {tag.description}
                  </p>
                  <span className="inline-block px-3 py-1 bg-primary/20 rounded-full text-sm">
                    {tag.bookCount} book{tag.bookCount !== 1 ? 's' : ''}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* SEO Content */}
        <section className="mt-16 prose prose-invert max-w-3xl mx-auto">
          <h2>Fantasy & Romance Sub-genres</h2>
          <p>
            Looking for a specific type of book? Katie's collection spans multiple
            fantasy and romance sub-genres. Whether you want dragon-filled epic
            fantasy, steamy dark romance, or magical fae courts, you'll find
            curated recommendations here.
          </p>
          <p>
            Each category includes Katie's personal ratings and reviews to help
            you find your next favorite read. Can't decide? Browse the
            <Link href="/books"> complete collection</Link> or check out
            <Link href="/authors"> authors</Link> you already love.
          </p>
        </section>
      </div>
    </main>
  )
}
