"use client"

import BannerVideoSection from "@/app/components/BannerVideoSection";
import NosotrosContent from "@/app/components/nosotros";
import { TimelineTFM } from "@/app/components/timeline2";



export default function Nosotros() {
    return (
        <>
            <BannerVideoSection title="Nosotros" />
            <NosotrosContent />
            <TimelineTFM />            
        </>
    )
}