"use client"
import { Card, Carousel } from "./welcomeCarousel";
import Image from "next/image";
import React from "react";


export function Welcome() {
    const cards = data.map((card, index) => (
        <Card key={card.src} card={card} index={index} />
    ));

    return (
        <div className="w-full h-full py-20 bg-black">
            <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl dark:text-neutral-100 text-center uppercase">
                Conoce nuestra casa sagrada
            </h2>
            <Carousel items={cards} />
        </div>
    );
}

const DummyContent = () => {
    return (
        <>
            {[...new Array(3).fill(1)].map((_, index) => {
                return (
                    <div
                        key={"dummy-content" + index}
                        className="bg-black p-8 md:p-14 rounded-3xl mb-4"
                    >
                        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl main-title max-w-3xl mx-auto">
                            <span className="font-bold text-neutral-700 dark:text-neutral-200">
                                The first rule of Apple club is that you boast about Apple club.
                            </span>{" "}
                            Keep a journal, quickly jot down a grocery list, and take amazing
                            class notes. Want to convert those notes to text? No problem.
                            Langotiya jeetu ka mara hua yaar is ready to capture every
                            thought.
                        </p>
                        <Image
                            src="/RaniteaWorkshop.jpg"
                            alt="Macbook mockup from Aceternity UI"
                            height="500"
                            width="500"
                            className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
                        />
                    </div>
                );
            })}
        </>
    );
};

const data = [
    {
        category: "Clases de Danza",
        title: "'Ori Tahiti",
        src: "/bnw_bt1.jpg",
        content: <DummyContent />,
    },
    {
        category: "Percusión y 'Aparima",
        title: "Música en vivo",
        src: "/bnw_bt3.jpg",
        content: <DummyContent />,
    },
    {
        category: "Espectáculos",
        title: "Presentaciones",
        src: "/bnw_bt2.jpg",
        content: <DummyContent />,
    },

    {
        category: "Eventos",
        title: "Workshop's",
        src: "/RaniteaWorkshop.jpg",
        content: <DummyContent />,
    },
];