"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export type YesNo = "yes" | "no" | "";

export type FormState = {
  name: string;
  age: string;
  contact: string;
  weightKg: string;
  heightM: string;
  injuriesYN: YesNo;
  injuries: string;
  chronicYN: YesNo;
  chronicDiseases: string;
  allergiesYN: YesNo;
  allergies: string;
  medicationsYN: YesNo;
  medications: string;
  surgeriesYN: YesNo;
  surgeries: string;
  activityDaysPerWeek: string;
  activityType: string;
  sessionDurationMinutes: string;
  consentAccepted: boolean;
  website: string; // honeypot
};

export const initialState: FormState = {
  name: "",
  age: "",
  contact: "",
  weightKg: "",
  heightM: "",
  injuriesYN: "",
  injuries: "",
  chronicYN: "",
  chronicDiseases: "",
  allergiesYN: "",
  allergies: "",
  medicationsYN: "",
  medications: "",
  surgeriesYN: "",
  surgeries: "",
  activityDaysPerWeek: "",
  activityType: "",
  sessionDurationMinutes: "",
  consentAccepted: false,
  website: "",
};

export type AnamnesisFormProps = {
  studentName?: string;
  redirectTo?: string;
  logoutOnSuccess?: boolean;
};

export function AnamnesisForm({ studentName, redirectTo, logoutOnSuccess = true }: AnamnesisFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (field: keyof FormState) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = field === "consentAccepted" ? (event.target as HTMLInputElement).checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage(null);

    try {
      const payload = {
        ...form,
        age: form.age ? Number(form.age) : null,
        weightKg: form.weightKg ? Number(form.weightKg) : null,
        heightM: form.heightM ? Number(form.heightM) : null,
        activityDaysPerWeek: form.activityDaysPerWeek ? Number(form.activityDaysPerWeek) : null,
        sessionDurationMinutes: form.sessionDurationMinutes ? Number(form.sessionDurationMinutes) : null,
      };

      const res = await fetch("/api/anamnesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "No se pudo enviar el formulario.");
      }

      setStatus("success");
      setMessage(
        redirectTo
          ? "¡Gracias por completar tu anamnesis! Redirigiendo…"
          : logoutOnSuccess
            ? "¡Gracias por completar tu anamnesis! Cerraremos tu sesión."
            : "¡Gracias por completar tu anamnesis!"
      );
      setForm(initialState);

      if (logoutOnSuccess) {
        fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
      }

      if (redirectTo) {
        setTimeout(() => {
          router.push(redirectTo);
        }, 250);
      }
    } catch (error: any) {
      setStatus("error");
      setMessage(error?.message || "Ocurrió un error al enviar el formulario.");
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-neutral-900 dark:text-neutral-100">
      <div className="space-y-6 rounded-2xl border border-orange-400 bg-white/90 p-8 shadow-[0_20px_60px_rgba(16,185,129,0.08)] dark:border-orange-400 dark:bg-neutral-900/90">
        <header className="space-y-2">
          <p className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-400 dark:bg-orange-900/40 dark:text-orange-200">
            {studentName ? `Bienvenida ${studentName}` : "Bienestar · Ori Tahiti"}
          </p>
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-50">Anamnesis de salud</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Completa este formulario con honestidad. Usaremos tu información solo para adaptar tu entrenamiento de forma segura y confidencial.
          </p>
        </header>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Honeypot */}
          <div className="hidden">
            <label>
              No completar este campo
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange("website")}
                autoComplete="off"
              />
            </label>
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Datos personales</h2>
              <span className="text-xs uppercase tracking-[0.18em] text-orange-600 dark:text-orange-300">Obligatorio</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Nombre completo *</label>
                <input
                  required
                  value={form.name}
                  onChange={handleChange("name")}
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
                  placeholder="Nombre y apellidos"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Edad (años)</label>
                <input
                  type="number"
                  min={0}
                  value={form.age}
                  onChange={handleChange("age")}
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
                  placeholder="Ej: 28"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium">Correo o teléfono de contacto *</label>
                <input
                  required
                  value={form.contact}
                  onChange={handleChange("contact")}
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
                  placeholder="correo@ejemplo.com / +56 9 ..."
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Medidas corporales</h2>
              <span className="text-xs text-neutral-500">Opcional</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  value={form.weightKg}
                  onChange={handleChange("weightKg")}
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
                  placeholder="Ej: 60"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Altura (m)</label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={form.heightM}
                  onChange={handleChange("heightM")}
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
                  placeholder="Ej: 1.65"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Antecedentes médicos</h2>
              <span className="text-xs text-neutral-500">Responde con Sí/No y detalla si aplica</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <YesNoCard
                label="¿Has tenido lesiones previas?"
                helper="Rodilla, tobillo, columna, etc."
                value={form.injuriesYN}
                onChange={(val) => setForm((p) => ({ ...p, injuriesYN: val, injuries: val === 'yes' ? p.injuries : '' }))}
                details={form.injuries}
                onDetailsChange={handleChange("injuries")}
              />
              <YesNoCard
                label="¿Tienes enfermedades crónicas diagnosticadas?"
                helper="Asma, diabetes, hipertensión, etc."
                value={form.chronicYN}
                onChange={(val) => setForm((p) => ({ ...p, chronicYN: val, chronicDiseases: val === 'yes' ? p.chronicDiseases : '' }))}
                details={form.chronicDiseases}
                onDetailsChange={handleChange("chronicDiseases")}
              />
              <YesNoCard
                label="¿Eres alérgica a medicamentos/alimentos/materiales?"
                helper="Especifica cuál"
                value={form.allergiesYN}
                onChange={(val) => setForm((p) => ({ ...p, allergiesYN: val, allergies: val === 'yes' ? p.allergies : '' }))}
                details={form.allergies}
                onDetailsChange={handleChange("allergies")}
              />
              <YesNoCard
                label="¿Estás tomando medicamentos actualmente?"
                helper="Nombre y dosis"
                value={form.medicationsYN}
                onChange={(val) => setForm((p) => ({ ...p, medicationsYN: val, medications: val === 'yes' ? p.medications : '' }))}
                details={form.medications}
                onDetailsChange={handleChange("medications")}
              />
              <div className="md:col-span-2">
                <YesNoCard
                  label="¿Has tenido cirugías importantes?"
                  helper="Tipo y fecha aproximada"
                  value={form.surgeriesYN}
                  onChange={(val) => setForm((p) => ({ ...p, surgeriesYN: val, surgeries: val === 'yes' ? p.surgeries : '' }))}
                  details={form.surgeries}
                  onDetailsChange={handleChange("surgeries")}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Actividad física</h2>
              <span className="text-xs text-neutral-500">Ayuda a ajustar ritmo y cargas</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Días de actividad física por semana</label>
                <input
                  type="number"
                  min={0}
                  max={7}
                  value={form.activityDaysPerWeek}
                  onChange={handleChange("activityDaysPerWeek")}
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
                  placeholder="Ej: 3"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Tipo de actividad habitual</label>
                <input
                  value={form.activityType}
                  onChange={handleChange("activityType")}
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
                  placeholder="Danza, deportes, gimnasio, caminata, etc."
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium">Duración promedio de cada sesión (minutos)</label>
                <input
                  type="number"
                  min={0}
                  value={form.sessionDurationMinutes}
                  onChange={handleChange("sessionDurationMinutes")}
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
                  placeholder="Ej: 60"
                />
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 dark:border-emerald-600/60 dark:bg-emerald-900/20">
              <input
                id="consent"
                type="checkbox"
                checked={form.consentAccepted}
                onChange={handleChange("consentAccepted")}
                className="mt-1 h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="consent" className="text-sm leading-5 text-neutral-700 dark:text-neutral-200">
                Autorizo el uso de mis datos exclusivamente para la adaptación segura y personalizada de mi entrenamiento en Ori Tahiti. Entiendo que mi información será confidencial y puedo solicitar su eliminación en cualquier momento.
              </label>
            </div>
          </section>

          {message && (
            <div
              className={`rounded-lg border px-3 py-2 text-sm ${
                status === "success"
                  ? "border-orange-300 bg-orange-50 text-orange-800 dark:border-orange-500/50 dark:bg-orange-900/20 dark:text-orange-100"
                  : "border-orange-300 bg-rose-50 text-rose-800 dark:border-rose-500/50 dark:bg-rose-900/20 dark:text-rose-100"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Tiempo estimado: 2-3 minutos.
            </div>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-700 via-orange-500 to-orange-700 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "submitting" ? "Enviando…" : "Enviar anamnesis"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

type YesNoCardProps = {
  label: string;
  helper?: string;
  value: YesNo;
  onChange: (value: YesNo) => void;
  details: string;
  onDetailsChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
};

function YesNoCard({ label, helper, value, onChange, details, onDetailsChange }: YesNoCardProps) {
  const isYes = value === "yes";
  return (
    <div className="rounded-xl border border-neutral-200 bg-white/80 p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{label}</p>
          {helper && <p className="text-xs text-neutral-500 dark:text-neutral-400">{helper}</p>}
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
          <button
            type="button"
            onClick={() => onChange("yes")}
            className={`rounded-full px-3 py-1 transition ${isYes ? 'bg-emerald-600 text-white shadow' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'}`}
          >
            Sí
          </button>
          <button
            type="button"
            onClick={() => onChange("no")}
            className={`rounded-full px-3 py-1 transition ${value === 'no' ? 'bg-rose-500 text-white shadow' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'}`}
          >
            No
          </button>
        </div>
      </div>
      {isYes && (
        <div className="mt-3">
          <textarea
            value={details}
            onChange={onDetailsChange}
            className="min-h-[80px] w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
            placeholder="Cuéntanos más..."
          />
        </div>
      )}
    </div>
  );
}
