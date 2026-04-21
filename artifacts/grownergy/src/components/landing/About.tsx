import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import aboutImg from "@/assets/images/about-solar.png";

export function About() {
  const bullets = [
    "Premium materials built to outlast extreme weather",
    "Expert installation by certified engineering teams",
    "Transparent pricing with no hidden fees",
    "Comprehensive warranties on parts and labor",
  ];

  return (
    <section id="about" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] shadow-2xl">
              <img
                src={aboutImg}
                alt="Modern home with solar panels"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-background p-6 rounded-3xl shadow-xl border border-border/50 max-w-xs">
              <p className="text-3xl font-display font-bold text-primary mb-1">10+ Years</p>
              <p className="text-sm text-muted-foreground font-medium">Of engineering excellence in renewable energy</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col"
          >
            <h2 className="text-3xl md:text-5xl font-bold font-display text-foreground mb-6">
              Quiet Confidence.<br />Clean Power.
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We believe the transition to sustainable energy shouldn't be chaotic. Grownergy was founded to bring rigorous engineering standards and calm, deliberate execution to solar installation.
            </p>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Our mission is to empower homes and businesses to generate their own clean power, seamlessly integrating advanced technology with the natural environment.
            </p>

            <div className="space-y-4 mb-8">
              {bullets.map((bullet, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium">{bullet}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
