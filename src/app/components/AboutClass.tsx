import Image from "next/image";

const AboutClass = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center md:justify-start md:col-span-1">
          <h2 className="text-5xl md:text-6xl xl:text-8xl uppercase">El <br />lenguaje del cuerpo revela el alma</h2>
        </div>
        <div className="flex items-center justify-center md:col-span-1">
          <p className="text-center">En nuestras clases de danza en Te Fare Mo&apos;a, nos enfocamos en el autoconocimiento 
            y la conexión profunda con nuestro cuerpo y la vida. A través de la danza polinesia, exploramos movimientos que no solo fortalecen y flexibilizan,
            sino que también nos permiten descubrir y expresar nuestra esencia interior. Cada clase es una oportunidad para escuchar a nuestro cuerpo, 
            entender sus límites y potenciales, y superar nuestras propias expectativas.<br/>
            Nuestro objetivo es que cada alumna se sienta empoderada y en sintonía consigo misma, utilizando el &apos;Ori Tahiti como una herramienta para 
            el crecimiento personal y la autoexploración. Aquí, la danza no es solo una serie de movimientos, sino un viaje hacia el autodescubrimiento y la 
            celebración de nuestra individualidad. ¡Únete a nosotros y descubre el poder transformador de la danza!
          </p>
        </div>
        <div className="relative flex items-center justify-center md:justify-end md:col-span-1">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-lg"></div>
          <Image src="/abouthome.jpg" alt="Danza" width={300} height={300} className="rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default AboutClass;
