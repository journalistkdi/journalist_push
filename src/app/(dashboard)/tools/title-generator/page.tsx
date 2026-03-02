'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyButton } from '@/components/tools/CopyButton'
import { Newspaper, Loader2, Sparkles } from 'lucide-react'

function parseTitles(text: string): string[] {
  const lines = text.split('\n').filter(Boolean)
  return lines
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .filter((line) => line.length > 5)
    .slice(0, 5)
}

export default function TitleGeneratorPage() {
  const [content, setContent] = useState('')
  const [titles, setTitles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (content.trim().length < 50) {
      toast.error('Masukkan teks berita minimal 50 karakter')
      return
    }
    setLoading(true)
    setTitles([])
    try {
      const res = await fetch('/api/ai/title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal generate')
      const parsed = parseTitles(data.result)
      setTitles(parsed)
      toast.success(`${parsed.length} judul berhasil digenerate!`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Newspaper className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Generator Judul Berita</h1>
          <p className="text-muted-foreground text-sm">Hasilkan 5 judul berita menarik dari teks artikel Anda.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Teks Berita / Artikel</Label>
            <Textarea
              id="content"
              placeholder="Paste atau ketik teks berita Anda di sini... (minimal 50 karakter)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {content.length} karakter
            </p>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading || content.trim().length < 50}
            className="w-full gap-2"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Sedang generate...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Generate 5 Judul</>
            )}
          </Button>
        </CardContent>
      </Card>

      {titles.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-base">Hasil Generate</h2>
          {titles.map((title, i) => (
            <Card key={i} className="group hover:border-primary/50 transition-colors">
              <CardHeader className="py-3 px-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {i + 1}
                    </span>
                    <CardTitle className="text-sm font-medium leading-relaxed">{title}</CardTitle>
                  </div>
                  <CopyButton text={title} />
                </div>
              </CardHeader>
            </Card>
          ))}
          <div className="flex justify-end">
            <CopyButton text={titles.map((t, i) => `${i + 1}. ${t}`).join('\n')} variant="outline" size="default" />
          </div>
        </div>
      )}
    </div>
  )
}
