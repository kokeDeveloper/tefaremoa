import React from 'react';

interface ValueItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const MisionVision: React.FC = () => {
  const values: ValueItem[] = [
    {
      icon: (
        <svg className="w-16 h-16 md:w-20 md:h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Rendimiento y técnica',
      description: 'Entrenamos bailarinas fuertes, precisas y listas para destacar en cualquier escenario que ellas elijan.'
    },
    {
      icon: (
        <svg className="w-16 h-16 md:w-20 md:h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Raíz cultural',
      description: 'Honramos la danza polinesia como arte vivo, conectando con su historia y espiritualidad.'
    },
    {
      icon: (
        <svg className="w-16 h-16 md:w-20 md:h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: 'Autoestima y empoderamiento',
      description: 'Fomentamos confianza, amor propio y expresión auténtica en cada clase.'
    }
  ];

  return (
    <section className="w-full py-16 md:py-24 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Título y bajada */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-6xl lg:text-4xl font-bold  tracking-wide text-white mb-4">
            Formamos bailarinas que dominen la técnica, irradien presencia y honren la cultura polinesia en cada escenario.
          </h2>
        </div>

        {/* Grid de iconos/valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {values.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center group"
            >
              {/* Icono */}
              <div className="mb-6 text-orange-400 group-hover:text-orange-300 transition-colors duration-300">
                {item.icon}
              </div>
              
              {/* Título */}
              <h3 className="text-2xl md:text-xl font-semibold text-white mb-3 uppercase tracking-wide">
                {item.title}
              </h3>
              
              {/* Descripción */}
              <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MisionVision;
