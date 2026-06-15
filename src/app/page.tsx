import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Platforms from "@/components/Platforms";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import FreeBanner from "@/components/FreeBanner";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <Platforms />
        <HowItWorks />
        <Features />
        <FreeBanner />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
