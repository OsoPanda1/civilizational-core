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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookmarks: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          category: string
          created_at: string
          description: string | null
          hours: string | null
          id: string
          image_url: string | null
          lat: number
          lng: number
          name: string
          owner_id: string | null
          phone: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          hours?: string | null
          id?: string
          image_url?: string | null
          lat: number
          lng: number
          name: string
          owner_id?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          hours?: string | null
          id?: string
          image_url?: string | null
          lat?: number
          lng?: number
          name?: string
          owner_id?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      citizen_identity: {
        Row: {
          consciousness_level: number | null
          consent_ledger: Json | null
          created_at: string | null
          did_document: Json | null
          dna_hash: string | null
          id: string
          last_verification: string | null
          reputation_score: number | null
          trust_level: string | null
          updated_at: string | null
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          consciousness_level?: number | null
          consent_ledger?: Json | null
          created_at?: string | null
          did_document?: Json | null
          dna_hash?: string | null
          id?: string
          last_verification?: string | null
          reputation_score?: number | null
          trust_level?: string | null
          updated_at?: string | null
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          consciousness_level?: number | null
          consent_ledger?: Json | null
          created_at?: string | null
          did_document?: Json | null
          dna_hash?: string | null
          id?: string
          last_verification?: string | null
          reputation_score?: number | null
          trust_level?: string | null
          updated_at?: string | null
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_edited: boolean | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_edited?: boolean | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_edited?: boolean | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          end_date: string | null
          event_date: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          location: string | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_date?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          location?: string | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_date?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          location?: string | null
          title?: string
        }
        Relationships: []
      }
      federated_nodes: {
        Row: {
          ast_state: string | null
          created_at: string | null
          encryption_key_hash: string | null
          health_score: number | null
          id: string
          last_heartbeat: string | null
          latency_ms: number | null
          metrics: Json | null
          node_name: string
          node_type: string | null
          region: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          ast_state?: string | null
          created_at?: string | null
          encryption_key_hash?: string | null
          health_score?: number | null
          id?: string
          last_heartbeat?: string | null
          latency_ms?: number | null
          metrics?: Json | null
          node_name: string
          node_type?: string | null
          region?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          ast_state?: string | null
          created_at?: string | null
          encryption_key_hash?: string | null
          health_score?: number | null
          id?: string
          last_heartbeat?: string | null
          latency_ms?: number | null
          metrics?: Json | null
          node_name?: string
          node_type?: string | null
          region?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      guardian_actions: {
        Row: {
          action_type: string
          created_at: string | null
          ethical_flags: Json | null
          explanation: string | null
          guardian_id: string | null
          id: string
          isabella_confidence: number | null
          isabella_recommendation: string | null
          msr_hash: string | null
          resolved_at: string | null
          status: string | null
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          ethical_flags?: Json | null
          explanation?: string | null
          guardian_id?: string | null
          id?: string
          isabella_confidence?: number | null
          isabella_recommendation?: string | null
          msr_hash?: string | null
          resolved_at?: string | null
          status?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          ethical_flags?: Json | null
          explanation?: string | null
          guardian_id?: string | null
          id?: string
          isabella_confidence?: number | null
          isabella_recommendation?: string | null
          msr_hash?: string | null
          resolved_at?: string | null
          status?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      hashtags: {
        Row: {
          created_at: string
          id: string
          tag: string
          usage_count: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          tag: string
          usage_count?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          tag?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      identity_events: {
        Row: {
          created_at: string
          event_type: string
          hash: string
          id: string
          metadata: Json | null
          prev_hash: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          hash: string
          id?: string
          metadata?: Json | null
          prev_hash?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          hash?: string
          id?: string
          metadata?: Json | null
          prev_hash?: string | null
          user_id?: string
        }
        Relationships: []
      }
      isabella_decisions: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          ethical_violations: Json | null
          explanation: string | null
          final_decision: string | null
          id: string
          input_payload: Json
          msr_hash: string | null
          processing_time_ms: number | null
          request_type: string
          requires_hitl: boolean | null
          stage_results: Json | null
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          ethical_violations?: Json | null
          explanation?: string | null
          final_decision?: string | null
          id?: string
          input_payload: Json
          msr_hash?: string | null
          processing_time_ms?: number | null
          request_type: string
          requires_hitl?: boolean | null
          stage_results?: Json | null
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          ethical_violations?: Json | null
          explanation?: string | null
          final_decision?: string | null
          id?: string
          input_payload?: Json
          msr_hash?: string | null
          processing_time_ms?: number | null
          request_type?: string
          requires_hitl?: boolean | null
          stage_results?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          deleted_at: string | null
          id: string
          is_read: boolean | null
          media_url: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_read?: boolean | null
          media_url?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_read?: boolean | null
          media_url?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      phoenix_transactions: {
        Row: {
          asset_id: string | null
          asset_type: string | null
          audit_signature: string | null
          citizen_id: string | null
          created_at: string | null
          creator_payout: number | null
          currency: string | null
          id: string
          metadata: Json | null
          msr_hash: string
          prev_hash: string | null
          system_fund: number | null
          total_amount: number
          tx_status: string | null
        }
        Insert: {
          asset_id?: string | null
          asset_type?: string | null
          audit_signature?: string | null
          citizen_id?: string | null
          created_at?: string | null
          creator_payout?: number | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          msr_hash: string
          prev_hash?: string | null
          system_fund?: number | null
          total_amount: number
          tx_status?: string | null
        }
        Update: {
          asset_id?: string | null
          asset_type?: string | null
          audit_signature?: string | null
          citizen_id?: string | null
          created_at?: string | null
          creator_payout?: number | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          msr_hash?: string
          prev_hash?: string | null
          system_fund?: number | null
          total_amount?: number
          tx_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phoenix_transactions_citizen_id_fkey"
            columns: ["citizen_id"]
            isOneToOne: false
            referencedRelation: "citizen_identity"
            referencedColumns: ["id"]
          },
        ]
      }
      places: {
        Row: {
          address: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          lat: number
          lng: number
          name: string
          rating: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          lat: number
          lng: number
          name: string
          rating?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          lat?: number
          lng?: number
          name?: string
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      post_hashtags: {
        Row: {
          created_at: string
          hashtag_id: string
          id: string
          post_id: string
        }
        Insert: {
          created_at?: string
          hashtag_id: string
          id?: string
          post_id: string
        }
        Update: {
          created_at?: string
          hashtag_id?: string
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_hashtags_hashtag_id_fkey"
            columns: ["hashtag_id"]
            isOneToOne: false
            referencedRelation: "hashtags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_hashtags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: string
          is_edited: boolean | null
          media_type: string | null
          media_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_edited?: boolean | null
          media_type?: string | null
          media_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_edited?: boolean | null
          media_type?: string | null
          media_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          is_guardian: boolean | null
          role: string | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          is_guardian?: boolean | null
          role?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_guardian?: boolean | null
          role?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      sentinel_logs: {
        Row: {
          action_taken: string | null
          created_at: string | null
          event_type: string
          id: string
          ip_address: unknown
          msr_hash: string | null
          resolved: boolean | null
          severity: string | null
          source_node: string | null
          threat_details: Json | null
          user_id: string | null
        }
        Insert: {
          action_taken?: string | null
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: unknown
          msr_hash?: string | null
          resolved?: boolean | null
          severity?: string | null
          source_node?: string | null
          threat_details?: Json | null
          user_id?: string | null
        }
        Update: {
          action_taken?: string | null
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown
          msr_hash?: string | null
          resolved?: boolean | null
          severity?: string | null
          source_node?: string | null
          threat_details?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sentinel_logs_source_node_fkey"
            columns: ["source_node"]
            isOneToOne: false
            referencedRelation: "federated_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          content: string
          created_at: string
          expires_at: string
          id: string
          is_highlighted: boolean | null
          media_url: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          expires_at?: string
          id?: string
          is_highlighted?: boolean | null
          media_url?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          expires_at?: string
          id?: string
          is_highlighted?: boolean | null
          media_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      world_entities: {
        Row: {
          created_at: string | null
          entity_type: string | null
          id: string
          last_interaction: string | null
          memory_context: string | null
          name: string | null
          owner_id: string | null
          position_x: number | null
          position_y: number | null
          position_z: number | null
          structural_integrity: number | null
          temporal_state: number | null
          visual_dna: Json | null
        }
        Insert: {
          created_at?: string | null
          entity_type?: string | null
          id?: string
          last_interaction?: string | null
          memory_context?: string | null
          name?: string | null
          owner_id?: string | null
          position_x?: number | null
          position_y?: number | null
          position_z?: number | null
          structural_integrity?: number | null
          temporal_state?: number | null
          visual_dna?: Json | null
        }
        Update: {
          created_at?: string | null
          entity_type?: string | null
          id?: string
          last_interaction?: string | null
          memory_context?: string | null
          name?: string | null
          owner_id?: string | null
          position_x?: number | null
          position_y?: number | null
          position_z?: number | null
          structural_integrity?: number | null
          temporal_state?: number | null
          visual_dna?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_economic_health: { Args: never; Returns: number }
      get_phoenix_fund_balance: { Args: never; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "citizen" | "guardian" | "admin"
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
      app_role: ["citizen", "guardian", "admin"],
    },
  },
} as const
