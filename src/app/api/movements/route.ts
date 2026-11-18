import { NextRequest, NextResponse } from "next/server";
import { getServerMovements, recordServerMovement } from "@/lib/server-storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const movements = await getServerMovements();
    return NextResponse.json(
      { movements },
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
    console.error("GET /api/movements error:", error);
    return NextResponse.json(
      { error: "Error al obtener historial de movimientos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, productName, type, quantity, reason } = body;

    if (!productId || !type || !quantity) {
      return NextResponse.json(
        { error: "Datos de movimiento incompletos (productId, type, quantity requeridos)" },
        { status: 400 }
      );
    }

    const recorded = await recordServerMovement({
      productId,
      productName: productName || "Producto",
      type,
      quantity: Number(quantity),
      reason: reason || "Ajuste manual de inventario",
    });

    return NextResponse.json(
      { success: true, movement: recorded },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("POST /api/movements error:", error);
    return NextResponse.json(
      { error: "Error al registrar movimiento en el servidor" },
      { status: 500 }
    );
  }
}
