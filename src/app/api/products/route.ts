import { NextRequest, NextResponse } from "next/server";
import { getServerProducts, saveServerProducts } from "@/lib/server-storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let products = await getServerProducts();

    if (category && category !== "todos") {
      products = products.filter((p) => p.category === category);
    }

    return NextResponse.json(
      { products },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Error al obtener inventario del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { products } = body;

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: "Se requiere un arreglo de productos válido en 'products'" },
        { status: 400 }
      );
    }

    const saved = await saveServerProducts(products);

    return NextResponse.json(
      { success: saved, products },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "Error al guardar inventario en el servidor" },
      { status: 500 }
    );
  }
}
