"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

type StudentMe = {
  id: number;
  name: string;
  email: string;
};

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts.length > 1 ? parts[1]?.[0] ?? "" : parts[0]?.[1] ?? "";
  return (first + second).toUpperCase();
}

export default function StudentPhotoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<StudentMe | null>(null);
  const [photoOk, setPhotoOk] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/student/me", { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (!mounted) return;
        if (!res.ok) throw new Error(data?.error || "No autorizado");
        setMe({ id: data.id, name: data.name, email: data.email });
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || "No autorizado");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const initials = useMemo(() => getInitials(me?.name || ""), [me?.name]);
  const [photoNonce, setPhotoNonce] = useState(0);
  const photoSrc = useMemo(() => `/api/student/profile-photo?t=${photoNonce}`, [photoNonce]);

  const upload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Selecciona una imagen.");
      return;
    }

    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      const form = new FormData();
      form.set("file", file);

      const res = await fetch("/api/student/profile-photo", {
        method: "POST",
        credentials: "include",
        body: form,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo subir la foto.");
      }

      setMessage("Foto actualizada.");
      setPhotoOk(true);
      setFile(null);
      setPhotoNonce(Date.now());
    } catch (err: any) {
      setError(err?.message || "No se pudo subir la foto.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
        <div className="text-neutral-200 text-sm">Cargando…</div>
      </div>
    );
  }

  if (error || !me) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
        <div className="w-full max-w-md rounded-xl bg-neutral-800 p-6 shadow-lg">
          <h1 className="text-lg font-semibold text-white mb-1">Acceso requerido</h1>
          <p className="text-sm text-neutral-300 mb-4">{error || "No autorizado"}</p>
          <Button className="w-full" onClick={() => router.push("/admin/student-login")}
          >
            Ir a login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-xl bg-neutral-800 p-6 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-lg font-semibold text-white">Foto de perfil</h1>
            <Button className="bg-neutral-200 text-neutral-800" onClick={() => router.push("/admin/student")}
            >
              Volver
            </Button>
          </div>

          {error && (
            <div className="mt-4 rounded border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>
          )}
          {message && (
            <div className="mt-4 rounded border border-emerald-500/60 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">{message}</div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-neutral-700">
              {photoOk ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoSrc}
                  alt="Foto de perfil"
                  className="h-full w-full object-cover"
                  onError={() => setPhotoOk(false)}
                />
              ) : (
                <div className="h-full w-full text-white flex items-center justify-center text-xl font-semibold">
                  {initials || "A"}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm text-neutral-200">{me.name}</div>
              <div className="text-xs text-neutral-400">{me.email}</div>
              <p className="mt-2 text-sm text-neutral-300">Sube una imagen JPG, PNG o WEBP (máx. 2MB).</p>
            </div>
          </div>

          <form onSubmit={upload} className="mt-6 space-y-3">
            <label htmlFor="profilePhoto" className="block text-sm text-neutral-200">Seleccionar imagen</label>
            <input
              id="profilePhoto"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-neutral-200 file:mr-4 file:rounded file:border-0 file:bg-neutral-200 file:px-3 file:py-1 file:text-sm file:font-medium file:text-neutral-800 hover:file:bg-neutral-100"
            />
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Subiendo…" : "Guardar foto"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
