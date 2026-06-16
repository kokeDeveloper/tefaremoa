"use client";

import Image from "next/image";
import { Forum } from "next/font/google";
import { useEffect, useState } from "react";
import {
  IconCalendar,
  IconClock,
  IconMapPin,
  IconArrowRight,
} from "@tabler/icons-react";

const forum = Forum({ subsets: ["latin"], weight: "400" });

// Reemplazar con la URL real cuando esté disponible
const SHOW_URL = "https://www.eventbrite.cl/e/te-mana-o-te-here-el-poder-del-amor-de-la-academia-te-fare-moa-tickets-1991788147968?aff=oddtdtcreator";

// Fecha del evento: 30 julio 2026 a las 19:00 hora de Chile (UTC-4 en invierno)
const SHOW_DATE = new Date("2026-07-30T19:00:00-04:00");

type CountdownState = { days: number; hours: number; minutes: number; seconds: number; over: boolean } | null;

function useCountdown(target: Date) {
  const calc = (): CountdownState => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, over: true };
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1_000),
      over: false,
    };
  };

  const [time, setTime] = useState<CountdownState>(null);

  useEffect(() => {
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return time;
}

function Pad(n: number) {
  return String(n).padStart(2, "0");
}

const AnnualShow = () => {
  const countdown = useCountdown(SHOW_DATE);

  return (
    <section className="relative w-full min-h-[60vw] md:min-h-[50vh] bg-black overflow-hidden flex items-center">
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0">
        <Image
          src="/ManaOteHere.jpg"
          alt="Presentación anual Te Fare Mo'a"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
          quality={100}
          unoptimized
        />
        {/* Degradé lateral izquierdo para el texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        {/* Degradé inferior */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
        {/* Degradé superior — fusiona con el fondo negro de la página */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 py-8 md:py-20 w-full">

        {/* Eyebrow */}
        <p className="text-[10px] md:text-sm uppercase tracking-[0.3em] md:tracking-[0.5em] text-orange-400 mb-3 md:mb-5">
          Presentación Anual · Julio 2026
        </p>

        {/* Título del show */}
        <h2 className={`${forum.className} text-5xl md:text-8xl text-white uppercase leading-none tracking-widest`}>
          Te Mana
        </h2>
        <h2 className={`${forum.className} text-5xl md:text-8xl text-white uppercase leading-none tracking-widest mb-3 md:mb-5`}>
          O Te Here
        </h2>

        {/* Significado */}
        <p className={`${forum.className} text-base md:text-2xl xl:text-3xl text-orange-300 uppercase italic tracking-[0.3em] md:tracking-[0.5em] mb-4 md:mb-8`}>
          El Poder del Amor
        </p>

        {/* Separador */}
        <div className="w-16 h-px bg-orange-400 mb-4 md:mb-8" />

        {/* ── Cuenta regresiva ── */}
        {countdown === null ? (
          <div className="flex gap-3 md:gap-6 mb-4 md:mb-8 invisible" aria-hidden>
            {["Días","Horas","Min","Seg"].map((label) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="tabular-nums text-2xl md:text-5xl font-semibold text-white leading-none">00</span>
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-orange-400/70">{label}</span>
              </div>
            ))}
          </div>
        ) : !countdown.over ? (
          <div className="flex gap-3 md:gap-6 mb-4 md:mb-8">
            {[
              { value: countdown.days, label: "Días" },
              { value: countdown.hours, label: "Horas" },
              { value: countdown.minutes, label: "Min" },
              { value: countdown.seconds, label: "Seg" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="tabular-nums text-2xl md:text-5xl font-semibold text-white leading-none">
                  {Pad(value)}
                </span>
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-orange-400/70">
                  {label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-orange-400 text-sm uppercase tracking-widest mb-8">¡El show es hoy!</p>
        )}

        {/* Fichas de datos del evento */}
        <div className="flex flex-wrap gap-2 mb-4 md:mb-8">
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white">
            <IconCalendar size={15} className="text-orange-400 shrink-0" />
            30 de julio, 2026
          </div>
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white">
            <IconClock size={15} className="text-orange-400 shrink-0" />
            19:00 hrs
          </div>
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white">
            <IconMapPin size={15} className="text-orange-400 shrink-0" />
            Teatro de Carabineros de Chile
          </div>
        </div>

        {/* Descripción narrativa */}
        <p className="hidden md:block text-base md:text-lg text-gray-300 leading-relaxed max-w-2xl mb-10">
          Un espectáculo con música en vivo donde nuestras alumnas llevarán al
          escenario todo lo aprendido durante el año. Una celebración del
          movimiento, la cultura polinesia y el poder de la dedicación.
        </p>

        {/* CTA */}
        <a
          href={SHOW_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 md:px-8 md:py-4 rounded-2xl bg-orange-500 text-white font-semibold uppercase tracking-wide text-xs md:text-sm hover:bg-orange-400 transition"
        >
          Más información
          <IconArrowRight size={16} />
        </a>
      </div>
    </section>
  );
};

export default AnnualShow;
