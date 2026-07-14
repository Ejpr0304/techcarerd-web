"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ZoomIn, Wrench, Shield, Play } from "lucide-react";

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryItems = [
    {
      id: "gal-1",
      title: "Aplicación de Metal Líquido en PS5",
      description: "Reacondicionamiento especializado del sistema de disipación de calor oficial de Sony.",
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "gal-2",
      title: "Limpieza Interna de Laptop Gaming",
      description: "Retirada total de pelusas en bloque de disipador de cobre dual.",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "gal-3",
      title: "Ensamblado Premium de PC Gaming",
      description: "Gestión avanzada de cableado y pruebas de flujo de aire en chasis cerrado.",
      image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "gal-4",
      title: "Cambio de Pasta Térmica en CPU",
      description: "Aplicación perfecta de compuesto de conductividad de nivel extremo.",
      image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "gal-5",
      title: "Identificación y Eliminación de Malware",
      description: "Detección profunda, limpieza y protección de sistemas contra amenazas y virus.",
      image: "/malware.png",
    },
    {
      id: "gal-6",
      title: "Venta de Consolas, Controles y Laptops",
      description: "Equipos gaming y accesorios de última generación garantizados.",
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section id="galeria" className="py-24 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-widest text-blue-500 uppercase">
            Galería de Trabajos
          </h2>
          <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Nuestra labor diaria en el Taller
          </p>
          <p className="mt-4 text-lg text-neutral-400">
            Documentamos los procesos de mantenimiento más rigurosos para certificar la excelencia y calidad de nuestro servicio técnico.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item) => (
            <Dialog key={item.id}>
              <DialogTrigger
                onClick={() => setSelectedImage(item.image)}
                className="group relative cursor-pointer aspect-video md:aspect-[4/3] rounded-xl overflow-hidden border border-neutral-900 bg-neutral-900 shadow-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 w-full"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={false}
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg transition-transform duration-300 scale-90 group-hover:scale-100">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {item.description}
                  </p>
                </div>
              </DialogTrigger>

              {/* Lightbox / Zoom Modal */}
              <DialogContent className="max-w-4xl p-0 overflow-hidden bg-neutral-950 border-neutral-900">
                {selectedImage && (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={selectedImage}
                      alt={item.title}
                      fill
                      sizes="90vw"
                      className="object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent text-white">
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="text-sm text-neutral-300 mt-1">{item.description}</p>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}
