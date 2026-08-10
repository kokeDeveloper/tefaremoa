"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconChevronLeft, IconDownload, IconX, IconPhoto } from "@tabler/icons-react";
import Button from "@/components/ui/Button";

type GalleryEvent = {
  id: number;
  name: string;
  description: string | null;
  eventDate: string | null;
  _count: { photos: number };
};

type GalleryPhoto = {
  id: number;
  title: string | null;
  sizeBytes: number | null;
};

export const dynamic = "force-dynamic";

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" });
}

export default function StudentGalleryPage() {
  const router = useRouter();
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active event
  const [activeEvent, setActiveEvent] = useState<GalleryEvent | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);

  // Lightbox
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/student/gallery", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setEvents(data);
      })
      .catch((err) => setError(err.message || "No autorizado"))
      .finally(() => setLoading(false));
  }, []);

  const openEvent = async (ev: GalleryEvent) => {
    setActiveEvent(ev);
    setPhotosLoading(true);
    try {
      const res = await fetch(`/api/student/gallery/${ev.id}/photos`, { credentials: "include" });
      const data = await res.json();
      setPhotos(data.photos || []);
    } finally {
      setPhotosLoading(false);
    }
  };

  const downloadPhoto = async (photo: GalleryPhoto) => {
    if (!activeEvent) return;
    setDownloading(photo.id);
    try {
      const res = await fetch(`/api/student/gallery/${activeEvent.id}/photos/${photo.id}/file?dl=1`, { credentials: "include" });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = photo.title || `foto-${photo.id}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-neutral-500 text-sm tracking-widest uppercase animate-pulse">Cargando…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6">
          <p className="text-neutral-300 mb-4">{error}</p>
          <Button onClick={() => router.push("/admin/student-login")}>Ir a login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => activeEvent ? (setActiveEvent(null), setPhotos([])) : router.push("/admin/student")}
            className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition">
            <IconChevronLeft size={16} />
            {activeEvent ? "Eventos" : "Mi portal"}
          </button>
          {activeEvent && (
            <>
              <span className="text-neutral-700">/</span>
              <span className="text-sm text-neutral-200 truncate">{activeEvent.name}</span>
            </>
          )}
        </div>

        {!activeEvent && (
          <>
            <div className="flex items-center gap-2 mb-5">
              <IconPhoto size={22} className="text-orange-500" />
              <h1 className="text-xl font-bold">Galería exclusiva</h1>
            </div>

            {events.length === 0 ? (
              <div className="rounded-2xl border border-neutral-800 p-10 text-center text-neutral-500 text-sm">
                No hay eventos disponibles por ahora.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {events.map((ev) => (
                  <button key={ev.id} onClick={() => openEvent(ev)}
                    className="text-left rounded-2xl border border-neutral-800 bg-neutral-950 p-5 hover:border-orange-500/50 hover:bg-neutral-900 transition group">
                    <p className="font-semibold text-white group-hover:text-orange-400 transition">{ev.name}</p>
                    {ev.eventDate && <p className="text-xs text-neutral-500 mt-1">{formatDate(ev.eventDate)}</p>}
                    {ev.description && <p className="text-sm text-neutral-400 mt-2 line-clamp-2">{ev.description}</p>}
                    <p className="text-xs text-neutral-600 mt-3">{ev._count.photos} foto{ev._count.photos !== 1 ? "s" : ""}</p>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {activeEvent && (
          <>
            <div className="mb-1">
              <h1 className="text-xl font-bold">{activeEvent.name}</h1>
              {activeEvent.eventDate && <p className="text-sm text-neutral-500 mt-0.5">{formatDate(activeEvent.eventDate)}</p>}
              {activeEvent.description && <p className="text-sm text-neutral-400 mt-2">{activeEvent.description}</p>}
            </div>

            <div className="h-px w-full bg-neutral-800 my-5" />

            {photosLoading ? (
              <p className="text-neutral-500 text-sm animate-pulse">Cargando fotos…</p>
            ) : photos.length === 0 ? (
              <p className="text-neutral-500 text-sm">No hay fotos en este evento.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((photo) => (
                  <div key={photo.id} className="group relative rounded-xl overflow-hidden aspect-square bg-neutral-900 cursor-pointer"
                    onClick={() => setLightbox(photo)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/student/gallery/${activeEvent.id}/photos/${photo.id}/file?thumb=1`}
                      alt={photo.title || "foto"}
                      loading="lazy"
                      className="w-full h-full object-cover transition group-hover:brightness-75"
                    />
                    <div className="absolute inset-0 flex items-end justify-end p-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={(e) => { e.stopPropagation(); downloadPhoto(photo); }}
                        disabled={downloading === photo.id}
                        className="bg-black/70 hover:bg-orange-600 text-white rounded-full p-2 transition"
                      >
                        <IconDownload size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && activeEvent && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/50 hover:text-white z-10" onClick={() => setLightbox(null)}>
            <IconX size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); downloadPhoto(lightbox); }}
            disabled={downloading === lightbox.id}
            className="absolute top-4 left-4 flex items-center gap-2 bg-white/10 hover:bg-orange-600 text-white rounded-full px-4 py-2 text-sm font-medium transition z-10"
          >
            <IconDownload size={15} />
            {downloading === lightbox.id ? "Descargando…" : "Descargar"}
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/student/gallery/${activeEvent.id}/photos/${lightbox.id}/file`}
            alt={lightbox.title || "foto"}
            className="max-h-[88vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
