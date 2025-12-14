"use client"
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import { Vortex } from '@/app/components/vortex'

interface ClassSchedule {
    day: string;
    class: string;
    descrbe: string;
    teacher: string;
    timeClass: string;
    src: string;
    extraClass?: {
        title: string;
        descrbe: string;
        timeClass: string;
    };
}

const data: ClassSchedule[] = [
    {
        day: "Lunes",
        class: "Multinivel",
        descrbe: "'Ōte'a y 'Aparima",
        teacher: "Ángela Ortiz",
        timeClass: "18:30 - 20:00",
        src: "/lun.png",
    },
    {
        day: "Miércoles",
        class: "Multinivel",
        descrbe: "'Ōte'a y 'Aparima",
        teacher: "Ángela Ortiz",
        timeClass: "18:30 - 20:00",
        src: "/mier.png",
        extraClass: {
            title: "Avanzado",
            descrbe: "Creación e Improvisación",
            timeClass: "20:00 - 21:00",
        }
    },
    {
        day: "Jueves",
        class: "Multinivel",
        descrbe: "'Ōte'a y 'Aparima",
        teacher: "Ángela Ortiz",
        timeClass: "18:30 - 20:00",
        src: "/jue.png",
    },
    {
        day: "Viernes",
        class: "Multinivel",
        descrbe: "'Ōte'a y 'Aparima",
        teacher: "Materna Rapu",
        timeClass: "18:30 - 20:00",
        src: "/jue.png",
    },
    {
        day: "Sábado",
        class: "Multinivel",
        descrbe: "'Ōte'a y 'Aparima",
        teacher: "Ángela Ortiz",
        timeClass: "10:30 - 12:00",
        src: "/mart.png",
    },
];

const WHATSAPP_PHONE = '56971075886'

const ClassTime = () => {
    const [openExtraSchedule, setOpenExtraSchedule] = useState<ClassSchedule | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    const openExtra = useCallback((schedule: ClassSchedule) => {
        setOpenExtraSchedule(schedule)
    }, [])

    const closeExtra = useCallback(() => setOpenExtraSchedule(null), [])

    const handleInterviewRequest = useCallback(() => {
        if (!openExtraSchedule?.extraClass) return
        const message = `Hola! Me interesa el módulo avanzado de creación e improvisación del día ${openExtraSchedule.day} a las ${openExtraSchedule.extraClass.timeClass}. ¿Podemos coordinar la entrevista personal?`
        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`
        window.open(whatsappUrl, '_blank')
        closeExtra()
    }, [openExtraSchedule, closeExtra])

    useEffect(() => {
        if (!openExtraSchedule) return
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeExtra()
            }
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [openExtraSchedule, closeExtra])

    return (
        <section className="mx-auto py-10 px-4">
            <div className='flex-col justify-center text-center mb-8'>
                <h2 className="text-3xl md:text-5xl">Horarios</h2>
            </div>

            <div className="max-w-7xl mx-auto">
                <Vortex
                    containerClassName="rounded-[36px] border border-orange-400/20 overflow-hidden"
                    particleCount={500}
                    baseHue={1}
                    rangeHue={3}
                >
                    <div className="relative px-4 py-10 sm:px-6 md:px-10">
                        <div className="pointer-events-none absolute inset-0" />
                        {/* Grid: 2 columnas en móvil, 3 en tablet, 5 en desktop */}
                        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 auto-rows-fr">
                            {data.map((item, index) => (
                        <div
                            key={index}
                            className="relative rounded-2xl overflow-hidden min-h-[20rem] md:min-h-[22rem] lg:min-h-96 group hover:scale-[1.02] transition-transform duration-300 flex flex-col"
                        >
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-20 pointer-events-none" />
                            
                            {/* Content */}
                            <div className="relative z-30 h-full flex flex-col justify-between p-4 md:p-5">
                                {/* Header */}
                                <div className="flex-shrink-0">
                                    <h3 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-wide mb-2">
                                        {item.day}
                                    </h3>
                                    <div className="w-12 h-1 bg-orange-400 rounded-full mb-3" />
                                </div>

                                {/* Info - flex-grow para empujar hacia abajo */}
                                <div className="space-y-2 flex-grow flex flex-col justify-end">
                                    <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                                        <p className="text-orange-300 text-xs md:text-sm font-semibold uppercase tracking-wide mb-1">
                                            {item.class}
                                        </p>
                                        <p className="text-white text-sm md:text-base font-medium mb-1.5">
                                            {item.descrbe}
                                        </p>
                                        <p className="text-orange-400 text-base md:text-lg font-bold mb-1.5">
                                            {item.timeClass}
                                        </p>
                                        <p className="text-white/80 text-xs md:text-sm">
                                            {item.teacher}
                                        </p>
                                    </div>

                                    {/* Extra class for Miércoles */}
                                    {item.extraClass && (
                                        <button
                                            type="button"
                                            onClick={() => openExtra(item)}
                                            className="bg-orange-500/20 backdrop-blur-sm rounded-lg p-3 border border-orange-400/30 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 focus:ring-offset-black"
                                            aria-haspopup="dialog"
                                            aria-label={`Ver más detalles del grupo avanzado del ${item.day}`}
                                        >
                                            <p className="text-orange-300 text-xs font-semibold uppercase tracking-wide mb-1">
                                                {item.extraClass.title}
                                            </p>
                                            <p className="text-white text-sm font-medium mb-1.5">
                                                {item.extraClass.descrbe}
                                            </p>
                                            <p className="text-orange-400 text-base md:text-lg font-bold">
                                                {item.extraClass.timeClass}
                                            </p>
                                            <span className="mt-2 inline-flex text-[10px] uppercase tracking-wide text-orange-200 bg-white/10 rounded-full px-2 py-0.5 border border-white/20">
                                                Más detalles
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Background image */}
                            <div className="absolute inset-0 z-10">
                                <Image
                                    src={item.src}
                                    alt={`Clase de ${item.day}`}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                    style={{ objectFit: 'cover' }}
                                    className="transition duration-300 group-hover:scale-110"
                                    priority={index < 3}
                                />
                            </div>
                        </div>
                    ))}
                        </div>
                    </div>
                </Vortex>
            </div>

            {mounted && openExtraSchedule?.extraClass && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Detalle avanzado del ${openExtraSchedule.day}`}
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeExtra} />
                    <div className="relative w-full max-w-md mx-4 bg-neutral-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-90 duration-200">
                        <div className="p-6 space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm uppercase tracking-wide text-orange-300 font-semibold">Grupo avanzado</p>
                                    <h3 className="text-white text-2xl font-semibold">{openExtraSchedule.day}</h3>
                                    <p className="text-white/70 text-sm">Creación e improvisación</p>
                                </div>
                                <button
                                    onClick={closeExtra}
                                    aria-label="Cerrar detalles"
                                    className="text-white/60 hover:text-white transition"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
                                <p className="text-orange-400 text-lg font-semibold">{openExtraSchedule.extraClass.timeClass}</p>
                                <p className="text-white text-sm">{openExtraSchedule.extraClass.descrbe}</p>
                                <div className="flex items-center justify-between text-sm text-white/80">
                                    <span>{openExtraSchedule.teacher}</span>
                                    <span>{openExtraSchedule.class}</span>
                                </div>
                            </div>
                            <p className="text-sm text-white/80 leading-relaxed">
                                Dirigido a bailarinas que, con su experiencia previa, desean explorar procesos creativos, composición y libertad expresiva. Solicita tu entrevista personal si estás interesada en participar en este módulo.
                            </p>
                        </div>
                        <div className="px-6 pb-6 pt-2 flex flex-col sm:flex-row sm:justify-end gap-3">
                            <button
                                onClick={closeExtra}
                                className="w-full sm:w-auto px-5 py-2 rounded-md border border-white/20 text-white/80 text-sm hover:bg-white/10 transition"
                            >
                                Seguir explorando horarios
                            </button>
                            <button
                                onClick={handleInterviewRequest}
                                className="w-full sm:w-auto px-5 py-2 rounded-md bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium shadow focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
                            >
                                Solicitar entrevista
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default ClassTime

