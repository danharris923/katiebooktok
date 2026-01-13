import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllBooks, getBookBySlug, getBookTags, generateAuthorSlug } from '@/lib/books'
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { SiteNav } from '@/components/site-nav'

interface ReviewPageProps {
  params: Promise<{ slug: string }>
}

// Generate static params for all books
export async function generateStaticParams() {
  const books = getAllBooks()
  return books.map((book) => ({
    slug: book.slug,
  }))
}

// Generate dynamic metadata for each review
export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const { slug } = await params
  const book = getBookBySlug(slug)

  if (!book) {
    return { title: 'Review Not Found | Katie Booktok' }
  }

  return {
    title: `${book.title} Review | Katie's Honest Thoughts | Katie Booktok`,
    description: `Katie's honest review of ${book.title} by ${book.author}. Rating: ${book.rating}/5 stars. ${book.description.slice(0, 120)}...`,
    keywords: [
      `${book.title} review`,
      `${book.author} books`,
      'book review',
      'fantasy review',
      'romance review',
      'booktok review',
      'honest book review'
    ],
    openGraph: {
      title: `${book.title} Review | Katie Booktok`,
      description: `Katie's ${book.rating}/5 star review of ${book.title}`,
      url: `https://katiebooktok.com/reviews/${slug}`,
      type: 'article',
      images: book.coverImage ? [
        {
          url: book.coverImage,
          width: 400,
          height: 600,
          alt: `${book.title} by ${book.author}`,
        }
      ] : undefined,
    },
    alternates: {
      canonical: `https://katiebooktok.com/reviews/${slug}`,
    },
  }
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params
  const book = getBookBySlug(slug)

  if (!book) {
    notFound()
  }

  const tags = getBookTags(book)

  // JSON-LD Review schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Book',
      name: book.title,
      author: {
        '@type': 'Person',
        name: book.author,
      },
      image: book.coverImage,
    },
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
    reviewBody: book.description,
    url: `https://katiebooktok.com/reviews/${slug}`,
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/reviews" className="hover:text-primary">Reviews</Link>
          <span className="mx-2">/</span>
          <span>{book.title}</span>
        </nav>

        {/* Review Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Book Cover */}
            <div className="relative w-40 md:w-48 flex-shrink-0 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl mx-auto md:mx-0">
              <Image
                src={book.coverImage || "/placeholder.svg"}
                alt={`${book.title} by ${book.author}`}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>

            {/* Book Info */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                by{' '}
                <Link
                  href={`/authors/${generateAuthorSlug(book.author)}`}
                  className="hover:text-primary transition-colors"
                >
                  {book.author}
                </Link>
              </p>

              {/* Rating */}
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <span className="text-3xl text-yellow-500">
                  {"★".repeat(Math.round(book.rating))}
                  {"☆".repeat(5 - Math.round(book.rating))}
                </span>
                <span className="text-2xl font-bold">{book.rating.toFixed(1)}</span>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  {tags.map(tag => (
                    <Link
                      key={tag.slug}
                      href={`/tags/${tag.slug}`}
                      className="px-3 py-1 bg-primary/20 rounded-full text-sm hover:bg-primary/30 transition-colors"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Read date */}
              {book.dateRead && (
                <p className="text-sm text-muted-foreground">
                  Read: {book.dateRead}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Katie's Review */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>Katie's Review</span>
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                  {book.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Links */}
        <section className="flex flex-wrap gap-4 justify-center">
          <Link
            href={`/books/${slug}`}
            className="px-6 py-3 bg-primary/20 rounded-lg hover:bg-primary/30 transition-colors"
          >
            View Book Details →
          </Link>
          <a
            href={book.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-yellow-500/20 rounded-lg hover:bg-yellow-500/30 transition-colors"
          >
            Get on Amazon →
          </a>
          <a
            href={book.goodreadsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
          >
            View on Goodreads →
          </a>
        </section>

        {/* More Reviews CTA */}
        <section className="mt-16 text-center">
          <h3 className="text-xl font-bold mb-4">Want more reviews?</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/reviews"
              className="px-6 py-3 border rounded-lg hover:bg-muted transition-colors"
            >
              All Reviews
            </Link>
            <Link
              href={`/authors/${generateAuthorSlug(book.author)}`}
              className="px-6 py-3 border rounded-lg hover:bg-muted transition-colors"
            >
              More by {book.author}
            </Link>
          </div>
        </section>
      </article>
    </main>
  )
}
