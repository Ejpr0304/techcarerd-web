import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { ContactMessage } from "@/types";

// Función básica para sanitizar campos de texto contra XSS simple
function sanitizeInput(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export async function submitContactMessage(
  message: Omit<ContactMessage, "id" | "createdAt">
): Promise<{ success: boolean; error?: string }> {
  // Validar y sanitizar entradas
  const sanitizedMessage: Omit<ContactMessage, "id" | "createdAt"> = {
    name: sanitizeInput(message.name.trim()),
    phone: sanitizeInput(message.phone.trim()),
    email: message.email ? sanitizeInput(message.email.trim()) : undefined,
    deviceType: sanitizeInput(message.deviceType),
    serviceType: sanitizeInput(message.serviceType),
    message: sanitizeInput(message.message.trim()),
  };

  // Validación básica del lado del servidor/servicio
  if (!sanitizedMessage.name || !sanitizedMessage.phone || !sanitizedMessage.deviceType || !sanitizedMessage.message) {
    return { success: false, error: "Por favor, completa todos los campos requeridos." };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("contact_messages").insert([
        {
          name: sanitizedMessage.name,
          phone: sanitizedMessage.phone,
          email: sanitizedMessage.email || null,
          device_type: sanitizedMessage.deviceType,
          service_type: sanitizedMessage.serviceType,
          message: sanitizedMessage.message,
          status: "nuevo",
        },
      ]);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error("Error al guardar mensaje en Supabase:", err);
      const errorMessage = err instanceof Error ? err.message : "Error al enviar mensaje a la base de datos.";
      return { success: false, error: errorMessage };
    }
  }

  // Simulación local en desarrollo si Supabase no está conectado
  console.log("Simulando envío de mensaje (Supabase desconectado):", sanitizedMessage);
  
  // Simular retraso de red de 800ms
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  return { success: true };
}
