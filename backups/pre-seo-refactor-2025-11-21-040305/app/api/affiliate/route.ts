import { NextResponse } from "next/server"

// This route handler manages affiliate link tracking and redirection
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const bookId = searchParams.get("book")

  // In a production environment, you would:
  // 1. Log the click for analytics
  // 2. Fetch the actual Amazon affiliate link from your database
  // 3. Redirect to the Amazon affiliate URL

  // Example affiliate link structure (replace with your actual Amazon affiliate ID)
  const affiliateId = "your-affiliate-id-20"

  // Map book IDs to ASINs (Amazon Standard Identification Numbers)
  const bookASINs: Record<string, string> = {
    "fourth-wing": "B0BXWFV6QB",
    acotar: "B00OZP5VRS",
    hoeab: "B0827YMZVN",
    // Add more books as needed
  }

  const asin = bookId ? bookASINs[bookId] : null

  if (asin) {
    // Construct Amazon affiliate link
    const amazonUrl = `https://www.amazon.com/dp/${asin}?tag=${affiliateId}`

    // Log the click (in production, save to database)
    console.log(`Affiliate click for book: ${bookId}`)

    return NextResponse.redirect(amazonUrl)
  }

  // Fallback to Amazon homepage if book not found
  return NextResponse.redirect(`https://www.amazon.com/?tag=${affiliateId}`)
}

// POST endpoint for tracking affiliate link performance
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { bookId, eventType } = body

    // In production, save this data to your database
    console.log(`Affiliate event: ${eventType} for book: ${bookId}`)

    return NextResponse.json({
      success: true,
      message: "Event tracked successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
  }
}
