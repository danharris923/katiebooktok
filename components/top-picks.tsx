"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { getTopRatedBooks } from "@/lib/books"

export function TopPicks() {
  // Get Katie's top-rated books from her actual Goodreads data
  const topPicks = getTopRatedBooks(8)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {topPicks.map((book) => (
        <Card key={book.id} className="overflow-hidden glass rounded-2xl hover:bg-white/10 transition-all">
          <CardContent className="p-4 space-y-4">
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
              <Image
                src={book.coverImage || "/placeholder.svg"}
                alt={`${book.title} by ${book.author} - Katie's Top Fantasy Pick`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="space-y-2">
              <h4 className="font-sans font-semibold text-base md:text-lg text-balance leading-tight text-white">
                {book.title}
              </h4>
              <p className="text-sm text-white/70">{book.author}</p>
              <button
                className="glass-button w-full h-10 text-sm rounded-xl"
                onClick={() => window.open(book.amazonUrl, "_blank")}
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
