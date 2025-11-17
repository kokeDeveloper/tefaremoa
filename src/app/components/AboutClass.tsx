import Image from "next/image";

const AboutClass = () => {
  return (
    <section className="relative w-full min-h-[70vh] bg-black overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/bannerHome.jpg"
          alt="Danza"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 md:py-28">
        <p className="text-xs md:text-sm uppercase tracking-[0.5em] text-orange-400 mb-6">&apos;Ori Tahiti</p>
        <h2 className="text-4xl md:text-5xl xl:text-7xl uppercase leading-tight text-white">
          ¿Qué <br /> ofrecemos en nuestras clases?
        </h2>
        <div className="w-20 h-1 bg-orange-400 mt-6 mb-8" />
        <p className="text-lg leading-relaxed text-gray-200 max-w-3xl">
          En nuestra academia, el &apos;Ori Tahiti es más que una danza: es una conexión con la cultura, el cuerpo y la expresión personal. 
          A través del movimiento tradicional, cultivamos técnica, ritmo y energía, honrando el legado polinésico. 
          Nuestras clases promueven el desarrollo físico y emocional, fortaleciendo la confianza y celebrando la identidad de cada bailarina.
        </p>
      </div>
    </section>
  );
};

export default AboutClass;
