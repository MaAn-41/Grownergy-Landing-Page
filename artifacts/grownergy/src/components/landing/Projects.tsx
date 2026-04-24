import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import project1 from "@/assets/images/project-1.png";
import project2 from "@/assets/images/project-2.png";
import project3 from "@/assets/images/project-3.png";

export function Projects() {
  const projects = [
    {
      title: "Logistics Hub Alpha",
      category: "Commercial",
      description: "A 500kW rooftop array powering a modern distribution center, offsetting 85% of grid usage.",
      image: project1,
    },
    {
      title: "The Redwood Residence",
      category: "Residential",
      description: "Seamlessly integrated premium black panels on a mid-century modern architectural home.",
      image: project2,
    },
    {
      title: "Tech Park Canopy",
      category: "Infrastructure",
      description: "A functional, elegant solar canopy providing shade for 200 vehicles while charging 50 EVs.",
      image: project3,
    },
  ];

  return (
    <section id="projects" className="py-24 bg-foreground text-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl font-bold font-display text-background mb-4"
            >
              Selected Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-muted/80"
            >
              A portfolio of deliberate design and uncompromising execution.
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group flex items-center gap-2 text-secondary hover:text-secondary/80 font-medium transition-colors"
          >
            View All Projects
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative rounded-3xl overflow-hidden cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary mb-2 block">
                  {project.category}
                </span>
                <h3 className="text-2xl font-display font-bold text-background mb-2">
                  {project.title}
                </h3>
                <p className="text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-2">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
