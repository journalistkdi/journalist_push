import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { callGroq } from '@/lib/groq/client'
import { PARAPHRASE_SYSTEM_PROMPT, buildParaphrasePrompt } from '@/lib/prompts/paraphrase'

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
    const result = await callGroq(
      profile.groq_api_key,
      PARAPHRASE_SYSTEM_PROMPT,
      buildParaphrasePrompt(content)
    )

    await supabase.from('usage_logs').insert({
      user_id: user.id,
      feature: 'paraphrase',
      input_chars: content.length,
    })

    return NextResponse.json({ result })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
