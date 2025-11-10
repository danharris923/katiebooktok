"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

interface NavbarProps {
  onAboutClick: () => void
  onNewsletterClick: () => void
}

export function Navbar({ onAboutClick, onNewsletterClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMobileMenuOpen(false)
    }
  }

  const navItems = [
    { label: "Home", id: "home" },
    { label: "Reviews", id: "reviews" },
    { label: "Top Picks", id: "top-picks" },
    { label: "TBR", id: "tbr" },
    { label: "Connect", id: "connect" },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border/50" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => scrollToSection("home")}
            className="font-sans font-bold text-lg hover:text-primary transition-colors"
          >
            Katie Booktok
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm hover:text-primary transition-colors min-h-[44px] px-2"
              >
                {item.label}
              </button>
            ))}
            <button onClick={onAboutClick} className="text-sm hover:text-primary transition-colors min-h-[44px] px-2">
              About
            </button>
            <button onClick={onNewsletterClick} className="glass-button h-9 px-4 text-sm rounded-full">
              Newsletter
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-11 h-11 flex items-center justify-center hover:bg-card/50 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-background/98 backdrop-blur-lg pt-14">
          <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-2xl hover:text-primary transition-colors min-h-[44px]"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                onAboutClick()
                setIsMobileMenuOpen(false)
              }}
              className="text-2xl hover:text-primary transition-colors min-h-[44px]"
            >
              About
            </button>
            <button
              onClick={() => {
                onNewsletterClick()
                setIsMobileMenuOpen(false)
              }}
              className="glass-button h-12 px-8 text-lg rounded-full"
            >
              Newsletter
            </button>
          </div>
        </div>
      )}
    </>
  )
}
