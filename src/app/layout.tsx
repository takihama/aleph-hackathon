import type { Metadata } from "next";
import { Outfit } from 'next/font/google'
import "./globals.css";
import MiniKitProvider from "@/components/MiniKitProvider";
import { DaimoProviders } from "@/components/DaimoProviders";

// Initialize Outfit font
const outfit = Outfit({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Senda | Cuida a quien vas a ser mañana",
  description: "Una aplicación para planificar tu retiro y futuro financiero",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <MiniKitProvider>
          <DaimoProviders>
            {children}
          </DaimoProviders>
        </MiniKitProvider>
      </body>
    </html>
  );
}
