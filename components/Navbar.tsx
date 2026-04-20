import Link from "next/link";
import LoginButton from "@/components/auth/LoginButton";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link href="/" className="brand">XinnStore</Link>
        <nav className="nav-links">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/products" className="nav-link">Products</Link>
          <Link href="/check" className="nav-link">Cek Order</Link>
          <Link href="/admin" className="nav-link">Admin</Link>
        </nav>
        <LoginButton />
      </div>
    </header>
  );
}
