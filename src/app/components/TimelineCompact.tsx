"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Data model more granular: Years with an array of events
export interface TimelineEvent {
  month?: string; // optional month label
  title: string;
  description?: string;
  images?: { src: string; alt?: string }[];
  videoUrl?: string;
}

export interface TimelineYear {
  year: string;
  events: TimelineEvent[];
}

interface TimelineCompactProps {
  data: TimelineYear[];
  initialOpen?: number; // index of year to open initially
}

const getYouTubeEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }

    if (hostname === "youtube.com" || hostname === "youtube-nocookie.com") {
      const pathSegments = parsed.pathname.split("/").filter(Boolean);
      if (pathSegments[0] === "embed" && pathSegments[1]) {
        return url;
      }
      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
  } catch (error) {
    // no-op, fallback to original url
  }

  return url;
};

// Utility: trap focus inside modal
function useFocusTrap(active: boolean, ref: React.RefObject<HTMLDivElement | null>, onExit: () => void) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const node = ref.current;
    const focusable = node.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onExit();
      if (e.key === 'Tab' && focusable.length > 1) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [active, ref, onExit]);
}

export const TimelineCompact: React.FC<TimelineCompactProps> = ({ data, initialOpen = 0 }) => {
  const [openYear, setOpenYear] = useState<string | null>(data[initialOpen]?.year || null);
  const [modalEvent, setModalEvent] = useState<TimelineEvent | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(!!modalEvent, modalRef, () => setModalEvent(null));

  const toggleYear = useCallback((year: string) => {
    setOpenYear(prev => (prev === year ? null : year));
  }, []);

  return (
    <div className="w-full bg-black py-16 px-4 md:px-10">
      {/* Sticky year navigation */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        {/* Sidebar Years */}
        <aside className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide" aria-label="Años de la historia">
          {data.map(y => {
            const active = y.year === openYear;
            return (
              <button
                key={y.year}
                onClick={() => toggleYear(y.year)}
                className={`relative px-5 py-3 rounded-xl text-sm md:text-base font-medium transition-all border flex-shrink-0 ${
                  active
                    ? 'bg-gradient-to-r from-orange-600 via-amber-500 to-pink-500 text-white border-orange-400 shadow-lg'
                    : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-orange-400 hover:text-white'
                }`}
              >
                <span>{y.year}</span>
                {active && (
                  <motion.span
                    layoutId="yearIndicator"
                    className="absolute inset-0 rounded-xl ring-2 ring-white/20 pointer-events-none"
                  />
                )}
              </button>
            );
          })}
        </aside>
        {/* Content */}
        <div>
          {data.map(y => {
            const active = y.year === openYear;
            return (
              <div key={y.year} className="mb-6 border border-neutral-800 rounded-2xl bg-neutral-950/50 backdrop-blur-sm overflow-hidden">
                <button
                  onClick={() => toggleYear(y.year)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left group"
                >
                  <span className="text-lg md:text-2xl font-semibold text-white flex items-center gap-3">
                    <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500" />
                    {y.year}
                  </span>
                  <span className="text-neutral-400 group-hover:text-orange-300 transition text-sm md:text-base">
                    {active ? 'Cerrar' : `${y.events.length} evento(s)`}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      id={`panel-${y.year}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="divide-y divide-neutral-800"
                    >
                      {y.events.map((ev, i) => {
                        const hasImages = (ev.images?.length ?? 0) > 0;
                        return (
                          <div key={i} className="px-6 py-5 flex flex-col md:flex-row md:items-start gap-6">
                            <div className="md:w-1/3">
                              <p className="uppercase tracking-wide text-xs text-orange-300 mb-2">{ev.month || y.year}</p>
                              <h3 className="text-white text-lg md:text-xl font-semibold leading-snug mb-2">
                                {ev.title}
                              </h3>
                              {ev.description && (
                                <p className="text-neutral-300 text-sm leading-relaxed line-clamp-4">
                                  {ev.description}
                                </p>
                              )}
                              <div className="mt-3">
                                <button
                                  onClick={() => setModalEvent(ev)}
                                  className="text-xs md:text-sm px-3 py-1.5 rounded-md bg-orange-600 hover:bg-orange-500 text-white font-medium shadow focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
                                  aria-label={`Ver detalles de ${ev.title}`}
                                >
                                  Ver más
                                </button>
                              </div>
                            </div>
                            <div className="md:flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {ev.videoUrl && (
                                <div className="relative col-span-full aspect-video overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
                                  <iframe
                                    src={getYouTubeEmbedUrl(ev.videoUrl)}
                                    title={`Video ${ev.title}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="absolute inset-0 h-full w-full"
                                  />
                                </div>
                              )}
                              {hasImages &&
                                ev.images?.slice(0, 6).map(img => (
                                  <div key={img.src} className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-neutral-800">
                                    <Image
                                      src={img.src}
                                      alt={img.alt || ev.title}
                                      fill
                                      loading="lazy"
                                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                      className="object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-60 pointer-events-none" />
                                  </div>
                                ))}
                              {!hasImages && !ev.videoUrl && (
                                <div className="text-neutral-600 text-sm italic col-span-full">Sin imágenes</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for full event detail */}
      <AnimatePresence>
        {modalEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label={`Detalles del evento ${modalEvent.title}`}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalEvent(null)} />
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.92, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full sm:max-w-3xl max-h-[90vh] overflow-hidden rounded-t-3xl sm:rounded-2xl bg-neutral-950 border border-neutral-800 shadow-xl flex flex-col"
            >
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <h3 className="text-white text-2xl font-semibold mb-2">{modalEvent.title}</h3>
                {modalEvent.description && (
                  <p className="text-neutral-300 text-sm leading-relaxed mb-6 whitespace-pre-line">
                    {modalEvent.description}
                  </p>
                )}
                {modalEvent.videoUrl && (
                  <div className="relative w-full aspect-video overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 mb-6">
                    <iframe
                      src={getYouTubeEmbedUrl(modalEvent.videoUrl)}
                      title={`Video ${modalEvent.title}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(modalEvent.images?.length ?? 0) > 0 &&
                    modalEvent.images?.map(img => (
                      <div key={img.src} className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-neutral-800">
                        <Image
                          src={img.src}
                          alt={img.alt || modalEvent.title}
                          fill
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  {(modalEvent.images?.length ?? 0) === 0 && !modalEvent.videoUrl && (
                    <div className="text-neutral-600 text-sm italic col-span-full">Sin imágenes</div>
                  )}
                </div>
              </div>
              <div className="p-4 flex justify-end border-t border-neutral-800 bg-neutral-900/60">
                <button
                  onClick={() => setModalEvent(null)}
                  className="px-5 py-2 rounded-md bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium shadow focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Example: You can import this component and pass a transformed version of your current data.