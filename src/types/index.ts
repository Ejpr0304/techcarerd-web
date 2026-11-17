export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  iconName: string;
  estimatedTime: string;
}

export type ProductStatus = "nuevo" | "usado";
export type ProductAvailability = "disponible" | "agotado" | "bajo pedido";
export type ProductCategory = "consolas" | "laptops" | "componentes" | "accesorios";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  status: ProductStatus;
  availability: ProductAvailability;
  category: ProductCategory;
  specs?: Record<string, string>;
  stock: number;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: "entrada" | "salida";
  quantity: number;
  reason: string;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  deviceType: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  deviceType: string;
  serviceType: string;
  message: string;
  createdAt?: string;
}

export type OrderStatus = "recibido" | "en_diagnostico" | "esperando_repuestos" | "completado";

export interface Order {
  id: string; // Order number (e.g., TC-2026-001)
  customerName: string;
  device: string;
  status: OrderStatus;
  estimatedCompletion?: string;
  price?: number;
  createdAt: string;
}
