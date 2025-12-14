const phoneNumber = "56971075886";
const message = encodeURIComponent(
  "Hola! Me gustaría agendar una clase de prueba por $10.000. ¿Podrían indicarme los cupos disponibles?"
);
const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

const TrialCTA = () => {
  return (
    <section className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-pink-500 py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-white">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] mb-3">Clase de prueba</p>
          <h3 className="text-2xl md:text-3xl font-semibold leading-tight">
            Agenda tu primera experiencia
          </h3>
          <p className="text-white/80 mt-3 max-w-2xl">
            Participa en nuestras clases, conoce la comunidad  y descubre tu potencial junto a Te Fare Mo&apos;a.
          </p>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-black/20 border border-white/50 text-white font-semibold uppercase tracking-wide text-sm hover:bg-black/30 transition"
        >
          Reservar por WhatsApp
        </a>
      </div>
    </section>
  );
};

export default TrialCTA;
