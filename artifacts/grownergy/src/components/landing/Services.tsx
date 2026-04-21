import { motion } from "framer-motion";
import { Sun, Wrench, Lightbulb } from "lucide-react";

export function Services() {
  const services = [
    {
      title: "Solar Installation",
      description: "Precision-engineered solar arrays for residential and commercial properties. We handle everything from permits to final connection.",
      icon: Sun,
    },
    {
      title: "Maintenance",
      description: "Proactive monitoring and maintenance to ensure your system operates at peak efficiency year-round. Quiet, reliable support.",
      icon: Wrench,
    },
    {
      title: "Energy Consultation",
      description: "Strategic planning for your energy independence. We analyze your usage and design a custom roadmap to zero emissions.",
      icon: Lightbulb,
    },
  ];

  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold font-display text-foreground"
          >
            Our Expertise
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            End-to-end solar solutions designed with engineering precision.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-background rounded-3xl p-8 border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col items-start"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <service.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground font-display group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
