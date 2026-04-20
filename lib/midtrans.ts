import midtransClient from "midtrans-client";

export const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
});

export function mapMidtransStatus(txStatus: string, fraudStatus?: string) {
  if (txStatus === "settlement") return "paid";
  if (txStatus === "capture" && fraudStatus === "accept") return "paid";
  if (["expire", "cancel", "deny"].includes(txStatus)) return "failed";
  return "pending";
}
