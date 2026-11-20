import { NextRequest, NextResponse } from "next/server";
import { getServerProductsWithMeta, saveServerProducts } from "@/lib/server-storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const { products, updatedAt, provider } = await getServerProductsWithMeta();

    let filtered = products;
    if (category && category !== "todos") {
      filtered = products.filter((p) => p.category === category);
    }

    return NextResponse.json(
      { products: filtered, serverUpdatedAt: updatedAt, provider },
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
    const { products, updatedAt } = body;

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: "Se requiere un arreglo de productos válido en 'products'" },
        { status: 400 }
      );
    }

    const timestamp = Number(updatedAt) || Date.now();
    const result = await saveServerProducts(products, timestamp);

    return NextResponse.json(
      {
        success: result.success,
        provider: result.provider,
        products,
        serverUpdatedAt: timestamp,
      },
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
