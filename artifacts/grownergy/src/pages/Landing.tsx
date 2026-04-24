import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { About } from "@/components/landing/About";
import { Projects } from "@/components/landing/Projects";
import { Benefits } from "@/components/landing/Benefits";
import { Testimonials } from "@/components/landing/Testimonials";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 selection:text-foreground">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Projects />
      <Benefits />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
