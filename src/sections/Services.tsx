"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getServices } from "@/services/services";
import { Service } from "@/types";
import { ArrowRight, Wrench, Shield, CheckCircle2, ChevronRight, Monitor, Laptop, Gamepad2, HardDrive, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState<number>(0);

  useEffect(() => {
    async function loadServices() {
      const data = await getServices();
      setServices(data);
    }
    loadServices();
  }, []);

  const specialties = [
    {
      id: "ps",
      category: "Consolas PlayStation 5 & PS4",
      desc: "Metal líquido original, limpieza profunda de fuente y disipador, pasta térmica de alta conductividad.",
      pillColor: "from-emerald-500 to-emerald-600 text-white shadow-emerald-500/20",
      accent: "bg-emerald-500",
      price: "Desde RD$ 1,000",
      icon: Gamepad2,
    },
    {
      id: "laptops",
      category: "Laptops Gaming & MacBooks",
      desc: "Limpieza de turbinas, cambio de compuestos térmicos en CPU/GPU, reemplazo de teclados y pantallas.",
      pillColor: "from-fuchsia-600 to-purple-600 text-white shadow-fuchsia-500/20",
      accent: "bg-fuchsia-600",
      price: "Desde RD$ 1,000",
      icon: Laptop,
    },
    {
      id: "pc",
      category: "PCs de Escritorio & Gaming Rigs",
      desc: "Optimización térmica, cable management profesional, limpieza de radiadores y ventiladores.",
      pillColor: "from-amber-500 to-orange-500 text-white shadow-amber-500/20",
      accent: "bg-amber-500",
      price: "Desde RD$ 1,300",
      icon: Monitor,
    },
    {
      id: "ssd",
      category: "Instalación & Clonación de SSD",
      desc: "Unidades NVMe M.2 ultrarrápidas para arranque instantáneo de Windows y juegos en PS5 o PC.",
      pillColor: "from-sky-500 to-blue-600 text-white shadow-sky-500/20",
      accent: "bg-sky-500",
      price: "Desde RD$ 1,200",
      icon: HardDrive,
    },
    {
      id: "ram",
      category: "Upgrade de Memoria RAM",
      desc: "Módulos SODIMM DDR4 y DDR5 para laptops multitarea y estaciones de trabajo.",
      pillColor: "from-orange-500 to-red-500 text-white shadow-orange-500/20",
      accent: "bg-orange-500",
      price: "Desde RD$ 800",
      icon: Cpu,
    },
  ];

  return (
    <section id="servicios" className="py-24 sm:py-32 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with pill badge */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200/80 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Wrench className="w-3.5 h-3.5 text-blue-600" />
            Nuestra Especialidad
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Servicios Profesionales de Mantenimiento
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Realizamos diagnósticos certificados y optimización térmica utilizando compuestos de grado internacional y herramientas ESD antiestáticas de precisión.
          </p>
        </div>

        {/* Interactive Stacked Pill Section (Inspired by Reference Image 'LED Processing') */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center bg-[#F8FAFC] rounded-3xl p-6 sm:p-12 border border-slate-200/90 shadow-sm mb-16">
          {/* Left Description Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 bg-slate-200/80 text-slate-800 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              Diagnóstico en Taller
            </div>
            
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Protocolos de Taller Rigurosos
            </h3>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Cada equipo que ingresa a TechCareRD recibe inspección visual microscópica, pruebas térmicas antes y después del servicio, y limpieza profunda por ultrasonido o soplado de precisión sin humedad.
            </p>

            <div className="pt-2">
              <Link href="#contacto">
                <Button className="bg-[#0B56A4] hover:bg-[#094380] text-white font-semibold text-xs px-6 py-5 rounded-full gap-2 cursor-pointer shadow-sm">
                  Consultar por mi Equipo
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Stacked Colored Pills (Matches reference exactly) */}
          <div className="lg:col-span-7 flex flex-col gap-3.5">
            {specialties.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  className={`bg-gradient-to-r ${item.pillColor} p-4 sm:p-5 rounded-2xl sm:rounded-full shadow-md flex items-center justify-between gap-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg cursor-pointer`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base tracking-wide leading-tight">
                        {item.category}
                      </h4>
                      <p className="text-white/80 text-xs line-clamp-1 mt-0.5 font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline-block text-xs font-bold text-white/90 bg-black/15 px-3 py-1 rounded-full backdrop-blur-sm">
                      {item.price}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
