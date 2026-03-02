# JurnalAI — Panduan Deploy ke Vercel

---

## Prasyarat
- Akun [Vercel](https://vercel.com) (gratis)
- Project sudah di GitHub / GitLab / Bitbucket
- Supabase project sudah berjalan
- Google OAuth sudah dikonfigurasi

---

## Langkah 1: Push ke GitHub

```bash
# Di folder project
git init
git add .
git commit -m "Initial commit: JurnalAI"

# Buat repo baru di github.com, lalu:
git remote add origin https://github.com/username/journalist.git
git branch -M main
git push -u origin main
```

---

## Langkah 2: Import ke Vercel

1. Buka [vercel.com/new](https://vercel.com/new)
2. Klik **"Import Git Repository"**
3. Pilih repo `journalist` yang baru di-push
4. Framework preset: **Next.js** (otomatis terdeteksi)
5. **Jangan klik Deploy dulu** — isi Environment Variables terlebih dahulu

---

## Langkah 3: Isi Environment Variables di Vercel

Di halaman import, klik **"Environment Variables"**, lalu tambahkan satu per satu:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` (anon key) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` (service role key) |
| `NEXT_PUBLIC_SITE_URL` | `https://nama-project.vercel.app` |

> **Catatan:** `NEXT_PUBLIC_SITE_URL` diisi URL Vercel yang akan didapat setelah deploy.
> Jika belum tahu, isi dulu dengan placeholder, lalu update setelah deploy pertama selesai.

Klik **Deploy**.

---

## Langkah 4: Dapat URL Vercel

Setelah deploy selesai, Vercel akan memberikan URL seperti:
```
https://journalist-abc123.vercel.app
```

---

## Langkah 5: Update NEXT_PUBLIC_SITE_URL

1. Vercel Dashboard → Project → **Settings → Environment Variables**
2. Edit `NEXT_PUBLIC_SITE_URL` → isi dengan URL Vercel yang sebenarnya
3. Klik **Save**
4. Lakukan **Redeploy**: Deployments → pilih deployment terakhir → **Redeploy**

---

## Langkah 6: Update Supabase — URL Configuration

Buka **Supabase Dashboard → Authentication → URL Configuration**:

| Field | Value |
|-------|-------|
| Site URL | `https://nama-project.vercel.app` |
| Redirect URLs | `https://nama-project.vercel.app/auth/callback` |

> Tambahkan juga `http://localhost:3000/auth/callback` agar local dev tetap bisa login.

Klik **Save**.

---

## Langkah 7: Update Google Cloud Console

1. Buka [console.cloud.google.com](https://console.cloud.google.com)
2. **APIs & Services → Credentials → OAuth 2.0 Client ID**
3. Di **Authorized redirect URIs**, pastikan sudah ada:
   - `https://xxxx.supabase.co/auth/v1/callback` ✅ (sudah ada dari setup awal)
4. Di **Authorized JavaScript origins**, tambahkan:
   - `https://nama-project.vercel.app`
5. Klik **Save**

---

## Langkah 8: Test Production

1. Buka `https://nama-project.vercel.app`
2. Login dengan Google → seharusnya redirect ke dashboard
3. Test tools AI (Generator Judul, Parafrase, SEO)
4. Test admin panel di `/admin`

---

## Langkah 9: Custom Domain (Opsional)

1. Vercel Dashboard → Project → **Settings → Domains**
2. Klik **Add Domain** → masukkan domain Anda
3. Ikuti instruksi DNS yang diberikan Vercel
4. Setelah domain aktif, **update kembali**:
   - `NEXT_PUBLIC_SITE_URL` di Vercel → ganti ke domain custom
   - **Supabase** → Site URL & Redirect URLs → ganti ke domain custom
   - **Google Cloud Console** → Authorized origins → tambahkan domain custom
5. Redeploy

---

## Checklist Sebelum Launch

- [ ] Environment variables semua terisi di Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` sudah URL production (bukan localhost)
- [ ] Supabase Redirect URLs sudah ditambah URL production
- [ ] Google Cloud Console sudah ditambah authorized origin production
- [ ] Login Google berhasil di URL production
- [ ] Admin panel bisa diakses
- [ ] Minimal 1 tool AI berhasil generate (butuh Groq API key)

---

## Troubleshooting

**Error: redirect_uri_mismatch**
→ Cek Google Cloud Console, pastikan `https://xxxx.supabase.co/auth/v1/callback` ada di Authorized redirect URIs

**Redirect ke /auth/unauthorized setelah login**
→ Cek Supabase → Authentication → URL Configuration → Redirect URLs sudah ada URL production

**Environment variable tidak terbaca**
→ Setelah update env vars di Vercel, wajib Redeploy agar perubahan berlaku

**Build gagal di Vercel**
→ Pastikan semua env vars sudah diisi sebelum deploy, terutama `NEXT_PUBLIC_SUPABASE_URL`
