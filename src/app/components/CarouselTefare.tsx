"use client"
import Image from 'next/image'
import React from 'react'

const data = [
  {
    category: "Clases de Danza",
    title: "'Ōte'a y 'Aparima",
    src: "/bnw_bt1.jpg",
  },
  {
    category: "Acompañamiento",
    title: "Improvisación y creación",
    src: "/bnw_bt2.jpg",
  },
  {
    category: "Clases",
    title: "Música en vivo",
    src: "/bnw_bt3.jpg",
  },
  {
    category: "Eventos",
    title: "Actividades",
    src: "/bnw_bt4.jpg",
  },
]

const CarouselTefare = () => {
  return (
    <section className="py-16 isolate">
      {/* Header */}
      <div className="px-6 mb-10 max-w-6xl mx-auto">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-orange-400 font-semibold mb-3">
          Descubre
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
          Bienvenida a nuestras clases
        </h2>
      </div>

      {/* Scrollable track — snap on mobile, centered row on desktop */}
      <div
        className="
          flex gap-3
          overflow-x-auto snap-x snap-mandatory scroll-smooth
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          pl-6
          md:overflow-x-visible md:flex-nowrap md:justify-center md:gap-5 md:px-6 md:max-w-6xl md:mx-auto
        "
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="
              relative flex-none snap-center rounded-[2rem] overflow-hidden
              w-[78vw] aspect-[3/4]
              md:w-80 md:aspect-auto md:h-[36rem]
              shadow-[0_24px_64px_rgba(0,0,0,0.45)]
            "
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              style={{ objectFit: 'cover' }}
              className="transition duration-500"
            />

            {/* Bottom gradient for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Text anchored to bottom */}
            <div className="absolute bottom-0 inset-x-0 p-6">
              <p className="text-orange-300 text-[0.6rem] uppercase tracking-[0.4em] font-semibold mb-1.5">
                {item.category}
              </p>
              <p className="text-white text-xl font-semibold leading-snug tracking-tight">
                {item.title}
              </p>
            </div>
          </div>
        ))}

        {/* Trailing spacer so last card has breathing room on mobile */}
        <div className="flex-none w-3 md:hidden" aria-hidden="true" />
      </div>
    </section>
  )
}

export default CarouselTefare

