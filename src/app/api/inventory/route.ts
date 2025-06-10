import { NextResponse } from "next/server";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/inventory`;

export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization") || "";

    const response = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("❌ Error en GET /api/inventory:", error);
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

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("❌ Error en POST /api/inventory:", error);
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

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("❌ Error en PUT /api/inventory:", error);
    return NextResponse.json(
      { error: "Error interno en el servidor", message: String(error) },
      { status: 500 }
    );
  }
}
