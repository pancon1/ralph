import type { Metadata } from "next";
import { Space_Grotesk, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

// Futuristic "Tech Startup" pairing — geometric techy display + clean body + mono labels.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Bob.io — Tes clips viraux, gratuitement",
  description:
    "Bob transforme tes longues vidéos en clips courts prêts pour TikTok, Reels et Shorts. Sous-titres animés, recadrage automatique, détection des meilleurs moments. 100% gratuit.",
  keywords: [
    "clips vidéo",
    "montage IA",
    "TikTok",
    "Reels",
    "Shorts",
    "Bob.io",
    "alternative Klap gratuite",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${spaceGrotesk.variable} ${inter.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
