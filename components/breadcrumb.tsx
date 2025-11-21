"use client"

import Link from "next/link"

interface BreadcrumbItem {
  label: string
  href: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      className="relative z-10 flex items-center gap-2 px-4 py-3 text-sm rounded-lg glass"
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.href}-${index}`} className="flex items-center gap-2">
            {item.current ? (
              /* Current page - not clickable, bold */
              <span className="font-semibold text-foreground truncate">
                {item.label}
              </span>
            ) : (
              /* Navigable link */
              <>
                <Link
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-200 underline-offset-2 hover:underline truncate"
                >
                  {item.label}
                </Link>
                {/* Separator - only show if not the last item */}
                {index < items.length - 1 && (
                  <span className="text-muted-foreground mx-1">/</span>
                )}
              </>
            )}
            {/* Separator after non-current items */}
            {!item.current && index < items.length - 1 && (
              <span className="text-muted-foreground mx-1">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
