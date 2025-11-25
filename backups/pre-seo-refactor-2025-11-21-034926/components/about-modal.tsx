"use client"

import { X } from "lucide-react"
import { useEffect } from "react"

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Parallax background in modal */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-30"
        style={{
          backgroundImage:
            "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_20251109_153217-UxUDUnIiH9h0qLP2V8KjZ6bSV7X3DI.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-background/90 backdrop-blur-xl" />

      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card/60 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors border border-white/20"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="space-y-6">
          <h2 className="font-sans font-bold text-3xl md:text-4xl text-balance text-white">About Katie Booktok</h2>

          <div className="prose prose-invert max-w-none space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Welcome to Katie Booktok! I'm Katie, a fantasy book lover with a passion for dragons, romance, and
              everything in between. This blog is my corner of the internet where I share honest reviews,
              recommendations, and bookish content.
            </p>

            <h3 className="font-sans font-bold text-xl mt-8 mb-4">Amazon Affiliate Disclosure</h3>
            <p className="text-muted-foreground leading-relaxed">
              Katie Booktok is a participant in the Amazon Services LLC Associates Program, an affiliate advertising
              program designed to provide a means for sites to earn advertising fees by advertising and linking to
              Amazon.com.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              As an Amazon Associate, I earn from qualifying purchases. This means that if you click on an affiliate
              link and make a purchase, I may receive a small commission at no additional cost to you. These commissions
              help support the blog and allow me to continue creating content.
            </p>

            <h3 className="font-sans font-bold text-xl mt-8 mb-4">Transparency & Honesty</h3>
            <p className="text-muted-foreground leading-relaxed">
              All opinions expressed on this blog are my own. I only recommend books that I have personally read and
              genuinely enjoyed. The presence of an affiliate link does not influence my review or rating of any book.
            </p>

            <h3 className="font-sans font-bold text-xl mt-8 mb-4">Privacy & Cookies</h3>
            <p className="text-muted-foreground leading-relaxed">
              This website may use cookies to improve your browsing experience and track affiliate links. By using this
              site, you consent to the use of cookies in accordance with our privacy practices.
            </p>

            <h3 className="font-sans font-bold text-xl mt-8 mb-4">Contact</h3>
            <p className="text-muted-foreground leading-relaxed">
              Questions or concerns? Feel free to reach out through any of my social media channels. I'd love to hear
              from you!
            </p>

            <p className="text-sm text-muted-foreground/70 mt-8">Last Updated: January 2025</p>
          </div>
        </div>
      </div>
    </div>
  )
}
