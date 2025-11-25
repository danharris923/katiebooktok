// Utility functions for managing affiliate links

export interface AffiliateBook {
  id: string
  title: string
  author: string
  asin: string // Amazon Standard Identification Number
  price?: number
  imageUrl?: string
}

// Your Amazon Associates affiliate ID
const AFFILIATE_ID = "your-affiliate-id-20"

/**
 * Generates an Amazon affiliate link for a book
 * @param asin - Amazon Standard Identification Number
 * @param affiliateId - Your Amazon Associates ID (optional)
 * @returns Full Amazon affiliate URL
 */
export function generateAffiliateLink(asin: string, affiliateId: string = AFFILIATE_ID): string {
  return `https://www.amazon.com/dp/${asin}?tag=${affiliateId}`
}

/**
 * Tracks affiliate link clicks
 * @param bookId - Unique identifier for the book
 * @param eventType - Type of event (click, purchase, etc.)
 */
export async function trackAffiliateEvent(bookId: string, eventType: "click" | "view" | "purchase"): Promise<void> {
  try {
    await fetch("/api/affiliate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId, eventType }),
    })
  } catch (error) {
    console.error("Failed to track affiliate event:", error)
  }
}

/**
 * Get affiliate link with tracking
 * @param bookId - Unique identifier for the book
 * @returns API route URL that handles tracking and redirection
 */
export function getTrackedAffiliateLink(bookId: string): string {
  return `/api/affiliate?book=${bookId}`
}
