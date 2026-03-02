import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShieldX } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
            <ShieldX className="h-8 w-8 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Akses Ditolak</h1>
          <p className="text-muted-foreground">
            Akun email Anda belum terdaftar dalam sistem. Silakan hubungi
            administrator untuk mendapatkan akses ke JurnalAI.
          </p>
        </div>

        <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
          <p>Jika Anda merasa ini adalah kesalahan, hubungi admin dan berikan alamat Gmail Anda.</p>
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href="/auth/login">Kembali ke Halaman Login</Link>
        </Button>
      </div>
    </div>
  )
}
