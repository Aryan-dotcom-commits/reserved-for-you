"use client"

import { useState, useEffect } from "react"
import confetti from "canvas-confetti"

interface AskPageProps {
  onRoyalPass: (location: string) => void
  availableLocations?: string[]
}

export default function AskPage({ onRoyalPass, availableLocations = ["Hot Put Bakes", "Hot and Bakes", "Pizzeria"] }: AskPageProps) {
  const [typewriterText, setTypewriterText] = useState("")
  const [showButtons, setShowButtons] = useState(false)
  const [noButtonScale, setNoButtonScale] = useState(1)
  const [yesButtonScale, setYesButtonScale] = useState(1)
  const [showTooltip, setShowTooltip] = useState(false)
  const [noClickCount, setNoClickCount] = useState(0)
  const [showNoButton, setShowNoButton] = useState(true)
  const [currentStep, setCurrentStep] = useState<"ask" | "scheduled" | "location" | "confetti">("ask")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [showLocationButton, setShowLocationButton] = useState(false)

  const fullText = "A simple question for the queen: ready to dine or not today?"

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypewriterText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        setTimeout(() => setShowButtons(true), 500)
      }
    }, 80) // Slower animation

    return () => clearInterval(timer)
  }, [])

  const handleYesClick = () => {
    if (currentStep === "ask") {
      setCurrentStep("scheduled")
    } else if (currentStep === "scheduled") {
      setCurrentStep("location")
    }
  }

  const handleNoClick = () => {
    setNoClickCount((prev) => prev + 1)

    if (noClickCount + 1 >= 5) {
      setShowNoButton(false)
      setYesButtonScale(1.2)
      return
    }

    // Progressive scaling - No button gets smaller, Yes button gets bigger
    const newNoScale = Math.max(0.3, 1 - (noClickCount + 1) * 0.15)
    const newYesScale = Math.min(1.4, 1 + (noClickCount + 1) * 0.1)

    setNoButtonScale(newNoScale)
    setYesButtonScale(newYesScale)

    if (noClickCount === 0) {
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 3000)
    }
  }

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location)
    setShowLocationButton(true)
  }

  const handleSetScene = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFB300", "#F67280", "#FFE0C3"],
    })
    setCurrentStep("confetti")
  }

  const handleNoLocation = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFB300", "#F67280", "#FFE0C3"],
    })
    setCurrentStep("confetti")
  }

  const handleGenerateRoyalPass = () => {
    onRoyalPass(selectedLocation)
  }

  if (currentStep === "scheduled") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="text-2xl md:text-3xl font-serif text-contrast-accent mb-8 max-w-2xl">
            The lunch has been scheduled for 1-2PM ⏰
          </div>
          <div className="text-lg md:text-xl text-gray-600 mb-8">Would you like to pick the location?</div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleYesClick}
              className="px-8 py-4 bg-primary-accent text-white font-medium text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {"Yes, I'll choose"}
            </button>
            <button
              onClick={handleNoLocation}
              className="px-8 py-4 bg-gray-300 text-gray-700 font-medium text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Surprise me
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "location") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="text-2xl md:text-3xl font-serif text-contrast-accent mb-8">
            Choose your royal dining location:
          </div>
          <div className="space-y-4 mb-8">
            {availableLocations.map((location) => (
              <button
                key={location}
                onClick={() => handleLocationSelect(location)}
                className={`block w-full max-w-md mx-auto px-6 py-4 rounded-full font-medium text-lg transition-all duration-300 ${
                  selectedLocation === location
                    ? "bg-primary-accent text-white shadow-lg"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-accent"
                }`}
              >
                {location}
              </button>
            ))}
          </div>
          {showLocationButton && (
            <button
              onClick={handleSetScene}
              className="px-8 py-4 bg-primary-accent text-white font-medium text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-soft"
            >
              Set a Scene ✨
            </button>
          )}
        </div>
      </div>
    )
  }

  if (currentStep === "confetti") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="text-2xl md:text-4xl font-serif text-contrast-accent mb-8 max-w-2xl">
            Perfect! Your royal feast awaits! 👑
          </div>
          <button
            onClick={handleGenerateRoyalPass}
            className="px-8 py-4 bg-primary-accent text-white font-medium text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-soft"
          >
            Generate Your Royal Palace 🏰
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
      <div className="text-center max-w-3xl">
        <div className="text-xl md:text-2xl lg:text-3xl font-serif font-normal text-contrast-accent mb-12 leading-relaxed min-h-[150px] flex items-center justify-center">
          <span className="typewriter">
            {typewriterText}
            <span className="animate-pulse">|</span>
          </span>
        </div>

        {showButtons && (
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative">
            <button
              onClick={handleYesClick}
              className="relative px-8 py-4 md:px-12 md:py-6 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-medium text-lg md:text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-glow min-w-[200px]"
              style={{
                transform: `scale(${yesButtonScale})`,
                boxShadow: yesButtonScale > 1 ? "0 0 30px rgba(255, 215, 0, 0.6)" : "0 0 20px rgba(255, 215, 0, 0.3)",
              }}
            >
              {"✅ Yes, I'm hungry"}
            </button>

            {showNoButton && (
              <div className="relative">
                <button
                  onClick={handleNoClick}
                  className="px-8 py-4 md:px-12 md:py-6 bg-gradient-to-r from-rose-300 to-rose-400 text-gray-700 font-medium text-lg md:text-xl rounded-full shadow-lg transition-all duration-300 min-w-[200px]"
                  style={{
                    transform: `scale(${noButtonScale})`,
                    opacity: noButtonScale < 1 ? 0.6 : 1,
                  }}
                >
                  {"❌ No, I'm full (Maybe later)"}
                </button>

                {noClickCount > 0 && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-500">
                    Clicks: {noClickCount}/5
                  </div>
                )}

                {showTooltip && (
                  <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-rose-400 text-white px-4 py-2 rounded-full text-sm animate-fade-in whitespace-nowrap shadow-lg">
                    <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-rose-400"></div>
                    Wrong button, Your Highness. 👑
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
