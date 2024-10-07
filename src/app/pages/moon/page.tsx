"use client"

import { CanvasRevealEffect } from "@/app/components/canvas-reveal-effect"
import { AnimatePresence } from "framer-motion"
import Image from "next/image"

import { AiOutlineCarryOut } from "react-icons/ai"
import { AiOutlineEnvironment } from "react-icons/ai"
import { AiOutlineDollar } from "react-icons/ai"
import { IoIosMusicalNotes } from "react-icons/io"
import FAQMoon from "./components/faqmoon"
import Link from "next/link"




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

                                <button className="btn-donate">
                                    <Link href="https://forms.office.com/Pages/ResponsePage.aspx?id=QY_Ub4GvpUWcHuOZC8J-fJB_erHxHuNFhYarVAf3gQFUNFozOEY4RVZJRkQ3NzM4TUtZQVRXNkhRUi4u" className="uppercase">inscribete aquí</Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <Banner2 /> */}
                {/* Titulo */}
                <div className="py-11 text-white text-center">
                    <h2 className="main-title title-moon text-5xl ">Santiago de Chile</h2>
                </div>
                {/* Titulo */}
                {/* 3 Columnas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-white container mx-auto py-11">
                    <div className="text-center flex flex-col items-center">
                        <span className="text-7xl mb-1 main-title uppercase flex items-center">
                            <AiOutlineCarryOut className="ml-2" />
                        </span>
                        <h3 className="text-3xl mb-4 main-title uppercase flex items-center ">
                            7 y 8 - diciembre 2024
                        </h3>
                        <p>&apos;ōte&apos;a - &apos;aparima, ambos días</p>
                    </div>

                    <div className="text-center flex flex-col items-center px-11">
                        <span className="text-7xl mb-1 main-title uppercase flex items-center">
                            <AiOutlineEnvironment className="ml-2" />
                        </span>
                        <h3 className="text-3xl mb-1 main-title uppercase flex items-center">
                            Irarrázaval 1520 A, Ñuñoa
                        </h3>
                        <p>Metro Monseñor Eyzaguirre, Línea 3</p>
                    </div>

                    <div className="text-center flex flex-col items-center px-11">
                        <span className="text-7xl mb-1 main-title uppercase flex items-center">
                            <AiOutlineDollar className="ml-2" />
                        </span>
                        <h3 className="text-3xl mb-1 main-title uppercase flex items-center">
                            $40.000 CLP
                        </h3>
                        <p>Por Workshop, se paga vía transferencia bancaria.</p>
                    </div>

                    <div className="text-center flex flex-col items-center">
                        <span className="text-7xl mb-1 main-title uppercase flex items-center">
                            <IoIosMusicalNotes className="ml-2" />
                        </span>
                        <h3 className="text-3xl mb-4 main-title uppercase flex items-center ">
                            Música en vivo
                        </h3>
                        <p>Orquesta Te Fare Mo&apos;a</p>
                    </div>
                </div>

                {/*                 
                <div className="flex justify-center py-11">
                    <Image
                        src="/bn_moon.jpg" // Asegúrate de cambiar esta ruta a la imagen que quieres usar
                        alt="Descripción de la imagen"
                        width={1080}
                        height={400}
                        className="rounded-lg"
                    />
                </div>
                */}

                {/* Reseña Moon */}
                <section className="py-11 bg-gradient-to-r from-slate-300 via-white to-slate-300">
                    <div className="py-11 text-center">
                        <h2 className=" title-moon text-6xl uppercase ">&apos;Ori Tahiti Workshop</h2>
                        <p className="main-title text-2xl">Recomendaciones para <span className="highlight px-1">tener en cuenta.</span></p>
                    </div>
                    {/* 3 Columnas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 container mx-auto md:py-11">
                        <div className="text-center flex flex-col items-center">
                            <h3 className="text-3xl mb-4 main-title uppercase flex items-center ">
                                jornadas
                            </h3>
                            <p className="container mx-auto main-title text-center px-2">Cada uno de nuestros workshop&apos;s cuenta con una experiencia intensiva de 2,5 horas de aprendizaje y 
                                práctica, lideradas por la maestra Moon Tahiti. Al concluir esta enriquecedora sesión, tendrás
                                el acceso a una selección de materiales multimedia exclusivos, incluyendo videos 
                                y audios del taller, que te permitirán continuar tu aprendizaje y profundizar en los temas tratados 
                                a tu propio ritmo.</p>
                        </div>

                        <div className="text-center flex flex-col items-center">
                            <h3 className="text-3xl mb-4 main-title uppercase flex items-center ">
                                Grabaciones
                            </h3>
                            <p className="container mx-auto main-title text-center px-2">Durante el desarrollo del workshop, las grabaciones de video no 
                                estarán permitidas. Esto se debe a que contaremos con un momento específicamente asignado para realizar todas las grabaciones 
                                necesarias. Nuestro objetivo es maximizar el aprendizaje y la participación activa.</p>
                        </div>

                        <div className="text-center flex flex-col items-center">
                            <h3 className="text-3xl mb-4 main-title uppercase flex items-center ">
                                otros
                            </h3>
                            <p className="container mx-auto main-title text-center px-2">Cada uno de nuestros workshop&apos;s cuenta con una experiencia intensiva de 2,5 horas de aprendizaje y 
                                práctica, lideradas por la maestra Moon Tahiti. Al concluir esta enriquecedora sesión, tendrás
                                el acceso a una selección de materiales multimedia exclusivos, incluyendo videos 
                                y audios del taller, que te permitirán continuar tu aprendizaje y profundizar en los temas tratados 
                                a tu propio ritmo.</p>
                        </div>
                    </div>

                </section>
                {/* Reseña Moon */}
                {/* FAQ */}
                <div className="py-11">
                    <FAQMoon />
                </div>

            </section>
        </>
    )
}