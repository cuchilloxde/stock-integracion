import { NextResponse } from "next/server";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get("authorization") || "";
    const { id } = params;

    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error deleting" },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error en DELETE /api/products/[id]:", error);
    return NextResponse.json(
      { error: "Error interno en el servidor", message: String(error) },
      { status: 500 }
    );
  }
}
