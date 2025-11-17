"use client";

import { useState } from "react";

const testimonials = [
  {
    name: "María Fernanda",
    role: "Bailarina intermedia",
    quote:
      "En seis meses sentí una evolución total en mi postura y resistencia. El enfoque técnico y humano de Te Fare Mo'a es único.",
    achievement: "Seleccionada para Heiva 2024",
  },
  {
    name: "Camila Torres",
    role: "Nivel beginner+",
    quote:
      "Llegué sin experiencia y hoy interpreto coreografías completas con confianza. Las clases me conectan con mi femineidad.",
    achievement: "Primera presentación en Teatro Oriente",
  },
  {
    name: "Josefina Rapu",
    role: "Comunidad avanzada",
    quote:
      "Las sesiones privadas y los laboratorios creativos me dieron herramientas para crear mi propio solo Aparima.",
    achievement: "Solo Aparima ganador categoría adultos",
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (direction: "next" | "prev") => {
    setActiveIndex((prev) => {
      if (direction === "next") {
        return prev === testimonials.length - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? testimonials.length - 1 : prev - 1;
    });
  };

  const handleDot = (index: number) => setActiveIndex(index);

  return (
    <section className="w-full bg-gradient-to-b from-black via-black to-gray-950 py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.5em] text-orange-400 mb-3">Testimonios</p>
          <h2 className="text-3xl md:text-5xl text-white font-semibold">
            Lo que dice nuestra comunidad
          </h2>
        </div>

        <div className="relative">
          <button
            aria-label="Testimonio anterior"
            onClick={() => goTo("prev")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/10 text-white w-12 h-12 rounded-full border border-white/20 hover:bg-white/20 transition hidden sm:flex items-center justify-center"
          >
            ‹
          </button>
          <button
            aria-label="Siguiente testimonio"
            onClick={() => goTo("next")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/10 text-white w-12 h-12 rounded-full border border-white/20 hover:bg-white/20 transition hidden sm:flex items-center justify-center"
          >
            ›
          </button>

          <div className="overflow-hidden px-2">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((item) => (
                <div key={item.name} className="min-w-full px-4">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
                    <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-6">
                      “{item.quote}”
                    </p>
                    <div className="text-white">
                      <p className="text-2xl font-semibold">{item.name}</p>
                      <p className="text-sm uppercase tracking-[0.3em] text-orange-300">{item.role}</p>
                      <p className="text-sm text-gray-400 mt-2">{item.achievement}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                aria-label={`Mostrar testimonio ${index + 1}`}
                onClick={() => handleDot(index)}
                className={`w-3 h-3 rounded-full transition ${
                  activeIndex === index ? "bg-orange-400" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
