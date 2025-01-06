import React from 'react'

interface BannerVideoSectionProps {
  title: string;
  height?: string;
}

const BannerVideoSection = ({title, height = '50vh'}: BannerVideoSectionProps) => {
  return (
    <div className="relative w-full overflow-hidden" style={{height}}>
      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover">
        <source src="/banner1_3.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute bottom-0 left-0 w-full h-1/6 bg-gradient-to-t from-black to-transparent"></div>
      <div className="relative flex flex-col items-center justify-center h-full text-white text-center">
        <h2 className="mt-4 text-8xl">{title}</h2>
      </div>
    </div>
  )
}

export default BannerVideoSection