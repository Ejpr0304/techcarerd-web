"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getProducts } from "@/services/products";
import { Product, ProductCategory } from "@/types";
import { siteConfig } from "@/config/site";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, RefreshCw } from "lucide-react";

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
    { value: "todos", label: "Todos" },
    { value: "consolas", label: "Consolas" },
    { value: "laptops", label: "Laptops" },
    { value: "componentes", label: "Componentes" },
    { value: "accesorios", label: "Accesorios" },
  ];

  const getWhatsAppMessage = (productName: string) => {
    const baseMsg = `Hola TechCareRD, estoy interesado en el producto: ${productName}. ¿Está disponible en tienda?`;
    return `${siteConfig.contact.whatsappLink}?text=${encodeURIComponent(baseMsg)}`;
  };

  return (
    <section id="productos" className="py-24 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-sm font-semibold tracking-widest text-blue-500 uppercase">
            Tienda Física
          </h2>
          <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Productos y Componentes Disponibles
          </p>
          <p className="mt-4 text-lg text-neutral-400">
            Equipos seleccionados y repuestos originales con garantía directa de nuestro taller.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeCategory === cat.value
                  ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  : "bg-neutral-900 text-neutral-400 hover:bg-neutral-850 hover:text-white border border-neutral-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-xl bg-neutral-900/50 animate-pulse border border-neutral-900"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-neutral-500 text-lg">No hay productos en esta categoría por el momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="relative group h-full">
                {/* Antigravity background glows */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#60A5FA]/10 to-[#F87171]/5 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl -z-10" />

                <Card
                  className="flex flex-col justify-between h-full bg-neutral-900/20 border-neutral-900 hover:border-neutral-800 hover:bg-neutral-900/40 transition-all duration-300 overflow-hidden group-hover:-translate-y-1.5 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  <div>
                    {/* Image container */}
                    <div className="relative aspect-square w-full bg-neutral-900 overflow-hidden border-b border-neutral-900">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={false}
                      />

                      {/* Status & Availability badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded bg-blue-600/90 text-white backdrop-blur-sm shadow-md">
                          {product.status}
                        </span>
                        <span
                          className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded text-white backdrop-blur-sm shadow-md ${
                            (product.stock ?? 1) > 0
                              ? "bg-emerald-600/90"
                              : "bg-red-600/90"
                          }`}
                        >
                          {(product.stock ?? 1) > 0
                            ? `${product.stock ?? 1} ${(product.stock ?? 1) === 1 ? "disponible" : "disponibles"}`
                            : "Agotado"}
                        </span>
                      </div>
                    </div>

                  {/* Body content */}
                  <CardHeader className="p-5 pb-2">
                    <span className="text-[10px] font-bold tracking-widest text-blue-500 uppercase">
                      {product.category}
                    </span>
                    <CardTitle className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mt-1 line-clamp-1">
                      {product.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 pb-2">
                    <p className="text-neutral-400 text-sm line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    
                    {/* Specs if available */}
                    {product.specs && (
                      <div className="mt-4 space-y-1.5 border-t border-neutral-900 pt-3 text-[11px] text-neutral-500">
                        {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
                          <div key={key} className="flex justify-between">
                            <span className="uppercase">{key}</span>
                            <span className="text-neutral-400 font-medium">{val}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </div>

                {/* Footer and Price */}
                <CardFooter className="p-5 pt-4 border-t border-neutral-900 flex flex-col items-stretch gap-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-neutral-500">RD$</span>
                    <span className="text-2xl font-extrabold text-white">
                      {product.price.toLocaleString("es-DO")}
                    </span>
                  </div>

                  <a
                    href={getWhatsAppMessage(product.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button
                      className="w-full bg-neutral-900 hover:bg-blue-600 hover:text-white text-neutral-300 font-semibold text-xs py-5 rounded-lg border border-neutral-800 hover:border-blue-500 transition-all duration-300 gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={product.stock === 0 || product.availability === "agotado"}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      {product.stock === 0 ? "Artículo Agotado" : "Consultar Disponibilidad"}
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            </div>
          ))}
          </div>
        )}
      </div>
    </section>
  );
}
