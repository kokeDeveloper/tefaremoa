import path from "path";
import fs from "fs";

export function getStorageRoot(): string {
  return process.env.GALLERY_STORAGE_PATH || path.join(process.cwd(), "storage", "gallery");
}

export function getEventDir(eventId: number): string {
  return path.join(getStorageRoot(), String(eventId));
}

export function ensureEventDir(eventId: number): string {
  const dir = getEventDir(eventId);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function getPhotoPath(eventId: number, filename: string): string {
  return path.join(getEventDir(eventId), filename);
}

export function safeFilename(original: string): string {
  const ext = path.extname(original).toLowerCase().replace(/[^.a-z0-9]/g, "") || ".jpg";
  const base = path.basename(original, path.extname(original))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 60);
  return `${Date.now()}_${base}${ext}`;
}
