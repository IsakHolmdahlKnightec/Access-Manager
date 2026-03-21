import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "Access Manager",
  description: "Secure, efficient, and user-friendly access management for your organization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-surface text-on-surface font-sans">
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
