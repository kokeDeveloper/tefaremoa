"use client";

import { useState } from "react";

function getInitials(name: string, lastName?: string | null) {
  const first = name?.trim()[0] ?? "";
  const second = lastName?.trim()[0] ?? name?.trim().split(/\s+/)[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

interface Props {
  studentId: number;
  name: string;
  lastName?: string | null;
  size?: number; // px, default 32
}

export default function StudentAvatar({ studentId, name, lastName, size = 32 }: Props) {
  const [photoOk, setPhotoOk] = useState(true);
  const initials = getInitials(name, lastName);

  const style = {
    width: size,
    height: size,
    minWidth: size,
    fontSize: size < 36 ? "0.65rem" : "0.85rem",
  };

  if (photoOk) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/api/admin/students/${studentId}/photo`}
        alt={name}
        style={style}
        className="rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-700"
        onError={() => setPhotoOk(false)}
      />
    );
  }

  return (
    <div
      style={style}
      className="rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 flex items-center justify-center font-semibold ring-1 ring-orange-200 dark:ring-orange-800 select-none"
    >
      {initials || "?"}
    </div>
  );
}
