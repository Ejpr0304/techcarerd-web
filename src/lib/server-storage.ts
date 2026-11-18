import fs from "fs";
import path from "path";
import { Product, InventoryMovement } from "@/types";
import { initialProducts } from "@/services/products";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

function getStoragePaths(filename: string): { readPath: string; writePath: string } {
  const standardDir = path.join(process.cwd(), "data");
  const standardPath = path.join(standardDir, filename);

  // Determinar si standardDir tiene permisos de escritura (localhost) o es de solo lectura (Vercel Lambda)
  let isWritable = false;
  try {
    if (!fs.existsSync(standardDir)) {
      fs.mkdirSync(standardDir, { recursive: true });
    }
    const testFile = path.join(standardDir, ".write-test-" + Date.now());
    fs.writeFileSync(testFile, "ok");
    fs.unlinkSync(testFile);
    isWritable = true;
  } catch {
    isWritable = false;
  }

  if (isWritable) {
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

// Memoria caché persistente durante el ciclo de vida del servidor
let memoryProducts: Product[] | null = null;
let memoryMovements: InventoryMovement[] | null = null;
let lastServerUpdate: number = Date.now();

export async function getServerProductsWithMeta(): Promise<{ products: Product[]; updatedAt: number }> {
  // 1. Si Supabase está configurado en producción (Vercel), obtener de Supabase
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
        return { products: mapped, updatedAt: lastServerUpdate };
      }
    } catch (e) {
      console.warn("Supabase fetch falló, utilizando archivo local:", e);
    }
  }

  // 2. Si ya tenemos en memoria y hubo cambios recientes
  if (memoryProducts && memoryProducts.length > 0) {
    return { products: memoryProducts, updatedAt: lastServerUpdate };
  }

  // 3. Leer de disco (local o /tmp)
  const { readPath, writePath } = getStoragePaths("inventory.json");
  if (fs.existsSync(readPath)) {
    try {
      const content = fs.readFileSync(readPath, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryProducts = parsed;
        return { products: parsed, updatedAt: lastServerUpdate };
      }
    } catch (e) {
      console.error("Error leyendo archivo de inventario:", e);
    }
  }

  // 4. Inicializar con la plantilla oficial de 19 artículos
  try {
    fs.writeFileSync(writePath, JSON.stringify(initialProducts, null, 2), "utf-8");
  } catch (e) {
    console.warn("No se pudo escribir inventario inicial en disco:", e);
  }

  memoryProducts = initialProducts;
  return { products: initialProducts, updatedAt: lastServerUpdate };
}

export async function getServerProducts(): Promise<Product[]> {
  const meta = await getServerProductsWithMeta();
  return meta.products;
}

export async function saveServerProducts(products: Product[], clientTimestamp?: number): Promise<boolean> {
  memoryProducts = products;
  lastServerUpdate = clientTimestamp || Date.now();

  // 1. Sincronizar con Supabase si está activo
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
      if (error) console.error("Error guardando en Supabase:", error);
    } catch (e) {
      console.error("Excepción en upsert de Supabase:", e);
    }
  }

  // 2. Guardar en disco (directo en localhost, o /tmp en Vercel)
  try {
    const { writePath } = getStoragePaths("inventory.json");
    fs.writeFileSync(writePath, JSON.stringify(products, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("Error guardando inventario en disco:", e);
    return false;
  }
}

export async function getServerMovements(): Promise<InventoryMovement[]> {
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

  try {
    const { writePath } = getStoragePaths("movements.json");
    fs.writeFileSync(writePath, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("Error registrando movimiento en disco:", e);
  }

  return newMovement;
}
