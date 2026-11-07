create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_reference text not null unique,
  tracking_code uuid not null unique default gen_random_uuid(),
  status text not null default 'pending'
    check (status in (
      'pending',
      'confirmed',
      'preparing',
      'ready_for_dispatch',
      'out_for_delivery',
      'delivered',
      'cancelled'
    )),
  status_note text not null default '',
  estimated_delivery text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_updates (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null
    check (status in (
      'pending',
      'confirmed',
      'preparing',
      'ready_for_dispatch',
      'out_for_delivery',
      'delivered',
      'cancelled'
    )),
  note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists order_updates_order_created_idx
  on public.order_updates (order_id, created_at desc);

alter table public.orders enable row level security;
alter table public.order_updates enable row level security;

revoke all on public.orders from anon, authenticated;
revoke all on public.order_updates from anon, authenticated;

create or replace function public.record_order_status_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status then
    insert into public.order_updates (order_id, status, note)
    values (new.id, new.status, new.status_note);
  end if;
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_record_status_update on public.orders;
create trigger orders_record_status_update
before update on public.orders
for each row
execute function public.record_order_status_update();
