import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingDown, Leaf, BatteryCharging } from "lucide-react";

function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number, suffix?: string, prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}

export function Benefits() {
  const benefits = [
    {
      title: "Cost Savings",
      description: "Drastically reduce or eliminate your monthly utility bills with efficient energy generation.",
      icon: TrendingDown,
      stat: 75,
      suffix: "%",
      statLabel: "Average Bill Reduction"
    },
    {
      title: "Eco-Friendly",
      description: "Minimize your carbon footprint and contribute directly to a cleaner, healthier planet.",
      icon: Leaf,
      stat: 12,
      suffix: " Tons",
      statLabel: "CO2 Offset Annually"
    },
    {
      title: "Energy Independence",
      description: "Protect yourself from grid outages and rising energy costs with battery storage solutions.",
      icon: BatteryCharging,
      stat: 99,
      suffix: "%",
      statLabel: "Uptime Reliability"
    },
  ];

  return (
    <section id="benefits" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold font-display text-foreground"
          >
            The Impact
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Measurable results for your wallet and the world.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-background rounded-3xl p-8 border border-border text-center shadow-sm"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mb-6">
                <benefit.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground font-display">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground mb-8">
                {benefit.description}
              </p>
              <div className="pt-8 border-t border-border">
                <div className="text-4xl font-bold font-display text-primary mb-2">
                  <AnimatedCounter end={benefit.stat} suffix={benefit.suffix} />
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {benefit.statLabel}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
