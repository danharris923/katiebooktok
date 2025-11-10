"use client"

import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface BookReviewProps {
  title: string
  author: string
  rating: number
  coverImage: string
  review: string
  affiliateLink: string
  tags: string[]
  reverse?: boolean
}

export function BookReview({
  title,
  author,
  rating,
  coverImage,
  review,
  affiliateLink,
  tags,
  reverse = false,
}: BookReviewProps) {
  return (
    <Card className="overflow-hidden glass rounded-2xl">
      <CardContent className="p-0">
        <div className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-6 md:gap-8 p-6 md:p-8`}>
          {/* Book Cover */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative w-48 h-72 md:w-56 md:h-84 rounded-2xl overflow-hidden shadow-2xl">
              <Image src={coverImage || "/placeholder.svg"} alt={`${title} cover`} fill className="object-cover" />
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

            {/* Review Text */}
            <p className="text-base md:text-lg leading-relaxed text-white/85">{review}</p>

            {/* Affiliate Button - Updated to glass button styling */}
            <button
              className="glass-button w-full md:w-auto min-w-[200px] h-12 text-base rounded-xl"
              onClick={() => window.open(affiliateLink, "_blank")}
            >
              {"Get on Amazon"}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
