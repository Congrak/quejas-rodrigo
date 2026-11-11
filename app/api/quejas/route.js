import { NextResponse } from "next/server";
import { guardarQueja, leerQuejas, contarQuejas, borrarQueja } from "@/lib/db";

export const dynamic = "force-dynamic";

const corta = (v, n) => String(v ?? "").slice(0, n);

function autorizado(req) {
  const pass = process.env.ADMIN_PASSWORD;
  return pass && req.headers.get("x-admin-password") === pass;
}

// GET: public count, or the full list with the admin password
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("solo") === "contador") {
    return NextResponse.json({ total: await contarQuejas() });
  }
  if (!autorizado(req)) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }
  try {
    return NextResponse.json({ quejas: await leerQuejas() });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.queja || String(body.queja).trim().length < 3) {
      return NextResponse.json({ error: "La queja está vacía" }, { status: 400 });
    }
    const queja = {
      id: crypto.randomUUID(),
      ticket: "RDG-" + Math.floor(100000 + Math.random() * 900000),
      categoria: corta(body.categoria, 100),
      intensidad: Math.max(1, Math.min(10, Number(body.intensidad) || 5)),
      queja: corta(body.queja, 3000),
      castigo: corta(body.castigo, 100),
      firma: corta(body.firma, 80),
      fecha: new Date().toISOString(),
    };
    const total = await guardarQueja(queja);
    return NextResponse.json({ ok: true, ticket: queja.ticket, total });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!autorizado(req)) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }
  const { id } = await req.json();
  return NextResponse.json({ ok: await borrarQueja(id) });
}
