import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Product, InventoryMovement } from "@/types";

// Los 19 artículos reales del inventario de TechCareRD
export const initialProducts: Product[] = [
  // --- LAPTOPS ---
  {
    id: "prod-laptop-1",
    name: "ASUS ROG Zephyrus G14 Gaming",
    description: "Laptop gaming ultraportable y para creadores. Potencia gráfica excepcional con refrigeración líquida y pantalla premium de alta tasa de refresco.",
    price: 58500,
    images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80"],
    status: "usado",
    availability: "disponible",
    category: "laptops",
    stock: 1,
    specs: {
      Procesador: "AMD Ryzen 7 5800HS",
      Gráfica: "NVIDIA GeForce RTX 3060 6GB",
      Memoria: "40GB RAM DDR4",
      Almacenamiento: "1TB SSD NVMe",
    },
  },
  {
    id: "prod-laptop-2",
    name: "HP ProBook 450 G8 (Core i7 11th)",
    description: "Laptop corporativa de alta durabilidad con chasis de aluminio, ideal para oficina, programación y multitarea intensiva.",
    price: 26500,
    images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80"],
    status: "usado",
    availability: "disponible",
    category: "laptops",
    stock: 1,
    specs: {
      Procesador: "Intel Core i7 11va Gen",
      Memoria: "8GB RAM DDR4 (Expandible)",
      Almacenamiento: "512GB SSD NVMe",
      Pantalla: "15.6\" FHD Antirreflejo",
    },
  },
  {
    id: "prod-laptop-3",
    name: "Apple MacBook Pro 13\" 2020 Space Gray",
    description: "MacBook Pro con pantalla Retina True Tone, Touch Bar multifunción, Touch ID y teclado Magic Keyboard en excelente estado estético.",
    price: 34900,
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"],
    status: "usado",
    availability: "disponible",
    category: "laptops",
    stock: 1,
    specs: {
      Procesador: "Intel Core i5 Quad-Core",
      Memoria: "8GB RAM LPDDR4X",
      Almacenamiento: "256GB SSD Ultrarrápido",
      Pantalla: "13.3\" Retina True Tone",
    },
  },

  // --- CONSOLAS ---
  {
    id: "prod-ps-1",
    name: "PlayStation 5 Slim (Edición con Disco) 1TB",
    description: "Consola PS5 Slim con lector físico de discos Blu-ray Ultra HD. Chasis reducido con 1TB de almacenamiento SSD y retrocompatibilidad total.",
    price: 32500,
    images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80"],
    status: "nuevo",
    availability: "disponible",
    category: "consolas",
    stock: 1,
    specs: {
      Almacenamiento: "1TB SSD NVMe",
      Lector: "Disco Blu-Ray 4K Ultra HD",
      Rendimiento: "Hasta 4K @ 120 FPS",
      Audio: "Tempest 3D AudioTech",
    },
  },
  {
    id: "prod-ps-2",
    name: "PlayStation 5 Fat (Chasis Original Disco) 1TB",
    description: "Consola PS5 con lector de discos, excelente refrigeración y mantenimiento de metal líquido verificado en taller. 100% garantizada.",
    price: 27900,
    images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"],
    status: "usado",
    availability: "disponible",
    category: "consolas",
    stock: 1,
    specs: {
      Almacenamiento: "825GB / 1TB SSD",
      Lector: "Blu-Ray 4K Ultra HD",
      Estado: "Condición 9.5/10",
      Incluye: "Control DualSense y cables",
    },
  },
  {
    id: "prod-ps-3",
    name: "PlayStation 4 Slim 512GB",
    description: "Consola PS4 Slim totalmente optimizada con pasta térmica de alta conductividad recién aplicada. Ultra silenciosa y lista para jugar.",
    price: 8500,
    images: ["https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=800&q=80"],
    status: "usado",
    availability: "disponible",
    category: "consolas",
    stock: 1,
    specs: {
      Almacenamiento: "512GB / 500GB HDD",
      Mantenimiento: "Pasta térmica recién cambiada",
      Incluye: "1 Control DualShock 4 original",
      Garantía: "3 meses directa en taller",
    },
  },

  // --- ACCESORIOS ---
  {
    id: "prod-ctrl-1",
    name: "Control Inalámbrico DualSense (PlayStation 5)",
    description: "Control original oficial Sony DualSense para PS5. Gatillos adaptativos dinámicos, vibración háptica inmersiva y micrófono integrado.",
    price: 2700,
    images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80"],
    status: "nuevo",
    availability: "disponible",
    category: "accesorios",
    stock: 10,
    specs: {
      Conectividad: "Bluetooth 5.1 / USB-C",
      Compatibilidad: "PS5, PC, iOS, Android",
      Batería: "Recargable Litio integrada",
      Gatillos: "Hápticos Adaptativos",
    },
  },
  {
    id: "prod-ctrl-2",
    name: "Control Inalámbrico DualShock 4 (PlayStation 4)",
    description: "Control original para PS4 con panel táctil capacitivo, altavoz integrado, conector de auriculares de 3.5 mm y barra luminosa frontal.",
    price: 1450,
    images: ["https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?auto=format&fit=crop&w=800&q=80"],
    status: "nuevo",
    availability: "disponible",
    category: "accesorios",
    stock: 1,
    specs: {
      Compatibilidad: "PS4 y PC",
      Conectividad: "Bluetooth / Micro-USB",
      Color: "Jet Black",
    },
  },

  // --- ALMACENAMIENTO (COMPONENTES) ---
  {
    id: "prod-ssd-1",
    name: "SSD NVMe M.2 128GB (Formato 2280)",
    description: "Unidad de estado sólido ultrarrápida ideal para acelerar el arranque de Windows y programas en laptops o PCs de escritorio.",
    price: 950,
    images: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80"],
    status: "nuevo",
    availability: "disponible",
    category: "componentes",
    stock: 1,
    specs: {
      Capacidad: "128GB",
      "Factor de Forma": "M.2 2280",
      Interfaz: "PCIe NVMe Gen3",
    },
  },
  {
    id: "prod-ssd-2",
    name: "SSD NVMe M.2 512GB (Formato 2280)",
    description: "Almacenamiento de alta velocidad para juegos, arranque instantáneo y transferencia rápida de datos en laptops, PCs y PS5.",
    price: 2400,
    images: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80"],
    status: "nuevo",
    availability: "disponible",
    category: "componentes",
    stock: 1,
    specs: {
      Capacidad: "512GB",
      "Factor de Forma": "M.2 2280",
      Interfaz: "PCIe NVMe de alta velocidad",
    },
  },
  {
    id: "prod-ssd-3",
    name: "SSD NVMe M.2 1TB (Formato 2280)",
    description: "Máxima capacidad y velocidad para consolas PlayStation 5, gaming rigs y laptops de alto rendimiento. Tasa de lectura extrema.",
    price: 4500,
    images: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80"],
    status: "nuevo",
    availability: "disponible",
    category: "componentes",
    stock: 1,
    specs: {
      Capacidad: "1TB (1000GB)",
      "Factor de Forma": "M.2 2280",
      Interfaz: "PCIe NVMe Gen4 / Gen3",
    },
  },
  {
    id: "prod-hdd-1",
    name: "Disco Duro Western Digital SATA 320GB",
    description: "Disco duro mecánico Western Digital de bajo consumo para almacenamiento secundario, copias de seguridad o consolas PS3/PS4.",
    price: 750,
    images: ["https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80"],
    status: "usado",
    availability: "disponible",
    category: "componentes",
    stock: 1,
    specs: {
      Marca: "Western Digital (WD)",
      Capacidad: "320GB",
      Interfaz: "SATA 3.0 (3 Gb/s / 6 Gb/s)",
    },
  },
  {
    id: "prod-hdd-2",
    name: "Disco Duro Seagate SATA 500GB",
    description: "Disco duro de 500GB con salud al 100% certificada en taller. Ideal para reemplazo de almacenamiento en laptops y consolas.",
    price: 1150,
    images: ["https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80"],
    status: "usado",
    availability: "disponible",
    category: "componentes",
    stock: 1,
    specs: {
      Marca: "Seagate",
      Capacidad: "500GB",
      Interfaz: "SATA 6Gb/s",
      Salud: "100% SMART OK",
    },
  },
  {
    id: "prod-hdd-3",
    name: "Disco Duro Western Digital SATA 1TB",
    description: "Almacenamiento masivo WD de 1TB para respaldos, almacenamiento de juegos pesados y librerías de video.",
    price: 2200,
    images: ["https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80"],
    status: "usado",
    availability: "disponible",
    category: "componentes",
    stock: 1,
    specs: {
      Marca: "Western Digital (WD)",
      Capacidad: "1TB (1000GB)",
      Interfaz: "SATA 6Gb/s",
    },
  },

  // --- MEMORIAS RAM (COMPONENTES) ---
  {
    id: "prod-ram-1",
    name: "Memoria RAM Laptop SODIMM 4GB DDR4",
    description: "Módulo de memoria para laptops de 4GB DDR4. Ideal para optimización básica, navegación fluida y ofimática.",
    price: 650,
    images: ["https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80"],
    status: "nuevo",
    availability: "disponible",
    category: "componentes",
    stock: 3,
    specs: {
      Tipo: "SODIMM Laptop",
      Capacidad: "4GB",
      Tecnología: "DDR4",
    },
  },
  {
    id: "prod-ram-2",
    name: "Memoria RAM Laptop SODIMM 16GB DDR4",
    description: "Módulo de 16GB DDR4 de alto rendimiento para portátiles gaming, edición de video y multitarea pesada sin congelamientos.",
    price: 2600,
    images: ["https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80"],
    status: "nuevo",
    availability: "disponible",
    category: "componentes",
    stock: 2,
    specs: {
      Tipo: "SODIMM Laptop",
      Capacidad: "16GB",
      Tecnología: "DDR4 3200MHz",
    },
  },
  {
    id: "prod-ram-3",
    name: "Memoria RAM Laptop SODIMM 32GB DDR4",
    description: "Módulo individual de 32GB DDR4 para estaciones de trabajo móviles, ingeniería, render 3D y virtualización exigente.",
    price: 4800,
    images: ["https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80"],
    status: "nuevo",
    availability: "disponible",
    category: "componentes",
    stock: 1,
    specs: {
      Tipo: "SODIMM Laptop",
      Capacidad: "32GB",
      Tecnología: "DDR4 3200MHz",
    },
  },
  {
    id: "prod-ram-4",
    name: "Memoria RAM Laptop SODIMM 8GB DDR5",
    description: "Memoria de nueva generación DDR5 para laptops modernas (Intel 12va/13va/14va gen y AMD Ryzen serie 6000/7000/8000).",
    price: 1950,
    images: ["https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80"],
    status: "nuevo",
    availability: "disponible",
    category: "componentes",
    stock: 2,
    specs: {
      Tipo: "SODIMM Laptop",
      Capacidad: "8GB",
      Tecnología: "DDR5 4800 / 5600 MHz",
    },
  },
  {
    id: "prod-ram-5",
    name: "Memoria RAM Laptop SODIMM 16GB DDR5",
    description: "Módulo DDR5 de 16GB de altísima frecuencia y baja latencia para laptops gaming de última generación.",
    price: 3400,
    images: ["https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80"],
    status: "nuevo",
    availability: "disponible",
    category: "componentes",
    stock: 1,
    specs: {
      Tipo: "SODIMM Laptop",
      Capacidad: "16GB",
      Tecnología: "DDR5 5600 MHz",
    },
  },
];

// Storage keys para cache de cliente
const STORAGE_KEY = "techcarerd_inventory_products";
const MOVEMENTS_KEY = "techcarerd_inventory_movements";

export function getClientProducts(): Product[] {
  if (typeof window === "undefined") return initialProducts;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return initialProducts;
    }
    return JSON.parse(stored);
  } catch {
    return initialProducts;
  }
}

export function getClientMovements(): InventoryMovement[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(MOVEMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Obtiene el inventario sincronizado desde el servidor (API /api/products).
 * Funciona para cualquier dispositivo, pestaña de incógnito o navegador en tiempo real.
 */
export async function getProducts(category?: string): Promise<Product[]> {
  // 1. Intentar obtener la versión más reciente del servidor
  if (typeof window !== "undefined") {
    try {
      const url = category && category !== "todos"
        ? `/api/products?category=${encodeURIComponent(category)}`
        : "/api/products";

      const res = await fetch(url, {
        cache: "no-store",
        headers: { "Pragma": "no-cache" },
      });

      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.products) && json.products.length > 0) {
          // Actualizamos la caché local del navegador
          try {
            if (!category || category === "todos") {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(json.products));
            }
          } catch {}
          return json.products;
        }
      }
    } catch (e) {
      console.warn("Fallo al conectar con /api/products, usando respaldo local:", e);
    }
  }

  // 2. Respaldo local si el servidor no responde o estamos offline
  const currentList = typeof window !== "undefined" ? getClientProducts() : initialProducts;
  if (category && category !== "todos") {
    return currentList.filter((p) => p.category === category);
  }
  return currentList;
}

/**
 * Guarda el inventario en el servidor central (/api/products)
 * para que todos los dispositivos e incógnitos vean los cambios inmediatamente.
 */
export async function saveProducts(products: Product[]): Promise<void> {
  // 1. Guardar en caché local inmediata y notificar
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      window.dispatchEvent(new Event("inventory_updated"));
    } catch (e) {
      console.error("Error guardando localmente:", e);
    }

    // 2. Enviar al servidor para persistencia global
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      });
    } catch (e) {
      console.error("Error persistiendo en servidor /api/products:", e);
    }
  }
}

// Alias retrocompatible
export const saveClientProducts = saveProducts;

/**
 * Obtiene los movimientos de inventario sincronizados desde el servidor.
 */
export async function getMovements(): Promise<InventoryMovement[]> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/movements", {
        cache: "no-store",
        headers: { "Pragma": "no-cache" },
      });
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.movements)) {
          try {
            localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(json.movements));
          } catch {}
          return json.movements;
        }
      }
    } catch (e) {
      console.warn("Fallo al conectar con /api/movements, usando respaldo local:", e);
    }
  }

  return getClientMovements();
}

/**
 * Registra un movimiento tanto en el servidor como localmente.
 */
export async function recordMovement(
  movement: Omit<InventoryMovement, "id" | "date">
): Promise<InventoryMovement> {
  const newMovement: InventoryMovement = {
    ...movement,
    id: "mov-" + Date.now(),
    date: new Date().toISOString(),
  };

  // Guardar en caché local
  if (typeof window !== "undefined") {
    try {
      const list = getClientMovements();
      list.unshift(newMovement);
      localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Error guardando movimiento local:", e);
    }

    // Persistir en servidor
    try {
      await fetch("/api/movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movement),
      });
    } catch (e) {
      console.error("Error persistiendo movimiento en servidor:", e);
    }
  }

  return newMovement;
}

// Alias retrocompatible
export const recordClientMovement = recordMovement;
