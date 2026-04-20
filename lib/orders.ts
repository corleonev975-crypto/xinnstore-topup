import { supabaseAdmin } from "@/lib/supabase-server";
import { calculateProfit } from "@/lib/pricing";

export async function getActiveProducts() {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

export async function getOrderByCode(orderCode: string) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("order_code", orderCode)
    .single();
  if (error) return null;
  return data;
}

export async function addOrderEvent(orderId: string, source: string, eventType: string, payload: any) {
  await supabaseAdmin.from("order_events").insert({
    order_id: orderId,
    source,
    event_type: eventType,
    payload,
  });
}

export async function createOrder(args: {
  orderCode: string;
  userId?: string | null;
  product: any;
  customerNo: string;
  zoneId?: string;
  paymentProvider: string;
  paymentFee?: number;
}) {
  const paymentFee = args.paymentFee ?? 0;
  const { grossProfit, netProfit } = calculateProfit({
    sellPrice: args.product.sell_price,
    baseCost: args.product.base_cost,
    paymentFee,
  });

  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert({
      order_code: args.orderCode,
      user_id: args.userId ?? null,
      product_id: args.product.id,
      product_name: args.product.name,
      buyer_sku_code: args.product.buyer_sku_code,
      customer_no: args.customerNo,
      zone_id: args.zoneId ?? null,
      payment_provider: args.paymentProvider,
      payment_status: "awaiting_payment",
      fulfillment_status: "queued",
      base_cost: args.product.base_cost,
      sell_price: args.product.sell_price,
      payment_fee: paymentFee,
      gross_profit: grossProfit,
      net_profit: netProfit,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrderStatus(orderCode: string, patch: Record<string, any>) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("order_code", orderCode)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
