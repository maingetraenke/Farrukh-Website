// Hand-written to match supabase/migrations/*.sql for Phase 1.
//
// Once this project is linked to a real Supabase project, regenerate with:
//   pnpm dlx supabase gen types typescript --linked > src/lib/supabase/types.ts
// and this file (and this comment) go away.

export type UserRole =
  | "ADMIN"
  | "DISPOSITION"
  | "LAGER"
  | "FAHRER"
  | "BUCHHALTUNG";

export type CustomerType = "PRIVATE" | "COMPANY";

export type PaymentMethod =
  | "CASH"
  | "CARD"
  | "APPLE_PAY"
  | "GOOGLE_PAY"
  | "BANK_TRANSFER"
  | "INVOICE";

export type InventoryMovementType =
  | "GOODS_RECEIPT"
  | "RESERVATION"
  | "DELIVERY"
  | "CANCELLATION"
  | "STOCKTAKE_CORRECTION"
  | "BREAKAGE"
  | "MANUAL_CORRECTION";

export type BottleMaterial = "GLASS" | "PET" | "KARTON";

export type ProductCategory =
  | "WASSER"
  | "BIER"
  | "WEIN_SEKT"
  | "SAFT_SCHORLEN"
  | "SAFT_NEKTAR"
  | "SOFTDRINKS"
  | "SONSTIGES";

export type LeadStatus = "NEW" | "CONTACTED" | "CONVERTED" | "DECLINED";

export interface CartItemSnapshot {
  product_id: string;
  name: string;
  brand: string;
  gebinde: string;
  quantity: number;
  sale_price_cents: number | null;
  deposit_name: string | null;
  deposit_amount_cents: number | null;
}

interface Table<Row, Insert, Update = Partial<Insert>> {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
}

interface View<Row> {
  Row: Row;
  Relationships: [];
}

export interface Database {
  public: {
    Tables: {
      organizations: Table<
        {
          id: string;
          name: string;
          legal_form: string | null;
          street: string | null;
          postal_code: string | null;
          city: string | null;
          country: string;
          phone: string | null;
          email: string | null;
          website: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          name: string;
          legal_form?: string | null;
          street?: string | null;
          postal_code?: string | null;
          city?: string | null;
          country?: string;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
        }
      >;
      organization_settings: Table<
        {
          organization_id: string;
          logo_url: string | null;
          bank_name: string | null;
          iban: string | null;
          bic: string | null;
          tax_id: string | null;
          vat_id: string | null;
          default_delivery_fee_cents: number;
          default_payment_terms_days: number;
          currency: string;
          timezone: string;
          customer_number_prefix: string;
          supplier_number_prefix: string;
          order_number_prefix: string;
          invoice_number_prefix: string;
          delivery_note_number_prefix: string;
          route_number_prefix: string;
          created_at: string;
          updated_at: string;
        },
        {
          organization_id: string;
          default_delivery_fee_cents?: number;
          default_payment_terms_days?: number;
        }
      >;
      profiles: Table<
        {
          id: string;
          organization_id: string | null;
          role: UserRole;
          full_name: string;
          phone: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id: string;
          organization_id?: string | null;
          role?: UserRole;
          full_name: string;
          phone?: string | null;
          active?: boolean;
        }
      >;
      customers: Table<
        {
          id: string;
          organization_id: string;
          customer_number: string;
          customer_type: CustomerType;
          company_name: string | null;
          first_name: string | null;
          last_name: string | null;
          billing_street: string | null;
          billing_postal_code: string | null;
          billing_city: string | null;
          billing_country: string;
          phone: string | null;
          email: string | null;
          preferred_payment_method: PaymentMethod | null;
          payment_terms_days: number | null;
          delivery_notes: string | null;
          notes: string | null;
          vat_id: string | null;
          active: boolean;
          archived_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          organization_id: string;
          customer_type: CustomerType;
          company_name?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          billing_street?: string | null;
          billing_postal_code?: string | null;
          billing_city?: string | null;
          phone?: string | null;
          email?: string | null;
          preferred_payment_method?: PaymentMethod | null;
          notes?: string | null;
        }
      >;
      customer_addresses: Table<
        {
          id: string;
          organization_id: string;
          customer_id: string;
          label: string | null;
          street: string;
          postal_code: string;
          city: string;
          country: string;
          delivery_notes: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          organization_id: string;
          customer_id: string;
          label?: string | null;
          street: string;
          postal_code: string;
          city: string;
          delivery_notes?: string | null;
          is_default?: boolean;
        }
      >;
      suppliers: Table<
        {
          id: string;
          organization_id: string;
          supplier_number: string;
          name: string;
          contact_name: string | null;
          street: string | null;
          postal_code: string | null;
          city: string | null;
          country: string;
          phone: string | null;
          email: string | null;
          payment_terms_days: number | null;
          minimum_order_value_cents: number | null;
          opening_hours: string | null;
          notes: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          organization_id: string;
          name: string;
          contact_name?: string | null;
          city?: string | null;
          notes?: string | null;
        }
      >;
      deposit_types: Table<
        {
          id: string;
          organization_id: string;
          name: string;
          amount_cents: number | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        },
        { organization_id: string; name: string; amount_cents?: number | null }
      >;
      products: Table<
        {
          id: string;
          organization_id: string;
          article_number: string;
          ean: string | null;
          name: string;
          brand: string;
          category: ProductCategory;
          variant: string | null;
          bottles_per_case: number;
          bottle_volume_ml: number;
          bottle_material: BottleMaterial;
          sales_unit: "KASTEN";
          supplier_id: string | null;
          deposit_type_id: string | null;
          tax_rate_percent: number | null;
          min_stock: number;
          target_stock: number | null;
          image_url: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          organization_id: string;
          name: string;
          brand: string;
          category: ProductCategory;
          bottles_per_case: number;
          bottle_volume_ml: number;
          bottle_material: BottleMaterial;
          supplier_id?: string | null;
          deposit_type_id?: string | null;
        }
      >;
      product_prices: Table<
        {
          id: string;
          organization_id: string;
          product_id: string;
          purchase_price_cents: number | null;
          sale_price_cents: number | null;
          valid_from: string;
          created_by: string | null;
          created_at: string;
        },
        {
          organization_id: string;
          product_id: string;
          purchase_price_cents?: number | null;
          sale_price_cents?: number | null;
          valid_from?: string;
          created_by?: string | null;
        }
      >;
      warehouses: Table<
        {
          id: string;
          organization_id: string;
          name: string;
          street: string | null;
          postal_code: string | null;
          city: string | null;
          is_default: boolean;
          active: boolean;
          created_at: string;
          updated_at: string;
        },
        { organization_id: string; name: string; is_default?: boolean }
      >;
      inventory_balances: Table<
        {
          id: string;
          organization_id: string;
          product_id: string;
          warehouse_id: string;
          on_hand: number;
          reserved: number;
          updated_at: string;
        },
        never
      >;
      inventory_movements: Table<
        {
          id: string;
          organization_id: string;
          product_id: string;
          warehouse_id: string;
          movement_type: InventoryMovementType;
          quantity: number;
          reason: string | null;
          reference_type: string | null;
          reference_id: string | null;
          created_by: string | null;
          created_at: string;
        },
        {
          organization_id: string;
          product_id: string;
          warehouse_id: string;
          movement_type: InventoryMovementType;
          quantity: number;
          reason?: string | null;
          reference_type?: string | null;
          reference_id?: string | null;
          created_by?: string | null;
        }
      >;
      audit_logs: Table<
        {
          id: string;
          organization_id: string;
          actor_id: string | null;
          entity_type: string;
          entity_id: string;
          action: string;
          before: unknown;
          after: unknown;
          created_at: string;
        },
        {
          organization_id: string;
          actor_id: string;
          entity_type: string;
          entity_id: string;
          action: string;
          before?: unknown;
          after?: unknown;
        }
      >;
      order_inquiries: Table<
        {
          id: string;
          organization_id: string;
          inquiry_number: string;
          customer_name: string;
          email: string;
          phone: string | null;
          delivery_street: string | null;
          delivery_postal_code: string | null;
          delivery_city: string | null;
          requested_date: string | null;
          items: CartItemSnapshot[];
          notes: string | null;
          status: LeadStatus;
          created_at: string;
        },
        {
          organization_id: string;
          customer_name: string;
          email: string;
          phone?: string | null;
          delivery_street?: string | null;
          delivery_postal_code?: string | null;
          delivery_city?: string | null;
          requested_date?: string | null;
          items: CartItemSnapshot[];
          notes?: string | null;
        },
        {
          status?: LeadStatus;
        }
      >;
      contact_messages: Table<
        {
          id: string;
          organization_id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          status: LeadStatus;
          created_at: string;
        },
        {
          organization_id: string;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
        }
      >;
    };
    Views: {
      public_products: View<{
        id: string;
        organization_id: string;
        article_number: string;
        name: string;
        brand: string;
        category: ProductCategory;
        variant: string | null;
        bottles_per_case: number;
        bottle_volume_ml: number;
        bottle_material: BottleMaterial;
        image_url: string | null;
        tax_rate_percent: number | null;
        sale_price_cents: number | null;
        deposit_name: string | null;
        deposit_amount_cents: number | null;
      }>;
    };
    Functions: {
      [_ in never]: never;
    };
  };
}
