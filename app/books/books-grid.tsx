"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import type { Book } from "@/lib/books"

interface BooksGridProps {
  books: Book[]
  authors: string[]
}

export function BooksGrid({ books, authors }: BooksGridProps) {
  const [search, setSearch] = useState("")
  const [ratingFilter, setRatingFilter] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<"rating" | "title" | "author">("rating")

  const filteredBooks = useMemo(() => {
    let filtered = books

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(searchLower) ||
          b.author.toLowerCase().includes(searchLower)
      )
    }

    // Rating filter
    if (ratingFilter !== null) {
      filtered = filtered.filter((b) => Math.round(b.rating) === ratingFilter)
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "title") return a.title.localeCompare(b.title)
      if (sortBy === "author") return a.author.localeCompare(b.author)
      return 0
    })

    return filtered
  }, [books, search, ratingFilter, sortBy])

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <Input
          type="search"
          placeholder="Search books or authors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />

        <select
          value={ratingFilter ?? ""}
          onChange={(e) =>
            setRatingFilter(e.target.value ? Number(e.target.value) : null)
          }
          className="px-4 py-2 rounded-md bg-background border"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "rating" | "title" | "author")}
          className="px-4 py-2 rounded-md bg-background border"
        >
          <option value="rating">Sort by Rating</option>
          <option value="title">Sort by Title</option>
          <option value="author">Sort by Author</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-center text-muted-foreground mb-6">
        Showing {filteredBooks.length} of {books.length} books
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredBooks.map((book) => (
          <Link key={book.id} href={`/books/${book.slug}`}>
            <Card className="overflow-hidden h-full hover:ring-2 hover:ring-primary transition-all cursor-pointer group">
              <CardContent className="p-3 space-y-2">
                <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden">
                  <Image
                    src={book.coverImage || "/placeholder.svg"}
                    alt={`${book.title} by ${book.author} - Fantasy Book Review`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {book.author}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500">
                      {"★".repeat(Math.round(book.rating))}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {book.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No books found matching your criteria.
        </div>
      )}
    </div>
  )
}
