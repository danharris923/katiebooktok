/**
 * ============================================
 * Dynamic Book Review Page
 * Route: /books/[slug]
 * ============================================
 *
 * This page displays individual book reviews with:
 * - Full book details and cover
 * - Katie's review and rating
 * - Similar book recommendations
 * - Breadcrumb navigation
 * - SEO optimization with JSON-LD schema
 * - Social sharing metadata (OpenGraph, Twitter)
 *
 * Static Site Generation (SSG):
 * - Pre-generates all 144+ book pages at build time
 * - Uses generateStaticParams() to define all routes
 * - Uses generateMetadata() for dynamic SEO tags
 *
 * Example URLs:
 * - /books/punk-57
 * - /books/hideaway-devils-night-2
 * - /books/the-exorcism-of-faeries-morbid-realities-1
 *
 * ARCHITECTURE NOTE:
 * This is a Server Component that uses generateStaticParams and generateMetadata
 * for SEO and static generation. The actual UI components (ParallaxBackground,
 * Navbar, etc.) are Client Components that handle interactivity.
 */

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllBooks, getBookBySlug } from "@/lib/books"
import BookPageClient from "./book-page-client"

/**
 * ============================================
 * STATIC SITE GENERATION - generateStaticParams()
 * ============================================
 *
 * This function tells Next.js which dynamic routes to pre-generate at build time.
 * It runs during `npm run build` to create static HTML for all book pages.
 *
 * How it works:
 * 1. Get all 144+ books from katie_books.json
 * 2. Generate slug for each book (e.g., "Punk 57" → "punk-57")
 * 3. Return array of { slug: "book-slug" } objects
 * 4. Next.js creates /books/punk-57/index.html, etc.
 *
 * Benefits:
 * - Instant page loads (no server rendering needed)
 * - Perfect SEO (static HTML for crawlers)
 * - Works on any static host (GitHub Pages, Netlify, etc.)
 */
export async function generateStaticParams() {
  const books = getAllBooks()

  // Return array of route parameters for all books
  // Next.js will pre-generate a page for each slug
  return books.map((book) => ({
    slug: book.slug,
  }))
}

/**
 * ============================================
 * SEO OPTIMIZATION - generateMetadata()
 * ============================================
 *
 * Generates dynamic metadata for each book page to improve SEO and social sharing.
 * This includes:
 * - Page title and description
 * - OpenGraph tags (Facebook, LinkedIn)
 * - Twitter Card tags
 * - Keywords for search engines
 * - Canonical URL
 *
 * This metadata appears in:
 * - Search engine results (Google, Bing)
 * - Social media previews (Facebook, Twitter, Discord)
 * - Browser tabs
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const book = getBookBySlug(slug)

  // If book not found, return basic metadata
  if (!book) {
    return {
      title: "Book Not Found | Katie Booktok",
      description: "The requested book could not be found.",
    }
  }

  // Create SEO-friendly description (use plot if available, fallback to review)
  const description =
    book.plot?.slice(0, 155) || book.description.slice(0, 155)
  const fullDescription = description.length === 155 ? `${description}...` : description

  // Construct canonical URL for this book
  const bookUrl = `https://katiebooktok.com/books/${params.slug}`

  return {
    // Page title - appears in browser tab and search results
    title: `${book.title} by ${book.author} - Katie's Review | Katie Booktok`,

    // Meta description - appears in search results
    description: fullDescription,

    // Keywords for search engines
    keywords: [
      book.title,
      book.author,
      book.genre,
      "fantasy book review",
      "Katie Booktok",
      "book review",
      "book recommendation",
      `${book.author} books`,
      `${book.genre} books`,
    ],

    // OpenGraph tags - used by Facebook, LinkedIn, Discord
    openGraph: {
      type: "article",
      title: `${book.title} by ${book.author} - Katie's Review`,
      description: fullDescription,
      url: bookUrl,
      siteName: "Katie Booktok",
      images: [
        {
          url: book.coverImage,
          width: 800,
          height: 1200,
          alt: `${book.title} by ${book.author} book cover`,
        },
      ],
      locale: "en_CA",
    },

    // Twitter Card tags - used by Twitter/X
    twitter: {
      card: "summary_large_image",
      title: `${book.title} by ${book.author} - Katie's Review`,
      description: fullDescription,
      images: [book.coverImage],
      creator: "@katiebooktok",
    },

    // Canonical URL - prevents duplicate content issues
    alternates: {
      canonical: bookUrl,
    },

    // Additional metadata
    authors: [{ name: "Katie" }],
    publisher: "Katie Booktok",
  }
}

/**
 * ============================================
 * BOOK PAGE SERVER COMPONENT
 * ============================================
 *
 * This is the main page component (Server Component).
 * It handles:
 * - Getting the book data
 * - 404 handling if book not found
 * - Passing data to the Client Component for rendering
 *
 * The actual rendering is delegated to BookPageClient which
 * handles all the interactive UI elements.
 */
export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params (Next.js 16 requirement)
  const { slug } = await params

  // Get book data from slug
  const book = getBookBySlug(slug)

  // If book not found, show Next.js 404 page
  if (!book) {
    notFound()
  }

  // Pass book data to Client Component for rendering
  return <BookPageClient book={book} slug={slug} />
}
