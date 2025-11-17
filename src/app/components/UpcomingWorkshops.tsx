const events = [
  {
    title: "Workshop Intensivo de 'Ōte'a",
    date: "23 NOV",
    time: "10:00 - 13:00 hrs",
    level: "Intermedio / Avanzado",
    spots: 12,
    description:
      "Exploraremos variaciones de cadera, cambios de energía y composición escénica para competencias.",
    focus: "Técnica + Escenario",
  },
  {
    title: "Laboratorio Aparima Contemporáneo",
    date: "30 NOV",
    time: "18:30 - 21:00 hrs",
    level: "Todos los niveles",
    spots: 15,
    description:
      "Trabajo emocional, storytelling y musicalidad para conectar con el origen de cada coreografía.",
    focus: "Narrativa + Ritmo",
  },
  {
    title: "Entrenamiento de Resistencia Tahitiana",
    date: "07 DIC",
    time: "09:00 - 11:00 hrs",
    level: "Beginner+ / Intermedio",
    spots: 20,
    description:
      "Sesión física para potenciar resistencia, respiración y control corporal en secuencias largas.",
    focus: "Fuerza + Cardio",
  },
];

const phoneNumber = "56971075886";

const buildWhatsAppLink = (title: string) => {
  const message = `Hola! Me gustaría reservar un cupo para "${title}". ¿Podrían confirmarme disponibilidad?`;
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

const UpcomingWorkshops = () => {
  return (
    <section className="w-full bg-black py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-orange-400 mb-3">Agenda viva</p>
            <h2 className="text-3xl md:text-5xl font-semibold text-white">
              Próximos talleres y experiencias
            </h2>
          </div>
          <p className="text-gray-400 max-w-xl">
            Activaciones exclusivas para profundizar técnica, narrativa y presencia escénica. Cupos limitados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.title}
              className="relative border border-white/10 rounded-3xl p-6 bg-gradient-to-b from-white/5 to-black/40 shadow-[0_20px_50px_rgba(0,0,0,0.45)] hover:border-orange-400/60 transition"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{event.level}</p>
                  <h3 className="text-2xl text-white font-semibold mt-1">{event.title}</h3>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-400">{event.date}</p>
                  <p className="text-xs text-gray-400">{event.time}</p>
                </div>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed mb-6">{event.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                <span>
                  <span className="text-gray-200">Foco:</span> {event.focus}
                </span>
                <span>
                  <span className="text-gray-200">Cupos:</span> {event.spots}
                </span>
              </div>

              <a
                href={buildWhatsAppLink(event.title)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center w-full py-3 rounded-2xl bg-orange-500 text-white font-semibold uppercase tracking-wide text-sm hover:bg-orange-400 transition"
              >
                Reservar cupo vía WhatsApp
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingWorkshops;
