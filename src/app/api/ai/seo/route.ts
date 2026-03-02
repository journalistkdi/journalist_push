import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { callGroq } from '@/lib/groq/client'
import { SEO_SYSTEM_PROMPT, buildSeoPrompt } from '@/lib/prompts/seo'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('groq_api_key')
    .eq('id', user.id)
    .single()

  if (!profile?.groq_api_key) {
    return NextResponse.json(
      { error: 'Groq API key belum dikonfigurasi. Hubungi admin atau tambahkan di halaman Profil.' },
      { status: 400 }
    )
  }

  const body = await request.json()
  const { content } = body

  if (!content || content.trim().length < 50) {
    return NextResponse.json({ error: 'Teks berita terlalu pendek (minimal 50 karakter).' }, { status: 400 })
  }

  try {
    const rawResult = await callGroq(
      profile.groq_api_key,
      SEO_SYSTEM_PROMPT,
      buildSeoPrompt(content)
    )

    // Try to parse JSON
    const jsonMatch = rawResult.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Format output tidak valid. Coba lagi.' }, { status: 500 })
    }
    const seoData = JSON.parse(jsonMatch[0])

    await supabase.from('usage_logs').insert({
      user_id: user.id,
      feature: 'seo',
      input_chars: content.length,
    })

    return NextResponse.json({ result: seoData })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
