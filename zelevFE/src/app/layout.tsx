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
        className={`antialiased h-dvh overflow-scroll bg-black/90 flex flex-col`}
      >
        {children}
        <div className="min-h-24 md:min-h-5"></div>
      </body>
    </html>
  );
}
