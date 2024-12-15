import { Loader2 } from 'lucide-react'

export default function Loader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <Loader2 className="h-12 w-12 animate-spin mb-4" />
      <h2 className="text-2xl font-bold">We are preparing your application.</h2>
    </div>
  )
}

