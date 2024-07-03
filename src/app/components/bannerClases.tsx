"use client";
import Image from "next/image";
import { HoverBorderGradient } from "./hover-border-gradient";

export function BannerClases() {
    return (
        <section className="text-gray-600 body-font bg-black relative bg-cover bg-center" style={{ backgroundImage: "url('/banner1.jpg')" }}>
            <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center relative z-10">
                <div className="pr-7 lg:flex-grow md:w-1/2 lg:pr-96 md:pr-16 flex flex-col md:items-start md:text-left items-center text-center">
                    <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white main-title">Clases de Danza</h1>
                    <p className="mb-8 leading-relaxed text-white">Copper mug try-hard pitchfork pour-over freegan heirloom neutra air plant cold-pressed tacos poke beard tote bag. Heirloom echo park mlkshk tote bag selvage hot chicken authentic tumeric truffaut hexagon try-hard chambray.</p>
                    <div className="flex justify-center">
                        <HoverBorderGradient containerClassName="rounded-full" as="button" className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2">
                            <span className="uppercase">conóce más</span>
                        </HoverBorderGradient>
                    </div>
                </div>
                <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">

                </div>
            </div>
            {/* Overlay para oscurecer la imagen de fondo */}
            <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        </section>
    );
};


