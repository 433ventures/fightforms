'use client'

import React from 'react';

type Props = React.PropsWithChildren<{
  fadeOut: boolean;
}>

export const Layout: React.FC<Props> = ({ children, fadeOut })  =>{
  return (
    <div className="min-h-screen bg-gradient-radial from-[#00d4c0] via-[#009184] to-[#071824]" style={{
      backgroundImage: 'radial-gradient(circle at top left, #00d4c0, transparent 30%), radial-gradient(circle at bottom right, #009184, #071824 70%)',
    }}>
      <div className={`transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </div>
  )
}