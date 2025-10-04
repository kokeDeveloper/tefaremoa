import Image from "next/image";

const AboutClass = () => {
  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col items-start space-y-6">
          <h2 className="text-4xl md:text-5xl xl:text-7xl uppercase leading-tight">
            El <br /> lenguaje del cuerpo revela el alma
          </h2>
          <p className="text-lg leading-relaxed">
            En nuestra academia, el &apos;Ori Tahiti es más que una danza: es una conexión con la cultura, el cuerpo y la expresión personal. A través de movimientos tradicionales, trabajamos técnica, ritmo y energía, respetando la esencia del legado polinesio.<br />
            Nuestras clases combinan enseñanza estructurada con exploración corporal, permitiendo a cada alumna desarrollar fuerza, flexibilidad y confianza. Buscamos que la danza sea una herramienta de crecimiento y autoconocimiento, en un ambiente que celebra la identidad y la historia del &apos;Ori Tahiti.
          </p>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-lg"></div>
          <Image
            src="/abouthome.jpg"
            alt="Danza"
            width={500}
            height={500}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutClass;
