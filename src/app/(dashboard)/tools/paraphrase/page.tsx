'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { CopyButton } from '@/components/tools/CopyButton'
import { FileText, Loader2, Sparkles } from 'lucide-react'

export default function ParaphrasePage() {
  const [content, setContent] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleParaphrase = async () => {
    if (content.trim().length < 50) {
      toast.error('Masukkan teks berita minimal 50 karakter')
      return
    }
    setLoading(true)
    setResult('')
    try {
      const res = await fetch('/api/ai/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal parafrase')
      setResult(data.result)
      toast.success('Berita berhasil diparafrase!')
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
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Parafrase Berita</h1>
          <p className="text-muted-foreground text-sm">Tulis ulang berita dalam format straight news yang profesional.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Teks Berita Asli</Label>
              <Textarea
                id="content"
                placeholder="Paste teks berita yang ingin diparafrase di sini... (minimal 50 karakter)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">{content.length} karakter</p>
            </div>
            <Button
              onClick={handleParaphrase}
              disabled={loading || content.trim().length < 50}
              className="w-full gap-2"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Sedang memproses...</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Parafrase Sekarang</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Hasil Parafrase (Straight News)</Label>
              {result && <CopyButton text={result} />}
            </div>
            {result ? (
              <div className="min-h-[280px] rounded-md border bg-muted/30 p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
              </div>
            ) : (
              <div className="flex min-h-[280px] items-center justify-center rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">
                  {loading ? 'Sedang memproses berita...' : 'Hasil parafrase akan muncul di sini'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
