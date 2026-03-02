import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient as createAdminSupabase } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  if (!code) {
    return NextResponse.redirect(`${siteUrl}/auth/unauthorized`)
  }

  const cookieStore = await cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  // Admin client pakai service role — bypass RLS
  const adminClient = createAdminSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: sessionData, error: sessionError } =
    await supabase.auth.exchangeCodeForSession(code)

  if (sessionError || !sessionData.user) {
    console.error('[callback] exchangeCodeForSession error:', sessionError?.message)
    return NextResponse.redirect(`${siteUrl}/auth/unauthorized`)
  }

  const userEmail = sessionData.user.email!
  const userId = sessionData.user.id

  console.log('[callback] user email:', userEmail)

  // Cek whitelist pakai admin client (bypass RLS)
  const { data: whitelistEntry, error: wlError } = await adminClient
    .from('whitelist')
    .select('*')
    .eq('email', userEmail.toLowerCase().trim())
    .single()

  console.log('[callback] whitelist entry:', whitelistEntry, 'error:', wlError?.message)

  if (!whitelistEntry) {
    // Hapus user dari Supabase auth
    await adminClient.auth.admin.deleteUser(userId)
    await supabase.auth.signOut()
    return NextResponse.redirect(`${siteUrl}/auth/unauthorized`)
  }

  // Copy groq_api_key ke profile jika whitelist punya dan profile belum ada
  if (whitelistEntry.groq_api_key) {
    const { data: profile } = await adminClient
      .from('profiles')
      .select('groq_api_key')
      .eq('id', userId)
      .single()

    if (profile && !profile.groq_api_key) {
      await adminClient
        .from('profiles')
        .update({ groq_api_key: whitelistEntry.groq_api_key })
        .eq('id', userId)
    }
  }

  return NextResponse.redirect(`${siteUrl}/dashboard`)
}
