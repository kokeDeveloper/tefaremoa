"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IconPhoto, IconPlus, IconTrash, IconUpload, IconEye, IconEyeOff, IconX, IconChevronLeft } from "@tabler/icons-react";
import Button from "@/components/ui/Button";

type GalleryEvent = {
  id: number;
  name: string;
  description: string | null;
  eventDate: string | null;
  isPublished: boolean;
  _count: { photos: number };
};

type GalleryPhoto = {
  id: number;
  title: string | null;
  sizeBytes: number | null;
  filename?: string;
  order: number;
};

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function GallerySection() {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create event form
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState("");
  const [creating, setCreating] = useState(false);

  // Active event detail
  const [activeEvent, setActiveEvent] = useState<GalleryEvent | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);

  // Upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  // Lightbox
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery", { credentials: "include" });
      const data = await res.json();
      setEvents(data);
    } catch {
      setError("No se pudieron cargar los eventos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const fetchPhotos = useCallback(async (eventId: number) => {
    setPhotosLoading(true);
    try {
      const res = await fetch(`/api/admin/gallery/${eventId}/photos`, { credentials: "include" });
      const data = await res.json();
      setPhotos(data);
    } finally {
      setPhotosLoading(false);
    }
  }, []);

  const openEvent = (ev: GalleryEvent) => {
    setActiveEvent(ev);
    fetchPhotos(ev.id);
  };

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await fetch("/api/admin/gallery", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDesc, eventDate: newDate || null }),
      });
      setNewName(""); setNewDesc(""); setNewDate("");
      setShowCreate(false);
      fetchEvents();
    } finally {
      setCreating(false);
    }
  };

  const togglePublish = async (ev: GalleryEvent) => {
    await fetch(`/api/admin/gallery?id=${ev.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !ev.isPublished }),
    });
    fetchEvents();
    if (activeEvent?.id === ev.id) setActiveEvent((p) => p ? { ...p, isPublished: !p.isPublished } : p);
  };

  const deleteEvent = async (ev: GalleryEvent) => {
    if (!confirm(`¿Eliminar el evento "${ev.name}" y todas sus fotos?`)) return;
    await fetch(`/api/admin/gallery?id=${ev.id}`, { method: "DELETE", credentials: "include" });
    setActiveEvent(null);
    fetchEvents();
  };

  const uploadFiles = async (files: FileList) => {
    if (!activeEvent || files.length === 0) return;
    setUploading(true);
    setUploadFeedback(null);
    setUploadProgress({ done: 0, total: files.length });
    let ok = 0;
    const failed: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const form = new FormData();
      form.set("file", files[i]);
      try {
        const res = await fetch(`/api/admin/gallery/${activeEvent.id}/photos`, {
          method: "POST",
          credentials: "include",
          body: form,
        });
        if (res.ok) {
          ok++;
        } else {
          const d = await res.json().catch(() => ({}));
          failed.push(files[i].name + (d.error ? ` (${d.error})` : ""));
        }
      } catch (err) {
        failed.push(files[i].name + " (error de red)");
      }
      setUploadProgress({ done: i + 1, total: files.length });
    }
    setUploading(false);
    setUploadFeedback(
      failed.length === 0
        ? `${ok} foto(s) subida(s) correctamente.`
        : `${ok} subida(s). ${failed.length} fallida(s): ${failed.slice(0, 3).join(", ")}${failed.length > 3 ? ` y ${failed.length - 3} más` : ""}`
    );
    fetchPhotos(activeEvent.id);
    fetchEvents();
  };

  const deletePhoto = async (photo: GalleryPhoto) => {
    if (!activeEvent) return;
    await fetch(`/api/admin/gallery/${activeEvent.id}/photos?photoId=${photo.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    fetchEvents();
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (activeEvent) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveEvent(null)} className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition">
            <IconChevronLeft size={16} /> Eventos
          </button>
          <span className="text-neutral-300">/</span>
          <h2 className="text-base font-semibold truncate">{activeEvent.name}</h2>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => togglePublish(activeEvent)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${activeEvent.isPublished ? "border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20" : "border-neutral-400 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
          >
            {activeEvent.isPublished ? <><IconEye size={14} /> Publicado</> : <><IconEyeOff size={14} /> Sin publicar</>}
          </button>
          <button
            onClick={() => deleteEvent(activeEvent)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            <IconTrash size={14} /> Eliminar evento
          </button>
        </div>

        {/* Upload zone */}
        <div
          className="rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 p-6 text-center cursor-pointer hover:border-orange-400 transition"
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); if (!uploading) uploadFiles(e.dataTransfer.files); }}
        >
          <IconUpload size={28} className="mx-auto mb-2 text-neutral-400" />
          <p className="text-sm text-neutral-500">Arrastra fotos aquí o haz clic para seleccionar</p>
          <p className="text-xs text-neutral-400 mt-1">JPG, PNG, WEBP — máx. 15 MB c/u</p>
          <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden"
            onChange={(e) => e.target.files && uploadFiles(e.target.files)} />
        </div>

        {uploading && uploadProgress && (
          <div className="text-sm text-neutral-500">Subiendo {uploadProgress.done}/{uploadProgress.total}…</div>
        )}
        {uploadFeedback && <div className="text-sm text-orange-600 dark:text-orange-400">{uploadFeedback}</div>}

        {/* Photo grid */}
        {photosLoading ? (
          <div className="text-sm text-neutral-400">Cargando fotos…</div>
        ) : photos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-6 text-center text-sm text-neutral-400">
            No hay fotos en este evento todavía.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/admin/gallery/${activeEvent.id}/photos/${photo.id}/file?thumb=1`}
                  alt={photo.title || "foto"}
                  loading="lazy"
                  className="w-full h-full object-cover cursor-pointer transition group-hover:brightness-75"
                  onClick={() => setLightbox(photo)}
                />
                <button
                  onClick={() => deletePhoto(photo)}
                  className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition bg-black/70 rounded-full p-1 text-white hover:bg-red-600"
                >
                  <IconX size={12} />
                </button>
                {photo.sizeBytes && (
                  <span className="absolute bottom-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition text-[10px] bg-black/60 text-white rounded px-1">
                    {formatBytes(photo.sizeBytes)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {lightbox && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
            <button className="absolute top-4 right-4 text-white/70 hover:text-white" onClick={() => setLightbox(null)}>
              <IconX size={24} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/admin/gallery/${activeEvent.id}/photos/${lightbox.id}/file`}
              alt={lightbox.title || "foto"}
              className="max-h-[90vh] max-w-full rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    );
  }

  // ── Event list ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2"><IconPhoto size={20} /> Galería de eventos</h2>
        <Button onClick={() => setShowCreate((v) => !v)} className="flex items-center gap-1 text-sm">
          <IconPlus size={15} /> Nuevo evento
        </Button>
      </div>

      {showCreate && (
        <form onSubmit={createEvent} className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 space-y-3 bg-neutral-50 dark:bg-neutral-900">
          <h3 className="text-sm font-semibold">Nuevo evento</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-500">Nombre *</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} required
                className="rounded-lg border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 px-3 py-2 text-sm"
                placeholder="Show Anual 2026" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-500">Fecha del evento</label>
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
                className="rounded-lg border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 px-3 py-2 text-sm" />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-xs text-neutral-500">Descripción</label>
              <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={2}
                className="rounded-lg border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 px-3 py-2 text-sm resize-none"
                placeholder="Descripción opcional…" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" onClick={() => setShowCreate(false)} className="bg-neutral-200 text-neutral-800 text-sm">Cancelar</Button>
            <Button type="submit" disabled={creating} className="text-sm">{creating ? "Creando…" : "Crear evento"}</Button>
          </div>
        </form>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
      {loading ? (
        <p className="text-sm text-neutral-400">Cargando…</p>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-8 text-center text-sm text-neutral-400">
          No hay eventos de galería todavía. Crea uno para empezar.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <div key={ev.id}
              className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-900 cursor-pointer hover:border-orange-400 transition"
              onClick={() => openEvent(ev)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{ev.name}</p>
                  {ev.eventDate && <p className="text-xs text-neutral-400 mt-0.5">{formatDate(ev.eventDate)}</p>}
                </div>
                <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${ev.isPublished ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800"}`}>
                  {ev.isPublished ? "Publicado" : "Borrador"}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-2">{ev._count.photos} foto{ev._count.photos !== 1 ? "s" : ""}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
