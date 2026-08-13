"use client";

import { motion, Variants } from "framer-motion";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench, ShieldCheck, Zap } from "lucide-react";

export function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-neutral-950"
    >
      {/* Background Neon Effects (ASUS ROG/PlayStation inspired) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] animate-pulse duration-5000" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[100px]" />
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center gap-6"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/40 border border-blue-500/30 text-xs font-semibold text-blue-400 tracking-wider uppercase backdrop-blur-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            Servicio Técnico de Computadoras y Consolas
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-tight"
          >
            Cuidamos tu tecnología.{" "}
            <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              Potenciamos tu experiencia.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-neutral-400 max-w-2xl font-light leading-relaxed"
          >
            Especialistas en limpieza profunda, cambio de metal líquido, pasta térmica y optimización de laptops, PCs y consolas (PS5, PS4, Xbox) en Santo Domingo.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto"
          >
            <a href="#contacto" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base py-6 px-8 rounded-xl border border-blue-500/50 shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)] transition-all duration-300 gap-2">
                Solicitar Diagnóstico
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <a href="#servicios" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-neutral-800 hover:border-neutral-700 bg-neutral-900/30 hover:bg-neutral-900/60 text-neutral-300 hover:text-white text-base py-6 px-8 rounded-xl backdrop-blur-sm transition-all"
              >
                Explorar Servicios
              </Button>
            </a>
          </motion.div>

          {/* Trust points */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 pt-16 mt-8 border-t border-neutral-900 w-full max-w-4xl"
          >
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
              <div className="flex items-center gap-2 text-blue-500">
                <Wrench className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wider uppercase text-neutral-500">Garantía</span>
              </div>
              <span className="text-xl font-bold text-white mt-1">100% Asegurada</span>
              <span className="text-xs text-neutral-500">En cada mantenimiento</span>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
              <div className="flex items-center gap-2 text-blue-500">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wider uppercase text-neutral-500">Entrega</span>
              </div>
              <span className="text-xl font-bold text-white mt-1">24 - 48 Horas</span>
              <span className="text-xs text-neutral-500">Servicio rápido y seguro</span>
            </div>

            <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left gap-1">
              <div className="flex items-center gap-2 text-blue-500 justify-center md:justify-start">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wider uppercase text-neutral-500">Compuestos</span>
              </div>
              <span className="text-xl font-bold text-white mt-1">Gama Premium</span>
              <span className="text-xs text-neutral-500">Thermal Grizzly / Arctic</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative gradient mask bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none" />
    </section>
  );
}
