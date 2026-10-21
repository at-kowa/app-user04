"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { useAppState } from "@/components/app-state"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Role } from "@/lib/types"
import { cn } from "@/lib/utils"

const ROLE_LABELS: Record<Role, string> = { general: "一般社員", admin: "情報システム部門" }

export function SiteHeader() {
  const { role, setRole, isAdmin, compareIds, submissions } = useAppState()
  const pathname = usePathname()
  const pending = submissions.filter((s) => s.status === "未確認").length

  const items = [
    { href: "/", label: "探す", active: pathname === "/" || pathname.startsWith("/tools") },
    { href: "/compare", label: `比較${compareIds.length ? `（${compareIds.length}）` : ""}` },
    { href: "/submit", label: "届け出る" },
    ...(isAdmin
      ? [
          { href: "/admin/review", label: `届出の確認${pending ? `（${pending}）` : ""}` },
          { href: "/admin/history", label: "変更履歴" },
        ]
      : []),
  ]

  return (
    <header className="sticky top-0 z-20 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-6">
        <Link href="/" className="font-bold whitespace-nowrap">
          社内ツール案内
        </Link>
        <nav className="flex flex-1 gap-1">
          {items.map((item) => {
            const active = item.active ?? pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                  active && "bg-muted font-semibold text-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>表示の立場（試作用）</span>
          <Select value={role} onValueChange={(v) => v && setRole(v as Role)}>
            <SelectTrigger size="sm" className="min-w-36">
              <SelectValue>{(v: Role) => ROLE_LABELS[v]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">一般社員</SelectItem>
              <SelectItem value="admin">情報システム部門</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  )
}
