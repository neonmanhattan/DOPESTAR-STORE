export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready_for_dispatch"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          order_reference: string;
          tracking_code: string;
          status: OrderStatus;
          status_note: string;
          estimated_delivery: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_reference: string;
          tracking_code?: string;
          status?: OrderStatus;
          status_note?: string;
          estimated_delivery?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_reference?: string;
          tracking_code?: string;
          status?: OrderStatus;
          status_note?: string;
          estimated_delivery?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_updates: {
        Row: {
          id: string;
          order_id: string;
          status: OrderStatus;
          note: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          status: OrderStatus;
          note?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          status?: OrderStatus;
          note?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_updates_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
