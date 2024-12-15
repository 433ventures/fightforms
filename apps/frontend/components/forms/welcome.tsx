'use client'

import { Button } from '@app/components/ui/button'

export function WelcomeScreen({ onApplyNow }: { onApplyNow: () => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-radial from-[#00d4c0] via-[#009184] to-[#071824]" style={{
      backgroundImage: 'radial-gradient(circle at top left, #00d4c0, transparent 30%), radial-gradient(circle at bottom right, #009184, #071824 70%)',
    }}>
      <main className="flex-grow flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to Fight Forms</h1>
          <p className="text-xl mb-8">Ready to get started? Apply now!</p>
          <Button onClick={onApplyNow} size="lg">
            Apply Now
          </Button>
        </div>
      </main>
    </div>
  )
}