'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import type { WhitelistEntry } from '@/types/app'

export default function WhitelistPage() {
  const [entries, setEntries] = useState<WhitelistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [groqKey, setGroqKey] = useState('')
  const [notes, setNotes] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [adding, setAdding] = useState(false)

  const fetchWhitelist = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/whitelist')
      const data = await res.json()
      setEntries(data.entries ?? [])
    } catch {
      toast.error('Gagal memuat whitelist')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchWhitelist() }, [])

  const handleAdd = async () => {
    if (!email) { toast.error('Email wajib diisi'); return }
    setAdding(true)
    try {
      const res = await fetch('/api/admin/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, groq_api_key: groqKey, notes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Email berhasil ditambahkan ke whitelist')
      setAddOpen(false)
      setEmail(''); setGroqKey(''); setNotes('')
      fetchWhitelist()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Gagal menambahkan')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string, entryEmail: string) => {
    if (!confirm(`Hapus ${entryEmail} dari whitelist?`)) return
    try {
      const res = await fetch(`/api/admin/whitelist/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Gagal menghapus')
      toast.success('Email dihapus dari whitelist')
      fetchWhitelist()
    } catch {
      toast.error('Gagal menghapus dari whitelist')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Whitelist Email</h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola email yang diizinkan untuk login.</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Tambah Email</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah ke Whitelist</DialogTitle>
              <DialogDescription>
                Tambahkan alamat Gmail yang diizinkan untuk login ke sistem.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Email (Gmail) *</Label>
                <Input
                  type="email"
                  placeholder="nama@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Groq API Key</Label>
                <div className="relative">
                  <Input
                    type={showKey ? 'text' : 'password'}
                    placeholder="gsk_... (opsional)"
                    value={groqKey}
                    onChange={(e) => setGroqKey(e.target.value)}
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
              </div>
              <div className="space-y-2">
                <Label>Catatan</Label>
                <Input
                  placeholder="Nama jurnalis, redaksi, dll. (opsional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddOpen(false)}>Batal</Button>
              <Button onClick={handleAdd} disabled={adding}>
                {adding ? 'Menambahkan...' : 'Tambahkan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Catatan</TableHead>
              <TableHead>API Key</TableHead>
              <TableHead>Ditambahkan</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Memuat...
                </TableCell>
              </TableRow>
            ) : entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Belum ada email di whitelist
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.email}</TableCell>
                  <TableCell className="text-muted-foreground">{entry.notes ?? '-'}</TableCell>
                  <TableCell>
                    {entry.groq_api_key ? (
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                        Terkonfigurasi
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Tidak ada</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(entry.created_at).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(entry.id, entry.email)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
