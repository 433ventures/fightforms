'use client'

import { CheckCircle } from 'lucide-react'

export function EndScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-md w-full max-w-md text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Thank you for your time</h2>
        <p className="mb-6">We&apos;ll contact you as soon as possible</p>
        <div className="flex justify-center mb-4">
          <CheckCircle size={64} className="text-green-500" />
        </div>
      </div>
    </div>
  )
}