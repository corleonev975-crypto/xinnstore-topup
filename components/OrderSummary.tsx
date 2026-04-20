
type Denom = { name: string; price: number };

export default function OrderSummary({
  productName,
  userId,
  zoneId,
  denomination,
  paymentMethod,
}: {
  productName?: string;
  userId?: string;
  zoneId?: string;
  denomination?: Denom | null;
  paymentMethod?: string;
}) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Ringkasan Order</h3>
      <div className="summary-item"><span>Produk</span><strong>{productName || "-"}</strong></div>
      <div className="summary-item"><span>User ID</span><strong>{userId || "-"}</strong></div>
      <div className="summary-item"><span>Zone ID</span><strong>{zoneId || "-"}</strong></div>
      <div className="summary-item"><span>Nominal</span><strong>{denomination?.name || "-"}</strong></div>
      <div className="summary-item"><span>Pembayaran</span><strong>{paymentMethod || "-"}</strong></div>
      <div className="summary-item" style={{ borderBottom: 0 }}>
        <span>Total</span><strong>{denomination ? `Rp ${denomination.price.toLocaleString("id-ID")}` : "-"}</strong>
      </div>
    </div>
  );
}
