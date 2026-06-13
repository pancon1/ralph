import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
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
      className={`${bricolage.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
