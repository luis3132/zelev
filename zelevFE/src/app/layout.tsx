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
        <link />
      </head>
      <body
        className={`antialiased h-dvh bg-black/90 flex flex-col md:pt-20`}
      >
        {children}
      </body>
    </html>
  );
}
