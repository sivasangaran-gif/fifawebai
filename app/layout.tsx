import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StadiumGPT AI - FIFA World Cup 2026 Dashboard",
  description: "Smart Stadium. Better Experience. One AI Assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-navy font-sans text-white min-h-screen overflow-x-hidden antialiased selection:bg-neon-purple/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
