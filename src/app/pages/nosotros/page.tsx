"use client"

import BannerVideoSection from "@/app/components/BannerVideoSection";
import Team from "@/app/components/Team";
import MisionVision from "@/app/components/MisionVision";
import { TimelineTFM } from "@/app/components/timeline2";




export default function Nosotros() {
    return (
        <>
            <BannerVideoSection title="Nosotros" />
            <MisionVision />
            <Team />                    
        </>
    )
}