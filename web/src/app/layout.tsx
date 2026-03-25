import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Nav } from "@/components/nav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Researcher Kit",
  description:
    "AI-powered research workflow: problem framing, literature review, and empirical standards-based peer review.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
