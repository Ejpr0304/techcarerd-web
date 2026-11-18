"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getProducts } from "@/services/products";
import { Product } from "@/types";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { MessageSquare, ShoppingBag, CheckCircle, Tag } from "lucide-react";

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await getProducts(activeCategory);
      setProducts(data);
      setLoading(false);
    }
    loadProducts();

    const handleUpdate = () => {
      loadProducts();
    };

    window.addEventListener("inventory_updated", handleUpdate);
    return () => window.removeEventListener("inventory_updated", handleUpdate);
  }, [activeCategory]);

  const categories = [
    { value: "todos", label: "Todos los Artículos" },
    { value: "laptops", label: "Laptops" },
    { value: "consolas", label: "Consolas" },
    { value: "componentes", label: "Componentes (SSD/RAM/HDD)" },
    { value: "accesorios", label: "Accesorios (Controles)" },
  ];

  const getWhatsAppMessage = (productName: string) => {
    const baseMsg = `Hola TechCareRD, estoy interesado en el artículo: ${productName}. ¿Aún está disponible en tienda para entrega?`;
    return `${siteConfig.contact.whatsappLink}?text=${encodeURIComponent(baseMsg)}`;
  };

  return (
    <section id="productos" className="py-24 sm:py-32 bg-[#EEF2F6] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
            Catálogo & Tienda Física
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Equipos y Repuestos Disponibles
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Consolas, laptops y componentes 100% probados en banco de trabajo con garantía directa de nuestro taller en Santo Domingo.
          </p>
        </div>

        {/* Category Pills Filters (Clean Modern Capsule Bar) */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-14">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeCategory === cat.value
                  ? "bg-[#0B56A4] text-white shadow-md scale-105"
                  : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-[420px] rounded-2xl bg-white animate-pulse border border-slate-200 shadow-sm"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto">
            <p className="text-slate-500 text-sm font-medium">
              No hay artículos en esta categoría por el momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {products.map((product) => {
              const isAvailable = (product.stock ?? 1) > 0 && product.availability !== "agotado";

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Image Container with Badges */}
                    <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden border-b border-slate-100">
                      <Image
                        src={product.images[0] || "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Floating status badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                        <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-slate-900/80 text-white backdrop-blur-sm shadow-sm">
                          {product.status}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full backdrop-blur-sm shadow-sm ${
                            isAvailable
                              ? "bg-emerald-600 text-white"
                              : "bg-red-600 text-white"
                          }`}
                        >
                          {isAvailable
                            ? `${product.stock ?? 1} ${(product.stock ?? 1) === 1 ? "disponible" : "disponibles"}`
                            : "Agotado"}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        <span>{product.category}</span>
                        {product.specs && Object.keys(product.specs).length > 0 && (
                          <span className="text-[10px] text-blue-600 font-semibold lowercase">
                            verificado
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>

                      <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Specs pills */}
                      {product.specs && (
                        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                          {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
                            <span
                              key={key}
                              className="inline-flex items-center text-[10px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium"
                            >
                              <strong className="mr-1 text-slate-900">{key}:</strong> {val}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 pt-0">
                    <div className="flex items-baseline justify-between mb-4 pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-500 font-semibold">Precio RD$</span>
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        RD$ {product.price.toLocaleString("es-DO")}
                      </span>
                    </div>

                    <a
                      href={getWhatsAppMessage(product.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block"
                    >
                      <Button
                        className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs py-5 rounded-full transition-all duration-300 gap-2 cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={!isAvailable}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        {isAvailable ? "Consultar por WhatsApp" : "Artículo Agotado"}
                      </Button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
