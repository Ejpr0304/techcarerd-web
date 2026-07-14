"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { getServices } from "@/services/services";
import { Service } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import * as Icons from "lucide-react";

function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons as any)[name] || Icons.Wrench;
  return <Icon className={className} />;
}

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      const data = await getServices();
      setServices(data);
      setLoading(false);
    }
    loadServices();
  }, []);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section id="servicios" className="py-24 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-widest text-blue-500 uppercase">
            Nuestra Especialidad
          </h2>
          <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Servicios Profesionales de Mantenimiento
          </p>
          <p className="mt-4 text-lg text-neutral-400">
            Realizamos mantenimientos preventivos y correctivos utilizando herramientas de precisión y compuestos térmicos de primer nivel mundial.
          </p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-60 rounded-xl bg-neutral-900/50 animate-pulse border border-neutral-900"
              />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group h-full"
              >
                <Card className="h-full bg-neutral-900/30 border-neutral-900 group-hover:border-blue-500/30 group-hover:bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 overflow-hidden shadow-md group-hover:shadow-[0_4px_30px_rgba(37,99,235,0.15)] flex flex-col justify-between">
                  <CardHeader className="p-6 pb-2">
                    <div className="relative mb-4 w-12 h-12">
                      {/* Antigravity glows/halos */}
                      <div className="absolute inset-0 -m-1 rounded-full bg-[#60A5FA]/10 blur-[8px] opacity-70 group-hover:bg-[#60A5FA]/20 group-hover:blur-[12px] transition-all duration-500" />
                      <div className="absolute inset-0 -m-0.5 rounded-full bg-[#F87171]/5 blur-[6px] opacity-70 group-hover:bg-[#F87171]/15 group-hover:blur-[10px] transition-all duration-500" />
                      
                      <div className="relative w-full h-full rounded-lg bg-neutral-900 border border-neutral-800 text-blue-500 flex items-center justify-center transition-all duration-300 group-hover:border-blue-500/40 group-hover:text-blue-400 group-hover:-translate-y-1 group-hover:shadow-[0_0_15px_rgba(96,165,250,0.3)]">
                        <ServiceIcon name={service.iconName} className="w-6 h-6" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {service.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 pt-2 flex-grow flex flex-col justify-between">
                    <CardDescription className="text-neutral-400 text-sm leading-relaxed mb-6">
                      {service.description}
                    </CardDescription>
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-900 text-xs font-semibold tracking-wider text-neutral-500">
                      <span>TIEMPO ESTIMADO</span>
                      <span className="text-neutral-300 font-medium">{service.estimatedTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
