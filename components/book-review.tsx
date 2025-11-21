"use client"

import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

interface BookReviewProps {
  bookId: string
  title: string
  author: string
  rating: number
  coverImage: string
  review: string
  plot?: string
  affiliateLink: string
  tags: string[]
  reverse?: boolean
  dateRead?: string
  slug?: string  // URL slug for linking to individual page
}

export function BookReview({
  bookId,
  title,
  author,
  rating,
  coverImage,
  review,
  plot,
  affiliateLink,
  tags,
  reverse = false,
  dateRead,
  slug,
}: BookReviewProps) {
  // Create preview - use first sentence of plot if available, otherwise review
  const getPreviewText = () => {
    if (plot) {
      // Extract first sentence from plot (up to first period, question mark, or exclamation point)
      const firstSentence = plot.match(/^[^.!?]+[.!?]/)
      if (firstSentence && firstSentence[0].length > 20) {
        return firstSentence[0]
      }
      // Fallback: first 150 characters of plot
      return plot.length > 150 ? plot.substring(0, 150) + "..." : plot
    }
    // Fallback to review if no plot
    return review.length > 150 ? review.substring(0, 150) + "..." : review
  }

  const reviewPreview = getPreviewText()
  return (
    <Card className="overflow-hidden glass rounded-2xl">
      <CardContent className="p-0">
        <div className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-6 md:gap-8 p-6 md:p-8`}>
          {/* Book Cover */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative w-48 h-72 md:w-56 md:h-84 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={coverImage || "/placeholder.svg"}
                alt={`${title} by ${author} - Fantasy Book Cover | Katie Booktok Review`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Review Content */}
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h3 className="font-sans font-bold text-2xl md:text-3xl text-balance text-white">{title}</h3>
              <p className="text-lg text-white/70">{author}</p>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < rating ? "fill-white/90 text-white/90" : "fill-white/20 text-white/20"}`}
                  />
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} className="glass text-sm text-white border-white/20">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Review Preview */}
            <p className="text-base md:text-lg leading-relaxed text-white/85">{reviewPreview}</p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {slug && (
                <Link href={`/books/${slug}`}>
                  <button className="glass-button w-full md:min-w-[200px] h-12 text-base rounded-xl">
                    Read Full Review
                  </button>
                </Link>
              )}
              <button
                className="glass-button flex-1 md:flex-none md:min-w-[200px] h-12 text-base rounded-xl"
                onClick={() => window.open(affiliateLink, "_blank")}
              >
                Get on Amazon
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
