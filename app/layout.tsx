import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers";
import { MainLayout } from "@/components/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WhisperrFlow - Smart Task Navigation",
  description: "The future of task orchestration inside the Whisperr ecosystem.",
  keywords: ["task management", "productivity", "whisperr", "todo", "project management"],
  authors: [{ name: "Whisperr Team" }],
  openGraph: {
    title: "WhisperrFlow - Smart Task Navigation",
    description: "The future of task orchestration inside the Whisperr ecosystem.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppProviders>
          <MainLayout>
            {children}
          </MainLayout>
        </AppProviders>
      </body>
    </html>
  );
}
