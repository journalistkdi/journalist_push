'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/app'

export default function ProfilePage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [groqKey, setGroqKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data as Profile)
        setDisplayName(data.display_name ?? '')
        setGroqKey(data.groq_api_key ?? '')
      }
    }
    fetchProfile()
  }, [supabase])

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: displayName, groq_api_key: groqKey }),
      })
      if (!res.ok) throw new Error('Gagal menyimpan')
      toast.success('Profil berhasil disimpan')
    } catch {
      toast.error('Gagal menyimpan profil')
    } finally {
      setLoading(false)
    }
  }

  const initials = profile?.display_name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? profile?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-muted-foreground mt-1">Kelola informasi akun dan API key Anda.</p>
      </div>

      {/* Profile Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Akun</CardTitle>
          <CardDescription>Data akun Google Anda yang terhubung.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{profile?.display_name ?? '-'}</p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
              <Badge variant={profile?.role === 'admin' ? 'default' : 'secondary'} className="mt-1">
                {profile?.role === 'admin' ? 'Admin' : 'User'}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_name">Nama Tampilan</Label>
            <Input
              id="display_name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nama Anda"
            />
          </div>
        </CardContent>
      </Card>

      {/* API Key Card */}
      <Card>
        <CardHeader>
          <CardTitle>Groq API Key</CardTitle>
          <CardDescription>
            API key digunakan untuk mengakses layanan AI. Dapatkan key dari{' '}
            <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="underline">
              console.groq.com
            </a>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groq_key">API Key</Label>
            <div className="relative">
              <Input
                id="groq_key"
                type={showKey ? 'text' : 'password'}
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7"
                onClick={() => setShowKey(!showKey)}
                type="button"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {groqKey ? 'API Key sudah dikonfigurasi.' : 'Belum ada API Key. Hubungi admin atau masukkan sendiri.'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={loading} className="gap-2">
        <Save className="h-4 w-4" />
        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
      </Button>
    </div>
  )
}
