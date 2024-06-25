"use client"

import { Banner2 } from "@/app/components/banner2"
import ContentClass from "@/app/components/contentClases"
import { LayoutGridDemo } from "@/app/components/galeriaClases"
import ClassLocation from "@/app/components/ubicacion"
import UbicacionClases from "@/app/components/ubicacion"


export default function Clases() {
    return (
        <>
        <Banner2 title="'Ori Tahiti" subtitle="con Ángela Ortiz" />
        <ContentClass />
        <LayoutGridDemo />
        <ClassLocation />
        </>
    )
}