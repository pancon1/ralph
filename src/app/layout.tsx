import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

// "Classic Elegant" pairing — premium editorial serif + clean modern sans.
const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
