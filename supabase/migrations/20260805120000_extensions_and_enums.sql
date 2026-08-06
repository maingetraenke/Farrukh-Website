-- Phase 1: extensions and shared enum types.

create extension if not exists "pgcrypto";

create type public.user_role as enum (
  'ADMIN',
  'DISPOSITION',
  'LAGER',
  'FAHRER',
  'BUCHHALTUNG'
);

create type public.customer_type as enum (
  'PRIVATE',
  'COMPANY'
);

create type public.payment_method as enum (
  'CASH',
  'CARD',
  'APPLE_PAY',
  'GOOGLE_PAY',
  'BANK_TRANSFER',
  'INVOICE'
);

create type public.inventory_movement_type as enum (
  'GOODS_RECEIPT',
  'RESERVATION',
  'DELIVERY',
  'CANCELLATION',
  'STOCKTAKE_CORRECTION',
  'BREAKAGE',
  'MANUAL_CORRECTION'
);

create type public.bottle_material as enum (
  'GLASS',
  'PET'
);
