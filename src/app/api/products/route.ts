import { NextResponse } from "next/server";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

async function safeParseJSON(response: Response) {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization") || "";

    const response = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await safeParseJSON(response);
    return NextResponse.json(data ?? [], { status: response.status });
  } catch (error) {
    console.error("❌ Error en GET /api/products:", error);
    return NextResponse.json(
      { error: "Error interno en el servidor", message: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = request.headers.get("authorization") || "";

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const data = await safeParseJSON(response);
    return NextResponse.json(data ?? {}, { status: response.status });
  } catch (error) {
    console.error("❌ Error en POST /api/products:", error);
    return NextResponse.json(
      { error: "Error interno en el servidor", message: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const token = request.headers.get("authorization") || "";

    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const data = await safeParseJSON(response);
    return NextResponse.json(data ?? {}, { status: response.status });
  } catch (error) {
    console.error("❌ Error en PUT /api/products:", error);
    return NextResponse.json(
      { error: "Error interno en el servidor", message: String(error) },
      { status: 500 }
    );
  }
}
