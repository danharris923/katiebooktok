import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllAuthors, getAuthorBySlug } from '@/lib/books'
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { SiteNav } from '@/components/site-nav'

interface AuthorPageProps {
  params: Promise<{ slug: string }>
}

// Generate static params for all authors
export async function generateStaticParams() {
  const authors = getAllAuthors()
  return authors.map((author) => ({
    slug: author.slug,
  }))
}

// Generate dynamic metadata for each author
export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params
  const author = getAuthorBySlug(slug)

  if (!author) {
    return {
      title: 'Author Not Found | Katie Booktok',
    }
  }

  const bookTitles = author.books.slice(0, 3).map(b => b.title).join(', ')

  return {
    title: `${author.name} Books | Katie Booktok Reviews`,
    description: `Read Katie's reviews of ${author.bookCount} book${author.bookCount > 1 ? 's' : ''} by ${author.name}. Including ${bookTitles}. Avg rating: ${author.avgRating.toFixed(1)}/5 stars.`,
    keywords: [
      author.name,
      `${author.name} books`,
      `${author.name} reviews`,
      'fantasy books',
      'romance books',
      'booktok',
      ...author.books.slice(0, 5).map(b => b.title)
    ],
    openGraph: {
      title: `${author.name} Books | Katie Booktok`,
      description: `${author.bookCount} books reviewed. Avg: ${author.avgRating.toFixed(1)}★`,
      url: `https://katiebooktok.com/authors/${slug}`,
      type: 'profile',
      images: author.books[0]?.coverImage ? [
        {
          url: author.books[0].coverImage,
          width: 400,
          height: 600,
          alt: `${author.name} - ${author.books[0].title}`,
        }
      ] : undefined,
    },
    alternates: {
      canonical: `https://katiebooktok.com/authors/${slug}`,
    },
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params
  const author = getAuthorBySlug(slug)

  if (!author) {
    notFound()
  }

  // JSON-LD for Person schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: `https://katiebooktok.com/authors/${slug}`,
    description: `Author of ${author.bookCount} fantasy/romance books reviewed by Katie Booktok`,
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/authors" className="hover:text-primary">Authors</Link>
          <span className="mx-2">/</span>
          <span>{author.name}</span>
        </nav>

        {/* Author Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {author.name}
          </h1>
          <div className="flex flex-wrap gap-4 text-lg">
            <span className="px-4 py-2 bg-primary/20 rounded-full">
              {author.bookCount} book{author.bookCount > 1 ? 's' : ''} reviewed
            </span>
            <span className="px-4 py-2 bg-yellow-500/20 rounded-full flex items-center gap-2">
              <span className="text-yellow-500">★</span>
              {author.avgRating.toFixed(1)} average rating
            </span>
          </div>
        </div>

        {/* Books Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            Books by {author.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {author.books.map((book) => (
              <Link key={book.id} href={`/books/${book.slug}`}>
                <Card className="overflow-hidden h-full hover:ring-2 hover:ring-primary transition-all cursor-pointer group">
                  <CardContent className="p-4 space-y-3">
                    <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden">
                      <Image
                        src={book.coverImage || "/placeholder.svg"}
                        alt={`${book.title} by ${author.name}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        unoptimized
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {book.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-yellow-500">
                          {"★".repeat(Math.round(book.rating))}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {book.rating.toFixed(1)}
                        </span>
                      </div>
                      {book.dateRead && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Read: {book.dateRead}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Content */}
        <section className="mt-16 prose prose-invert max-w-3xl mx-auto">
          <h2>About {author.name}'s Books</h2>
          <p>
            Katie has reviewed {author.bookCount} book{author.bookCount > 1 ? 's' : ''} by {author.name},
            with an average rating of {author.avgRating.toFixed(1)} out of 5 stars.
            Click on any book above to read Katie's full review and thoughts.
          </p>
          <p>
            Looking for more recommendations? Check out the <Link href="/books">full book collection</Link> or
            browse <Link href="/authors">other authors</Link> Katie has reviewed.
          </p>
        </section>
      </div>
    </main>
  )
}
