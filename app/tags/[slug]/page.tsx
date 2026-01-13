import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TAGS, getTagBySlug, getBooksByTag } from '@/lib/books'
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { SiteNav } from '@/components/site-nav'

interface TagPageProps {
  params: Promise<{ slug: string }>
}

// Generate static params for all tags
export async function generateStaticParams() {
  return TAGS.map((tag) => ({
    slug: tag.slug,
  }))
}

// Generate dynamic metadata for each tag
export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  const tag = getTagBySlug(slug)

  if (!tag) {
    return {
      title: 'Category Not Found | Katie Booktok',
    }
  }

  const books = getBooksByTag(slug)
  const bookTitles = books.slice(0, 3).map(b => b.title).join(', ')

  return {
    title: `${tag.name} Books | Katie Booktok Reviews`,
    description: `${tag.description}. Browse ${books.length} ${tag.name.toLowerCase()} books reviewed by Katie, including ${bookTitles}. Find your next read!`,
    keywords: [
      tag.name,
      `${tag.name} books`,
      `${tag.name} recommendations`,
      'fantasy books',
      'romance books',
      'booktok',
      ...tag.keywords.slice(0, 5)
    ],
    openGraph: {
      title: `${tag.name} Books | Katie Booktok`,
      description: `${books.length} ${tag.name.toLowerCase()} books reviewed`,
      url: `https://katiebooktok.com/tags/${slug}`,
      type: 'website',
      images: books[0]?.coverImage ? [
        {
          url: books[0].coverImage,
          width: 400,
          height: 600,
          alt: `${tag.name} - ${books[0].title}`,
        }
      ] : undefined,
    },
    alternates: {
      canonical: `https://katiebooktok.com/tags/${slug}`,
    },
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params
  const tag = getTagBySlug(slug)

  if (!tag) {
    notFound()
  }

  const books = getBooksByTag(slug)

  // JSON-LD for CollectionPage schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${tag.name} Books`,
    description: tag.description,
    url: `https://katiebooktok.com/tags/${slug}`,
    numberOfItems: books.length,
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
          <Link href="/tags" className="hover:text-primary">Categories</Link>
          <span className="mx-2">/</span>
          <span>{tag.name}</span>
        </nav>

        {/* Tag Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {tag.name}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            {tag.description}
          </p>
          <span className="inline-block px-4 py-2 bg-primary/20 rounded-full">
            {books.length} book{books.length !== 1 ? 's' : ''} in this category
          </span>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {books.map((book) => (
            <Link key={book.id} href={`/books/${book.slug}`}>
              <Card className="overflow-hidden h-full hover:ring-2 hover:ring-primary transition-all cursor-pointer group">
                <CardContent className="p-3 space-y-2">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden">
                    <Image
                      src={book.coverImage || "/placeholder.svg"}
                      alt={`${book.title} - ${tag.name}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {book.author}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-500 text-xs">
                        {"★".repeat(Math.round(book.rating))}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {book.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* SEO Content */}
        <section className="mt-16 prose prose-invert max-w-3xl mx-auto">
          <h2>About {tag.name}</h2>
          <p>
            {tag.description}. Katie has reviewed {books.length} book{books.length !== 1 ? 's' : ''} in
            this category, with personal ratings and thoughts on each one.
          </p>
          <p>
            Looking for more? Check out <Link href="/tags">other categories</Link>,
            browse the <Link href="/books">full book collection</Link>, or
            discover <Link href="/authors">authors</Link> you'll love.
          </p>
        </section>
      </div>
    </main>
  )
}
