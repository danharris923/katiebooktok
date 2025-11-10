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

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false)

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

        {/* Book Reviews Section */}
        <section id="reviews" className="py-16 px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            <h2 className="font-sans font-bold text-4xl md:text-5xl text-center mb-12 text-balance">
              {"Latest Reviews"}
            </h2>

            <BookReview
              title="Fourth Wing"
              author="Rebecca Yarros"
              rating={5}
              coverImage="/fantasy-book-cover-dragon-violet.jpg"
              review="An absolute masterpiece! The dragon bonding system is intricate and fascinating. Violet's journey from underdog to warrior had me completely hooked. The chemistry between the characters is electric, and the plot twists left me gasping. A must-read for fantasy romance lovers!"
              affiliateLink="#"
              tags={["Dragons", "Enemies to Lovers", "Military Academy"]}
            />

            <BookReview
              title="A Court of Thorns and Roses"
              author="Sarah J. Maas"
              rating={5}
              coverImage="/placeholder-popew.png"
              review="The perfect blend of Beauty and the Beast retelling with High Fae politics. Feyre's transformation is beautifully written, and the world-building is absolutely stunning. The romance builds slowly and intensely. This series changed my life and ignited my love for fantasy romance!"
              affiliateLink="#"
              tags={["Fae", "Retelling", "Slow Burn"]}
              reverse
            />

            <BookReview
              title="House of Earth and Blood"
              author="Sarah J. Maas"
              rating={4}
              coverImage="/fantasy-book-cover-urban-angel-wings.jpg"
              review="Urban fantasy at its finest! The mystery kept me guessing until the very end. Bryce is a phenomenally flawed and real protagonist. The world of Crescent City is rich with different species and political intrigue. Warning: the middle can be slow, but the payoff is absolutely worth it!"
              affiliateLink="#"
              tags={["Urban Fantasy", "Mystery", "Found Family"]}
            />
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
          <p className="text-sm">{"© 2025 Katie Booktok. All affiliate links support this blog."}</p>
        </footer>
      </div>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <NewsletterModal isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)} />
    </main>
  )
}
