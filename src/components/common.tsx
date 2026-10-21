"use client"

import type * as React from "react"

import { useAppState } from "@/components/app-state"
import { Badge } from "@/components/ui/badge"
import type { SubmissionStatus, Tool } from "@/lib/types"
import { cn } from "@/lib/utils"

export function ListText({ items }: { items: string[] }) {
  if (!items.length) return <span className="text-muted-foreground">（未記入）</span>
  return <>{items.join("、")}</>
}

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  const cls =
    status === "公開済み"
      ? "border-green-300 bg-green-50 text-green-700"
      : status === "差し戻し"
        ? "border-red-300 bg-red-50 text-red-700"
        : "border-amber-300 bg-amber-50 text-amber-800"
  return (
    <Badge variant="outline" className={cls}>
      {status}
    </Badge>
  )
}

/**
 * 費用の表示。非公開の費用は一般社員には項目ごと出さない（要件定義書 5章）。
 * 表示しない場合は null を返すので、呼び出し側で行ごと省略する。
 */
export function useCostDisplay() {
  const { isAdmin } = useAppState()
  return function costOf(t: Tool): React.ReactNode | null {
    if (isAdmin)
      return (
        <span className="inline-flex items-center gap-2">
          {t.cost || <span className="text-muted-foreground">未設定</span>}
          <Badge variant={t.costPublic ? "outline" : "secondary"}>{t.costPublic ? "公開" : "非公開"}</Badge>
        </span>
      )
    return t.costPublic && t.cost ? t.cost : null
  }
}

export function Notice({
  tone = "info",
  className,
  children,
}: {
  tone?: "info" | "warn" | "danger"
  className?: string
  children: React.ReactNode
}) {
  const toneCls = {
    info: "border-blue-200 bg-blue-50 text-blue-950",
    warn: "border-amber-300 bg-amber-50 text-amber-900",
    danger: "border-red-200 bg-red-50 text-red-900",
  }[tone]
  return (
    <div role="status" className={cn("rounded-lg border px-4 py-3 text-sm", toneCls, className)}>
      {children}
    </div>
  )
}

export function PageTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && <p className="mt-1.5 text-muted-foreground">{description}</p>}
    </div>
  )
}

/** 情報システム部門専用の画面で、一般社員には中身を出さない */
export function AdminOnly({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAppState()
  if (!isAdmin)
    return <Notice>このページは情報システム部門のみ表示できます。</Notice>
  return <>{children}</>
}
