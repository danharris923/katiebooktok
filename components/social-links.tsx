"use client"

import { Facebook, Instagram, Music, Youtube } from "lucide-react"

const socialLinks = [
  {
    name: "Facebook",
    icon: Facebook,
    href: "#",
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "#",
  },
  {
    name: "TikTok",
    icon: Music,
    href: "#",
  },
  {
    name: "Lemonade",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
      </svg>
    ),
    href: "#",
  },
  {
    name: "YouTube",
    icon: Youtube,
    href: "#",
  },
]

export function SocialLinks() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {socialLinks.map((social) => {
        const Icon = social.icon
        return (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 rounded-full bg-card/80 backdrop-blur-sm border border-border hover:bg-card hover:scale-110 transition-all duration-300"
            aria-label={social.name}
          >
            <Icon className="w-7 h-7" />
          </a>
        )
      })}
    </div>
  )
}
