"use client"
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image'
import React from 'react'
import { CanvasRevealEffect } from './canvas-reveal-effect';
import { group } from 'console';

const data = [
    {
        day: "Lunes",
        class: "'Ori Tahiti",
        descrbe: "'Ōte'a y 'Aparima",
        group: "Grupo 1: Multinivel",
        timeClass: "18:30 a 20:00",
        src: "/lun.png",
        colors: [
            [255, 165, 0], // Orange
            [255, 140, 0], // Dark Orange
        ],
    },
    {
        day: "Miércoles",
        class: "'Ori Tahiti",
        descrbe: "'Ōte'a y 'Aparima",
        group: "Grupo 1: Multinivel",
        timeClass: "18:30 a 20:00",
        src: "/mier.png",
        colors: [
            [255, 165, 0], // Orange
            [255, 140, 0], // Dark Orange
        ],
    },
    {
        day: "Jueves",
        class: "'Ori Tahiti",
        descrbe: "'Ōte'a y 'Aparima",
        group: "Grupo 2: Multinivel",
        timeClass: "18:30 a 20:00",
        src: "/jue.png",
        colors: [
            [255, 69, 0], // Red-Orange
            [220, 20, 60], // Crimson
        ],
    },
];

const ClassTime = () => {
    return (
        <>
            <section className="mx-auto py-10 overflow-x-hidden">
                <div className='flex-col justify-center text-center'>
                    <h2 className="text-3xl md:text-5xl">Horarios</h2>
                    <p className="text-sm md:text-base text-gray-500 mt-2">Clases de danza de Tahiti</p>
                </div>
                <div className="flex justify-center items-center py-10">
                    <div className="flex space-x-4 overflow-x-auto md:overflow-x-visible scrollbar-hide">
                        {/* Carousel */}
                        {data.map((item, index) => (
                            <div key={index} className="relative w-56 h-80 md:w-96 md:h-[40rem] rounded-3xl flex-shrink-0 overflow-hidden">
                                <div className="absolute h-full top-0 inset-x-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-30 pointer-events-none" />
                                <div className="relative p-8 z-40 flex items-center justify-center flex-col h-full">
                                    <p className="text-white text-4xl md:text-5xl font-medium text-left uppercase">
                                        {item.day}
                                    </p>
                                    <p className="text-white text-sm  max-w-xs text-left [text-wrap:balance] mt-2">
                                        {item.group}
                                    </p>
                                    <p className="text-white text-xl  max-w-xs text-left [text-wrap:balance]">
                                        {item.descrbe}
                                    </p>
                                    <p className="text-white text-xl  max-w-xs text-left [text-wrap:balance]">
                                        {item.timeClass}
                                    </p>

                                    {item.day === "Miércoles" && (
                                        <>
                                            <p className="text-white text-sm  max-w-xs text-center [text-wrap:balance] mt-3">
                                                Grupo 3: Creación e Improvisación
                                            </p>
                                            <p className="text-white text-xl  max-w-xs text-left [text-wrap:balance]">
                                            &apos;Ōte&apos;a y &apos;Aparima
                                            </p>
                                            <p className="text-white text-xl  max-w-xs text-left [text-wrap:balance]">
                                                20:00 a 21:00
                                            </p>
                                        </>
                                    )}

                                </div>
                                <div className="absolute inset-0 z-20">
                                    <Image
                                        src={item.src}
                                        alt={item.class}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="transition duration-300"
                                    />
                                </div>
                                <AnimatePresence>
                                    <div className="h-full w-full absolute inset-0">
                                        <CanvasRevealEffect
                                            animationSpeed={3}
                                            containerClassName="bg-black"
                                            colors={item.colors}
                                            dotSize={5}
                                        />
                                    </div>
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default ClassTime

