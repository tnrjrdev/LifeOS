import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"], weight: ['300','400','500','600','700','800'] });

export const metadata: Metadata = {
  title: "Life OS — Organização Total",
  description: "Organize sua vida, finanças, hábitos e metas em um só lugar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Sidebar />
        <main style={{
          flex: 1,
          height: '100vh',
          overflowY: 'auto',
          padding: '40px 48px',
        }}>
          {children}
        </main>
      </body>
    </html>
  );
}
