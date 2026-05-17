"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";

type ScanResult = {
  ok: boolean;
  studentName: string;
  alreadyRecorded?: boolean;
  notEnrolled?: boolean;
  error?: string;
};

interface Props {
  classId: number;
  onScan: (result: ScanResult) => void;
}

export default function QrScannerCamera({ classId, onScan }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const processingRef = useRef(false);
  const startedRef = useRef(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    // Give the div a stable unique id
    const id = `qr-reader-${Math.random().toString(36).slice(2)}`;
    const container = containerRef.current;
    if (!container) return;
    container.id = id;

    const scanner = new Html5Qrcode(id, { verbose: false });
    scannerRef.current = scanner;

    let cleanedUp = false;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          if (processingRef.current) return;
          processingRef.current = true;

          try {
            const res = await fetch("/api/attendance/scan", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ qrToken: decodedText, classId }),
            });
            const data = await res.json().catch(() => ({}));

            if (res.ok) {
              onScan({
                ok: true,
                studentName: `${data.student.name} ${data.student.lastName}`,
                notEnrolled: data.notEnrolled,
              });
            } else if (res.status === 409) {
              onScan({
                ok: false,
                alreadyRecorded: true,
                studentName: `${data.student?.name ?? ""} ${data.student?.lastName ?? ""}`.trim(),
                error: data.error,
              });
            } else {
              onScan({ ok: false, studentName: "", error: data.error || "Error al registrar." });
            }
          } catch {
            onScan({ ok: false, studentName: "", error: "Error de red." });
          } finally {
            setTimeout(() => { processingRef.current = false; }, 2500);
          }
        },
        () => { /* ignore per-frame decode errors */ }
      )
      .then(() => {
        startedRef.current = true;
        // If cleanup already ran before start() resolved, stop now
        if (cleanedUp) {
          stopScanner(scanner);
        }
      })
      .catch((err: Error) => {
        setCameraError(
          err?.message?.toLowerCase().includes("permission")
            ? "Sin permiso para la cámara. Habilítala en la configuración del navegador."
            : "No se pudo iniciar la cámara."
        );
      });

    return () => {
      cleanedUp = true;
      if (startedRef.current) {
        stopScanner(scanner);
        startedRef.current = false;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  if (cameraError) {
    return (
      <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-300">
        {cameraError}
      </div>
    );
  }

  return <div ref={containerRef} className="w-full rounded-xl overflow-hidden" />;
}

function stopScanner(scanner: Html5Qrcode) {
  try {
    const state = scanner.getState();
    if (
      state === Html5QrcodeScannerState.SCANNING ||
      state === Html5QrcodeScannerState.PAUSED
    ) {
      scanner.stop().catch(() => {}).finally(() => { try { scanner.clear(); } catch { /* ignore */ } });
    } else {
      try { scanner.clear(); } catch { /* ignore */ }
    }
  } catch {
    // ignore any state-check errors
  }
}

