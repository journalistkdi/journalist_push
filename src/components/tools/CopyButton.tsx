'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'

interface CopyButtonProps {
  text: string
  size?: 'sm' | 'default'
  variant?: 'ghost' | 'outline' | 'default'
}

export function CopyButton({ text, size = 'sm', variant = 'ghost' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant={variant} size={size} onClick={handleCopy} className="gap-1.5">
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Disalin' : 'Salin'}
    </Button>
  )
}
