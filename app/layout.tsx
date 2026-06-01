// src/app/layout.tsx
import { Playfair_Display, Courier_Prime } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const courier = Courier_Prime({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-courier",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${courier.variable}`}>
      <body>{children}</body>
    </html>
  );
}
