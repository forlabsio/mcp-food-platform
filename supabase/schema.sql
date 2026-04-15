-- MCP Food Platform Schema
-- Run this in Supabase SQL Editor

-- Restaurants
create table if not exists restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  address text not null,
  phone text not null,
  business_hours text,
  category text,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Menu Items
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name text not null,
  description text,
  price integer not null, -- 원 단위 (10000 = 1만원)
  category text,
  is_available boolean default true,
  image_url text,
  options jsonb, -- MenuOption[]
  created_at timestamptz default now()
);

create index if not exists idx_menu_items_restaurant on menu_items(restaurant_id);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id),
  items jsonb not null, -- OrderItem[]
  customer_name text not null,
  customer_phone text not null,
  status text not null default 'pending',
  total_price integer not null, -- 원 단위
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_orders_restaurant on orders(restaurant_id);
create index if not exists idx_orders_status on orders(status);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger restaurants_updated_at
  before update on restaurants
  for each row execute function update_updated_at();

create or replace trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- RLS
alter table restaurants enable row level security;
alter table menu_items enable row level security;
alter table orders enable row level security;

-- For now (Week 1-2 prototype): allow all reads, service role for writes
create policy "Public read restaurants" on restaurants for select using (true);
create policy "Public read menu_items" on menu_items for select using (true);
create policy "Public read orders" on orders for select using (true);
create policy "Service write restaurants" on restaurants for all using (true);
create policy "Service write menu_items" on menu_items for all using (true);
create policy "Service write orders" on orders for all using (true);
