import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold font-display text-foreground mb-6">
              Let's Talk Power.
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-md">
              Ready to transition to clean energy? Reach out for a site evaluation and a custom proposal.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 text-secondary flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">Headquarters</h4>
                  <p className="text-muted-foreground mt-1">
                    1400 CleanTech Blvd<br />
                    Suite 200<br />
                    Portland, OR 97209
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 text-secondary flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">Phone</h4>
                  <p className="text-muted-foreground mt-1">1-800-GROW-NRG</p>
                  <p className="text-sm text-muted-foreground">Mon-Fri, 8am-6pm PST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 text-secondary flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">Email</h4>
                  <p className="text-muted-foreground mt-1">hello@grownergy.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-muted/30 p-8 rounded-3xl border border-border"
          >
            {isSubmitted ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <CheckCircle2 className="w-20 h-20 text-secondary" />
                </motion.div>
                <h3 className="text-2xl font-bold font-display text-foreground">Message Received</h3>
                <p className="text-muted-foreground max-w-sm">
                  Thank you for reaching out. One of our engineers will be in touch within 24 hours.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4 rounded-full"
                  onClick={() => setIsSubmitted(false)}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    required
                    placeholder="John Doe"
                    className="bg-background rounded-xl h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="bg-background rounded-xl h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    required
                    placeholder="Tell us about your project..."
                    className="bg-background rounded-xl min-h-[150px] resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Request Evaluation"}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
