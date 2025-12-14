"use client"

import AboutClass from "@/app/components/AboutClass"
import BannerVideoSection from "@/app/components/BannerVideoSection"
import ClassTime from "@/app/components/CarouselDays"
import ContentClass from "@/app/components/contentClases"
import GalleryClass from "@/app/components/GalleryClass"
import Pricing from "@/app/components/Pricing"
import ClassLocation from "@/app/components/ubicacion"


export default function Clases() {
    return (
        <>
        <BannerVideoSection title="Clases de Danza" />
        
        <ClassTime />
        <AboutClass />
        {/* <ContentClass /> */}
        <GalleryClass />
        <Pricing/>
        <ClassLocation />
        </>
    )
}