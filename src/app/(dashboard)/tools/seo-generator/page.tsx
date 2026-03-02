'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from '@/components/tools/CopyButton'
import { Search, Loader2, Sparkles } from 'lucide-react'
import type { SeoOutput } from '@/types/app'

export default function SeoGeneratorPage() {
  const [content, setContent] = useState('')
  const [result, setResult] = useState<SeoOutput | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (content.trim().length < 50) {
      toast.error('Masukkan teks berita minimal 50 karakter')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/ai/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal generate SEO')
      setResult(data.result)
      toast.success('Metadata SEO berhasil digenerate!')
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
          <Search className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Generator SEO</h1>
          <p className="text-muted-foreground text-sm">
            Buat metadata SEO lengkap: meta title, deskripsi, keywords, dan slug URL.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Teks Berita / Artikel</Label>
            <Textarea
              id="content"
              placeholder="Paste teks berita Anda untuk digenerate metadata SEO-nya..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">{content.length} karakter</p>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading || content.trim().length < 50}
            className="w-full gap-2"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Sedang generate...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Generate Metadata SEO</>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <h2 className="font-semibold text-base">Hasil Metadata SEO</h2>

          {/* Meta Title */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Meta Title</CardTitle>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${result.metaTitle.length > 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {result.metaTitle.length}/60
                  </span>
                  <CopyButton text={result.metaTitle} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-medium">{result.metaTitle}</p>
            </CardContent>
          </Card>

          {/* Meta Description */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Meta Description</CardTitle>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${result.metaDescription.length > 160 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {result.metaDescription.length}/160
                  </span>
                  <CopyButton text={result.metaDescription} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">{result.metaDescription}</p>
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Keywords</CardTitle>
                <CopyButton text={result.keywords.join(', ')} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((kw, i) => (
                  <Badge key={i} variant="secondary">{kw}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Slug */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">URL Slug</CardTitle>
                <CopyButton text={result.slug} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <code className="text-sm bg-muted px-2 py-1 rounded font-mono">/{result.slug}</code>
            </CardContent>
          </Card>

          {/* Copy All */}
          <div className="flex justify-end">
            <CopyButton
              text={`Meta Title: ${result.metaTitle}\nMeta Description: ${result.metaDescription}\nKeywords: ${result.keywords.join(', ')}\nSlug: /${result.slug}`}
              variant="outline"
              size="default"
            />
          </div>
        </div>
      )}
    </div>
  )
}
