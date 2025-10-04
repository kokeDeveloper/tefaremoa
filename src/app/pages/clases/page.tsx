"use client"

import BannerVideoSection from "@/app/components/BannerVideoSection"
import ClassTime from "@/app/components/CarouselDays"
import ContentClass from "@/app/components/contentClases"
import GalleryClass from "@/app/components/GalleryClass"
import Pircing from "@/app/components/Pircing"
import ClassLocation from "@/app/components/ubicacion"


export default function Clases() {
    return (
        <>
        <BannerVideoSection title="Clases de Danza" />
        <ClassTime />
        <ContentClass />
        <GalleryClass />
        <Pircing />
        <ClassLocation />
        </>
    )
}