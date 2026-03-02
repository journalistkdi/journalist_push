import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { Newspaper } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground">
              <Newspaper className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">JurnalAI</h1>
          <p className="text-muted-foreground text-sm">
            Alat bantu AI untuk jurnalis profesional
          </p>
        </div>

        <div className="bg-card border rounded-xl p-8 shadow-sm space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-semibold">Masuk ke Akun Anda</h2>
            <p className="text-sm text-muted-foreground">
              Gunakan akun Gmail yang telah didaftarkan
            </p>
          </div>

          <GoogleSignInButton />

          <p className="text-xs text-center text-muted-foreground">
            Hanya akun yang telah diizinkan admin yang dapat masuk.
            Hubungi administrator untuk mendapatkan akses.
          </p>
        </div>
      </div>
    </div>
  )
}
