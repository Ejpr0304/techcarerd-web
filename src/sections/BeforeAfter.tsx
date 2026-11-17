"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, Trash2, ArrowLeftRight } from "lucide-react";

export function BeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <section id="antes-despues" className="py-24 sm:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200/80 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Evidencia en Taller
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            El Impacto de un Mantenimiento Profesional
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Compara tú mismo. Desliza el control para ver la diferencia entre un disipador obstruido y uno completamente restaurado con compuestos térmicos frescos.
          </p>
        </div>

        {/* Interactive Slider Container */}
        <div className="relative max-w-4xl mx-auto aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-900 select-none">
          {/* Before Image (Left / Background) */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/fan-dirty.jpg"
              alt="Abanico sucio antes del servicio"
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover"
              priority={false}
            />
          </div>

          {/* After Image (Right / Overlay) */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            style={{
              clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
            }}
          >
            <Image
              src="/fan-clean.jpg"
              alt="Abanico limpio después del mantenimiento"
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover"
              priority={false}
            />
          </div>

          {/* Divider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-800 border-2 border-slate-200">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 z-20 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider">
            Antes (Sucio)
          </div>
          <div className="absolute top-4 right-4 z-20 bg-emerald-600/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider">
            Después (Restaurado)
          </div>

          {/* Range Input for Dragging */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={handleSliderChange}
            aria-label="Control deslizante antes y después"
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          />
        </div>

      </div>
    </section>
  );
}
