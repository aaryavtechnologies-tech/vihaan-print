import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      message: "pong",
      timestamp: new Date().toISOString(),
      service: "vihaan-print",
      url: "https://vihaan-print.onrender.com",
    },
    { status: 200 }
  );
}
