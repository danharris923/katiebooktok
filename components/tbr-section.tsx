"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const tbrBooks = [
  {
    title: "The Ashes and the Star-Cursed King",
    author: "Carissa Broadbent",
    coverImage: "/fantasy-book-ashes-star-cursed-king.jpg",
    affiliateLink: "#",
    releaseInfo: "Out Now",
  },
  {
    title: "The Serpent and the Wings of Night",
    author: "Carissa Broadbent",
    coverImage: "/fantasy-book-serpent-wings-night.jpg",
    affiliateLink: "#",
    releaseInfo: "Out Now",
  },
  {
    title: "Assistant to the Villain",
    author: "Hannah Nicole Maehrer",
    coverImage: "/fantasy-book-assistant-villain.jpg",
    affiliateLink: "#",
    releaseInfo: "Out Now",
  },
  {
    title: "Hell Bent",
    author: "Leigh Bardugo",
    coverImage: "/fantasy-book-hell-bent-dark.jpg",
    affiliateLink: "#",
    releaseInfo: "Out Now",
  },
  {
    title: "House of Flame and Shadow",
    author: "Sarah J. Maas",
    coverImage: "/fantasy-book-flame-shadow.jpg",
    affiliateLink: "#",
    releaseInfo: "Out Now",
  },
  {
    title: "A Dawn of Onyx",
    author: "Kate Golden",
    coverImage: "/fantasy-book-dawn-onyx.jpg",
    affiliateLink: "#",
    releaseInfo: "Out Now",
  },
]

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
                  alt={`${book.title} cover`}
                  fill
                  className="object-cover"
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
