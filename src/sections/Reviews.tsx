"use client";

import { Star, Quote, CheckCircle2 } from "lucide-react";

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
    <section id="reseñas" className="py-24 sm:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            5.0 Estrellas en Google & WhatsApp
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Lo que Dicen Nuestros Clientes
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            La satisfacción y el cuidado de cada equipo son nuestra mejor carta de presentación en toda la República Dominicana.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#F8FAFC] rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4 text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/80">
                <h4 className="font-bold text-slate-900 text-sm">{rev.name}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span className="font-semibold text-blue-600">{rev.deviceType}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
