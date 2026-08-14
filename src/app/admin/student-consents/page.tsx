"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ACADEMY_DOCUMENTS, REQUIRED_DOCUMENT_KEYS } from "@/lib/documentTexts";

export const dynamic = "force-dynamic";

export default function StudentConsentsPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // which document is currently shown
  const [checked, setChecked] = useState<boolean[]>(ACADEMY_DOCUMENTS.map(() => false));
  const [canCheck, setCanCheck] = useState<boolean[]>(ACADEMY_DOCUMENTS.map(() => false));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check if consents already done
  useEffect(() => {
    let mounted = true;
    fetch("/api/student/consents", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (data.allAccepted) {
          router.replace("/admin/student");
        } else {
          setLoading(false);
        }
      })
      .catch(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [router]);

  // Reset scroll-to-bottom gate when step changes
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setCanCheck((prev) => {
      const next = [...prev];
      next[step] = false;
      return next;
    });
  }, [step]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
    if (nearBottom) {
      setCanCheck((prev) => {
        if (prev[step]) return prev;
        const next = [...prev];
        next[step] = true;
        return next;
      });
    }
  };

  const allChecked = checked.every(Boolean);

  const handleNext = () => {
    if (step < ACADEMY_DOCUMENTS.length - 1) {
      setStep((s) => s + 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/student/consents", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentKeys: REQUIRED_DOCUMENT_KEYS }),
      });
      if (!res.ok) throw new Error("Error al registrar la aceptación");
      // Redirect: check if anamnesis is done
      const dash = await fetch("/api/student/dashboard", { credentials: "include" });
      const data = await dash.json().catch(() => ({}));
      router.replace(data.hasAnamnesis ? "/admin/student" : "/admin/student-anamnesis");
    } catch (e: any) {
      setError(e?.message || "Error inesperado");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-neutral-600 text-xs tracking-widest uppercase animate-pulse">Cargando…</p>
      </div>
    );
  }

  const doc = ACADEMY_DOCUMENTS[step];
  const isLast = step === ACADEMY_DOCUMENTS.length - 1;
  const stepChecked = checked[step];
  const stepCanCheck = canCheck[step];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center px-4 py-10">
      {/* Header */}
      <div className="w-full max-w-2xl mb-6 flex flex-col items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/tefaremoa.svg" alt="Te Fare Mo'a" className="h-8 w-auto opacity-50 mb-2" />
        <p className="text-xs text-neutral-600 uppercase tracking-widest">Documentos de la academia</p>
        {/* Step indicators */}
        <div className="flex items-center gap-2 mt-2">
          {ACADEMY_DOCUMENTS.map((d, i) => (
            <div key={d.key} className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full transition-colors ${
                  i < step
                    ? "bg-orange-500"
                    : i === step
                    ? "bg-orange-400 ring-2 ring-orange-500/30"
                    : "bg-neutral-800"
                }`}
              />
              {i < ACADEMY_DOCUMENTS.length - 1 && (
                <div className="h-px w-8 bg-neutral-800" />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-neutral-500 mt-1">
          Documento {step + 1} de {ACADEMY_DOCUMENTS.length}
        </p>
      </div>

      {/* Document card */}
      <div className="w-full max-w-2xl rounded-2xl bg-neutral-950 border border-neutral-800/60 shadow-2xl flex flex-col overflow-hidden">
        {/* Title */}
        <div className="px-6 py-4 border-b border-neutral-800/50">
          <h1 className="text-sm font-semibold text-white">{doc.title}</h1>
          <p className="text-xs text-neutral-600 mt-0.5">Versión {doc.version}</p>
        </div>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="px-6 py-5 overflow-y-auto text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap"
          style={{ maxHeight: "55vh" }}
        >
          {doc.content}
        </div>

        {/* Scroll hint */}
        {!stepCanCheck && (
          <div className="px-6 py-2 bg-neutral-900/60 border-t border-neutral-800/40 text-xs text-neutral-600 text-center">
            ↓ Desplázate hasta el final para poder aceptar
          </div>
        )}

        {/* Acceptance checkbox */}
        <div className={`px-6 py-4 border-t border-neutral-800/50 transition-opacity ${stepCanCheck ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded accent-orange-500 shrink-0"
              checked={stepChecked}
              disabled={!stepCanCheck}
              onChange={(e) =>
                setChecked((prev) => {
                  const next = [...prev];
                  next[step] = e.target.checked;
                  return next;
                })
              }
            />
            <span className="text-xs text-neutral-400 group-hover:text-neutral-200 transition-colors leading-relaxed">
              He leído y acepto el contenido de este documento en su totalidad. Entiendo que mi aceptación quedará registrada digitalmente con fecha y hora.
            </span>
          </label>
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 border-t border-neutral-800/50 flex justify-end gap-3">
          {!isLast ? (
            <button
              onClick={handleNext}
              disabled={!stepChecked}
              className="rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-30 disabled:cursor-not-allowed text-black text-sm font-semibold px-5 py-2.5 transition-colors"
            >
              Siguiente documento →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allChecked || submitting}
              className="rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-30 disabled:cursor-not-allowed text-black text-sm font-semibold px-5 py-2.5 transition-colors"
            >
              {submitting ? "Registrando…" : "Acepto y continuar"}
            </button>
          )}
        </div>

        {error && (
          <p className="px-6 pb-4 text-xs text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
}
