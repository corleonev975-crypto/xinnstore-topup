import crypto from "crypto";

const DIGI_USERNAME = process.env.DIGIFLAZZ_USERNAME!;
const DIGI_API_KEY = process.env.DIGIFLAZZ_API_KEY!;

function md5(value: string) {
  return crypto.createHash("md5").update(value).digest("hex");
}

export function digiflazzTransactionSign(refId: string) {
  return md5(`${DIGI_USERNAME}${DIGI_API_KEY}${refId}`);
}

export async function createDigiflazzTopup(args: {
  buyerSkuCode: string;
  customerNo: string;
  refId: string;
}) {
  const res = await fetch("https://api.digiflazz.com/v1/transaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: DIGI_USERNAME,
      buyer_sku_code: args.buyerSkuCode,
      customer_no: args.customerNo,
      ref_id: args.refId,
      sign: digiflazzTransactionSign(args.refId),
      testing: false
    }),
    cache: "no-store"
  });

  if (!res.ok) throw new Error("Gagal kirim order ke Digiflazz");
  return res.json();
}
