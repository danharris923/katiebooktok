/**
 * ============================================
 * EXAMPLE: How to use scraped book data
 * ============================================
 *
 * This file shows how to integrate the scraped
 * Goodreads data into your Next.js components.
 *
 * Copy the relevant sections into your actual
 * components (app/page.tsx, components/book-review.tsx, etc.)
 *
 * ============================================
 */

"use client"

import { useEffect, useState } from "react"
import { BookReview } from "@/components/book-review"
import { getAllBooks, getTopRatedBooks } from "@/lib/books"
import type { Book } from "@/lib/books"

// ============================================
// Example 1: Display all scraped books
// ============================================
export function AllBooksExample() {
  const books = getAllBooks()

  return (
    <section id="reviews" className="py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <h2 className="font-sans font-bold text-4xl md:text-5xl text-center mb-12">
          Latest Reviews
        </h2>

        {books.map((book, index) => (
          <BookReview
            key={book.id}
            title={book.title}
            author={book.author}
            rating={book.rating}
            coverImage={book.coverImage}
            review={book.description}
            affiliateLink={book.amazonUrl}
            tags={[book.genre]} // You could expand this
            reverse={index % 2 !== 0} // Alternate layout
          />
        ))}
      </div>
    </section>
  )
}

// ============================================
// Example 2: Display top rated books only
// ============================================
export function TopRatedBooksExample() {
  const topBooks = getTopRatedBooks(3) // Get top 3

  return (
    <section id="reviews" className="py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <h2 className="font-sans font-bold text-4xl md:text-5xl text-center mb-12">
          Top Rated Books
        </h2>

        {topBooks.map((book) => (
          <BookReview
            key={book.id}
            title={book.title}
            author={book.author}
            rating={book.rating}
            coverImage={book.coverImage}
            review={book.description}
            affiliateLink={book.amazonUrl}
            tags={[`${book.rating}★`, book.genre]}
          />
        ))}
      </div>
    </section>
  )
}

// ============================================
// Example 3: Custom book card with more data
// ============================================
export function CustomBookCard({ book }: { book: Book }) {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <img
        src={book.coverImage}
        alt={book.title}
        className="w-full h-64 object-cover rounded"
      />

      <h3 className="text-2xl font-bold">{book.title}</h3>
      <p className="text-muted-foreground">by {book.author}</p>

      <div className="flex items-center gap-2">
        <span className="text-yellow-500">★</span>
        <span className="font-semibold">{book.rating}</span>
        <span className="text-muted-foreground">
          ({book.reviews.toLocaleString()} reviews)
        </span>
      </div>

      <p className="text-sm">{book.description}</p>

      <div className="flex gap-2">
        <a
          href={book.amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-white px-4 py-2 rounded hover:opacity-90"
        >
          Buy on Amazon
        </a>

        <a
          href={book.goodreadsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border px-4 py-2 rounded hover:bg-muted"
        >
          View on Goodreads
        </a>
      </div>

      <p className="text-xs text-muted-foreground">
        Last updated: {new Date(book.scrapedAt).toLocaleDateString()}
      </p>
    </div>
  )
}

// ============================================
// Example 4: Complete page with scraped data
// ============================================
export default function ScrapedBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading (in reality, data is imported statically)
    const loadBooks = () => {
      const allBooks = getAllBooks()
      setBooks(allBooks)
      setLoading(false)
    }

    loadBooks()
  }, [])

  if (loading) {
    return <div className="text-center p-12">Loading books...</div>
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-5xl font-bold text-center mb-12">
        Katie's Book Reviews
      </h1>

      {/* Stats Section */}
      <div className="max-w-4xl mx-auto mb-12 grid grid-cols-3 gap-4 text-center">
        <div className="border rounded-lg p-6">
          <div className="text-3xl font-bold">{books.length}</div>
          <div className="text-muted-foreground">Total Reviews</div>
        </div>

        <div className="border rounded-lg p-6">
          <div className="text-3xl font-bold">
            {(
              books.reduce((sum, book) => sum + book.rating, 0) / books.length
            ).toFixed(1)}
          </div>
          <div className="text-muted-foreground">Average Rating</div>
        </div>

        <div className="border rounded-lg p-6">
          <div className="text-3xl font-bold">
            {books.reduce((sum, book) => sum + book.reviews, 0).toLocaleString()}
          </div>
          <div className="text-muted-foreground">Total Reviews</div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <CustomBookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Last Updated */}
      <div className="text-center mt-12 text-muted-foreground">
        <p>
          Last scraped:{" "}
          {books.length > 0
            ? new Date(books[0].scrapedAt).toLocaleString()
            : "Never"}
        </p>
      </div>
    </main>
  )
}

// ============================================
// HOW TO USE IN YOUR APP
// ============================================
//
// 1. Copy the example you want into app/page.tsx
// 2. Adjust styling to match your theme
// 3. Add any additional filtering/sorting
// 4. Test locally: npm run dev
// 5. Build static: npm run build
// 6. Deploy!
//
// ============================================
