"use client"

import { useEffect, useRef } from "react"

export default function SparkleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const sparkles: Array<{
      x: number
      y: number
      size: number
      opacity: number
      speed: number
      angle: number
    }> = []

    // Create sparkles
    for (let i = 0; i < 50; i++) {
      sparkles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.15 + 0.05,
        speed: Math.random() * 0.5 + 0.2,
        angle: Math.random() * Math.PI * 2,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      sparkles.forEach((sparkle) => {
        // Update position
        sparkle.y -= sparkle.speed
        sparkle.x += Math.sin(sparkle.angle) * 0.2

        // Reset if off screen
        if (sparkle.y < -10) {
          sparkle.y = canvas.height + 10
          sparkle.x = Math.random() * canvas.width
        }

        // Draw sparkle
        ctx.save()
        ctx.globalAlpha = sparkle.opacity
        ctx.fillStyle = "#FFB300"
        ctx.beginPath()

        // Draw star shape
        const spikes = 4
        const outerRadius = sparkle.size
        const innerRadius = sparkle.size * 0.4

        ctx.translate(sparkle.x, sparkle.y)
        ctx.rotate(Date.now() * 0.001 * sparkle.speed)

        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius
          const angle = (i * Math.PI) / spikes
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius

          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }

        ctx.closePath()
        ctx.fill()
        ctx.restore()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "transparent" }} />
  )
}
