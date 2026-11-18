import fs from "fs";
import path from "path";
import { Product, InventoryMovement } from "@/types";
import { initialProducts } from "@/services/products";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

function getDataFilePath(filename: string): string {
  const standardDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(standardDir)) {
    try {
      fs.mkdirSync(standardDir, { recursive: true });
    } catch {
      // In serverless environments where cwd is read-only, fallback to /tmp
      const tmpDir = path.join("/tmp", "techcarerd-data");
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      return path.join(tmpDir, filename);
    }
  }
  return path.join(standardDir, filename);
}

// In-memory cache for lightning-fast responses
let memoryProducts: Product[] | null = null;
let memoryMovements: InventoryMovement[] | null = null;

export async function getServerProducts(): Promise<Product[]> {
  // 1. If Supabase is configured, try Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (!error && data && data.length > 0) {
        return data.map((item) => ({
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
      }
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to disk/memory storage:", e);
    }
  }

  // 2. Read from disk
  const filePath = getDataFilePath("inventory.json");
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryProducts = parsed;
        return parsed;
      }
    } catch (e) {
      console.error("Error reading inventory file:", e);
    }
  }

  // 3. Fallback: Initialize with initialProducts
  if (memoryProducts && memoryProducts.length > 0) {
    return memoryProducts;
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify(initialProducts, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write initial inventory to disk:", e);
  }

  memoryProducts = initialProducts;
  return initialProducts;
}

export async function saveServerProducts(products: Product[]): Promise<boolean> {
  memoryProducts = products;

  // 1. If Supabase is configured, sync to Supabase
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
      if (error) console.error("Error saving to Supabase:", error);
    } catch (e) {
      console.error("Supabase upsert exception:", e);
    }
  }

  // 2. Save to disk
  try {
    const filePath = getDataFilePath("inventory.json");
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("Error saving inventory to disk:", e);
    return false;
  }
}

export async function getServerMovements(): Promise<InventoryMovement[]> {
  const filePath = getDataFilePath("movements.json");
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        memoryMovements = parsed;
        return parsed;
      }
    } catch (e) {
      console.error("Error reading movements file:", e);
    }
  }

  if (memoryMovements) return memoryMovements;
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
    const filePath = getDataFilePath("movements.json");
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("Error recording movement to disk:", e);
  }

  return newMovement;
}
