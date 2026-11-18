"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Cpu } from "lucide-react";

export function Hero() {
  return (
    <section id="inicio" className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 overflow-hidden bg-[#EEF2F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Cinematic Showcase Image (Inspired by reference banner) */}
        <div className="relative w-full h-[320px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden shadow-2xl mb-16 sm:mb-24 border border-slate-200/80 group">
          <Image
            src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1600&q=85"
            alt="TechCareRD Taller de Mantenimiento y Hardware"
            fill
            priority
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          
          {/* Floating Pill Badge over image */}
          <div className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/60 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-900 tracking-wide uppercase">
              Taller Activo · Santo Domingo
            </span>
          </div>

          {/* Bottom text inside cinematic banner */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">
                Servicio Técnico de Alta Precisión
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Consolas, Laptops Gaming y Estaciones de Trabajo
              </h2>
            </div>
            <Link href="#servicios">
              <Button className="bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs px-6 py-5 rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer">
                Ver Especialidades
              </Button>
            </Link>
          </div>
        </div>

        {/* Editorial Title & Description Layout (Matching Reference Structure) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-20 sm:mb-28">
          {/* Left Title Column with Green Pill */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Garantía y Confianza
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
              Cuidamos tu tecnología.{" "}
              <span className="text-slate-500 font-bold">Potenciamos tu experiencia.</span>
            </h1>
          </div>

          {/* Right Text & CTA Column */}
          <div className="lg:col-span-5 space-y-6 pt-2">
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              TechCareRD ofrece un ecosistema integral de servicio técnico y venta de componentes seleccionados. Especialistas certificados en cambio de metal líquido, pasta térmica de competición y diagnóstico integral de consolas PS5/PS4/Xbox y laptops en República Dominicana.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="#contacto">
                <Button className="bg-[#0B56A4] hover:bg-[#094380] text-white font-bold text-xs px-7 py-6 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer gap-2">
                  Solicitar Diagnóstico
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#productos">
                <Button
                  variant="outline"
                  className="border-slate-300 hover:border-slate-900 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-6 py-6 rounded-full transition-all cursor-pointer shadow-xs"
                >
                  Ver Catálogo en Tienda
                </Button>
              </Link>
            </div>

            {/* Micro badges */}
            <div className="flex items-center gap-6 pt-4 text-xs font-semibold text-slate-600 border-t border-slate-300/60">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Garantía en Taller</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Insumos Originales</span>
              </div>
            </div>
          </div>
        </div>

        {/* High-Impact Dark Contrast Block (Inspired by 'Meet Ventana' in Reference) */}
        <div className="relative rounded-3xl bg-[#090D16] text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl border border-slate-800">
          {/* Subtle blue & purple ambient glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/15 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              Laboratorio Térmico Especializado
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Reacondicionamiento Térmico de Precisión
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              El calor es el enemigo número uno de tu consola y computadora. Reemplazamos pastas térmicas degradadas por compuestos de grado entusiasta (Thermal Grizzly y Arctic MX) y restauramos la barrera de metal líquido en consolas PS5 para eliminar el sobrecalentamiento y el ruido de ventiladores.
            </p>

            <div className="pt-4 flex justify-center">
              <Link href="#antes-despues">
                <Button className="bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs px-8 py-5 rounded-full shadow-xl transition-transform hover:scale-105 cursor-pointer gap-2">
                  Ver Casos Antes & Después
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
