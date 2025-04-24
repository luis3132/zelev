import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Zelev",
  description: "Venta de bolsos y accesorios de cuero",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/logo/logo.png" />
      </head>
      <body
        className={`antialiased max-h-dvh h-dvh overflow-scroll bg-black/90 flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
