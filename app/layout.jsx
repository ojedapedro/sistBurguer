import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "SistBurguer | Las mejores hamburguesas artesanales",
  description: "Pide tus hamburguesas favoritas rápido y fácil con preparación en tiempo real.",
};

import DemoBanner from "@/components/DemoBanner";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <DemoBanner />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

