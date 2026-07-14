import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Product } from "@/types";

// Datos locales de demostración (mock data de alta calidad)
export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "PlayStation 5 Slim 1TB",
    description: "Consola PS5 versión digital o física con chasis reducido. Rendimiento 4K HDR a 120 FPS y retrocompatibilidad.",
    price: 35000,
    images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80"],
    status: "nuevo",
    availability: "disponible",
    category: "consolas",
    specs: {
      Almacenamiento: "1TB SSD NVMe",
      Resolución: "Hasta 4K @ 120Hz",
      Audio: "Tempest 3D AudioTech",
    },
  },
  {
    id: "prod-2",
    name: "ASUS ROG Strix G15 G513QR",
    description: "Laptop gaming de alto rendimiento. CPU AMD Ryzen 9, GPU NVIDIA RTX 3070, pantalla FHD a 300Hz para la mejor experiencia competitiva.",
    price: 59900,
    images: ["/asus-rog-strix.png"],
    status: "nuevo",
    availability: "disponible",
    category: "laptops",
    specs: {
      Procesador: "AMD Ryzen 9 5900HX",
      Gráfica: "NVIDIA RTX 3070 8GB",
      Memoria: "16GB DDR4",
      Pantalla: "15.6\" FHD 300Hz",
    },
  },
  {
    id: "prod-3",
    name: "XBOX Series S 512GB",
    description: "Consola Xbox 100% digital de nueva generación. Velocidad y rendimiento excepcionales en el chasis de Xbox más pequeño.",
    price: 19500,
    images: ["https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=600&q=80"],
    status: "nuevo",
    availability: "disponible",
    category: "consolas",
    specs: {
      Almacenamiento: "512GB SSD NVMe",
      Resolución: "1440p hasta 120 FPS",
      Arquitectura: "Xbox Velocity",
    },
  },
  {
    id: "prod-4",
    name: "Control Inalámbrico DualSense (PS5)",
    description: "Control oficial para PlayStation 5 con retroalimentación háptica y gatillos adaptativos en su empaque original.",
    price: 2500,
    images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=600&q=80"],
    status: "nuevo",
    availability: "disponible",
    category: "accesorios",
    specs: {
      Conectividad: "Bluetooth / USB-C",
      Compatibilidad: "PS5, PC, Mobile",
      Batería: "Recargable Litio",
    },
  },
  {
    id: "prod-5",
    name: "PlayStation 4 Slim 1TB",
    description: "Consola PS4 Slim en excelentes condiciones de mantenimiento. Incluye un control DualShock 4 original y cables de alimentación.",
    price: 7500,
    images: ["/ps4-slim.png"],
    status: "usado",
    availability: "disponible",
    category: "consolas",
    specs: {
      Almacenamiento: "1TB HDD",
      Estado: "Condición 9/10",
      Controles: "1 DualShock 4 incluido",
    },
  },
  {
    id: "prod-6",
    name: "ASUS ROG Zephyrus M16 GU603ZM",
    description: "Laptop gaming premium ultra-delgada. Pantalla ROG Nebula de 16 pulgadas, procesador Intel Core i7 y gráfica RTX 3060.",
    price: 58500,
    images: ["/asus-rog-zephyrus.jpg"],
    status: "nuevo",
    availability: "bajo pedido",
    category: "laptops",
    specs: {
      Procesador: "Intel Core i7-12700H",
      Memoria: "16GB DDR5",
      GPU: "NVIDIA RTX 3060 6GB",
      Pantalla: "16\" WQXGA 165Hz",
    },
  },
  {
    id: "prod-7",
    name: "Pasta Térmica Arctic MX-7 8g",
    description: "Compuesto térmico de gama alta para disipación de calor extrema en procesadores and tarjetas gráficas.",
    price: 1500,
    images: ["/arctic-mx7.png"],
    status: "nuevo",
    availability: "bajo pedido",
    category: "componentes",
    specs: {
      Cantidad: "8 gramos",
      Conductividad: "Gama Alta",
      Uso: "CPU / GPU / Consolas",
    },
  },
  {
    id: "prod-8",
    name: "Metal Líquido Thermal Grizzly Conductonaut 1g",
    description: "Compuesto térmico de metal líquido de máxima conductividad térmica para overclocking entusiasta y consolas PS5.",
    price: 1800,
    images: ["/liquid-metal.png"],
    status: "nuevo",
    availability: "bajo pedido",
    category: "componentes",
    specs: {
      Cantidad: "1 gramo",
      Conductividad: "73 W/mk",
      Tipo: "Metal Líquido",
    },
  },
];

export async function getProducts(category?: string): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) {
    // Si no hay categoría, retornar todos. Si hay, filtrar localmente.
    if (category && category !== "todos") {
      return mockProducts.filter((p) => p.category === category);
    }
    return mockProducts;
  }

  try {
    let query = supabase.from("products").select("*");
    
    if (category && category !== "todos") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error) throw error;

    if (data && data.length > 0) {
      return data.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        images: item.images,
        status: item.status,
        availability: item.availability,
        category: item.category,
        specs: item.specs,
      }));
    }

    // Si la tabla existe pero está vacía, usar mock
    if (category && category !== "todos") {
      return mockProducts.filter((p) => p.category === category);
    }
    return mockProducts;
  } catch (error) {
    console.error("Error al obtener productos de Supabase, usando locales:", error);
    if (category && category !== "todos") {
      return mockProducts.filter((p) => p.category === category);
    }
    return mockProducts;
  }
}
