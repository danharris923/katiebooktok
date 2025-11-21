"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import tbrData from "@/data/katie_tbr.json"

const tbrBooks = tbrData

export function TBRSection() {
  return (
    <div className="space-y-6">
      <p className="text-center text-lg text-white/70 max-w-2xl mx-auto text-balance">
        {"Books I'm dying to read next! Check back for updates and reviews."}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {tbrBooks.map((book) => (
          <Card key={book.title} className="overflow-hidden glass rounded-2xl hover:bg-white/10 transition-all">
            <CardContent className="p-3 space-y-3">
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={book.coverImage || "/placeholder.svg"}
                  alt={`${book.title} by ${book.author} - Katie's TBR (To Be Read)`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-sans font-semibold text-sm leading-tight text-balance line-clamp-2 text-white">
                  {book.title}
                </h4>
                <p className="text-xs text-white/70 line-clamp-1">{book.author}</p>
                <p className="text-xs text-white/90 font-medium">{book.releaseInfo}</p>
                <button
                  className="glass-button w-full h-9 text-xs rounded-lg"
                  onClick={() => window.open(book.affiliateLink, "_blank")}
                >
                  {"Pre-order"}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
