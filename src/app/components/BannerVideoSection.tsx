import Image from 'next/image'
import React from 'react'

const BannerVideoSection = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover">
        <source src="/banner1_2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute bottom-0 left-0 w-full h-1/6 bg-gradient-to-t from-black to-transparent"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
        <Image src="/tefaremoa.svg" width={200} height={200} alt="TeFareLogo" />
        <p className="mt-4 text-2xl">Academia de Danzas Polinesias<br/>From Chile</p>
      </div>
    </div>
  )
}

export default BannerVideoSection