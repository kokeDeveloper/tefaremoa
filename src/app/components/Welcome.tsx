"use client"
import { Card, Carousel } from "./welcomeCarousel";
import Image from "next/image";
import React, { useState } from "react";


export function Welcome() {
    const [selectedIndex, setSelectedIndex] = useState(null)
    
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
            {data.map((item, index) => (
                <div
                    key={"dummy-content" + index}
                    className="bg-black p-8 md:p-14 rounded-3xl mb-4"
                >
                    <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl main-title max-w-3xl mx-auto">
                        <span className="font-bold text-neutral-700 dark:text-neutral-200">
                            {item.category} - {item.title}
                        </span>{" "}
                        {item.details || "Detalles no disponibles."}
                    </p>
                    <Image
                        src={item.src}
                        alt={item.title}
                        height="500"
                        width="500"
                        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
                    />
                </div>
            ))}
        </>
    );
};

const data = [
    {
        category: "Clases de Danza",
        title: "'Ori Tahiti",
        src: "/bnw_bt1.jpg",
        content: <DummyContent />,
        details: "Clases con la profe Agie",
        imgDetails: "",
    },
    {
        category: "Percusión y 'Aparima",
        title: "Música en vivo",
        src: "/bnw_bt3.jpg",
        content: <DummyContent />,
        details: "",
        imgDetails: "",
    },
    {
        category: "Espectáculos",
        title: "Presentaciones",
        src: "/bnw_bt2.jpg",
        content: <DummyContent />,
        details: "",
        imgDetails: "",
    },

    {
        category: "Eventos",
        title: "Workshop's",
        src: "/RaniteaWorkshop.jpg",
        content: <DummyContent />,
        details: "",
        imgDetails: "",
    },
];
