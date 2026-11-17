"use client";

import { Check, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function Prices() {
  const categories = [
    {
      title: "Consolas de Videojuegos",
      description: "Mantenimiento preventivo y correctivo especializado para Playstation y Xbox.",
      price: "1,000",
      priceLabel: "Desde RD$",
      popular: false,
      badge: "Consolas",
      features: [
        "PS5: Premium: RD$ 2,500 | Metal Líquido: RD$ 2,900",
        "PS4: Full: RD$ 1,000 | Premium: RD$ 1,500",
        "Xbox One / Series: Full: RD$ 1,500 | Premium: RD$ 2,500",
        "Desensamble cuidadoso y limpieza de fuente",
        "Cambio de pasta térmica de alta conductividad",
        "Restauración de metal líquido en APU (PS5)",
        "Diagnóstico de temperaturas post-servicio",
      ],
      cta: "Cotizar Consola",
    },
    {
      title: "Computadoras & Laptops",
      description: "Optimización de temperatura y rendimiento para tu equipo de trabajo o gaming.",
      price: "1,000",
      priceLabel: "Desde RD$",
      popular: true,
      badge: "Más Solicitado",
      features: [
        "Laptops: Básico: RD$ 1,000 | Full: RD$ 1,500 | Premium: RD$ 2,500",
        "PC: Básico: RD$ 1,300 | Full: RD$ 1,900 | Gaming: RD$ 4,000",
        "Pastas térmicas Arctic MX-6 / Thermal Grizzly",
        "Limpieza profunda de disipadores y ventiladores",
        "Ordenamiento de cableado interno (airflow)",
        "Test de estabilidad y temperaturas bajo estrés",
        "Garantía directa en taller TechCareRD",
      ],
      cta: "Cotizar Computadora",
    },
    {
      title: "Upgrades & Diagnósticos",
      description: "Aumenta la velocidad y almacenamiento con repuestos originales.",
      price: "500",
      priceLabel: "Desde RD$",
      popular: false,
      badge: "Repuestos & Upgrades",
      features: [
        "Diagnóstico técnico completo: RD$ 500",
        "Upgrade de Memoria RAM SODIMM: RD$ 800",
        "Instalación de SSD (SATA / NVMe M.2): RD$ 1,200",
        "Clonación de disco o instalación limpia de SO",
        "Pruebas de salud SMART de disco duro",
        "Asesoramiento técnico personalizado",
        "Soporte post-instalación",
      ],
      cta: "Cotizar Upgrade",
    },
  ];

  return (
    <section id="precios" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Transparencia Total
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Tarifas Claras y Cerradas
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Sin costos ocultos ni sorpresas en tu presupuesto. Todos los trabajos incluyen garantía escrita del taller.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-between rounded-3xl p-8 sm:p-10 transition-all duration-300 ${
                cat.popular
                  ? "bg-white border-2 border-blue-600 shadow-2xl relative lg:-translate-y-2"
                  : "bg-[#F8FAFC] border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300"
              }`}
            >
              <div>
                {/* Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span
                    className={`text-[11px] font-bold tracking-wider uppercase px-3.5 py-1 rounded-full ${
                      cat.popular
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-200/80 text-slate-700"
                    }`}
                  >
                    {cat.badge}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {cat.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed min-h-[40px]">
                  {cat.description}
                </p>

                {/* Price Display */}
                <div className="my-8 pb-6 border-b border-slate-200 flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    {cat.priceLabel}
                  </span>
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    {cat.price}
                  </span>
                </div>

                {/* Features list */}
                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 mb-8">
                  {cat.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <a
                href={`${siteConfig.contact.whatsappLink}?text=${encodeURIComponent(
                  `Hola TechCareRD, me gustaría cotizar el servicio para: ${cat.title}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full pt-4"
              >
                <Button
                  className={`w-full font-bold text-xs py-6 rounded-full cursor-pointer transition-all ${
                    cat.popular
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  {cat.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
