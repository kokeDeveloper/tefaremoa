"use client"

import { Banner2 } from "@/app/components/banner2"
import BannerVideoSection from "@/app/components/BannerVideoSection"
import ContentClass from "@/app/components/contentClases"
import { LayoutGridDemo } from "@/app/components/galeriaClases"
import Pircing from "@/app/components/Pircing"
import ClassLocation from "@/app/components/ubicacion"
import UbicacionClases from "@/app/components/ubicacion"


export default function Clases() {
    return (
        <>
        <BannerVideoSection title="Clases de Danza" />
        <ContentClass />
        <Pircing />
        <ClassLocation />
        </>
    )
}