import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-server";
import StatusPill from "@/components/StatusPill";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <main className="section"><div className="container"><div className="card">Login Google dulu untuk buka admin.</div></div></main>;
  }

  const role = (session.user as any).role;
  if (role !== "admin") {
    return <main className="section"><div className="container"><div className="card">Akun ini bukan admin.</div></div></main>;
  }

  const { data: items } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(30);

  const orders = items ?? [];
  const totalOrders = orders.length;
  const gmv = orders.reduce((a: number, b: any) => a + (b.sell_price || 0), 0);
  const gross = orders.reduce((a: number, b: any) => a + (b.gross_profit || 0), 0);
  const net = orders.reduce((a: number, b: any) => a + (b.net_profit || 0), 0);

  return (
    <main className="section">
      <div className="container">
        <h1 className="section-title">Admin Dashboard</h1>
        <div className="grid" style={{ marginTop: 18 }}>
          <div className="card"><div className="small">Total Orders</div><h2>{totalOrders}</h2></div>
          <div className="card"><div className="small">GMV</div><h2>Rp {gmv.toLocaleString("id-ID")}</h2></div>
          <div className="card"><div className="small">Gross Profit</div><h2>Rp {gross.toLocaleString("id-ID")}</h2></div>
          <div className="card"><div className="small">Net Profit</div><h2>Rp {net.toLocaleString("id-ID")}</h2></div>
        </div>

        <div className="card" style={{ marginTop: 18 }}>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Produk</th>
                  <th>Payment</th>
                  <th>Fulfillment</th>
                  <th>Sell Price</th>
                  <th>Net Profit</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.order_code}</td>
                    <td>{item.product_name}</td>
                    <td><StatusPill value={item.payment_status} /></td>
                    <td><StatusPill value={item.fulfillment_status} /></td>
                    <td>Rp {item.sell_price.toLocaleString("id-ID")}</td>
                    <td>Rp {item.net_profit.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
