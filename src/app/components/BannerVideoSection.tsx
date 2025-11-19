import Image from 'next/image';
import React, { useEffect, useRef } from 'react';

interface BannerVideoSectionProps {
  title: string;
  height?: string;
}

const BannerVideoSection = ({title, height = '50vh'}: BannerVideoSectionProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.play().catch(() => {
        // Autoplay can be blocked on some mobile browsers; in that case we leave the poster frame visible.
      });
    };

    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener('canplay', playVideo, { once: true });
    }

    return () => {
      video.removeEventListener('canplay', playVideo);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{height}}>
      <video
        autoPlay
        loop
        muted
        playsInline
        // @ts-ignore Safari iOS inline playback hint
        webkit-playsinline="true"
        preload="auto"
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/banner1_3.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute bottom-0 left-0 w-full h-1/6 bg-gradient-to-t from-black to-transparent"></div>
      <div className="relative flex flex-col sm:flex-row items-center justify-center h-full text-white text-center">
        <Image src="/tefaremoa.svg" alt="Logo" width={80} height={80} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28" />
        <h2 className="mt-2 sm:mt-0 sm:ml-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">{title}</h2>
      </div>
    </div>
  )
}

export default BannerVideoSection;