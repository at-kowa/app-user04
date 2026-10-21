"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

import { useAppState } from "@/components/app-state"
import { AdminOnly, Notice, PageTitle } from "@/components/common"
import { FIELD_LABELS, ToolForm } from "@/components/tool-form"
import { buttonVariants } from "@/components/ui/button"
import type { Tool } from "@/lib/types"

export default function ToolEditPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { tools, updateTool } = useAppState()
  const tool = tools.find((t) => t.id === id)

  return (
    <AdminOnly>
      {!tool ? (
        <Notice>ツールが見つかりません。</Notice>
      ) : (
        <div>
          <Link href={`/tools/${tool.id}`} className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-4" })}>
            ← 詳細に戻る
          </Link>
          <PageTitle title={`${tool.name} の情報を更新`} description="内容の追加・修正と、費用公開区分の設定を行います。変更は変更履歴に記録されます。" />
          <ToolForm
            initial={tool}
            withContract
            submitLabel="保存する"
            onCancel={() => router.push(`/tools/${tool.id}`)}
            onSubmit={(v) => {
              const next = v as Omit<Tool, "id">
              const rec = tool as Record<string, unknown>
              const changed = Object.keys(next)
                .filter((k) => JSON.stringify((next as Record<string, unknown>)[k]) !== JSON.stringify(rec[k]))
                .map((k) => FIELD_LABELS[k])
              updateTool(tool.id, next, changed)
              router.push(`/tools/${tool.id}`)
            }}
          />
        </div>
      )}
    </AdminOnly>
  )
}
