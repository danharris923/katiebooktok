import { Metadata } from 'next'
import { getAllAuthors } from '@/lib/books'
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { SiteNav } from '@/components/site-nav'

export const metadata: Metadata = {
  title: "Authors | Katie Booktok - Fantasy & Romance Book Reviews",
  description: "Discover fantasy and romance authors reviewed by Katie Booktok. Browse 55+ authors including Sarah J. Maas, Jennifer L. Armentrout, Penelope Douglas, and more. Find your next favorite author!",
  keywords: [
    "fantasy authors",
    "romance authors",
    "sarah j maas books",
    "jennifer armentrout",
    "booktok authors",
    "book recommendations by author",
    "fantasy book authors"
  ],
  openGraph: {
    title: "Authors | Katie Booktok",
    description: "Discover 55+ fantasy and romance authors reviewed by Katie",
    url: "https://katiebooktok.com/authors",
    type: "website",
  },
  alternates: {
    canonical: "https://katiebooktok.com/authors",
  },
}

export default function AuthorsPage() {
  const authors = getAllAuthors()

  // Group by number of books for display sections
  const featuredAuthors = authors.filter(a => a.bookCount >= 3)
  const otherAuthors = authors.filter(a => a.bookCount < 3)

  return (
    <main className="min-h-screen bg-background">
      <SiteNav />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Authors
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {authors.length} authors featured in Katie's book reviews.
            Click any author to see all their reviewed books.
          </p>
        </div>

        {/* Featured Authors (3+ books) */}
        {featuredAuthors.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Featured Authors</h2>
            <p className="text-muted-foreground mb-6">
              Authors with multiple books reviewed by Katie
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAuthors.map((author) => (
                <Link key={author.slug} href={`/authors/${author.slug}`}>
                  <Card className="overflow-hidden h-full hover:ring-2 hover:ring-primary transition-all cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Show first 3 book covers */}
                        <div className="flex -space-x-4">
                          {author.books.slice(0, 3).map((book, i) => (
                            <div
                              key={book.id}
                              className="relative w-16 h-24 rounded-lg overflow-hidden border-2 border-background"
                              style={{ zIndex: 3 - i }}
                            >
                              <Image
                                src={book.coverImage || "/placeholder.svg"}
                                alt={book.title}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {author.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {author.bookCount} books reviewed
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-500 text-sm">
                              {"★".repeat(Math.round(author.avgRating))}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {author.avgRating.toFixed(1)} avg
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Other Authors */}
        <section>
          <h2 className="text-2xl font-bold mb-6">All Authors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {otherAuthors.map((author) => (
              <Link key={author.slug} href={`/authors/${author.slug}`}>
                <Card className="overflow-hidden h-full hover:ring-2 hover:ring-primary transition-all cursor-pointer group">
                  <CardContent className="p-3">
                    <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden mb-2">
                      <Image
                        src={author.books[0]?.coverImage || "/placeholder.svg"}
                        alt={`${author.name} books`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        unoptimized
                      />
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {author.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {author.bookCount} book{author.bookCount > 1 ? 's' : ''}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Content */}
        <section className="mt-16 prose prose-invert max-w-3xl mx-auto">
          <h2>Fantasy and Romance Authors</h2>
          <p>
            Discover incredible fantasy and romance authors through Katie's reviews.
            From bestselling authors like Sarah J. Maas and Jennifer L. Armentrout
            to exciting debut novelists, find your next favorite writer here.
          </p>
          <p>
            Each author page shows all their books that Katie has reviewed,
            along with ratings and recommendations to help you decide what to read next.
          </p>
        </section>
      </div>
    </main>
  )
}
