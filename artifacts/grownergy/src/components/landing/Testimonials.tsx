import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      quote: "Grownergy handled our commercial installation with zero disruption to our operations. The craftsmanship is evident, and the ROI has exceeded their initial projections.",
      author: "Sarah Jenkins",
      role: "Operations Director, Vertex Manufacturing",
    },
    {
      quote: "I appreciated their quiet confidence. They didn't try to upsell me; they just designed a system that worked perfectly for our home's architecture.",
      author: "Marcus Chen",
      role: "Homeowner",
    },
    {
      quote: "The cleanest installation I've seen. The conduits are hidden, the panels are perfectly aligned, and the app makes monitoring our production effortless.",
      author: "Elena Rodriguez",
      role: "Architect",
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative">
        <Quote className="absolute top-0 left-4 text-primary-foreground/10 w-32 h-32 -z-10" />
        
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold font-display"
          >
            Trusted by Leaders
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-3xl p-8 flex flex-col"
            >
              <p className="text-lg leading-relaxed mb-8 flex-grow">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-bold font-display text-lg">{testimonial.author}</p>
                <p className="text-primary-foreground/70 text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
