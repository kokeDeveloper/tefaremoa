"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  // If the path starts with /admin, render children only (no Navbar/Footer)
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
