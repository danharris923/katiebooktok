import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    // Validate email and name
    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 })
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Here you would integrate with your email service provider
    // Examples: Mailchimp, ConvertKit, SendGrid, etc.
    // For now, we'll log it (in production, replace with actual integration)
    console.log("[v0] Newsletter signup:", { email, name, timestamp: new Date().toISOString() })

    // TODO: Integrate with email service provider
    // Example with fetch to a service:
    // const response = await fetch('YOUR_EMAIL_SERVICE_API', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, name })
    // })

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to newsletter",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Newsletter signup error:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
