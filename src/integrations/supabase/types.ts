export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      internship_applications: {
        Row: {
          admin_notes: string | null
          availability_end: string | null
          availability_start: string | null
          cover_letter: string | null
          created_at: string | null
          current_education: string | null
          expected_graduation_date: string | null
          github_url: string | null
          id: string
          internship_id: string | null
          linkedin_url: string | null
          notes: string | null
          portfolio_url: string | null
          relevant_experience: string | null
          resume_url: string | null
          skills: string[] | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          availability_end?: string | null
          availability_start?: string | null
          cover_letter?: string | null
          created_at?: string | null
          current_education?: string | null
          expected_graduation_date?: string | null
          github_url?: string | null
          id?: string
          internship_id?: string | null
          linkedin_url?: string | null
          notes?: string | null
          portfolio_url?: string | null
          relevant_experience?: string | null
          resume_url?: string | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          availability_end?: string | null
          availability_start?: string | null
          cover_letter?: string | null
          created_at?: string | null
          current_education?: string | null
          expected_graduation_date?: string | null
          github_url?: string | null
          id?: string
          internship_id?: string | null
          linkedin_url?: string | null
          notes?: string | null
          portfolio_url?: string | null
          relevant_experience?: string | null
          resume_url?: string | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "internship_applications_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
        ]
      }
      internships: {
        Row: {
          benefits: string[] | null
          created_at: string | null
          current_applications: number | null
          department: string
          description: string
          duration: string
          end_date: string | null
          id: string
          location: string
          max_applications: number | null
          requirements: string[] | null
          responsibilities: string[] | null
          salary_range: string | null
          start_date: string | null
          status: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          benefits?: string[] | null
          created_at?: string | null
          current_applications?: number | null
          department: string
          description: string
          duration: string
          end_date?: string | null
          id?: string
          location: string
          max_applications?: number | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          start_date?: string | null
          status?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          benefits?: string[] | null
          created_at?: string | null
          current_applications?: number | null
          department?: string
          description?: string
          duration?: string
          end_date?: string | null
          id?: string
          location?: string
          max_applications?: number | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          start_date?: string | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          price: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price: number
          product_id?: string | null
          quantity?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          created_at: string | null
          id: string
          notes: string | null
          order_number: string
          payment_method: string | null
          shipping_address: Json | null
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string | null
          id?: string
          notes?: string | null
          order_number: string
          payment_method?: string | null
          shipping_address?: Json | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_address?: Json | null
          created_at?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          shipping_address?: Json | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          compare_price: number | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          images: string[] | null
          name: string
          price: number
          sku: string | null
          status: Database["public"]["Enums"]["product_status"] | null
          stock_quantity: number | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          compare_price?: number | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          name: string
          price: number
          sku?: string | null
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          compare_price?: number | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          name?: string
          price?: number
          sku?: string | null
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_profile_safely: {
        Args: { target_user_id: string }
        Returns: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          updated_at: string
          user_id: string
        }[]
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: string[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      validate_profile_security: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      product_status: "active" | "inactive" | "out_of_stock"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      order_status: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      product_status: ["active", "inactive", "out_of_stock"],
    },
  },
} as const
