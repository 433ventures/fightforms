import { Loader2 } from 'lucide-react'
import Image from 'next/image';
import React from 'react';

export default function Loader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <Loader2 className="h-12 w-12 animate-spin mb-4"/>
      <h2 className="text-2xl font-bold relative">
        We are preparing your application.
      <div style={{ position: 'absolute', width: 24, height: 24, top: -20, right: -28}}>
        <Image
          src="/ai_stars_white.svg"
          width={24}
          height={24}
          alt="Picture of the author"
          className="text-white animate-pulse"
        />
      </div>
      </h2>
    </div>
  )
}

