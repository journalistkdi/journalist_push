export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          role: 'admin' | 'user'
          groq_api_key: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'user'
          groq_api_key?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'user'
          groq_api_key?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      whitelist: {
        Row: {
          id: string
          email: string
          groq_api_key: string | null
          added_by: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          groq_api_key?: string | null
          added_by?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          groq_api_key?: string | null
          added_by?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      usage_logs: {
        Row: {
          id: string
          user_id: string | null
          feature: 'title' | 'paraphrase' | 'seo'
          input_chars: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          feature: 'title' | 'paraphrase' | 'seo'
          input_chars?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          feature?: 'title' | 'paraphrase' | 'seo'
          input_chars?: number | null
          created_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
