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

export default function StudentIndexPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<StudentMe | null>(null);
  const [photoOk, setPhotoOk] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/student/me", { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (!mounted) return;
        if (!res.ok) {
          throw new Error(data?.error || "No autorizado");
        }
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

  const photoSrc = useMemo(() => `/api/student/profile-photo?t=${Date.now()}`, []);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/admin/student-login");
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
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-neutral-700">
              {photoOk ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoSrc}
                  alt="Foto de perfil"
                  className="h-full w-full object-cover"
                  onError={() => setPhotoOk(false)}
                />
              ) : (
                <div className="h-full w-full text-white flex items-center justify-center text-lg font-semibold">
                  {initials || "A"}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-white truncate">{me.name}</h1>
              <p className="text-sm text-neutral-300 truncate">{me.email}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button
              className="w-full bg-neutral-200 text-neutral-800"
              onClick={() => router.push("/admin/student-profile")}
            >
              Editar perfil
            </Button>
            <Button
              className="w-full bg-neutral-200 text-neutral-800"
              onClick={() => router.push("/admin/student-photo")}
            >
              Foto de perfil
            </Button>
            <Button
              className="w-full sm:col-span-2"
              onClick={logout}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
