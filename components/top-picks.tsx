"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const topPicks = [
  {
    title: "Powerless",
    author: "Lauren Roberts",
    coverImage: "/fantasy-book-powerless.jpg",
    affiliateLink: "#",
  },
  {
    title: "The Hurricane Wars",
    author: "Thea Guanzon",
    coverImage: "/fantasy-book-hurricane-wars.jpg",
    affiliateLink: "#",
  },
  {
    title: "Divine Rivals",
    author: "Rebecca Ross",
    coverImage: "/fantasy-book-divine-rivals.jpg",
    affiliateLink: "#",
  },
  {
    title: "The Scarlet Veil",
    author: "Shelby Mahurin",
    coverImage: "/fantasy-book-scarlet-veil.jpg",
    affiliateLink: "#",
  },
]

export function TopPicks() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {topPicks.map((book) => (
        <Card key={book.title} className="overflow-hidden glass rounded-2xl hover:bg-white/10 transition-all">
          <CardContent className="p-4 space-y-4">
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
              <Image
                src={book.coverImage || "/placeholder.svg"}
                alt={`${book.title} cover`}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-2">
              <h4 className="font-sans font-semibold text-base md:text-lg text-balance leading-tight text-white">
                {book.title}
              </h4>
              <p className="text-sm text-white/70">{book.author}</p>
              <button
                className="glass-button w-full h-10 text-sm rounded-xl"
                onClick={() => window.open(book.affiliateLink, "_blank")}
              >
                {"Buy Now"}
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
