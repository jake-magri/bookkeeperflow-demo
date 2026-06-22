import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);

  return NextResponse.json({
    ok: true,
    receivedAt: new Date().toISOString(),
    message: "Webhook received. In production this would log an automation event and update document request status.",
    payload
  });
}
