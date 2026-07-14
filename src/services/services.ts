import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Service } from "@/types";

// Datos locales de demostración (mock data)
export const mockServices: Service[] = [
  {
    id: "serv-1",
    name: "Mantenimiento de PC",
    description: "Limpieza profunda de componentes, ordenamiento de cableado (cable management) y optimización de flujo de aire. Ideal para gaming o trabajo pesado.",
    price: 1300,
    iconName: "Monitor",
    estimatedTime: "24-48 horas",
  },
  {
    id: "serv-2",
    name: "Mantenimiento de Laptops",
    description: "Desarme completo, remoción de polvo en ventiladores y disipadores. Vital para evitar sobrecalentamiento y alargar la vida útil.",
    price: 1000,
    iconName: "Laptop",
    estimatedTime: "12-24 horas",
  },
  {
    id: "serv-3",
    name: "Mantenimiento de PS5",
    description: "Limpieza interna exhaustiva contra polvo y pelusas, remoción de residuos y reacondicionamiento del sistema de enfriamiento por metal líquido.",
    price: 2500,
    iconName: "Gamepad2",
    estimatedTime: "12-24 horas",
  },
  {
    id: "serv-4",
    name: "Mantenimiento de PS4",
    description: "Desarmado total, limpieza de ventilador, disipador y fuente de poder. Incluye limpieza de lector de discos.",
    price: 1000,
    iconName: "Gamepad2",
    estimatedTime: "8-12 horas",
  },
  {
    id: "serv-5",
    name: "Mantenimiento de Xbox",
    description: "Limpieza completa para consolas Xbox Series X/S y Xbox One. Limpieza del conducto de aire y disipador.",
    price: 1500,
    iconName: "Gamepad",
    estimatedTime: "12-24 horas",
  },
  {
    id: "serv-8",
    name: "Instalación de SSD",
    description: "Instalación física de unidad de estado sólido (SATA o NVMe M.2) y clonación de sistema operativo o instalación limpia para máxima velocidad.",
    price: 1200,
    iconName: "HardDrive",
    estimatedTime: "2-3 horas",
  },
  {
    id: "serv-9",
    name: "Upgrade de RAM",
    description: "Instalación y configuración de módulos de memoria RAM en laptops y PCs de escritorio para mejorar la multitarea y rendimiento en juegos.",
    price: 800,
    iconName: "Cpu",
    estimatedTime: "30-60 minutos",
  },
  {
    id: "serv-10",
    name: "Diagnóstico Técnico",
    description: "Revisión detallada de fallas físicas o de software, pruebas de estrés y generación de presupuesto formal de reparación.",
    price: 500,
    iconName: "Activity",
    estimatedTime: "1-2 días",
  },
];

export async function getServices(): Promise<Service[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockServices;
  }

  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("price", { ascending: true });

    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        iconName: item.icon_name,
        estimatedTime: item.estimated_time,
      }));
    }
    
    return mockServices;
  } catch (error) {
    console.error("Error al obtener servicios de Supabase, usando local mocks:", error);
    return mockServices;
  }
}
