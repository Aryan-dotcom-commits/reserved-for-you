"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface FormData {
  name: string
  location: string
  nickname: string
}

export default function SetupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    location: "",
    nickname: ""
  })
  const [generatedLink, setGeneratedLink] = useState("")
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    // Store data in localStorage for the dynamic route
    const invitationData = {
      name: formData.name,
      location: formData.location,
      nickname: formData.nickname,
      createdAt: new Date().toISOString()
    }
    
    localStorage.setItem(`invitation-${formData.nickname}`, JSON.stringify(invitationData))
    
    // Generate the link
    const baseUrl = window.location.origin
    const link = `${baseUrl}/reserved-for-you/${formData.nickname}`
    setGeneratedLink(link)
    setCurrentStep(4)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim().length > 0
      case 2:
        return formData.location.trim().length > 0
      case 3:
        return formData.nickname.trim().length > 0
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-contrast-accent mb-2">
            Create Lunch Invitation
          </h1>
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step <= currentStep ? 'bg-primary-accent' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-600">Step {currentStep} of 4</p>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's her name?
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter her name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Where would you like to take her?
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter location (e.g., Hot Put Bakes)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What nickname would you like to use for the URL?
              </label>
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) => handleInputChange('nickname', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="Enter nickname (e.g., princess)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent outline-none transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                Only lowercase letters, numbers, and hyphens allowed
              </p>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                🎉 Invitation Created!
              </h3>
              <p className="text-green-700 mb-4">
                Your personalized lunch invitation is ready!
              </p>
              <div className="bg-white border rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600 mb-2">Share this link:</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={generatedLink}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-2 text-sm font-medium rounded transition-all ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-primary-accent text-white hover:bg-amber-600'
                    }`}
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <button
                onClick={() => window.open(generatedLink, '_blank')}
                className="w-full px-6 py-3 bg-primary-accent text-white font-medium rounded-lg hover:bg-amber-600 transition-all"
              >
                Preview Invitation
              </button>
            </div>
          </div>
        )}

        {currentStep < 4 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-3 font-medium rounded-lg transition-all ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              Previous
            </button>
            
            {currentStep === 3 ? (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className={`px-6 py-3 font-medium rounded-lg transition-all ${
                  isStepValid()
                    ? 'bg-primary-accent text-white hover:bg-amber-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Create Invitation
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`px-6 py-3 font-medium rounded-lg transition-all ${
                  isStepValid()
                    ? 'bg-primary-accent text-white hover:bg-amber-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}