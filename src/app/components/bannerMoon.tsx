"use client";
import Image from "next/image";
import { HoverBorderGradient } from "./hover-border-gradient";
import Link from "next/link";

export function BannerMoon() {
    return (
        <section className="text-gray-600 body-font bg-black relative bg-cover bg-center" style={{ backgroundImage: "url('/bn_moon.jpg')" }}>
            <div className="container mx-auto flex px-20 py-24 md:flex-row flex-col items-center relative z-10">
                <div className="md:pl-10 lg:flex-grow md:w-1/2 lg:pr-96 md:pr-16 flex flex-col md:items-start md:text-left items-center text-center">
                    <p className="title-font lg:text-left lg:text-2xl text-center text-lg mb-4 font-medium text-black title-moon uppercase">&apos;ori tahiti workshop - chile 2024</p>
                    <h2 className="title-font lg:text-left lg:text-9xl text-center text-6xl mb-4 font-medium text-black title-moon uppercase">moontahiti</h2>
                    <div className="flex justify-center">
                        <HoverBorderGradient containerClassName="rounded-full" as="button" className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2">
                            <Link href="/pages/moon" className="uppercase">inscripción</Link>
                        </HoverBorderGradient>
                    </div>
                </div>
                <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">

                </div>
            </div>
            {/* <div className="absolute inset-0 bg-black opacity-50 z-0"></div>*/}
        </section>
    );
};


