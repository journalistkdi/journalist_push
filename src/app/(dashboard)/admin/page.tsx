import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, ListChecks, Activity, ArrowRight } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: userCount },
    { count: whitelistCount },
    { count: usageCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('whitelist').select('*', { count: 'exact', head: true }),
    supabase.from('usage_logs').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { title: 'Total Pengguna', value: userCount ?? 0, icon: Users, href: '/admin/users' },
    { title: 'Whitelist Email', value: whitelistCount ?? 0, icon: ListChecks, href: '/admin/whitelist' },
    { title: 'Total Penggunaan AI', value: usageCount ?? 0, icon: Activity, href: null },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Panel Admin</h1>
        <p className="text-muted-foreground mt-1">Kelola pengguna, whitelist, dan monitor penggunaan.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.href && (
                <Link href={stat.href} className="text-xs text-muted-foreground hover:underline">
                  Lihat detail →
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kelola Pengguna</CardTitle>
            <CardDescription>Lihat semua pengguna terdaftar dan kelola role mereka.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/admin/users">
                Buka Kelola Pengguna <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Whitelist Email</CardTitle>
            <CardDescription>Tambah atau hapus email yang diizinkan login ke sistem.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/admin/whitelist">
                Buka Whitelist <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
