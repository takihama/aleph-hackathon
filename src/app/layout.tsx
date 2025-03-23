import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import "./globals.css";
import MiniKitProvider from "@/components/MiniKitProvider";
import { DaimoProviders } from "@/components/DaimoProviders";

// Initialize Outfit font
const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Senda | Take care of who you will be tomorrow",
  description: "An application to plan your retirement and financial future",
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
          <DaimoProviders>{children}</DaimoProviders>
        </MiniKitProvider>
      </body>
    </html>
  );
}
