"use client"

import { CanvasRevealEffect } from "@/app/components/canvas-reveal-effect"
import FormMoon from "@/app/components/FormMoon"
import { AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function Moon() {
    return (
        <>
            <section className="bg-black">
                {/* <Banner2 /> */}
                <div className="flex flex-col lg:flex-row items-center justify-center bg-white dark:bg-black w-full gap-4 mx-auto">
                    <div className="border border-black/[0.2] group/canvas-card flex items-center justify-center max-w-full w-full mx-auto p-4 relative h-[30rem]">
                        <AnimatePresence>
                            <div className="h-full w-full absolute inset-0">
                                <CanvasRevealEffect
                                    animationSpeed={3}
                                    containerClassName="bg-black"
                                    colors={[
                                        [255, 255, 255],
                                        [255, 255, 255],
                                        [255, 255, 255]
                                    ]}
                                    dotSize={2}
                                />
                            </div>
                        </AnimatePresence>
                        <div className="relative z-20">
                            <div className="text-center transition duration-200 w-full mx-auto flex flex-col items-center justify-center align-top">
                                <Image
                                    src="/tefaremoa.svg" // Asegúrate de cambiar esta ruta a la imagen que quieres usar
                                    alt="Logo"
                                    width={60}
                                    height={60}
                                    className="rounded-lg mb-2"
                                />

                                <p className="text-white uppercase text-2xl md:text-3xl title-moon mb-2">&apos;ori tahiti workshop</p>
                                <h2 className="text-white uppercase text-6xl md:text-8xl title-moon">MOONTAHITI</h2>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <Banner2 /> */}
                {/* Titulo */}
                <div>
                    <h2 className="text-white text-center main-title uppercase text-3xl">&apos;ote&apos;a y &apos;aparima / 2 días</h2>
                </div>
                {/* Titulo */}
                {/* Imagen */}
                <div className="flex justify-center my-6">
                    <Image
                        src="/bn_moon.jpg" // Asegúrate de cambiar esta ruta a la imagen que quieres usar
                        alt="Descripción de la imagen"
                        width={1080}
                        height={400}
                        className="rounded-lg"
                    />
                </div>
                {/* 2 Columnas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 text-white">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-center">Columna 1</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque elementum, nunc a facilisis lacinia, urna sapien bibendum urna, et gravida sapien ligula a massa.</p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-center">Columna 2</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel tortor at ipsum auctor cursus ac a leo. Praesent et mauris bibendum, sollicitudin arcu quis, lacinia est.</p>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <FormMoon />
                </div>
            </section>
        </>
    )
}