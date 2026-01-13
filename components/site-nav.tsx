"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"

export function SiteNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Books", href: "/books" },
    { label: "Reviews", href: "/reviews" },
    { label: "Authors", href: "/authors" },
    { label: "Categories", href: "/tags" },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border/50" : "bg-background/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-sans font-bold text-lg hover:text-primary transition-colors"
          >
            Katie Booktok
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm hover:text-primary transition-colors min-h-[44px] px-2 flex items-center"
              >
                {item.label}
              </Link>
            ))}
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
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl hover:text-primary transition-colors min-h-[44px]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Spacer for fixed nav */}
      <div className="h-14" />
    </>
  )
}
