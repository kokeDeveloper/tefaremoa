"use client"
import { Card, Carousel } from "./welcomeCarousel"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import { LuConstruction } from "react-icons/lu"

export function Welcome() {
    // Estado para manejar la carta seleccionada
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const cards = data.map((card, index) => (
        <Card
            key={card.src}
            card={card}
            index={index}
            onClick={() => setSelectedIndex(index)} // Actualizamos el índice seleccionado
        />
    ));

    return (
        <div className="w-full h-full py-5 bg-black">
            <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl dark:text-neutral-100 text-center uppercase">
                Conoce nuestra casa sagrada
            </h2>
            <Carousel items={cards} />
            {/* Mostrar contenido de la carta seleccionada */}
            {selectedIndex !== null && <DummyContent selectedIndex={selectedIndex} />}
        </div>
    );
}

// Modificamos DummyContent para recibir solo un nodo del arreglo
const DummyContent = ({ selectedIndex }: { selectedIndex: number }) => {
    const item = data[selectedIndex]; // Obtenemos el item seleccionado

    return (
        <div className="bg-black p-8 md:p-14 rounded-3xl mb-10">
            <p className="text-neutral-400 md:text-2xl max-w-3xl mx-auto mb-6 main-title">
                {item.details || "Detalles no disponibles."}
            </p>
            <Image
                src={item.imgDetails}
                alt={item.title}
                height="500"
                width="500"
                className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mb-6"
            />

            <Link href={item.srcButton} className="text-sm flex justify-center items-center">
                <button className="btn-donate flex justify-center items-center space-x-2">
                    <p>Sito en construcción</p>
                    <LuConstruction />
                </button>
            </Link>
        </div >
    );
};

const data = [
    {
        category: "Clases de Danza",
        title: "'Ori Tahiti",
        src: "/bnw_bt1.jpg",
        content: <DummyContent selectedIndex={0} />,
        details: "No solo aprenderás los movimientos y ritmos tradicionales, sino que te invitamos a explorar tu propio camino en este arte, respetando siempre las raíces culturales. Cada clase es una oportunidad para conocerte mejor, descubrir tu fuerza interior y avanzar a tu propio ritmo. ¡Únete a nuestra comunidad y encuentra en la danza una nueva forma de crecimiento personal!",
        imgDetails: "/bnw_bt1_1.jpg",
        srcButton: "",
    },
    {
        category: "Percusión y 'Aparima",
        title: "Música en vivo",
        src: "/bnw_bt3.jpg",
        content: <DummyContent selectedIndex={1} />,
        details: "Es el latido que da vida a cada presentación y clase. Te invitamos a sentir la energía auténtica de las percuciones y los cantos tradicionales mientras bailas. Vive la experiencia de conectar profundamente con la cultura polinesia a través de la música, y deja que su fuerza inspire cada uno de tus movimientos.",
        imgDetails: "/bnw_bt3.jpg",
        srcButton: "",
    },
    {
        category: "Espectáculos",
        title: "Presentaciones",
        src: "/bnw_bt2.jpg",
        content: <DummyContent selectedIndex={2} />,
        details: "Nuestras presentaciones son más que un espectáculo, son una celebración de la cultura tahitiana y el esfuerzo de cada bailarina. Cada presentación refleja el compromiso de nuestra comunidad con la autenticidad y el respeto por las tradiciones. Ven a disfrutar de un viaje a través de la danza, donde la pasión y la cultura se fusionan para ofrecerte una experiencia inolvidable.",
        imgDetails: "/bnw_bt2.jpg",
        srcButton: "",
    },
    {
        category: "Eventos",
        title: "Workshop's",
        src: "/bnw_bt4.jpg",
        content: <DummyContent selectedIndex={3} />,
        details: "Los workshops con maestros tahitianos son una oportunidad única para profundizar en el conocimiento de esta danza. Aprende de quienes han heredado y viven esta tradición, y lleva tu práctica al siguiente nivel. Cada workshop es un espacio de crecimiento y conexión, donde respetamos las bases pero te alentamos a encontrar tu propio estilo. ¡Inscríbete y descubre el poder transformador de esta experiencia!",
        imgDetails: "/bnw_bt4.jpg",
        srcButton: "",
    },
];
