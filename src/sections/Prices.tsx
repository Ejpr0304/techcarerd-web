"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Prices() {
  const categories = [
    {
      title: "Consolas de Videojuegos",
      description: "Mantenimiento especializado para Playstation y Xbox.",
      price: "1,000",
      priceLabel: "Desde RD$",
      popular: false,
      features: [
        "PS5: Premium: RD$ 2,500 | Premium+ Metal Líquido: RD$ 2,900",
        "PS4: Full: RD$ 1,000 | Premium: RD$ 1,500",
        "Xbox One/Series: Full: RD$ 1,500 | Premium: RD$ 2,500",
        "Limpieza total de disipador y ventilador",
        "Cambio de pasta térmica de alta calidad",
        "Reacondicionamiento de metal líquido (PS5)",
        "Diagnóstico de temperaturas post-servicio",
      ],
      cta: "Cotizar Consola",
    },
    {
      title: "Computadoras & Laptops",
      description: "Optimización de temperatura y rendimiento para tu PC.",
      price: "1,000",
      priceLabel: "Desde RD$",
      popular: true,
      features: [
        "Laptops: Básico: RD$ 1,000 | Full: RD$ 1,500 | Premium: RD$ 2,500",
        "PC: Básico: RD$ 1,300 | Full: RD$ 1,900",
        "PC: Premium: RD$ 3,000 | Premium+ Gaming: RD$ 4,000",
        "Cambio de pasta térmica premium (Arctic/Thermal Grizzly)",
        "Limpieza profunda de componentes y ventiladores",
        "Ordenamiento de cableado y flujo de aire",
        "Pruebas de estrés y control de temperaturas",
      ],
      cta: "Cotizar Computadora",
    },
    {
      title: "Upgrades & Diagnósticos",
      description: "Aumenta la velocidad y almacenamiento de tus equipos.",
      price: "500",
      priceLabel: "Desde RD$",
      popular: false,
      features: [
        "Diagnóstico técnico completo: RD$ 500",
        "Upgrade de Memoria RAM: RD$ 800",
        "Instalación de SSD (SATA / M.2 NVMe): RD$ 1,200",
        "Clonación de sistema operativo o instalación limpia",
        "Pruebas de rendimiento del hardware",
        "Asesoramiento técnico para repuestos",
        "Garantía de instalación",
      ],
      cta: "Cotizar Upgrade",
    },
  ];

  return (
    <section id="precios" className="py-24 bg-neutral-900/30 border-y border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-widest text-blue-500 uppercase">
            Transparencia Total
          </h2>
          <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tarifas de Referencia para Servicios
          </p>
          <p className="mt-4 text-lg text-neutral-400">
            Ofrecemos precios competitivos y cerrados desde el inicio. Sin cargos ocultos ni sorpresas en tu presupuesto.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100, damping: 15 }}
              className="flex"
            >
              <div
                className={`relative flex flex-col justify-between w-full rounded-2xl p-8 backdrop-blur-md transition-all duration-300 ${
                  category.popular
                    ? "bg-neutral-950 border-2 border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.15)] scale-100 lg:scale-105 z-10"
                    : "bg-neutral-950/50 border border-neutral-900 hover:border-neutral-800 shadow-lg"
                }`}
              >
                {category.popular && (
                  <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                    Más Recomendado
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white">{category.title}</h3>
                  <p className="text-sm text-neutral-400 mt-2 min-h-[40px]">
                    {category.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1 text-white">
                    <span className="text-sm font-semibold text-neutral-500">{category.priceLabel}</span>
                    <span className="text-4xl font-extrabold tracking-tight">{category.price}</span>
                    <span className="text-sm text-neutral-500">/servicio</span>
                  </div>

                  <ul className="mt-8 space-y-4 border-t border-neutral-900 pt-6">
                    {category.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6">
                  <a href="#contacto" className="w-full block">
                    <Button
                      className={`w-full py-6 rounded-xl font-semibold text-sm transition-all duration-300 gap-2 ${
                        category.popular
                          ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
                          : "bg-neutral-900 hover:bg-neutral-850 text-neutral-200 border border-neutral-800"
                      }`}
                    >
                      {category.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
