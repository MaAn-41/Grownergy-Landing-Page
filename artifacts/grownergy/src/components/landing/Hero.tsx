import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, ShoppingBag } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/images/hero-solar.png";

export function Hero() {
  const [, navigate] = useLocation();
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-background pt-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/90 z-10" />
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="w-full h-full"
        >
          <img
            src={heroImg}
            alt="Solar panels at sunset"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </div>

      <div className="container relative z-20 mx-auto px-4 md:px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground border border-secondary/30 mb-8 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-sm font-medium tracking-wide uppercase">The Future of Clean Power</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight font-display text-foreground max-w-4xl leading-[1.1]"
        >
          Powering a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Sustainable</span> Future
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl font-light leading-relaxed"
        >
          We design and install advanced solar systems for forward-thinking homes and businesses. Quiet confidence, clean energy, and engineering excellence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Button
            size="lg"
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg group"
            onClick={() => scrollTo("contact")}
          >
            Get a Quote
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 py-6 text-lg group bg-background/50 backdrop-blur-sm border-foreground/10 hover:bg-background/80"
            onClick={() => navigate("/products")}
          >
            <ShoppingBag className="mr-2 w-5 h-5" />
            Shop Products
          </Button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          onClick={() => scrollTo("services")}
          className="absolute bottom-10 animate-bounce text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowDown className="w-6 h-6" />
          <span className="sr-only">Scroll down</span>
        </motion.button>
      </div>
    </section>
  );
}
