import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Newspaper, FileText, Search, ArrowRight, AlertCircle } from 'lucide-react'

const tools = [
  {
    title: 'Generator Judul',
    description: 'Hasilkan 5 judul berita menarik dari teks artikel secara otomatis.',
    href: '/tools/title-generator',
    icon: Newspaper,
    badge: 'AI',
  },
  {
    title: 'Parafrase Berita',
    description: 'Tulis ulang berita dalam format straight news yang profesional.',
    href: '/tools/paraphrase',
    icon: FileText,
    badge: 'AI',
  },
  {
    title: 'Generator SEO',
    description: 'Buat metadata SEO lengkap: meta title, deskripsi, keywords, dan slug.',
    href: '/tools/seo-generator',
    icon: Search,
    badge: 'AI',
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const hasApiKey = !!profile?.groq_api_key

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Selamat datang, {profile?.display_name?.split(' ')[0] ?? 'Jurnalis'} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Gunakan alat AI berikut untuk membantu pekerjaan jurnalistik Anda.
        </p>
      </div>

      {!hasApiKey && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Groq API Key belum dikonfigurasi</p>
            <p className="text-sm opacity-80">
              Hubungi administrator untuk mendapatkan API key, atau tambahkan sendiri di halaman{' '}
              <Link href="/profile" className="underline font-medium">Profil</Link>.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.href} className="group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <tool.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">{tool.badge}</Badge>
              </div>
              <CardTitle className="text-base mt-3">{tool.title}</CardTitle>
              <CardDescription className="text-sm">{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground">
                <Link href={tool.href}>
                  Mulai Gunakan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
