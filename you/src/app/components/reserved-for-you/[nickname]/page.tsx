"use client"

import { useState } from "react"
import HomePage from "../../home-page"
import AskPage from "../../ask-page"
import RoyalPass from "../../royal-pass"
import SparkleBackground from "../../sparkle-background"

export default function LunchInvitation() {
  const [currentPage, setCurrentPage] = useState<"home" | "ask" | "royal-pass">("home")
  const [selectedLocation, setSelectedLocation] = useState("")

  const object = "object"
  const status = "status"

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
                  <div class="value">Her Royal Highness Kritika</div>
                </div>
                
                <div class="detail">
                  <div class="label">Date & Time</div>
                  <div class="value">Today, 1:00 PM - 2:00 PM</div>
                </div>
                
                <div class="detail">
                  <div class="label">Royal Venue</div>
                  <div class="value">${selectedLocation || "Surprise Location"}</div>
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

    // 2. Handle Email (independent) - with better error handling
    try {
      // Check if EmailJS environment variables are available
      const serviceId = "service_r4u971k"
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

      if (serviceId && templateId && publicKey) {
        const emailjs = (await import("@emailjs/browser")).default

        const templateParams = {
          to_name: "Aryan",
          from_name: "Her Royal Highness Kritika",
          guest: "Her Royal Highness Kritika",
          date_time: "Today, 1:00 PM - 2:00 PM",
          royal_venue: selectedLocation || "Surprise Location",
          the_one_awaiting: "Your Humble Servant",
          subject: "Royal Dine - Lunch Invitation Accepted!",
          email_body: `Hello!

Her Royal Highness Kritika has accepted the lunch invitation! 👑

GUEST: Her Royal Highness Kritika
DATE & TIME: Today, 1:00 PM - 2:00 PM
ROYAL VENUE: ${selectedLocation || "Surprise Location"}
THE ONE AWAITING: Your Humble Servant

The royal dining pass has been generated.

Best regards,
The Royal Dining System`,
          reply_to: "noreply@royaldining.com",
        }

        await emailjs.send(serviceId, templateId, templateParams, publicKey)
        console.log("✅ Email sent successfully")
      } else {
        console.log("⚠️ EmailJS not configured - skipping email")

        // Fallback: Create a mailto link
        const subject = encodeURIComponent("Royal Dine - Lunch Invitation Accepted!")
        const body = encodeURIComponent(`
Hello!

Her Royal Highness Kritika has accepted the lunch invitation! 👑

GUEST: Her Royal Highness Kritika
DATE & TIME: Today, 1:00 PM - 2:00 PM
ROYAL VENUE: ${selectedLocation || "Surprise Location"}
THE ONE AWAITING: Your Humble Servant

The royal dining pass has been generated.

Best regards,
The Royal Dining System
        `)

        const mailtoLink = `mailto:aryanpradhan773@gmail.com?subject=${subject}&body=${body}`

        // Try to open default email client
        window.open(mailtoLink, "_blank")
        console.log("📧 Opened default email client as fallback")
      }
    } catch (error) {
      console.error("❌ Email failed:", error)
      const isEmailJSError = error && typeof error === "object" && "status" in error
      // Handle specific EmailJS errors
      if (isEmailJSError) {
        const emailError = error as { status: number; text: string }

        if (emailError.status === 412) {
          console.log("🔐 EmailJS authentication issue - Gmail API scopes insufficient")
        } else if (emailError.status === 400) {
          console.log("📝 EmailJS template or service configuration issue")
        } else if (emailError.status === 401) {
          console.log("🔑 EmailJS unauthorized - check public key")
        }
      }

      // Fallback: Create a mailto link
      try {
        const subject = encodeURIComponent("Royal Dine - Lunch Invitation Accepted!")
        const body = encodeURIComponent(`
Hello!

Her Royal Highness Kritika has accepted the lunch invitation! 👑

GUEST: Her Royal Highness Kritika
DATE & TIME: Today, 1:00 PM - 2:00 PM
ROYAL VENUE: ${selectedLocation || "Surprise Location"}
THE ONE AWAITING: Your Humble Servant

The royal dining pass has been generated.

Best regards,
The Royal Dining System
        `)

        const mailtoLink = `mailto:aryanpradhan773@gmail.com?subject=${subject}&body=${body}`
        window.open(mailtoLink, "_blank")
        console.log("📧 Opened default email client as fallback")
      } catch (mailtoError) {
        console.error("❌ Mailto fallback also failed:", mailtoError)
      }
    }

    // 3. Show appropriate success message
    if (downloadSuccess) {
      alert(
        "📜 Royal pass downloaded successfully! Check your downloads or use the print dialog. 👑\n\n📧 If email didn't work automatically, your default email client should open with a pre-filled message.",
      )
    } else {
      alert(
        "⚠️ Please try using your browser's print function (Ctrl+P) to save the royal pass.\n\n📧 Your default email client should open with a pre-filled message to send the invitation details.",
      )
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SparkleBackground />

      {currentPage === "home" && (
      <HomePage onNext={() => setCurrentPage("ask")} />
      )}

      {currentPage === "ask" && (
      <AskPage
        onRoyalPass={(location: string) => {
        setSelectedLocation(location)
        setCurrentPage("royal-pass")
        }}
      />
      )}

      {currentPage === "royal-pass" && (
      <RoyalPass
        selectedLocation={selectedLocation}
        onDownload={handleDownloadPass}
      />
      )}
    </div>
  )
}
