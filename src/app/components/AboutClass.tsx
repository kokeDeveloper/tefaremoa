import Image from "next/image";

const AboutClass = () => {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="col-span-1 flex items-center justify-start">
          <h2 className=" xl:text-8xl uppercase">El <br />lenguaje del cuerpo revela el alma</h2>
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <p className="text-center">En nuestras clases de danza en Te Fare Mo&apos;a, nos enfocamos en el autoconocimiento 
            y la conexión profunda con nuestro cuerpo y la vida. A través de la danza polinesia, exploramos movimientos que no solo fortalecen y flexibilizan,
            sino que también nos permiten descubrir y expresar nuestra esencia interior. Cada clase es una oportunidad para escuchar a nuestro cuerpo, 
            entender sus límites y potenciales, y superar nuestras propias expectativas.<br/>
            Nuestro objetivo es que cada alumna se sienta empoderada y en sintonía consigo misma, utilizando el &apos;Ori Tahiti como una herramienta para 
            el crecimiento personal y la autoexploración. Aquí, la danza no es solo una serie de movimientos, sino un viaje hacia el autodescubrimiento y la 
            celebración de nuestra individualidad. ¡Únete a nosotros y descubre el poder transformador de la danza!
            </p>
        </div>
        <div className="col-span-1 flex items-center justify-end">
          <Image src="/abouthome.jpg" alt="Danza" width={300} height={300} />
        </div>
      </div>
    </div>

  );
};

export default AboutClass;
