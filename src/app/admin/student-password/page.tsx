"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default function StudentPasswordPage() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/student/me", { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || "No autorizado");
        }
        if (!mounted) return;
        setName(data.name || "");
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/auth/student/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "No se pudo actualizar la contraseña.");
      }
      router.push("/admin/student-anamnesis");
    } catch (err: any) {
      setError(err?.message || "No se pudo actualizar la contraseña.");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
      <div className="w-full max-w-md rounded-xl bg-neutral-800 p-6 shadow-lg">
        <h1 className="text-lg font-semibold text-white mb-1">Bienvenida {name || ""}</h1>
        <p className="text-sm text-neutral-300 mb-4">Crea tu contraseña antes de continuar.</p>
        {error && <div className="mb-3 rounded border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>}
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm text-neutral-200">Nueva contraseña</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 bg-neutral-200 text-neutral-800 placeholder:text-neutral-500"
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="text-sm text-neutral-200">Confirmar contraseña</label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 bg-neutral-200 text-neutral-800 placeholder:text-neutral-500"
              required
              minLength={8}
            />
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Guardando…" : "Guardar y continuar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
