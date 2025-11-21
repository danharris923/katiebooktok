/**
 * ============================================
 * Book Page Client Component
 * ============================================
 *
 * This is the client-side component that renders the book page UI.
 * It handles all interactive elements:
 * - Modal state (About, Newsletter)
 * - User interactions
 * - Client-side navigation
 *
 * This component receives the book data from the parent Server Component
 * and renders all the UI elements with interactivity.
 */

"use client"

import { useState } from "react"
import { ParallaxBackground } from "@/components/parallax-background"
import { Navbar } from "@/components/navbar"
import { Breadcrumb } from "@/components/breadcrumb"
import { BookReviewPage } from "@/components/book-review-page"
import { JsonLdBookSchema } from "@/components/json-ld-book-schema"
import { AboutModal } from "@/components/about-modal"
import { NewsletterModal } from "@/components/newsletter-modal"
import type { Book } from "@/lib/books"

interface BookPageClientProps {
  book: Book
  slug: string
}

export default function BookPageClient({ book, slug }: BookPageClientProps) {
  // Modal state management
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false)

  // Construct full review URL for JSON-LD schema
  const reviewUrl = `https://katiebooktok.com/books/${slug}`

  return (
    <main className="relative min-h-screen">
      {/* Parallax Background - Same starry sky as homepage */}
      <ParallaxBackground />

      {/* Navigation Bar */}
      <Navbar
        onAboutClick={() => setIsAboutOpen(true)}
        onNewsletterClick={() => setIsNewsletterOpen(true)}
      />

      {/* Main Content Container */}
      <div className="relative z-10 pt-20">
        {/* Breadcrumb Navigation */}
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Books", href: "/#reviews" },
              { label: book.title, href: `/books/${slug}`, current: true },
            ]}
          />
        </div>

        {/* Book Review Content */}
        <BookReviewPage book={book} />
      </div>

      {/* JSON-LD Structured Data for SEO */}
      {/* This helps search engines understand the book data and display rich snippets */}
      <JsonLdBookSchema
        book={book}
        reviewText={book.description}
        reviewUrl={reviewUrl}
      />

      {/* Modals */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <NewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />
    </main>
  )
}
