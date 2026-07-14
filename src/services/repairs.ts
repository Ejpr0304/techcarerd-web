import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Order } from "@/types";

// Órdenes mock para simulación de búsqueda
const mockOrders: Record<string, Order> = {
  "TC-2026-0001": {
    id: "TC-2026-0001",
    customerName: "Juan Pérez",
    device: "PlayStation 5 Slim",
    status: "completado",
    estimatedCompletion: "Completado el 10/07/2026",
    price: 2500,
    createdAt: "2026-07-09T14:30:00Z",
  },
  "TC-2026-0002": {
    id: "TC-2026-0002",
    customerName: "María Rodríguez",
    device: "Laptop ASUS ROG Zephyrus",
    status: "en_diagnostico",
    estimatedCompletion: "15 de Julio, 2026",
    price: 1800,
    createdAt: "2026-07-12T10:15:00Z",
  },
  "TC-2026-0003": {
    id: "TC-2026-0003",
    customerName: "Carlos Gómez",
    device: "PC de Escritorio Gaming",
    status: "esperando_repuestos",
    estimatedCompletion: "Pendiente (Arribo de ventilador)",
    price: 3200,
    createdAt: "2026-07-11T09:00:00Z",
  },
};

export async function trackOrder(orderId: string): Promise<Order | null> {
  const formattedId = orderId.trim().toUpperCase();

  if (!formattedId) return null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", formattedId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No se encontró la fila
          return null;
        }
        throw error;
      }

      if (data) {
        return {
          id: data.id,
          customerName: data.customer_name,
          device: data.device,
          status: data.status,
          estimatedCompletion: data.estimated_completion,
          price: data.price ? Number(data.price) : undefined,
          createdAt: data.created_at,
        };
      }
    } catch (err) {
      console.error("Error al buscar orden en Supabase, usando locales:", err);
    }
  }

  // Fallback a mock local
  // Simular latencia de red de 600ms
  await new Promise((resolve) => setTimeout(resolve, 600));
  return mockOrders[formattedId] || null;
}
