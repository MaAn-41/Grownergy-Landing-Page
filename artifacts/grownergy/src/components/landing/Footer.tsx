import { Sun, Instagram, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground py-16 text-background/80">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-background/10 pb-12">
          <div className="md:col-span-2">
            <div
              className="flex items-center gap-2 mb-6 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <Sun className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold tracking-tight font-display text-background">
                Grownergy
              </span>
            </div>
            <p className="max-w-sm text-background/60 leading-relaxed">
              Precision engineering for a sustainable future. Designing and installing premium solar systems with quiet confidence.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold font-display text-background mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <a href="#services" className="hover:text-primary transition-colors">Services</a>
              </li>
              <li>
                <a href="#about" className="hover:text-primary transition-colors">About Us</a>
              </li>
              <li>
                <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold font-display text-background mb-6">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/50">
          <p>&copy; {new Date().getFullYear()} Grownergy Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-background transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-background transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
