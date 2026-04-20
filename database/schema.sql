create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  name text,
  image text,
  role text not null default 'customer',
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category text not null,
  buyer_sku_code text unique not null,
  supplier text not null default 'digiflazz',
  base_cost integer not null default 0,
  markup integer not null default 0,
  sell_price integer not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_code text unique not null,
  user_id uuid,
  product_id uuid references products(id),
  product_name text not null,
  buyer_sku_code text not null,
  customer_no text not null,
  zone_id text,
  payment_provider text,
  payment_reference text,
  payment_status text not null default 'awaiting_payment',
  fulfillment_status text not null default 'queued',
  supplier_status text,
  base_cost integer not null,
  sell_price integer not null,
  payment_fee integer not null default 0,
  gross_profit integer not null default 0,
  net_profit integer not null default 0,
  sn text,
  raw_payment jsonb,
  raw_supplier jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_events (
  id bigserial primary key,
  order_id uuid references orders(id) on delete cascade,
  source text not null,
  event_type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

insert into products (name, slug, category, buyer_sku_code, base_cost, markup, sell_price)
values
('Mobile Legends 86 Diamonds', 'mobile-legends-86', 'game', 'ml86', 18000, 2000, 20000),
('Free Fire 70 Diamonds', 'free-fire-70', 'game', 'ff70', 9000, 1000, 10000),
('PUBG Mobile 60 UC', 'pubg-mobile-60', 'game', 'pubg60', 13000, 2000, 15000),
('Steam Wallet 12K', 'steam-wallet-12k', 'voucher', 'steam12k', 11000, 1000, 12000)
on conflict (buyer_sku_code) do nothing;
