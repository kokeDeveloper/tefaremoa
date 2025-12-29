"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export const dynamic = "force-dynamic";

type StudentProfile = {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone: string | null;
  nickname: string | null;
  address: string | null;
  city: string | null;
  birthDate: string | null;
};

function toDateInputValue(value: string | null) {
  if (!value) return "";
  if (typeof value === "string" && value.length >= 10) return value.slice(0, 10);
  return "";
}

export default function StudentProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/student/profile", { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (!mounted) return;
        if (!res.ok) throw new Error(data?.error || "No autorizado");
        setProfile({
          id: data.id,
          name: data.name || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone ?? null,
          nickname: data.nickname ?? null,
          address: data.address ?? null,
          city: data.city ?? null,
          birthDate: data.birthDate ?? null,
        });
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
        <div className="text-neutral-200 text-sm">Cargando…</div>
      </div>
    );
  }

  if (error || !profile) {
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: profile.name,
          lastName: profile.lastName,
          phone: profile.phone,
          nickname: profile.nickname,
          address: profile.address,
          city: profile.city,
          birthDate: profile.birthDate,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo guardar.");
      }

      setMessage("Perfil actualizado.");
    } catch (err: any) {
      setError(err?.message || "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-xl bg-neutral-800 p-6 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-lg font-semibold text-white">Perfil</h1>
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

          <form onSubmit={submit} className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm text-neutral-200">Nombre</label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile((p) => (p ? { ...p, name: e.target.value } : p))}
                  className="mt-1 bg-neutral-200 text-neutral-800 placeholder:text-neutral-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-neutral-200">Apellido</label>
                <Input
                  value={profile.lastName}
                  onChange={(e) => setProfile((p) => (p ? { ...p, lastName: e.target.value } : p))}
                  className="mt-1 bg-neutral-200 text-neutral-800 placeholder:text-neutral-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-neutral-200">Email</label>
              <Input
                value={profile.email}
                readOnly
                className="mt-1 bg-neutral-200 text-neutral-800 placeholder:text-neutral-500 opacity-80"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm text-neutral-200">Teléfono</label>
                <Input
                  value={profile.phone ?? ""}
                  onChange={(e) => setProfile((p) => (p ? { ...p, phone: e.target.value || null } : p))}
                  className="mt-1 bg-neutral-200 text-neutral-800 placeholder:text-neutral-500"
                  placeholder="+56 9 ..."
                />
              </div>
              <div>
                <label className="text-sm text-neutral-200">Nickname</label>
                <Input
                  value={profile.nickname ?? ""}
                  onChange={(e) => setProfile((p) => (p ? { ...p, nickname: e.target.value || null } : p))}
                  className="mt-1 bg-neutral-200 text-neutral-800 placeholder:text-neutral-500"
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-neutral-200">Dirección</label>
              <Input
                value={profile.address ?? ""}
                onChange={(e) => setProfile((p) => (p ? { ...p, address: e.target.value || null } : p))}
                className="mt-1 bg-neutral-200 text-neutral-800 placeholder:text-neutral-500"
                placeholder="Opcional"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm text-neutral-200">Ciudad</label>
                <Input
                  value={profile.city ?? ""}
                  onChange={(e) => setProfile((p) => (p ? { ...p, city: e.target.value || null } : p))}
                  className="mt-1 bg-neutral-200 text-neutral-800 placeholder:text-neutral-500"
                  placeholder="Opcional"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-200">Fecha de nacimiento</label>
                <Input
                  type="date"
                  value={toDateInputValue(profile.birthDate)}
                  onChange={(e) =>
                    setProfile((p) => (p ? { ...p, birthDate: e.target.value ? e.target.value : null } : p))
                  }
                  className="mt-1 bg-neutral-200 text-neutral-800 placeholder:text-neutral-500"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
