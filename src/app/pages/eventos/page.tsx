"use client"

import BannerVideoSection from "@/app/components/BannerVideoSection"
import WorkshopModule from "@/app/components/WorkshopModule"
import { TimelineTFM } from "@/app/components/timeline2"

const stats = [
    { value: "30+", label: "Eventos presenciales y online" },
    { value: "12", label: "Workshops internacionales" },
    { value: "2K+", label: "Personas impactadas" }
]

const phoneNumber = "56971075886"
const message = encodeURIComponent("Hola Te Fare Mo'a, quiero saber cómo llevar un evento a mi comunidad ✨")
const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

export default function EventosPage() {
    return (
        <section className="bg-black text-white">
            <BannerVideoSection title="Eventos" />

            {/* //<WorkshopModule /> */}

            <div className="relative border-y border-white/5">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent pointer-events-none" />
                <div className="relative max-w-6xl mx-auto px-4 md:px-8 lg:px-10 py-16">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                        <div>
                            <h2 className="text-2xl md:text-4xl font-semibold">Nuestra línea de tiempo</h2>
                         </div>
                    </div>
                    <TimelineTFM />
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-10 py-20">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-orange-600/80 via-pink-600/70 to-rose-600/70 px-6 md:px-12 py-10 md:py-14 text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between gap-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
                    <div className="md:max-w-2xl">
                        <p className="uppercase text-xs tracking-[0.45em] text-white/70 mb-3">Producción artística</p>
                        <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3">¿Quieres co-crear un evento junto a Te Fare Mo&apos;a?</h3>
                        <p className="text-white/80 text-sm md:text-base leading-relaxed">
                            Diseñamos experiencias a medida para festivales, instituciones educativas y comunidades creativas.
                        </p>
                    </div>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-white text-black font-semibold uppercase tracking-wide px-6 py-3 text-sm shadow-lg hover:bg-neutral-100 transition"
                    >
                        Coordinar reunión
                    </a>
                </div>
            </div>
        </section>
    )
}