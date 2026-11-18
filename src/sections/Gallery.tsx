"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, ZoomIn, Eye } from "lucide-react";

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryItems = [
    {
      id: "gal-1",
      title: "Metal Líquido en PS5",
      description: "Reacondicionamiento de barrera térmica en APU de PlayStation 5.",
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
      pill: "bg-fuchsia-600 text-white",
      tag: "PlayStation 5",
    },
    {
      id: "gal-2",
      title: "Laptops Gaming & Ultrabooks",
      description: "Limpieza de doble turbina y bloque de cobre en laptops de alto rendimiento.",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
      pill: "bg-sky-500 text-white",
      tag: "Laptops",
    },
    {
      id: "gal-3",
      title: "Ensamblaje & Cable Management",
      description: "Montaje con flujo de aire optimizado y estética minimalista para PCs.",
      image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
      pill: "bg-emerald-600 text-white",
      tag: "PC Gaming",
    },
    {
      id: "gal-4",
      title: "Pastas Térmicas de Competición",
      description: "Aplicación de compuestos Arctic MX-6 y Thermal Grizzly para reducir temperaturas.",
      image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80",
      pill: "bg-amber-500 text-white",
      tag: "Rendimiento",
    },
    {
      id: "gal-5",
      title: "Optimización de Software & Malware",
      description: "Eliminación de programas espía, virus y aceleración del sistema operativo.",
      image: "/malware.png",
      pill: "bg-indigo-600 text-white",
      tag: "Seguridad",
    },
    {
      id: "gal-6",
      title: "Equipos & Accesorios Garantizados",
      description: "Controles DualSense, mandos DualShock y componentes con garantía directa.",
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80",
      pill: "bg-rose-500 text-white",
      tag: "Tienda Oficial",
    },
  ];

  return (
    <section id="galeria" className="py-24 sm:py-32 bg-[#EEF2F6] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-slate-200/80 text-slate-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Camera className="w-3.5 h-3.5" />
            Galería del Taller
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Nuestra Labor Diaria
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Fotografías directas de nuestro banco de trabajo. Cada intervención se realiza con estándares técnicos de alta precisión.
          </p>
        </div>

        {/* Gallery Grid (Inspired by 'Applications' cards with pill buttons) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-3xl overflow-hidden bg-slate-900 h-[360px] sm:h-[400px] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-200/80 flex flex-col justify-end p-6 sm:p-8"
            >
              {/* Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />

              {/* Pill Tag overlay (Matches reference image) */}
              <div className="relative z-10 flex flex-col items-start gap-3">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${item.pill}`}>
                  {item.tag}
                </span>

                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
