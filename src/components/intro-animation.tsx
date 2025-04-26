"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dot1Ref = useRef<HTMLDivElement>(null)
  const dot2Ref = useRef<HTMLDivElement>(null)
  const dot3Ref = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get references
    const container = containerRef.current
    const dot1 = dot1Ref.current
    const dot2 = dot2Ref.current
    const dot3 = dot3Ref.current
    const message = messageRef.current

    if (!container || !dot1 || !dot2 || !dot3 || !message) return

    // Simple animation for the dots
    const animateDots = () => {
      // Clear any existing animations
      gsap.killTweensOf([dot1, dot2, dot3])

      // Animate dot 1
      gsap.to(dot1, {
        y: -15,
        duration: 0.4,
        repeat: 1,
        yoyo: true,
        ease: "power1.inOut",
        onComplete: () => {
          // Animate dot 2 after dot 1
          gsap.to(dot2, {
            y: -15,
            duration: 0.4,
            repeat: 1,
            yoyo: true,
            ease: "power1.inOut",
            onComplete: () => {
              // Animate dot 3 after dot 2
              gsap.to(dot3, {
                y: -15,
                duration: 0.4,
                repeat: 1,
                yoyo: true,
                ease: "power1.inOut",
                onComplete: () => {
                  // Repeat the sequence
                  setTimeout(animateDots, 300)
                },
              })
            },
          })
        },
      })
    }

    // Start the animation
    animateDots()

    // After 3 seconds, transition to the next phase
    setTimeout(() => {
      // Stop the jumping animation
      gsap.killTweensOf([dot1, dot2, dot3])

      // Update message
      gsap.to(message, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          if (message) {
            message.textContent = "Preparing your journey..."
            gsap.to(message, { opacity: 1, duration: 0.3 })
          }
        },
      })

      // Fade out dot1 and dot3
      gsap.to([dot1, dot3], {
        opacity: 0,
        duration: 0.5,
        ease: "power1.out",
      })

      // Move dot2 to center and expand
      gsap.to(dot2, {
        scale: 100,
        backgroundColor: "rgba(91, 33, 182, 0.3)",
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: () => {
          // Create shockwave effect
          const shockwave = document.createElement("div")
          shockwave.className =
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-2 border-purple-500/30"
          container.appendChild(shockwave)

          gsap.fromTo(
            shockwave,
            { scale: 0.1, opacity: 0.8 },
            {
              scale: 15,
              opacity: 0,
              duration:0.5,
              ease: "power1.out",
              onComplete: () => {
                // Fade out the entire container
                gsap.to(container, {
                  opacity: 0,
                  duration: 0.5,
                  onComplete: () => {
                    // Call the onComplete callback
                    onComplete()
                  },
                })
              },
            },
          )
        },
      })
    },1000)

    return () => {
      // Clean up animations
      gsap.killTweensOf([dot1, dot2, dot3, message, container])
    }
  }, [onComplete])

  return (
    <div ref={containerRef} className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-[#0a0a2b]">
      <div className="relative">
        {/* Loading dots */}
        <div className="flex gap-4 items-center justify-center">
          <div ref={dot1Ref} className="w-4 h-4 rounded-full bg-purple-500" />
          <div ref={dot2Ref} className="w-4 h-4 rounded-full bg-purple-500" />
          <div ref={dot3Ref} className="w-4 h-4 rounded-full bg-purple-500" />
        </div>
      </div>

      {/* Loading text */}
      <div ref={messageRef} className="mt-8 text-purple-300 text-lg">
        Loading cosmic energy...
      </div>
    </div>
  )
}
