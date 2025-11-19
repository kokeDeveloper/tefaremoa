"use client"
import Image from 'next/image'
import React from 'react'

const data = [
  {
    category: "Clases de Danza",
    title: "'Ōte'a y 'Aparima ",
    src: "/bnw_bt1.jpg",
  },
  {
    category: "Acompañamiento",
    title: "Improvisación",
    src: "/bnw_bt2.jpg",
  },
    {
    category: "Clases",
    title: "Música en Vivo",
    src: "/bnw_bt3.jpg", 
  },
  {
    category: "Eventos",
    title: "Actividades",
    src: "/bnw_bt4.jpg",
  },

];

const CarouselTefare = () => {
  return (
    <>
      <section className="mx-auto py-10 overflow-x-hidden">
        <div className='flex-col justify-center text-center'>
          <h2 className="text-3xl md:text-5xl">Bienvenida a nuestras clases</h2>
        </div>
        <div className="flex justify-center items-center py-10">
          <div className="flex space-x-4 overflow-x-auto md:overflow-x-visible scrollbar-hide">
            {/* Carousel */}
            {data.map((item, index) => (
              <div key={index} className="relative w-56 h-80 md:w-96 md:h-[40rem] rounded-3xl flex-shrink-0 overflow-hidden">
                <div className="absolute h-full top-0 inset-x-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-30 pointer-events-none" />
                <div className="relative p-8 z-40">
                  <p className="text-white text-sm md:text-base font-medium text-left">
                    {item.category}
                  </p>
                  <p className="text-white text-xl md:text-3xl max-w-xs text-left [text-wrap:balance] mt-2">
                    {item.title}
                  </p>
                </div>
                <div className="absolute inset-0 z-20">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default CarouselTefare

