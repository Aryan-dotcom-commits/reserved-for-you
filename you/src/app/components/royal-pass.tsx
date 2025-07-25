"use client"

import { Crown } from "lucide-react"
import { useRef } from "react"

interface RoyalPassProps {
  selectedLocation: string
  onDownload: () => void
  guestName?: string
}

export default function RoyalPass({ selectedLocation, onDownload, guestName = "Kritika" }: RoyalPassProps) {
  const passRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <div className="w-full max-w-md">
        <div
          ref={passRef}
          id="royal-pass"
          className="bg-gradient-radial from-orange-100 to-white p-8 rounded-2xl shadow-2xl border-4 border-primary-accent relative"
          style={{
            background: "radial-gradient(circle at center, #FFE0C3 0%, #FFFFFF 70%)",
          }}
        >
          <Crown className="absolute top-4 right-4 w-8 h-8 text-primary-accent" />

          <div className="text-center">
            <h1 className="text-3xl font-serif text-contrast-accent mb-2">Royal Dining Pass</h1>
            <div className="w-16 h-1 bg-primary-accent mx-auto mb-6"></div>

            <div className="space-y-4 text-contrast-accent">
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-600">Guest</p>
                <p className="text-xl font-serif">Her Royal Highness {guestName}</p>
              </div>

              <div>
                <p className="text-sm uppercase tracking-wide text-gray-600">Date & Time</p>
                <p className="text-lg font-medium">Today, 1:00 PM - 2:00 PM</p>
              </div>

              <div>
                <p className="text-sm uppercase tracking-wide text-gray-600">Royal Venue</p>
                <p className="text-lg font-medium">{selectedLocation || "Surprise Location"}</p>
              </div>

              <div>
                <p className="text-sm uppercase tracking-wide text-gray-600">Your Companion</p>
                <p className="text-lg font-medium">The One Awaiting</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-primary-accent/30">
              <p className="text-sm text-gray-600 italic">Show this at the café to skip the line.</p>
              <p className="text-xs text-gray-500 mt-1">{"(Just kidding... unless you're into that.)"}</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={onDownload}
            className="px-8 py-4 bg-primary-accent text-white font-medium text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            style={{
              boxShadow: "0 0 20px rgba(255, 179, 0, 0.3)",
              animation: "pulse-glow 2s infinite",
            }}
          >
            Download Royal Pass 📜
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 179, 0, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 179, 0, 0.5); }
        }
      `}</style>
    </div>
  )
}
