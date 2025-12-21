import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalShell from "./components/ConditionalShell";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Te Fare Mo'a | Clases de Ori Tahiti en Providencia, Santiago",
  description: "Academia de danzas polinesias en Providencia, Santiago. Clases de Ori Tahiti, talleres, presentaciones y entrenamiento para todas las edades.",
  keywords: [
    "Ori Tahiti",
    "danzas polinesias",
    "clases de baile",
    "academia de danza Santiago",
    "clases de baile en Providencia",
    "Te Fare Mo'a",
  ],
  openGraph: {
    title: "Te Fare Mo'a | Clases de Ori Tahiti en Providencia, Santiago",
    description:
      "Academia de danzas polinesias en Providencia, Santiago. Clases de Ori Tahiti, talleres y entrenamiento para todas las edades.",
    url: "https://tefaremoa.com",
    siteName: "Te Fare Mo'a",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "/tefaremoa.svg",
        width: 800,
        height: 800,
        alt: "Te Fare Mo'a",
      },
    ],
  },
  alternates: {
    canonical: "https://tefaremoa.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preload" href="/fonts/aloha.otf" as="font" type="font/otf"  />
        <link rel="preload" href="/fonts/aloha.otf" as="font" type="font/otf"  />
        <link rel="preload" href="/fonts/oswald.ttf" as="font" type="font/ttf" />
        <link rel="preload" href="/fonts/adorage.ttf" as="font" type="font/ttf" />
      </head>
      <body>
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}
