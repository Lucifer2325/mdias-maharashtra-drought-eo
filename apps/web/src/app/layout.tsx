import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "MDIAS — Maharashtra Drought Intelligence & Advisory System",
    template: "%s | MDIAS",
  },
  description:
    "Early warning, smarter water management, and resilient planning for Maharashtra through satellite intelligence, NDVI analysis, and AI-driven drought forecasting.",
  keywords: [
    "drought intelligence",
    "Maharashtra water",
    "NDVI satellite",
    "early warning system",
    "water resource management",
    "SPI index",
    "MODIS",
    "Sentinel-2",
  ],
  authors: [{ name: "MDIAS Team" }],
  creator: "MDIAS",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://mdias.in",
    siteName: "MDIAS",
    title: "MDIAS — Maharashtra Drought Intelligence & Advisory System",
    description:
      "Real-time satellite intelligence for drought early warning across 36 districts of Maharashtra.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MDIAS — Maharashtra Drought Intelligence",
    description:
      "Real-time satellite intelligence for drought early warning across 36 districts of Maharashtra.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
