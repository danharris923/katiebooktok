"use client"

import { Star } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getSimilarBooks } from "@/lib/books"
import type { Book } from "@/lib/books"

interface BookReviewPageProps {
  book: Book
}

export function BookReviewPage({ book }: BookReviewPageProps) {
  // Get similar books for recommendations
  const similarBooks = getSimilarBooks(book.id, 6)

  // Extract rating from book (assumes it's 0-5 scale)
  const ratingStars = Math.round(book.rating)

  // Format the date read if available (optional - would need to come from enhanced Book interface)
  const dateRead = undefined // Placeholder - would come from extended props if needed

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/30 to-black">
      {/* Main Content Container */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12 md:py-16">
        {/* Book Header Section */}
        <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12">
          {/* Title */}
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              {book.title}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 font-semibold">{book.author}</p>
          </div>

          {/* Book Details Card */}
          <div className="glass rounded-2xl p-6 sm:p-8 border border-white/20">
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
              {/* Book Cover */}
              <div className="flex-shrink-0">
                <div className="relative w-48 h-72 sm:w-56 sm:h-84 md:w-64 md:h-96 rounded-xl overflow-hidden shadow-2xl">
                  <Image
                    src={book.coverImage || "/placeholder.svg"}
                    alt={`${book.title} by ${book.author}`}
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                  />
                </div>
              </div>

              {/* Book Info */}
              <div className="flex-1 space-y-4 sm:space-y-6 flex flex-col justify-between">
                {/* Metadata */}
                <div className="space-y-4">
                  {/* Rating */}
                  <div className="space-y-2">
                    <p className="text-sm text-white/70 uppercase tracking-wide font-medium">
                      Katie's Rating
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 sm:w-7 sm:h-7 ${
                              i < ratingStars
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-white/20 text-white/20"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg sm:text-xl text-white font-semibold">
                        {book.rating.toFixed(1)}/5
                      </span>
                    </div>
                  </div>

                  {/* Date Read (if available) */}
                  {dateRead && (
                    <p className="text-sm text-white/60">Read on {dateRead}</p>
                  )}

                  {/* Genre & Year */}
                  <div className="space-y-1">
                    <p className="text-sm text-white/70 uppercase tracking-wide font-medium">
                      Genre
                    </p>
                    <p className="text-base text-white/90">{book.genre}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-white/70 uppercase tracking-wide font-medium">
                      Published
                    </p>
                    <p className="text-base text-white/90">{book.publishedYear}</p>
                  </div>

                  {/* Tags/Badges */}
                  <div className="space-y-2 pt-2">
                    <p className="text-sm text-white/70 uppercase tracking-wide font-medium">
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="glass text-xs sm:text-sm text-white border-white/20 px-3 py-1">
                        {book.genre}
                      </Badge>
                      {book.rating >= 4.5 && (
                        <Badge className="glass text-xs sm:text-sm text-white border-white/20 px-3 py-1">
                          Highly Recommended
                        </Badge>
                      )}
                      <Badge className="glass text-xs sm:text-sm text-white border-white/20 px-3 py-1">
                        {book.publishedYear}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Amazon Button */}
                <button
                  className="glass-button w-full h-12 sm:h-14 text-base sm:text-lg rounded-xl font-semibold transition-all hover:bg-white/20 active:scale-95"
                  onClick={() => window.open(book.amazonUrl, "_blank")}
                >
                  Get on Amazon.ca
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 sm:space-y-12">
          {/* About This Book Section */}
          {book.plot && (
            <section className="glass rounded-2xl p-6 sm:p-8 border border-white/20 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">About This Book</h2>
              <p className="text-base sm:text-lg leading-relaxed text-white/80 italic">
                {book.plot}
              </p>
            </section>
          )}

          {/* Katie's Review Section */}
          <section className="glass rounded-2xl p-6 sm:p-8 border border-white/20 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Katie's Review</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-base sm:text-lg leading-relaxed text-white/85 whitespace-pre-wrap">
                {book.description}
              </p>
            </div>
          </section>

          {/* You Might Also Like Section */}
          {similarBooks.length > 0 && (
            <section className="glass rounded-2xl p-6 sm:p-8 border border-white/20 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">You Might Also Like</h2>

              {/* Similar Books Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {similarBooks.map((similarBook) => (
                  <Card
                    key={similarBook.id}
                    className="overflow-hidden glass rounded-lg sm:rounded-xl hover:bg-white/10 transition-all cursor-pointer group border border-white/10"
                    onClick={() => window.open(similarBook.amazonUrl, "_blank")}
                  >
                    <CardContent className="p-2 sm:p-3 space-y-2 sm:space-y-3 h-full flex flex-col">
                      {/* Book Cover */}
                      <div className="relative w-full aspect-[3/4] rounded-md sm:rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                        <Image
                          src={similarBook.coverImage || "/placeholder.svg"}
                          alt={`${similarBook.title} by ${similarBook.author}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      </div>

                      {/* Book Info */}
                      <div className="space-y-1 sm:space-y-2 flex-1 flex flex-col">
                        <h3 className="font-semibold text-[11px] sm:text-xs leading-tight text-balance line-clamp-2 text-white">
                          {similarBook.title}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-white/60 line-clamp-1 mb-1">
                          {similarBook.author}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                                i < Math.round(similarBook.rating)
                                  ? "fill-yellow-300 text-yellow-300"
                                  : "fill-white/20 text-white/20"
                              }`}
                            />
                          ))}
                          <span className="text-[9px] sm:text-[10px] text-white/60 ml-1">
                            {similarBook.rating}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Helper Text */}
              <p className="text-xs sm:text-sm text-white/50 text-center italic pt-4 border-t border-white/10">
                Click any book to find it on Amazon.ca
              </p>
            </section>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <button
            className="glass-button inline-block h-12 sm:h-14 px-8 sm:px-12 text-base sm:text-lg rounded-xl font-semibold transition-all hover:bg-white/20 active:scale-95"
            onClick={() => window.open(book.amazonUrl, "_blank")}
          >
            Get {book.title} on Amazon.ca
          </button>
        </div>
      </div>
    </div>
  )
}
