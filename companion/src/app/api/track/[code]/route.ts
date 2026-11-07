import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;
  if (!uuidPattern.test(code)) {
    return NextResponse.json({ error: "That tracking code doesn’t look right." }, { status: 400 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Order tracking isn’t configured yet. Please contact us on WhatsApp." },
      { status: 503 },
    );
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id,order_reference,status,status_note,estimated_delivery,updated_at")
    .eq("tracking_code", code)
    .maybeSingle();

  if (orderError) {
    console.error("Order tracking lookup failed:", orderError.message);
    return NextResponse.json(
      { error: "We couldn’t check your order right now. Please try again shortly." },
      { status: 500 },
    );
  }

  if (!order) {
    return NextResponse.json(
      { error: "No order was found for that code. Check it and try again." },
      { status: 404 },
    );
  }

  const { data: updates, error: updatesError } = await supabase
    .from("order_updates")
    .select("status,note,created_at")
    .eq("order_id", order.id)
    .order("created_at", { ascending: false });

  if (updatesError) {
    console.error("Order status history lookup failed:", updatesError.message);
    return NextResponse.json(
      { error: "We couldn’t check your order right now. Please try again shortly." },
      { status: 500 },
    );
  }

  const statusUpdates = updates.map((update) => ({
    status: update.status,
    note: update.note,
    createdAt: update.created_at,
  }));

  return NextResponse.json(
    {
      order: {
        reference: order.order_reference,
        status: order.status,
        statusNote: order.status_note || "",
        estimatedDelivery: order.estimated_delivery,
        updatedAt: order.updated_at,
        updates: statusUpdates,
      },
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
