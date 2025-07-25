"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import HomePage from "../../components/home-page"
import AskPage from "../../components/ask-page"
import RoyalPass from "../../components/royal-pass"
import SparkleBackground from "../../components/sparkle-background"

interface InvitationData {
  name: string
  location: string
  nickname: string
  createdAt: string
}

export default function PersonalizedInvitation() {
  const params = useParams()
  const nickname = params.nickname as string
  
  const [currentPage, setCurrentPage] = useState<"home" | "ask" | "royal-pass">("home")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (nickname) {
      // Try to get data from localStorage
      const storedData = localStorage.getItem(`invitation-${nickname}`)
      
      if (storedData) {
        const data = JSON.parse(storedData) as InvitationData
        setInvitationData(data)
        setSelectedLocation(data.location)
      } else {
        // Fallback data if not found in localStorage
        setInvitationData({
          name: nickname.charAt(0).toUpperCase() + nickname.slice(1),
          location: "Surprise Location",
          nickname: nickname,
          createdAt: new Date().toISOString()
        })
      }
      
      setLoading(false)
    }
  }, [nickname])

  const handleDownloadPass = async () => {
    let downloadSuccess = false

    // 1. Handle PDF Download (independent)
    try {
      // Alternative PDF generation using browser's print functionality
      const element = document.getElementById("royal-pass")

      if (element) {
        // Create a new window for printing
        const printWindow = window.open("", "_blank")
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Royal Dining Pass</title>
              <style>
                body { 
                  font-family: Georgia, serif; 
                  margin: 20px; 
                  background: white;
                }
                .royal-pass {
                  max-width: 400px;
                  margin: 0 auto;
                  padding: 40px;
                  border: 4px solid #FFB300;
                  border-radius: 20px;
                  background: radial-gradient(circle at center, #FFE0C3 0%, #FFFFFF 70%);
                  position: relative;
                }
                .crown {
                  position: absolute;
                  top: 20px;
                  right: 20px;
                  font-size: 24px;
                }
                .title {
                  text-align: center;
                  font-size: 28px;
                  color: #2E1F27;
                  margin-bottom: 10px;
                }
                .divider {
                  width: 60px;
                  height: 4px;
                  background: #FFB300;
                  margin: 0 auto 30px;
                }
                .detail {
                  margin-bottom: 20px;
                  text-align: center;
                }
                .label {
                  font-size: 12px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  color: #666;
                  margin-bottom: 5px;
                }
                .value {
                  font-size: 18px;
                  color: #2E1F27;
                  font-weight: bold;
                }
                .footer {
                  margin-top: 40px;
                  padding-top: 20px;
                  border-top: 1px solid rgba(255, 179, 0, 0.3);
                  text-align: center;
                  font-size: 12px;
                  color: #666;
                  font-style: italic;
                }
                @media print {
                  body { margin: 0; }
                  .royal-pass { border: 2px solid #FFB300; }
                }
              </style>
            </head>
            <body>
              <div class="royal-pass">
                <div class="crown">👑</div>
                <h1 class="title">Royal Dining Pass</h1>
                <div class="divider"></div>
                
                <div class="detail">
                  <div class="label">Guest</div>
                  <div class="value">Her Royal Highness ${invitationData?.name || nickname}</div>
                </div>
                
                <div class="detail">
                  <div class="label">Date & Time</div>
                  <div class="value">Today, 1:00 PM - 2:00 PM</div>
                </div>
                
                <div class="detail">
                  <div class="label">Royal Venue</div>
                  <div class="value">${selectedLocation || invitationData?.location || "Surprise Location"}</div>
                </div>
                
                <div class="detail">
                  <div class="label">The One Awaiting</div>
                  <div class="value">Your Humble Servant</div>
                </div>
                
                <div class="footer">
                  <p>Show this at the café to skip the line.</p>
                  <p>(Just kidding... unless you're into that.)</p>
                </div>
              </div>
            </body>
            </html>
          `)

          printWindow.document.close()

          // Wait for content to load then trigger print
          setTimeout(() => {
            printWindow.print()
            printWindow.close()
          }, 500)

          downloadSuccess = true
          console.log("✅ PDF download/print successful")
        }
      }
    } catch (error) {
      console.error("❌ PDF download failed:", error)

      // Fallback: Create a downloadable HTML file
      try {
        const element = document.getElementById("royal-pass")
        if (element) {
          const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Royal Dining Pass</title>
              <meta charset="utf-8">
              <style>
                body { 
                  font-family: Georgia, serif; 
                  margin: 20px; 
                  background: linear-gradient(135deg, #FFF4E0, #FFE0C3);
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                ${document.querySelector("style")?.textContent || ""}
              </style>
            </head>
            <body>
              ${element.outerHTML}
            </body>
            </html>
          `

          const blob = new Blob([htmlContent], { type: "text/html" })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = "royal-dining-pass.html"
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          downloadSuccess = true
          console.log("✅ HTML file download successful")
        }
      } catch (fallbackError) {
        console.error("❌ Fallback download also failed:", fallbackError)
      }
    }

    // Show appropriate success message
    if (downloadSuccess) {
      alert(
        "📜 Royal pass downloaded successfully! Check your downloads or use the print dialog. 👑"
      )
    } else {
      alert(
        "⚠️ Please try using your browser's print function (Ctrl+P) to save the royal pass."
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-contrast-accent">Loading your personalized invitation...</p>
        </div>
      </div>
    )
  }

  if (!invitationData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-contrast-accent mb-4">
            Invitation Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The invitation for "{nickname}" could not be found.
          </p>
          <a
            href="/setup"
            className="px-6 py-3 bg-primary-accent text-white font-medium rounded-lg hover:bg-amber-600 transition-all"
          >
            Create New Invitation
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SparkleBackground />

      {currentPage === "home" && (
        <HomePage 
          onNext={() => setCurrentPage("ask")} 
          guestName={invitationData.name}
        />
      )}

      {currentPage === "ask" && (
        <AskPage
          onRoyalPass={(location: string) => {
            setSelectedLocation(location || invitationData.location)
            setCurrentPage("royal-pass")
          }}
          availableLocations={[invitationData.location]}
        />
      )}

      {currentPage === "royal-pass" && (
        <RoyalPass
          selectedLocation={selectedLocation}
          onDownload={handleDownloadPass}
          guestName={invitationData.name}
        />
      )}
    </div>
  )
}