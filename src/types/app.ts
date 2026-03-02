export interface Profile {
  id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  role: 'admin' | 'user'
  groq_api_key: string | null
  created_at: string
  updated_at: string
}

export interface WhitelistEntry {
  id: string
  email: string
  groq_api_key: string | null
  added_by: string | null
  notes: string | null
  created_at: string
}

export interface UsageLog {
  id: string
  user_id: string | null
  feature: 'title' | 'paraphrase' | 'seo'
  input_chars: number | null
  created_at: string
}

export interface SeoOutput {
  metaTitle: string
  metaDescription: string
  keywords: string[]
  slug: string
}

export type ToolFeature = 'title' | 'paraphrase' | 'seo'
