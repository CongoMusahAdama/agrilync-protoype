export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      association_members: {
        Row: {
          association_id: string
          farmer_id: string
          id: string
          joined_at: string
          status: string | null
        }
        Insert: {
          association_id: string
          farmer_id: string
          id?: string
          joined_at?: string
          status?: string | null
        }
        Update: {
          association_id?: string
          farmer_id?: string
          id?: string
          joined_at?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "association_members_association_id_fkey"
            columns: ["association_id"]
            isOneToOne: false
            referencedRelation: "associations"
            referencedColumns: ["id"]
          },
        ]
      }
      associations: {
        Row: {
          created_at: string
          description: string | null
          extension_agent_id: string | null
          id: string
          member_count: number | null
          name: string
          region: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          extension_agent_id?: string | null
          id?: string
          member_count?: number | null
          name: string
          region: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          extension_agent_id?: string | null
          id?: string
          member_count?: number | null
          name?: string
          region?: string
          updated_at?: string
        }
        Relationships: []
      }
      consultations: {
        Row: {
          consultation_type: string | null
          created_at: string
          extension_agent_id: string | null
          farmer_id: string
          id: string
          notes: string | null
          scheduled_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          consultation_type?: string | null
          created_at?: string
          extension_agent_id?: string | null
          farmer_id: string
          id?: string
          notes?: string | null
          scheduled_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          consultation_type?: string | null
          created_at?: string
          extension_agent_id?: string | null
          farmer_id?: string
          id?: string
          notes?: string | null
          scheduled_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      extension_agent_profiles: {
        Row: {
          certifications: string[] | null
          created_at: string
          farmers_managed: number | null
          id: string
          operational_areas: string[] | null
          specializations: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          certifications?: string[] | null
          created_at?: string
          farmers_managed?: number | null
          id?: string
          operational_areas?: string[] | null
          specializations?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          certifications?: string[] | null
          created_at?: string
          farmers_managed?: number | null
          id?: string
          operational_areas?: string[] | null
          specializations?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      farm_partner_opportunities: {
        Row: {
          created_at: string
          crop_type: string
          description: string | null
          expected_yield: number | null
          extension_agent_id: string | null
          farm_size: string | null
          farmer_id: string
          funding_needed: number
          id: string
          investor_id: string | null
          location: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          crop_type: string
          description?: string | null
          expected_yield?: number | null
          extension_agent_id?: string | null
          farm_size?: string | null
          farmer_id: string
          funding_needed: number
          id?: string
          investor_id?: string | null
          location: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          crop_type?: string
          description?: string | null
          expected_yield?: number | null
          extension_agent_id?: string | null
          farm_size?: string | null
          farmer_id?: string
          funding_needed?: number
          id?: string
          investor_id?: string | null
          location?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      farmer_profiles: {
        Row: {
          created_at: string
          credibility_score: number | null
          crop_type: string[] | null
          current_growth_stage: string | null
          farm_photos: string[] | null
          farm_size: string | null
          id: string
          is_verified: boolean | null
          previous_harvest: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credibility_score?: number | null
          crop_type?: string[] | null
          current_growth_stage?: string | null
          farm_photos?: string[] | null
          farm_size?: string | null
          id?: string
          is_verified?: boolean | null
          previous_harvest?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credibility_score?: number | null
          crop_type?: string[] | null
          current_growth_stage?: string | null
          farm_photos?: string[] | null
          farm_size?: string | null
          id?: string
          is_verified?: boolean | null
          previous_harvest?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      investor_profiles: {
        Row: {
          active_partnerships: number | null
          created_at: string
          id: string
          investment_interests: string[] | null
          total_investments: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active_partnerships?: number | null
          created_at?: string
          id?: string
          investment_interests?: string[] | null
          total_investments?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active_partnerships?: number | null
          created_at?: string
          id?: string
          investment_interests?: string[] | null
          total_investments?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          location: string | null
          phone: string | null
          region: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          location?: string | null
          phone?: string | null
          region?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          location?: string | null
          phone?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      User: {
        Row: {
          created_at: string
          email: string
          id: number
          location: string
          name: string
          phonenumber: number
          role: Json
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          location: string
          name: string
          phonenumber: number
          role: Json
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          location?: string
          name?: string
          phonenumber?: number
          role?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "farmer" | "investor" | "extension_agent"
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
      user_role: ["farmer", "investor", "extension_agent"],
    },
  },
} as const
