"use client"
import { HoverBorderGradient } from "./hover-border-gradient";
import { Vortex } from "./vortex";
import Image from "next/image";

const HeroBanner = () => {
    return (
        <section className="relative min-h-screen py-5 bg-black">
            <>
                <Vortex                
                    rangeY={300}
                    particleCount={300}
                    baseHue={1}
                    rangeHue={3}
                >
                    <div className="container mx-auto flex flex-col items-center justify-center text-center mt-20">
                        <Image
                            src="/tefaremoa.svg"
                            width={400}
                            height={400}
                            alt="TeFareLogo"
                            className="w-96 h-96 md:w-[400px] md:h-[400px]"
                        />
                        <div className="container mx-auto text-white">
                            <h1 className="uppercase main-title text-3xl lg:text-5xl">
                                Academia de danzas polinesias
                            </h1>
                            <p className = "mt-5 text-lg px-4">
                                Bienvenidos a nuestra casa sagrada. Si ya eres parte de Te Fare Mo&apos;a inicia sesión.
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center mt-10">
                            <HoverBorderGradient containerClassName="rounded-full" as="button" className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2">
                                <span className="uppercase">iniciar sesión</span>
                            </HoverBorderGradient>
                        </div>
                    </div>
                </Vortex>
            </>
        </section>
    );
};

export default HeroBanner;