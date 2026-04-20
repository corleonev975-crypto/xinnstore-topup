
"use client";

import { useState } from "react";
import OrderSummary from "@/components/OrderSummary";
import { createTransaction } from "@/lib/transaction";

type Denom = { name: string; price: number };
type Product = {
  id: number;
  name: string;
  slug: string;
  category: string;
  denominations: Denom[];
};

const paymentMethods = ["QRIS", "DANA", "OVO", "GoPay", "Bank Transfer"];

export default function CheckoutClient({ product }: { product: Product }) {
  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [selectedDenom, setSelectedDenom] = useState<Denom | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [result, setResult] = useState<{ id: string; status: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const disabled = !userId || !selectedDenom || !paymentMethod || loading;

  async function handleCheckout() {
    if (disabled || !selectedDenom) return;
    setLoading(true)

    const response = await createTransaction({
      productSlug: product.slug,
      productName: product.name,
      userId,
      zoneId,
      denominationName: selectedDenom.name,
      price: selectedDenom.price,
      paymentMethod,
    });
    setResult({ id: response.id, status: response.status });
    setLoading(false);
  }

  return (
    <main className="section">
      <div className="container">
        <h1 className="section-title">{product.name}</h1>
        <div className="two-col">
          <div className="card">
            <div className="field">
              <label>User ID</label>
              <input className="input" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Masukkan User ID" />
            </div>

            <div className="field">
              <label>Zone ID (opsional)</label>
              <input className="input" value={zoneId} onChange={(e) => setZoneId(e.target.value)} placeholder="Masukkan Zone ID" />
            </div>

            <div className="field">
              <label>Pilih Nominal</label>
              <div className="list">
                {product.denominations.map((denom) => (
                  <button
                    key={denom.name}
                    type="button"
                    className={`denom-btn ${selectedDenom?.name === denom.name ? "active" : ""}`}
                    onClick={() => setSelectedDenom(denom)}
                  >
                    {denom.name} — Rp {denom.price.toLocaleString("id-ID")}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Metode Pembayaran</label>
              <select className="select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="">Pilih metode pembayaran</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            <button className="button" onClick={handleCheckout} disabled={disabled} style={{ opacity: disabled ? 0.6 : 1 }}>
              {loading ? "Memproses..." : "Checkout"}
            </button>

            {result && (
              <div className="card" style={{ marginTop: 16 }}>
                <h3 style={{ marginTop: 0 }}>Transaksi Berhasil</h3>
                <p>ID Transaksi: <strong>{result.id}</strong></p>
                <span className={`status ${result.status}`}>{result.status}</span>
              </div>
            )}
          </div>

          <OrderSummary
            productName={product.name}
            userId={userId}
            zoneId={zoneId}
            denomination={selectedDenom}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>
    </main>
  );
}
