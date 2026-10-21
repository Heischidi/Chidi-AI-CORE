import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CHIDI AI — Intelligent Customer Assistant",
  description: "Chidi is the AI that turns conversations into customers. The intelligent assistant that helps fashion brands answer questions, discover the right products, and guide customers towards their next purchase.",
  keywords: ["AI assistant", "fashion AI", "customer service AI", "product discovery", "AI chatbot"],
  openGraph: {
    title: "CHIDI AI",
    description: "The AI assistant built for fashion commerce and beyond.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-(--color-surface) text-(--color-text)">
        {children}
      </body>
    </html>
  );
}

