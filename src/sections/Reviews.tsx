"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  deviceType: string;
  date: string;
}

export function Reviews() {
  const reviews: Review[] = [
    {
      id: "rev-1",
      name: "Jean Carlos Ortiz",
      rating: 5,
      comment: "Traje mi PS5 que parecía una turbina de avión y se apagaba sola por sobrecalentamiento. Le hicieron el reacondicionamiento de metal líquido y ahora no suena absolutamente nada. Increíble servicio.",
      deviceType: "PlayStation 5",
      date: "04/07/2026",
    },
    {
      id: "rev-2",
      name: "Alejandro Bisonó",
      rating: 5,
      comment: "Excelente servicio de mantenimiento para mi Laptop ASUS ROG. Las temperaturas bajaron casi 20°C en juegos pesados. Fueron muy profesionales y me enviaron fotos de todo el proceso por WhatsApp.",
      deviceType: "ASUS ROG Zephyrus",
      date: "28/06/2026",
    },
    {
      id: "rev-3",
      name: "Camila Vásquez",
      rating: 5,
      comment: "Le instalaron un SSD y le aumentaron la RAM a mi laptop de trabajo que estaba lentísima. Literalmente se siente como nueva. El servicio fue sumamente rápido, me la entregaron el mismo día.",
      deviceType: "HP Pavilion Laptop",
      date: "12/06/2026",
    },
    {
      id: "rev-4",
      name: "Manuel Terrero",
      rating: 5,
      comment: "El trato es de primera. Muy honestos con el diagnóstico y el precio de la limpieza de mi PC gamer. Se nota que conocen su trabajo al detalle. Los recomiendo al 100% en Santo Domingo.",
      deviceType: "PC Gaming Escritorio",
      date: "02/06/2026",
    },
  ];

  return (
    <section id="reseñas" className="py-24 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-widest text-blue-500 uppercase">
            Opiniones de Clientes
          </h2>
          <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Nuestra mayor garantía es tu satisfacción
          </p>
          <p className="mt-4 text-lg text-neutral-400">
            Descubre por qué los apasionados de la tecnología y los videojuegos en Santo Domingo confían sus equipos a TechCareRD.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100, damping: 15 }}
            >
              <Card className="h-full bg-neutral-900/20 border-neutral-900 hover:border-neutral-800 hover:bg-neutral-900/30 transition-all duration-300 relative overflow-hidden group">
                <CardContent className="p-8">
                  {/* Quote icon watermark */}
                  <Quote className="absolute right-6 top-6 w-12 h-12 text-blue-500/5 group-hover:text-blue-500/10 transition-colors" />

                  {/* Rating Stars */}
                  <div className="flex gap-1 text-amber-500 mb-5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-neutral-300 text-sm sm:text-base leading-relaxed italic mb-6">
                    &ldquo;{review.comment}&rdquo;
                  </p>

                  {/* User Profile */}
                  <div className="flex items-center gap-4 pt-4 border-t border-neutral-900">
                    <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold text-sm flex items-center justify-center">
                      {review.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{review.name}</h4>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {review.deviceType} • {review.date}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
