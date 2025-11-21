"use client"

import { useEffect, useState } from "react"
import { BookReview } from "@/components/book-review"
import { TopPicks } from "@/components/top-picks"
import { TBRSection } from "@/components/tbr-section"
import { SocialLinks } from "@/components/social-links"
import { ParallaxBackground } from "@/components/parallax-background"
import { Navbar } from "@/components/navbar"
import { AboutModal } from "@/components/about-modal"
import { NewsletterModal } from "@/components/newsletter-modal"
import { Button } from "@/components/ui/button"
import { getAllBooks, getTopRatedBooks } from "@/lib/books"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false)

  // Get Katie's real books from Goodreads scrape
  const allBooks = getAllBooks()
  const latestBooks = allBooks.slice(0, 10) // First 10 books (most recent)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="relative min-h-screen">
      <ParallaxBackground />

      <Navbar onAboutClick={() => setIsAboutOpen(true)} onNewsletterClick={() => setIsNewsletterOpen(true)} />

      <div className="relative z-10">
        {/* Clean title with gumball logo */}
        <section id="home" className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 pt-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Clean title with gumball logo */}
            <h1
              className="font-sans text-6xl md:text-8xl lg:text-9xl font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              style={{
                textShadow: "2px 2px 4px rgba(0,0,0,0.5), 0 0 30px rgba(255,255,255,0.2)",
              }}
            >
              Katie Booktok
            </h1>

            <p className="text-lg md:text-xl text-white/90 text-balance max-w-2xl mx-auto font-medium drop-shadow-lg">
              {"Your guide to fantasy, dragons, and swoon-worthy romance"}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
              <Button
                size="lg"
                className="h-12 px-8 text-base min-w-[200px] bg-transparent border-2 border-white/60 text-white hover:bg-white/10 backdrop-blur-sm"
                onClick={() => {
                  document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                {"Explore Reviews"}
              </Button>

              <Button
                size="lg"
                className="h-12 px-8 text-base min-w-[200px] bg-transparent border-2 border-white/60 text-white hover:bg-white/10 backdrop-blur-sm"
                onClick={() => {
                  document.getElementById("top-picks")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                {"Top Picks"}
              </Button>

              <Button
                size="lg"
                className="h-12 px-8 text-base min-w-[200px] bg-transparent border-2 border-white/60 text-white hover:bg-white/10 backdrop-blur-sm"
                onClick={() => {
                  document.getElementById("tbr")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                {"TBR"}
              </Button>
            </div>
          </div>
        </section>

        {/* Book Reviews Section - Katie's Real Books from Goodreads */}
        <section id="reviews" className="py-16 px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            <h2 className="font-sans font-bold text-4xl md:text-5xl text-center mb-12 text-balance">
              {"Latest Reviews"}
            </h2>

            {/* Book cards with "Read Full Review" button linking to individual pages */}
            {latestBooks.map((book, index) => (
              <BookReview
                key={book.id}
                bookId={book.id}
                title={book.title}
                author={book.author}
                rating={Math.round(book.rating)}
                coverImage={book.coverImage}
                review={book.description}
                plot={book.plot}
                affiliateLink={book.amazonUrl}
                tags={[book.genre]}
                reverse={index % 2 !== 0}
                dateRead={book.dateRead}
                slug={book.slug}
              />
            ))}
          </div>
        </section>

        {/* Top Picks Section */}
        <section id="top-picks" className="py-16 px-4 bg-card/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-sans font-bold text-4xl md:text-5xl text-center mb-12 text-balance">
              {"Katie's Top Picks"}
            </h2>
            <TopPicks />
          </div>
        </section>

        {/* TBR Section */}
        <section id="tbr" className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-sans font-bold text-4xl md:text-5xl text-center mb-12 text-balance">{"To Be Read"}</h2>
            <TBRSection />
          </div>
        </section>

        {/* Social Links Section */}
        <section id="connect" className="py-16 px-4 bg-card/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="font-sans font-bold text-4xl md:text-5xl text-balance">{"Connect With Me"}</h2>
            <p className="text-lg md:text-xl text-muted-foreground text-balance">
              {"Follow along for daily book content, reviews, and recommendations"}
            </p>
            <SocialLinks />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 text-center text-muted-foreground">
          <div className="space-y-3">
            <p className="text-sm">{"© 2025 Katie Booktok. All affiliate links support this blog."}</p>
            <p className="text-sm">
              {"Looking for great deals? Check out "}
              <a
                href="https://shopcanada.cc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white underline transition-colors"
              >
                ShopCanada.cc
              </a>
              {" for Canadian shopping deals and discounts."}
            </p>
          </div>
        </footer>
      </div>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <NewsletterModal isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)} />
    </main>
  )
}
