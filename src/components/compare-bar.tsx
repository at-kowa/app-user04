"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { useAppState } from "@/components/app-state"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** 比較候補が選ばれているときに画面下に出す帯 */
export function CompareBar() {
  const { compareIds, tools, maxCompare, clearCompare } = useAppState()
  const pathname = usePathname()
  if (!compareIds.length || pathname === "/compare") return null
  const names = compareIds.map((id) => tools.find((t) => t.id === id)?.name).filter(Boolean)

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 text-sm">
        <span>
          比較の候補：<b>{names.join("、")}</b>（{names.length}/{maxCompare}）
        </span>
        <span className="flex-1" />
        <Button variant="ghost" size="sm" onClick={clearCompare}>
          クリア
        </Button>
        {names.length >= 2 ? (
          <Link href="/compare" className={buttonVariants({ size: "sm" })}>
            比較する
          </Link>
        ) : (
          <span className={cn(buttonVariants({ size: "sm" }), "pointer-events-none opacity-50")}>
            もう1つ選ぶと比較できます
          </span>
        )}
      </div>
    </div>
  )
}
