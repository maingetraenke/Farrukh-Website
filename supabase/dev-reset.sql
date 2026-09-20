-- DEV-ONLY reset: drops every object created by supabase/migrations/*.sql,
-- so you can re-run the migrations from a clean slate after a partial/failed
-- attempt. Safe to run repeatedly (everything is IF EXISTS).
--
-- NEVER run this against a database that has real data you care about —
-- it deletes everything (organizations, customers, products, ...).
--
-- Usage: run this once in the SQL Editor, then re-run the 8 migration
-- files in order (see docs/implementation-plan.md), then seed.sql.

drop trigger if exists on_auth_user_created on auth.users;

drop table if exists public.audit_logs cascade;
drop table if exists public.inventory_movements cascade;
drop table if exists public.inventory_balances cascade;
drop table if exists public.warehouses cascade;
drop table if exists public.product_prices cascade;
drop table if exists public.products cascade;
drop table if exists public.deposit_types cascade;
drop table if exists public.suppliers cascade;
drop table if exists public.customer_addresses cascade;
drop table if exists public.customers cascade;
drop table if exists public.number_sequences cascade;
drop table if exists public.profiles cascade;
drop table if exists public.organization_settings cascade;
drop table if exists public.organizations cascade;

drop function if exists public.apply_inventory_movement() cascade;
drop function if exists public.products_assign_number() cascade;
drop function if exists public.next_article_number(uuid) cascade;
drop function if exists public.suppliers_assign_number() cascade;
drop function if exists public.next_supplier_number(uuid) cascade;
drop function if exists public.customers_assign_number() cascade;
drop function if exists public.next_customer_number(uuid) cascade;
drop function if exists public.next_sequence_value(uuid, text, text) cascade;
drop function if exists public.handle_new_auth_user() cascade;
drop function if exists public.set_updated_at() cascade;
drop function if exists public.has_role(public.user_role[]) cascade;
drop function if exists public.is_admin() cascade;
drop function if exists public.current_role() cascade;
drop function if exists public.current_org_id() cascade;

drop type if exists public.product_category cascade;
drop type if exists public.bottle_material cascade;
drop type if exists public.inventory_movement_type cascade;
drop type if exists public.payment_method cascade;
drop type if exists public.customer_type cascade;
drop type if exists public.user_role cascade;
