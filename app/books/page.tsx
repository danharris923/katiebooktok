import { Metadata } from 'next'
import { getAllBooks } from '@/lib/books'
import { BooksGrid } from './books-grid'
import { SiteNav } from '@/components/site-nav'

export const metadata: Metadata = {
  title: "All Book Reviews | Katie Booktok - Fantasy & Romance Reviews",
  description: "Browse all 144+ fantasy and romance book reviews by Katie Booktok. Find your next favorite read with honest reviews, ratings, and recommendations from a passionate BookTok reviewer.",
  keywords: [
    "fantasy book reviews",
    "romance book reviews",
    "booktok recommendations",
    "book ratings",
    "fantasy novels",
    "dark romance books",
    "book blogger",
    "reading recommendations"
  ],
  openGraph: {
    title: "All Book Reviews | Katie Booktok",
    description: "Browse 144+ fantasy and romance book reviews. Find your next favorite read!",
    url: "https://katiebooktok.com/books",
    type: "website",
  },
  alternates: {
    canonical: "https://katiebooktok.com/books",
  },
}

export default function BooksPage() {
  const allBooks = getAllBooks()

  // Get unique authors for filter
  const authors = [...new Set(allBooks.map(b => b.author))].sort()

  // Get rating distribution for stats
  const ratingCounts = {
    5: allBooks.filter(b => Math.round(b.rating) === 5).length,
    4: allBooks.filter(b => Math.round(b.rating) === 4).length,
    3: allBooks.filter(b => Math.round(b.rating) === 3).length,
    2: allBooks.filter(b => Math.round(b.rating) === 2).length,
    1: allBooks.filter(b => Math.round(b.rating) <= 1).length,
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteNav />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            All Book Reviews
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {allBooks.length} fantasy and romance books reviewed by Katie.
            Click any book to read the full review.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
            <span className="px-3 py-1 bg-yellow-500/20 rounded-full">
              ⭐ 5 stars: {ratingCounts[5]}
            </span>
            <span className="px-3 py-1 bg-green-500/20 rounded-full">
              ⭐ 4 stars: {ratingCounts[4]}
            </span>
            <span className="px-3 py-1 bg-blue-500/20 rounded-full">
              ⭐ 3 stars: {ratingCounts[3]}
            </span>
            <span className="px-3 py-1 bg-muted rounded-full">
              {authors.length} authors
            </span>
          </div>
        </div>

        {/* Books Grid with Client-side Filtering */}
        <BooksGrid books={allBooks} authors={authors} />

        {/* SEO Content */}
        <section className="mt-16 prose prose-invert max-w-3xl mx-auto">
          <h2>About Katie's Book Reviews</h2>
          <p>
            Welcome to my complete collection of fantasy and romance book reviews!
            I'm Katie, and I've been devouring books and sharing my honest thoughts
            with the BookTok community. Whether you're looking for epic dragon fantasy,
            swoon-worthy romance, or dark and twisty reads, you'll find something here.
          </p>
          <p>
            Each review includes my personal rating, thoughts on the plot, and whether
            I'd recommend it. Use the filters above to find books by rating or search
            for specific titles and authors.
          </p>
        </section>
      </div>
    </main>
  )
}
