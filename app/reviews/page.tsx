import { Metadata } from 'next'
import { getAllBooks } from '@/lib/books'
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { SiteNav } from '@/components/site-nav'

export const metadata: Metadata = {
  title: "Katie's Book Reviews | Honest Fantasy & Romance Reviews",
  description: "Read Katie's honest, in-depth book reviews. 144+ fantasy and romance book reviews with personal ratings, thoughts, and recommendations from a passionate BookTok reviewer.",
  keywords: [
    "book reviews",
    "fantasy book reviews",
    "romance book reviews",
    "honest book reviews",
    "booktok reviews",
    "book blogger",
    "reading reviews"
  ],
  openGraph: {
    title: "Katie's Book Reviews | Katie Booktok",
    description: "144+ honest fantasy and romance book reviews",
    url: "https://katiebooktok.com/reviews",
    type: "website",
  },
  alternates: {
    canonical: "https://katiebooktok.com/reviews",
  },
}

export default function ReviewsPage() {
  const allBooks = getAllBooks()

  // Sort by rating (highest first) for reviews page
  const sortedBooks = [...allBooks].sort((a, b) => b.rating - a.rating)

  return (
    <main className="min-h-screen bg-background">
      <SiteNav />
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Katie's Reviews
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {allBooks.length} honest reviews with my personal thoughts, ratings, and whether I'd recommend each book. No spoilers, just vibes.
          </p>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {sortedBooks.map((book) => (
            <Link key={book.id} href={`/reviews/${book.slug}`}>
              <Card className="overflow-hidden hover:ring-2 hover:ring-primary transition-all cursor-pointer group">
                <CardContent className="p-4 md:p-6">
                  <div className="flex gap-4 md:gap-6">
                    {/* Book Cover */}
                    <div className="relative w-20 md:w-28 flex-shrink-0 aspect-[2/3] rounded-lg overflow-hidden">
                      <Image
                        src={book.coverImage || "/placeholder.svg"}
                        alt={book.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Review Preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h2 className="font-bold text-lg md:text-xl group-hover:text-primary transition-colors line-clamp-1">
                            {book.title}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            by {book.author}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-yellow-500">★</span>
                          <span className="font-bold">{book.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Review snippet */}
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2 md:line-clamp-3">
                        {book.description}
                      </p>

                      <p className="mt-2 text-sm text-primary font-medium">
                        Read full review →
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
