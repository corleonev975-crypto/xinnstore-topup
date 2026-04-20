import { createDigiflazzTopup } from "@/lib/digiflazz";
import { addOrderEvent, getOrderByCode, updateOrderStatus } from "@/lib/orders";

export async function fulfillPaidOrder(orderCode: string) {
  const order = await getOrderByCode(orderCode);
  if (!order) throw new Error("Order tidak ditemukan");

  const customerNo = order.zone_id ? `${order.customer_no}${order.zone_id}` : order.customer_no;
  const response = await createDigiflazzTopup({
    buyerSkuCode: order.buyer_sku_code,
    customerNo,
    refId: order.order_code,
  });

  await addOrderEvent(order.id, "digiflazz", "create", response);

  const supplierStatus = response?.data?.status || response?.status || "pending";
  const lower = String(supplierStatus).toLowerCase();

  if (lower == "sukses") {
    return updateOrderStatus(order.order_code, {
      fulfillment_status: "success",
      supplier_status: supplierStatus,
      raw_supplier: response,
      sn: response?.data?.sn ?? null,
    });
  }

  if (lower == "gagal") {
    return updateOrderStatus(order.order_code, {
      fulfillment_status: "failed",
      supplier_status: supplierStatus,
      raw_supplier: response,
    });
  }

  return updateOrderStatus(order.order_code, {
    fulfillment_status: "processing",
    supplier_status: supplierStatus,
    raw_supplier: response,
  });
}
