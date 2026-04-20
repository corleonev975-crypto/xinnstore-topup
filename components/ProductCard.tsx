import Link from "next/link";

export default function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/product/${product.slug}`} className="card product-card">
      <div className="row" style={{ marginBottom: 12 }}>
        <strong>{product.name}</strong>
        <span className="badge">{product.category}</span>
      </div>
      <div className="small">Supplier SKU: {product.buyer_sku_code}</div>
      <div className="row" style={{ marginTop: 12 }}>
        <div>
          <div className="small">Harga jual</div>
          <strong>Rp {product.sell_price.toLocaleString("id-ID")}</strong>
        </div>
        <span className="btn secondary">Top Up</span>
      </div>
    </Link>
  );
}
