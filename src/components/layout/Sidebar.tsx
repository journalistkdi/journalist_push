'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Newspaper,
  FileText,
  Search,
  User,
  Users,
  ListChecks,
  Shield,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type NavLeaf = { title: string; href: string; icon: LucideIcon }
type NavGroup = { title: string; items: NavLeaf[] }
type NavSection = NavLeaf | NavGroup

const navItems: NavSection[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Tools',
    items: [
      { title: 'Generator Judul', href: '/tools/title-generator', icon: Newspaper },
      { title: 'Parafrase Berita', href: '/tools/paraphrase', icon: FileText },
      { title: 'Generator SEO', href: '/tools/seo-generator', icon: Search },
    ],
  },
  {
    title: 'Akun',
    items: [{ title: 'Profil', href: '/profile', icon: User }],
  },
]

const adminNavItems: NavSection[] = [
  {
    title: 'Admin',
    items: [
      { title: 'Overview Admin', href: '/admin', icon: Shield },
      { title: 'Kelola Pengguna', href: '/admin/users', icon: Users },
      { title: 'Whitelist Email', href: '/admin/whitelist', icon: ListChecks },
    ],
  },
]

interface SidebarProps {
  isAdmin?: boolean
  onNavClick?: () => void
}

export function Sidebar({ isAdmin, onNavClick }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const renderNavItems = (items: NavSection[]) =>
    items.map((section) => (
      <div key={section.title} className="space-y-1">
        {'href' in section ? (
          <Link
            href={section.href}
            onClick={onNavClick}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              pathname === section.href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <section.icon className="h-4 w-4" />
            {section.title}
          </Link>
        ) : (
          <>
            <p className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              {section.title}
            </p>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavClick}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </>
        )}
      </div>
    ))

  return (
    <nav className="flex flex-col h-full px-3 py-4">
      <div className="flex-1 space-y-1">
        {renderNavItems(navItems)}
        {isAdmin && renderNavItems(adminNavItems)}
      </div>

      {/* Tombol Keluar selalu terlihat di bawah sidebar */}
      <div className="border-t pt-3 mt-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </nav>
  )
}
