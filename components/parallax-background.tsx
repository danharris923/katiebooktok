"use client"

interface ParallaxBackgroundProps {
  scrollY: number
}

export function ParallaxBackground({ scrollY }: ParallaxBackgroundProps) {
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 1000
  const documentHeight = typeof document !== "undefined" ? document.documentElement.scrollHeight : 5000

  return (
    <>
      {/* Fixed bookcase background - content scrolls over it */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_20251109_153217-UxUDUnIiH9h0qLP2V8KjZ6bSV7X3DI.jpg')",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.5,
          }}
        />
      </div>

      {/* Dark gradient overlay for readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background/60 pointer-events-none z-[1]" />
    </>
  )
}
