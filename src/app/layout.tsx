import type { Metadata } from "next";
import { Fredoka, Nunito, Space_Mono } from "next/font/google";
import "./globals.css";

// Retro "Playful Creative" pairing — chunky rounded display + soft rounded body.
const fredoka = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
      className={`${fredoka.variable} ${nunito.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
