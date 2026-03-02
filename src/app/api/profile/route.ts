import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { display_name, groq_api_key } = body

  const updates: ProfileUpdate = { updated_at: new Date().toISOString() }
  if (display_name !== undefined) updates.display_name = display_name
  if (groq_api_key !== undefined) updates.groq_api_key = groq_api_key

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
