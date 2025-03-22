import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import MiniKitProvider from "@/components/MiniKitProvider";
import { DaimoProviders } from "@/components/DaimoProviders";

// Initialize Inter font
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "WorldApp Mini",
  description: "A WorldApp Mini Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MiniKitProvider>
          <DaimoProviders>
            {children}
          </DaimoProviders>
        </MiniKitProvider>
      </body>
    </html>
  );
}
