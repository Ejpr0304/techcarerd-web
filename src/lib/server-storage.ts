import fs from "fs";
import path from "path";
import { Product, InventoryMovement } from "@/types";
import { initialProducts } from "@/services/products";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// 1. Detección de Vercel KV / Upstash Redis
const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
const isKvConfigured = Boolean(kvUrl && kvToken);

export type StorageProvider = "supabase" | "kv" | "disk" | "memory";

export function getActiveStorageProvider(): StorageProvider {
  if (isKvConfigured) return "kv";
  if (isSupabaseConfigured) return "supabase";
  return isDiskWritable() ? "disk" : "memory";
}

function isDiskWritable(): boolean {
  try {
    const standardDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(standardDir)) {
      fs.mkdirSync(standardDir, { recursive: true });
    }
    const testFile = path.join(standardDir, ".write-test-" + Date.now());
    fs.writeFileSync(testFile, "ok");
    fs.unlinkSync(testFile);
    return true;
  } catch {
    return false;
  }
}

function getStoragePaths(filename: string): { readPath: string; writePath: string } {
  const standardDir = path.join(process.cwd(), "data");
  const standardPath = path.join(standardDir, filename);

  if (isDiskWritable()) {
    return { readPath: standardPath, writePath: standardPath };
  }

  // Fallback para entornos Serverless de solo lectura (Vercel)
  const tmpDir = path.join("/tmp", "techcarerd-data");
  if (!fs.existsSync(tmpDir)) {
    try {
      fs.mkdirSync(tmpDir, { recursive: true });
    } catch {}
  }
  const tmpPath = path.join(tmpDir, filename);

  return {
    readPath: fs.existsSync(tmpPath) ? tmpPath : standardPath,
    writePath: tmpPath,
  };
}

// Memoria caché
let memoryProducts: Product[] | null = null;
let memoryMovements: InventoryMovement[] | null = null;
let lastServerUpdate: number = Date.now();

// --- OPERACIONES CON VERCEL KV / UPSTASH REST ---
async function getKvData<T>(key: string): Promise<T | null> {
  if (!isKvConfigured) return null;
  try {
    const res = await fetch(`${kvUrl}/get/${key}`, {
      headers: { Authorization: `Bearer ${kvToken}` },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.result) {
        return typeof data.result === "string" ? JSON.parse(data.result) : data.result;
      }
    }
  } catch (e) {
    console.error(`Error leyendo clave ${key} de Vercel KV:`, e);
  }
  return null;
}

async function setKvData<T>(key: string, value: T): Promise<boolean> {
  if (!isKvConfigured) return false;
  try {
    const res = await fetch(`${kvUrl}/set/${key}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${kvToken}`,
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(value),
    });
    return res.ok;
  } catch (e) {
    console.error(`Error guardando clave ${key} en Vercel KV:`, e);
    return false;
  }
}

// --- PRODUCTOS ---
export async function getServerProductsWithMeta(): Promise<{
  products: Product[];
  updatedAt: number;
  provider: StorageProvider;
}> {
  const provider = getActiveStorageProvider();

  // 1. Si Vercel KV / Upstash está configurado (1 clic en Vercel Storage)
  if (isKvConfigured) {
    const kvResult = await getKvData<{ products: Product[]; updatedAt: number }>("techcarerd_inventory");
    if (kvResult && Array.isArray(kvResult.products) && kvResult.products.length > 0) {
      memoryProducts = kvResult.products;
      lastServerUpdate = kvResult.updatedAt || Date.now();
      return { products: kvResult.products, updatedAt: lastServerUpdate, provider: "kv" };
    }
  }

  // 2. Si Supabase está configurado
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (!error && data && data.length > 0) {
        const mapped = data.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          images: item.images || [],
          status: item.status,
          availability: item.availability,
          category: item.category,
          specs: item.specs,
          stock: item.stock !== undefined ? Number(item.stock) : 1,
        }));
        memoryProducts = mapped;
        return { products: mapped, updatedAt: lastServerUpdate, provider: "supabase" };
      }
    } catch (e) {
      console.warn("Supabase fetch falló, utilizando almacenamiento local:", e);
    }
  }

  // 3. Si ya está en memoria viva
  if (memoryProducts && memoryProducts.length > 0) {
    return { products: memoryProducts, updatedAt: lastServerUpdate, provider };
  }

  // 4. Leer de disco (localhost o archivo inicial empaquetado)
  const { readPath, writePath } = getStoragePaths("inventory.json");
  if (fs.existsSync(readPath)) {
    try {
      const content = fs.readFileSync(readPath, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryProducts = parsed;
        return { products: parsed, updatedAt: lastServerUpdate, provider };
      }
    } catch (e) {
      console.error("Error leyendo archivo de inventario:", e);
    }
  }

  // 5. Inicializar con plantilla oficial de 19 artículos
  try {
    fs.writeFileSync(writePath, JSON.stringify(initialProducts, null, 2), "utf-8");
  } catch (e) {
    console.warn("No se pudo escribir inventario inicial en disco:", e);
  }

  memoryProducts = initialProducts;
  return { products: initialProducts, updatedAt: lastServerUpdate, provider };
}

export async function getServerProducts(): Promise<Product[]> {
  const meta = await getServerProductsWithMeta();
  return meta.products;
}

export async function saveServerProducts(
  products: Product[],
  clientTimestamp?: number
): Promise<{ success: boolean; provider: StorageProvider }> {
  memoryProducts = products;
  lastServerUpdate = clientTimestamp || Date.now();
  const provider = getActiveStorageProvider();

  // 1. Guardar en Vercel KV / Upstash si está activo
  if (isKvConfigured) {
    const saved = await setKvData("techcarerd_inventory", {
      products,
      updatedAt: lastServerUpdate,
    });
    if (saved) return { success: true, provider: "kv" };
  }

  // 2. Guardar en Supabase si está activo
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("products").upsert(
        products.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          images: p.images,
          status: p.status,
          availability: p.availability,
          category: p.category,
          specs: p.specs,
          stock: p.stock,
          updated_at: new Date().toISOString(),
        }))
      );
      if (!error) return { success: true, provider: "supabase" };
      console.error("Error guardando en Supabase:", error);
    } catch (e) {
      console.error("Excepción en upsert de Supabase:", e);
    }
  }

  // 3. Guardar en disco (localhost o /tmp)
  try {
    const { writePath } = getStoragePaths("inventory.json");
    fs.writeFileSync(writePath, JSON.stringify(products, null, 2), "utf-8");
    return { success: true, provider: isDiskWritable() ? "disk" : "memory" };
  } catch (e) {
    console.error("Error guardando inventario en disco:", e);
    return { success: false, provider: "memory" };
  }
}

// --- MOVIMIENTOS ---
export async function getServerMovements(): Promise<InventoryMovement[]> {
  if (isKvConfigured) {
    const kvMovs = await getKvData<InventoryMovement[]>("techcarerd_movements");
    if (Array.isArray(kvMovs)) {
      memoryMovements = kvMovs;
      return kvMovs;
    }
  }

  if (memoryMovements) return memoryMovements;

  const { readPath } = getStoragePaths("movements.json");
  if (fs.existsSync(readPath)) {
    try {
      const content = fs.readFileSync(readPath, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        memoryMovements = parsed;
        return parsed;
      }
    } catch (e) {
      console.error("Error leyendo movimientos:", e);
    }
  }

  return [];
}

export async function recordServerMovement(
  movement: Omit<InventoryMovement, "id" | "date">
): Promise<InventoryMovement> {
  const newMovement: InventoryMovement = {
    ...movement,
    id: "mov-" + Date.now(),
    date: new Date().toISOString(),
  };

  const list = await getServerMovements();
  list.unshift(newMovement);
  memoryMovements = list;

  if (isKvConfigured) {
    await setKvData("techcarerd_movements", list);
  }

  try {
    const { writePath } = getStoragePaths("movements.json");
    fs.writeFileSync(writePath, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("Error registrando movimiento en disco:", e);
  }

  return newMovement;
}
