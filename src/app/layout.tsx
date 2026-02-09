import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roia - Gestión Textil",
  description:
    "Sistema de gestión de producción, clientes y finanzas para Roia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geist.variable} antialiased min-h-screen bg-background`}>
        {children}
      </body>
    </html>
  );
}
