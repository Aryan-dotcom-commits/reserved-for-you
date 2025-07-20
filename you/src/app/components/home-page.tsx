"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

interface HomePageProps {
  onNext: () => void
}

export default function HomePage({ onNext }: HomePageProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
      <div
        className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-contrast-accent mb-8 leading-tight">
          Hey Kritika,
          <br />
          <span className="text-primary-accent">guess what time it is?</span>
        </h1>

        <div className="mb-12 flex justify-center">
          <div className="relative bg-gradient-to-br from-amber-100 to-amber-200 rounded-full p-8 shadow-lg border-4 border-primary-accent">
            <Clock className="w-16 h-16 md:w-20 md:h-20 text-primary-accent animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center mt-2">
                <div className="text-sm md:text-base font-bold text-contrast-accent">Lunch</div>
                <div className="text-xs md:text-sm text-contrast-accent">{"O'Clock"}</div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-secondary-accent rounded-full animate-bounce-soft"></div>
            <div
              className="absolute -bottom-2 -left-2 w-3 h-3 bg-primary-accent rounded-full animate-bounce-soft"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute top-1/2 -left-3 w-2 h-2 bg-secondary-accent rounded-full animate-bounce-soft"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="group relative px-8 py-4 md:px-12 md:py-6 bg-primary-accent text-white font-medium text-lg md:text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse-soft"
          style={{
            boxShadow: "0 4px 15px rgba(255, 179, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            animation: "pulse-glow 2s infinite",
          }}
        >
          <span className="group-hover:animate-wiggle inline-block">{"Let's Get Lunch? ✨"}</span>
        </button>
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.5); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
        }
        
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out;
        }
        
        .animate-pulse-soft {
          animation: pulse-glow 2s infinite;
        }
        
        .animate-bounce-soft {
          animation: bounce-soft 2s infinite;
        }
        
        @keyframes bounce-soft {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
          60% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  )
}
