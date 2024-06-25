"use client";
import Image from "next/image";
import { HoverBorderGradient } from "./hover-border-gradient";



export function BannerClases() {

    return (
        <>
                <section className="text-gray-600 body-font bg-black">
                    <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900 text-white">Clases de Danza
                            </h1>
                            <p className="mb-8 leading-relaxed">Copper mug try-hard pitchfork pour-over freegan heirloom neutra air plant cold-pressed tacos poke beard tote bag. Heirloom echo park mlkshk tote bag selvage hot chicken authentic tumeric truffaut hexagon try-hard chambray.</p>
                            <div className="flex justify-center">
                            <HoverBorderGradient containerClassName="rounded-full" as="button" className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2">
                                <span className="uppercase">detalles</span>
                            </HoverBorderGradient>
                            </div>
                        </div>
                        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                            <Image
                                src="/tefaremoa.svg"
                                width={300}
                                height={300}
                                alt="TeFareLogo" 
                            />
                        </div>
                    </div>
                </section>
        </>

    );
};


