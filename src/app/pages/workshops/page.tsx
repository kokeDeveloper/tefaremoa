"use client"

import { Banner2 } from "@/app/components/banner2"
import { GlarecardWorkshop } from "@/app/components/workshopGrid"


export default function Workshops() {
    return (
        <>
        <section className="bg-black">
        <Banner2 title="Workshops" subtitle="Revisa nuestros eventos" />
            <div className="flex flex-col text-center w-full mb-20">
                    <h1 className="mb-4 text-white tracking-widest uppercase main-title">Nuestras Actividades</h1>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-white">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably heard of them.</p>
                </div>
            <GlarecardWorkshop />

        </section>

        </>
    )
}