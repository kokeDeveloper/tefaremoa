import AboutClass from "./components/AboutClass";
import BannerVideo from "./components/BannerVideo";
import CarouselTefare from "./components/CarouselTefare";
import TrialCTA from "./components/TrialCTA";
import UpcomingWorkshops from "./components/UpcomingWorkshops";
import Testimonials from "./components/Testimonials";


export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Te Fare Mo'a",
    url: "https://tefaremoa.com",
    image: "https://tefaremoa.com/tefaremoa.svg",
    description:
      "Academia de danzas polinesias y Ori Tahiti en Providencia, Santiago. Clases, talleres y presentaciones para todas las edades.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Providencia",
      addressRegion: "Región Metropolitana",
      addressCountry: "CL",
    },
    areaServed: "Santiago",
    priceRange: "$$",
    sameAs: [
      "https://tefaremoa.com",
    ],
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Dónde están ubicadas las clases?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "En Providencia, Santiago. Al inscribirte te enviamos la dirección exacta y las opciones de transporte cercanas.",
        },
      },
      {
        "@type": "Question",
        name: "¿Necesito experiencia previa para tomar clases de Ori Tahiti?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Tenemos niveles para principiantes y avanzados; te guiamos desde la base técnica hasta coreografías completas.",
        },
      },
      {
        "@type": "Question",
        name: "¿Ofrecen clases de prueba o planes flexibles?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, puedes agendar una clase de prueba y contamos con planes mensuales y talleres especiales. Escríbenos para reservar tu cupo.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <main>
        <BannerVideo />
        <CarouselTefare />
        <TrialCTA />
        {/*<UpcomingWorkshops /> */}
        {/*<Testimonials />*/}
        <AboutClass />
      </main>
    </>
  );
}
