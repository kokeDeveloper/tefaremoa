"use client"
import Image from 'next/image'
import React from 'react'
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
            title: "Grupo 3",
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

const ClassTime = () => {
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
                                        <div className="bg-orange-500/20 backdrop-blur-sm rounded-lg p-3 border border-orange-400/30">
                                            <p className="text-orange-300 text-xs font-semibold uppercase tracking-wide mb-1">
                                                {item.extraClass.title}
                                            </p>
                                            <p className="text-white text-sm font-medium mb-1.5">
                                                {item.extraClass.descrbe}
                                            </p>
                                            <p className="text-orange-400 text-base md:text-lg font-bold">
                                                {item.extraClass.timeClass}
                                            </p>
                                        </div>
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
        </section>
    )
}

export default ClassTime

