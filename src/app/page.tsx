import { Navbar } from "@/components/Navbar";
import { Hero } from "@/sections/Hero";
import { Services } from "@/sections/Services";
import { Prices } from "@/sections/Prices";
import { Products } from "@/sections/Products";
import { BeforeAfter } from "@/sections/BeforeAfter";
import { Gallery } from "@/sections/Gallery";
import { FAQ } from "@/sections/FAQ";
import { Reviews } from "@/sections/Reviews";
import { Contact } from "@/sections/Contact";
import { Footer } from "@/sections/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen">
        <Hero />
        <Services />
        <Prices />
        <Products />
        <BeforeAfter />
        <Gallery />
        <FAQ />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
