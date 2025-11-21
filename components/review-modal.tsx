"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getSimilarBooks } from "@/lib/books"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  bookId: string
  title: string
  author: string
  rating: number
  coverImage: string
  review: string
  plot?: string
  tags: string[]
  affiliateLink: string
  dateRead?: string
}

export function ReviewModal({
  isOpen,
  onClose,
  bookId,
  title,
  author,
  rating,
  coverImage,
  review,
  plot,
  tags,
  affiliateLink,
  dateRead,
}: ReviewModalProps) {
  // Get similar books for recommendations
  const similarBooks = getSimilarBooks(bookId, 6)
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[98vw] w-[98vw] sm:max-w-[95vw] sm:w-[95vw] md:max-w-7xl md:w-[92vw] lg:w-[90vw] max-h-[95vh] overflow-y-auto glass rounded-xl sm:rounded-2xl border-white/20 p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-white pr-8">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
            {/* Book Cover */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="relative w-40 h-60 sm:w-48 sm:h-72 md:w-56 md:h-84 rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={coverImage || "/placeholder.svg"}
                  alt={`${title} cover`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

            {/* Book Details */}
            <div className="flex-1 space-y-3 sm:space-y-4">
              <div>
                <p className="text-base sm:text-lg text-white/90 font-semibold">{author}</p>
                {dateRead && (
                  <p className="text-xs sm:text-sm text-white/60 mt-1">Read on {dateRead}</p>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      i < rating ? "fill-white/90 text-white/90" : "fill-white/20 text-white/20"
                    }`}
                  />
                ))}
                <span className="ml-2 text-white/80 text-xs sm:text-sm">({rating}/5)</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} className="glass text-xs sm:text-sm text-white border-white/20 px-2 py-0.5">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Affiliate Button */}
              <button
                className="glass-button w-full h-11 sm:h-12 text-sm sm:text-base rounded-xl font-medium"
                onClick={() => window.open(affiliateLink, "_blank")}
              >
                Get on Amazon.ca
              </button>
            </div>
          </div>

          {/* Plot Summary */}
          {plot && (
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-lg sm:text-xl text-white">About This Book</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-sm sm:text-base leading-relaxed text-white/70 italic">
                  {plot}
                </p>
              </div>
            </div>
          )}

          {/* Katie's Review */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="font-semibold text-lg sm:text-xl text-white">Katie's Review</h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-sm sm:text-base leading-relaxed text-white/85 whitespace-pre-wrap">
                {review}
              </p>
            </div>
          </div>

          {/* You Might Also Like */}
          {similarBooks.length > 0 && (
            <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-white/10">
              <h3 className="font-semibold text-lg sm:text-xl text-white">You Might Also Like</h3>
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                {similarBooks.map((book) => (
                  <Card
                    key={book.id}
                    className="overflow-hidden glass rounded-lg sm:rounded-xl hover:bg-white/10 transition-all cursor-pointer group"
                    onClick={() => window.open(book.amazonUrl, "_blank")}
                  >
                    <CardContent className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
                      <div className="relative w-full aspect-[3/4] rounded-md sm:rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src={book.coverImage || "/placeholder.svg"}
                          alt={`${book.title} by ${book.author} - Similar Book Recommendation`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      </div>
                      <div className="space-y-0.5 sm:space-y-1">
                        <h4 className="font-semibold text-[10px] sm:text-xs leading-tight text-balance line-clamp-2 text-white">
                          {book.title}
                        </h4>
                        <p className="text-[9px] sm:text-xs text-white/60 line-clamp-1">{book.author}</p>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                                i < Math.round(book.rating)
                                  ? "fill-white/70 text-white/70"
                                  : "fill-white/20 text-white/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-[10px] sm:text-xs text-white/50 text-center italic">
                Click any book to find it on Amazon.ca
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
