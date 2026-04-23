create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'platform_role') then
    create type public.platform_role as enum ('platform_admin', 'gym_owner', 'staff', 'member');
  end if;

  if not exists (select 1 from pg_type where typname = 'gym_status') then
    create type public.gym_status as enum ('draft', 'active', 'paused', 'archived');
  end if;

  if not exists (select 1 from pg_type where typname = 'membership_status') then
    create type public.membership_status as enum ('trial', 'active', 'paused', 'cancelled', 'expired');
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');
  end if;

  if not exists (select 1 from pg_type where typname = 'booking_status') then
    create type public.booking_status as enum ('booked', 'confirmed', 'attended', 'cancelled', 'no_show');
  end if;

  if not exists (select 1 from pg_type where typname = 'network_access_type') then
    create type public.network_access_type as enum ('none', 'included', 'occasional', 'tourist');
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  phone text,
  platform_role public.platform_role not null default 'member',
  default_gym_id uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.gyms (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.profiles (id) on delete restrict,
  name text not null,
  slug text not null unique,
  theme_slug text not null default 'elite-fight',
  legal_name text,
  description text,
  logo_url text,
  cover_image_url text,
  support_email text,
  support_phone text,
  website_url text,
  country text,
  city text,
  timezone text not null default 'America/Argentina/Buenos_Aires',
  primary_color text default '#dc2626',
  secondary_color text default '#111827',
  status public.gym_status not null default 'draft',
  network_access public.network_access_type not null default 'none',
  allow_dropins boolean not null default false,
  dropin_day_pass_price numeric(10, 2),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles
  drop constraint if exists profiles_default_gym_id_fkey;

alter table public.profiles
  add constraint profiles_default_gym_id_fkey
  foreign key (default_gym_id) references public.gyms (id) on delete set null;

create table if not exists public.gym_locations (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  name text not null,
  slug text not null,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text,
  postal_code text,
  country text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  phone text,
  is_main_location boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (gym_id, slug)
);

create table if not exists public.gym_users (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.platform_role not null,
  is_active boolean not null default true,
  invited_by uuid references public.profiles (id) on delete set null,
  joined_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (gym_id, user_id)
);

create table if not exists public.gym_site_pages (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  slug text not null,
  title text not null,
  page_template text not null default 'home',
  status text not null default 'draft',
  sort_order integer not null default 0,
  is_homepage boolean not null default false,
  hero_title text,
  hero_subtitle text,
  primary_cta_label text,
  primary_cta_href text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (gym_id, slug)
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  profile_id uuid references public.profiles (id) on delete set null,
  home_location_id uuid references public.gym_locations (id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  birth_date date,
  emergency_contact_name text,
  emergency_contact_phone text,
  notes text,
  is_active boolean not null default true,
  accepted_network_terms_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  location_id uuid references public.gym_locations (id) on delete set null,
  name text not null,
  description text,
  price numeric(10, 2) not null default 0,
  billing_interval text not null default 'monthly',
  visit_limit integer,
  class_booking_limit integer,
  includes_network_access boolean not null default false,
  network_access_type public.network_access_type not null default 'none',
  network_visit_limit integer,
  is_public boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.member_memberships (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  member_id uuid not null references public.members (id) on delete cascade,
  plan_id uuid not null references public.membership_plans (id) on delete restrict,
  status public.membership_status not null default 'trial',
  starts_at timestamptz not null default timezone('utc', now()),
  ends_at timestamptz,
  auto_renew boolean not null default true,
  source text not null default 'direct',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  location_id uuid references public.gym_locations (id) on delete set null,
  coach_user_id uuid references public.profiles (id) on delete set null,
  name text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer,
  room_name text,
  class_type text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.class_bookings (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  class_session_id uuid not null references public.class_sessions (id) on delete cascade,
  member_id uuid not null references public.members (id) on delete cascade,
  booking_status public.booking_status not null default 'booked',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (class_session_id, member_id)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  member_id uuid references public.members (id) on delete set null,
  membership_id uuid references public.member_memberships (id) on delete set null,
  amount numeric(10, 2) not null,
  currency text not null default 'ARS',
  payment_status public.payment_status not null default 'pending',
  payment_method text,
  reference_code text,
  due_at timestamptz,
  paid_at timestamptz,
  source text not null default 'direct',
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  location_id uuid references public.gym_locations (id) on delete set null,
  member_id uuid not null references public.members (id) on delete cascade,
  membership_id uuid references public.member_memberships (id) on delete set null,
  check_in_at timestamptz not null default timezone('utc', now()),
  check_out_at timestamptz,
  access_type public.network_access_type not null default 'none',
  source text not null default 'qr',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.network_programs (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.network_program_gyms (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.network_programs (id) on delete cascade,
  gym_id uuid not null references public.gyms (id) on delete cascade,
  access_type public.network_access_type not null default 'occasional',
  monthly_visit_cap integer,
  commission_percent numeric(5, 2),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (program_id, gym_id)
);

create table if not exists public.apps_catalog (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text,
  category text not null default 'operacion',
  is_premium boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.gym_enabled_apps (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  app_slug text not null references public.apps_catalog (slug) on delete cascade,
  is_enabled boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  enabled_at timestamptz not null default timezone('utc', now()),
  enabled_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (gym_id, app_slug)
);

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and platform_role = 'platform_admin'
  );
$$;

create or replace function public.has_gym_access(target_gym_id uuid)
returns boolean
language sql
stable
as $$
  select
    public.is_platform_admin()
    or exists (
      select 1
      from public.gym_users
      where gym_id = target_gym_id
        and user_id = auth.uid()
        and is_active = true
    );
$$;

create or replace function public.is_member_profile(target_member_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.members
    where id = target_member_id
      and profile_id = auth.uid()
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

alter table public.gyms
  add column if not exists theme_slug text not null default 'elite-fight';

create or replace function public.create_gym_workspace(
  gym_name text,
  gym_slug text,
  gym_city text default null,
  gym_timezone text default 'America/Argentina/Buenos_Aires'
)
returns public.gyms
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  created_gym public.gyms;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'You must be authenticated to create a gym workspace.';
  end if;

  insert into public.gyms (
    owner_user_id,
    name,
    slug,
    theme_slug,
    city,
    timezone,
    status,
    network_access
  )
  values (
    current_user_id,
    trim(gym_name),
    trim(lower(gym_slug)),
    'elite-fight',
    nullif(trim(gym_city), ''),
    coalesce(nullif(trim(gym_timezone), ''), 'America/Argentina/Buenos_Aires'),
    'draft',
    'none'
  )
  returning * into created_gym;

  insert into public.gym_users (gym_id, user_id, role, is_active)
  values (created_gym.id, current_user_id, 'gym_owner', true)
  on conflict (gym_id, user_id) do update
    set role = excluded.role,
        is_active = true,
        updated_at = timezone('utc', now());

  update public.profiles
  set default_gym_id = coalesce(default_gym_id, created_gym.id)
  where id = current_user_id;

  return created_gym;
end;
$$;

create or replace function public.set_gym_app_enabled(
  target_gym_id uuid,
  target_app_slug text,
  target_enabled boolean
)
returns public.gym_enabled_apps
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  app_row public.gym_enabled_apps;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'You must be authenticated to manage gym apps.';
  end if;

  if not public.has_gym_access(target_gym_id) then
    raise exception 'You do not have access to this gym.';
  end if;

  insert into public.gym_enabled_apps (
    gym_id,
    app_slug,
    is_enabled,
    enabled_by
  )
  values (
    target_gym_id,
    target_app_slug,
    target_enabled,
    current_user_id
  )
  on conflict (gym_id, app_slug) do update
    set is_enabled = excluded.is_enabled,
        enabled_by = excluded.enabled_by,
        updated_at = timezone('utc', now())
  returning * into app_row;

  return app_row;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists set_gyms_updated_at on public.gyms;
create trigger set_gyms_updated_at before update on public.gyms
for each row execute procedure public.set_updated_at();

drop trigger if exists set_gym_locations_updated_at on public.gym_locations;
create trigger set_gym_locations_updated_at before update on public.gym_locations
for each row execute procedure public.set_updated_at();

drop trigger if exists set_gym_users_updated_at on public.gym_users;
create trigger set_gym_users_updated_at before update on public.gym_users
for each row execute procedure public.set_updated_at();

drop trigger if exists set_gym_site_pages_updated_at on public.gym_site_pages;
create trigger set_gym_site_pages_updated_at before update on public.gym_site_pages
for each row execute procedure public.set_updated_at();

drop trigger if exists set_members_updated_at on public.members;
create trigger set_members_updated_at before update on public.members
for each row execute procedure public.set_updated_at();

drop trigger if exists set_membership_plans_updated_at on public.membership_plans;
create trigger set_membership_plans_updated_at before update on public.membership_plans
for each row execute procedure public.set_updated_at();

drop trigger if exists set_member_memberships_updated_at on public.member_memberships;
create trigger set_member_memberships_updated_at before update on public.member_memberships
for each row execute procedure public.set_updated_at();

drop trigger if exists set_class_sessions_updated_at on public.class_sessions;
create trigger set_class_sessions_updated_at before update on public.class_sessions
for each row execute procedure public.set_updated_at();

drop trigger if exists set_class_bookings_updated_at on public.class_bookings;
create trigger set_class_bookings_updated_at before update on public.class_bookings
for each row execute procedure public.set_updated_at();

drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at before update on public.payments
for each row execute procedure public.set_updated_at();

drop trigger if exists set_network_programs_updated_at on public.network_programs;
create trigger set_network_programs_updated_at before update on public.network_programs
for each row execute procedure public.set_updated_at();

drop trigger if exists set_network_program_gyms_updated_at on public.network_program_gyms;
create trigger set_network_program_gyms_updated_at before update on public.network_program_gyms
for each row execute procedure public.set_updated_at();

drop trigger if exists set_apps_catalog_updated_at on public.apps_catalog;
create trigger set_apps_catalog_updated_at before update on public.apps_catalog
for each row execute procedure public.set_updated_at();

drop trigger if exists set_gym_enabled_apps_updated_at on public.gym_enabled_apps;
create trigger set_gym_enabled_apps_updated_at before update on public.gym_enabled_apps
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.gyms enable row level security;
alter table public.gym_locations enable row level security;
alter table public.gym_users enable row level security;
alter table public.gym_site_pages enable row level security;
alter table public.members enable row level security;
alter table public.membership_plans enable row level security;
alter table public.member_memberships enable row level security;
alter table public.class_sessions enable row level security;
alter table public.class_bookings enable row level security;
alter table public.payments enable row level security;
alter table public.checkins enable row level security;
alter table public.network_programs enable row level security;
alter table public.network_program_gyms enable row level security;
alter table public.apps_catalog enable row level security;
alter table public.gym_enabled_apps enable row level security;

drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_platform_admin());

drop policy if exists "profiles_update_self_or_admin" on public.profiles;
create policy "profiles_update_self_or_admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_platform_admin())
  with check (auth.uid() = id or public.is_platform_admin());

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
  on public.profiles for insert
  with check (auth.uid() = id or public.is_platform_admin());

drop policy if exists "gyms_select_access" on public.gyms;
create policy "gyms_select_access"
  on public.gyms for select
  using (public.has_gym_access(id) or owner_user_id = auth.uid());

drop policy if exists "gyms_insert_owner" on public.gyms;
create policy "gyms_insert_owner"
  on public.gyms for insert
  with check (owner_user_id = auth.uid() or public.is_platform_admin());

drop policy if exists "gyms_update_access" on public.gyms;
create policy "gyms_update_access"
  on public.gyms for update
  using (public.has_gym_access(id) or owner_user_id = auth.uid())
  with check (public.has_gym_access(id) or owner_user_id = auth.uid());

drop policy if exists "gym_locations_access" on public.gym_locations;
create policy "gym_locations_access"
  on public.gym_locations for all
  using (public.has_gym_access(gym_id))
  with check (public.has_gym_access(gym_id));

drop policy if exists "gym_users_access" on public.gym_users;
create policy "gym_users_access"
  on public.gym_users for all
  using (public.has_gym_access(gym_id))
  with check (public.has_gym_access(gym_id));

drop policy if exists "gym_site_pages_access" on public.gym_site_pages;
create policy "gym_site_pages_access"
  on public.gym_site_pages for all
  using (public.has_gym_access(gym_id))
  with check (public.has_gym_access(gym_id));

drop policy if exists "members_select_access" on public.members;
create policy "members_select_access"
  on public.members for select
  using (public.has_gym_access(gym_id) or profile_id = auth.uid());

drop policy if exists "members_write_access" on public.members;
create policy "members_write_access"
  on public.members for all
  using (public.has_gym_access(gym_id))
  with check (public.has_gym_access(gym_id));

drop policy if exists "membership_plans_select_access" on public.membership_plans;
create policy "membership_plans_select_access"
  on public.membership_plans for select
  using (public.has_gym_access(gym_id) or (is_public = true and is_active = true));

drop policy if exists "membership_plans_write_access" on public.membership_plans;
create policy "membership_plans_write_access"
  on public.membership_plans for all
  using (public.has_gym_access(gym_id))
  with check (public.has_gym_access(gym_id));

drop policy if exists "member_memberships_select_access" on public.member_memberships;
create policy "member_memberships_select_access"
  on public.member_memberships for select
  using (
    public.has_gym_access(gym_id)
    or exists (
      select 1 from public.members m
      where m.id = member_id and m.profile_id = auth.uid()
    )
  );

drop policy if exists "member_memberships_write_access" on public.member_memberships;
create policy "member_memberships_write_access"
  on public.member_memberships for all
  using (public.has_gym_access(gym_id))
  with check (public.has_gym_access(gym_id));

drop policy if exists "class_sessions_select_access" on public.class_sessions;
create policy "class_sessions_select_access"
  on public.class_sessions for select
  using (public.has_gym_access(gym_id) or is_active = true);

drop policy if exists "class_sessions_write_access" on public.class_sessions;
create policy "class_sessions_write_access"
  on public.class_sessions for all
  using (public.has_gym_access(gym_id))
  with check (public.has_gym_access(gym_id));

drop policy if exists "class_bookings_select_access" on public.class_bookings;
create policy "class_bookings_select_access"
  on public.class_bookings for select
  using (
    public.has_gym_access(gym_id)
    or exists (
      select 1 from public.members m
      where m.id = member_id and m.profile_id = auth.uid()
    )
  );

drop policy if exists "class_bookings_write_access" on public.class_bookings;
create policy "class_bookings_write_access"
  on public.class_bookings for all
  using (public.has_gym_access(gym_id))
  with check (public.has_gym_access(gym_id));

drop policy if exists "payments_select_access" on public.payments;
create policy "payments_select_access"
  on public.payments for select
  using (
    public.has_gym_access(gym_id)
    or exists (
      select 1 from public.members m
      where m.id = member_id and m.profile_id = auth.uid()
    )
  );

drop policy if exists "payments_write_access" on public.payments;
create policy "payments_write_access"
  on public.payments for all
  using (public.has_gym_access(gym_id))
  with check (public.has_gym_access(gym_id));

drop policy if exists "checkins_select_access" on public.checkins;
create policy "checkins_select_access"
  on public.checkins for select
  using (
    public.has_gym_access(gym_id)
    or exists (
      select 1 from public.members m
      where m.id = member_id and m.profile_id = auth.uid()
    )
  );

drop policy if exists "checkins_write_access" on public.checkins;
create policy "checkins_write_access"
  on public.checkins for all
  using (public.has_gym_access(gym_id))
  with check (public.has_gym_access(gym_id));

drop policy if exists "network_programs_select_access" on public.network_programs;
create policy "network_programs_select_access"
  on public.network_programs for select
  using (auth.role() = 'authenticated');

drop policy if exists "network_programs_write_admin" on public.network_programs;
create policy "network_programs_write_admin"
  on public.network_programs for all
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "network_program_gyms_select_access" on public.network_program_gyms;
create policy "network_program_gyms_select_access"
  on public.network_program_gyms for select
  using (public.is_platform_admin() or public.has_gym_access(gym_id));

drop policy if exists "network_program_gyms_write_admin" on public.network_program_gyms;
create policy "network_program_gyms_write_admin"
  on public.network_program_gyms for all
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "apps_catalog_select_authenticated" on public.apps_catalog;
create policy "apps_catalog_select_authenticated"
  on public.apps_catalog for select
  using (auth.role() = 'authenticated');

drop policy if exists "apps_catalog_write_admin" on public.apps_catalog;
create policy "apps_catalog_write_admin"
  on public.apps_catalog for all
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "gym_enabled_apps_access" on public.gym_enabled_apps;
create policy "gym_enabled_apps_access"
  on public.gym_enabled_apps for all
  using (public.has_gym_access(gym_id))
  with check (public.has_gym_access(gym_id));

create index if not exists idx_profiles_default_gym_id on public.profiles (default_gym_id);
create index if not exists idx_gyms_owner_user_id on public.gyms (owner_user_id);
create index if not exists idx_gyms_slug on public.gyms (slug);
create index if not exists idx_gym_locations_gym_id on public.gym_locations (gym_id);
create index if not exists idx_gym_users_gym_id on public.gym_users (gym_id);
create index if not exists idx_gym_users_user_id on public.gym_users (user_id);
create index if not exists idx_gym_site_pages_gym_id on public.gym_site_pages (gym_id);
create index if not exists idx_members_gym_id on public.members (gym_id);
create index if not exists idx_members_profile_id on public.members (profile_id);
create index if not exists idx_membership_plans_gym_id on public.membership_plans (gym_id);
create index if not exists idx_member_memberships_gym_id on public.member_memberships (gym_id);
create index if not exists idx_member_memberships_member_id on public.member_memberships (member_id);
create index if not exists idx_class_sessions_gym_id on public.class_sessions (gym_id);
create index if not exists idx_class_sessions_starts_at on public.class_sessions (starts_at);
create index if not exists idx_class_bookings_gym_id on public.class_bookings (gym_id);
create index if not exists idx_payments_gym_id on public.payments (gym_id);
create index if not exists idx_payments_paid_at on public.payments (paid_at);
create index if not exists idx_checkins_gym_id on public.checkins (gym_id);
create index if not exists idx_checkins_check_in_at on public.checkins (check_in_at);
create index if not exists idx_network_program_gyms_program_id on public.network_program_gyms (program_id);
create index if not exists idx_network_program_gyms_gym_id on public.network_program_gyms (gym_id);
create index if not exists idx_apps_catalog_slug on public.apps_catalog (slug);
create index if not exists idx_gym_enabled_apps_gym_id on public.gym_enabled_apps (gym_id);
create index if not exists idx_gym_enabled_apps_app_slug on public.gym_enabled_apps (app_slug);

insert into public.apps_catalog (slug, name, short_description, category, is_premium)
values
  ('qr-checkin', 'QR Check-in', 'Acceso rapido con QR, validacion de cuota y check-in en recepcion.', 'operacion', false),
  ('class-bookings', 'Reservas', 'Agenda de clases, cupos, asistencia y recordatorios automaticos.', 'operacion', false),
  ('nutrition', 'Nutricion', 'Planes de alimentacion, seguimiento y entregas por profesional.', 'servicios', true),
  ('referrals', 'Referidos', 'Campanas para que socios inviten amigos y obtengan beneficios.', 'marketing', true)
on conflict (slug) do update
  set name = excluded.name,
      short_description = excluded.short_description,
      category = excluded.category,
      is_premium = excluded.is_premium,
      is_active = true,
      updated_at = timezone('utc', now());
