"use client"

import Link from "next/link"
import * as React from "react"

import { useAppState } from "@/components/app-state"
import { Notice } from "@/components/common"
import { ToolCard } from "@/components/tool-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { searchTools } from "@/lib/search"
import { CATEGORIES } from "@/lib/types"
import { cn } from "@/lib/utils"

const EXAMPLES = ["日程を調整したい", "部署内アンケートを集計したい", "申請を電子化したい", "議事録をみんなで作りたい", "売上を分析したい"]

function Chip({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-0.5 text-sm hover:bg-muted",
        active && "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
      )}
    >
      {children}
    </button>
  )
}

export default function SearchPage() {
  const { tools, query, setQuery, category, setCategory } = useAppState()
  const [draft, setDraft] = React.useState(query)
  const results = searchTools(tools, query, category)

  const runSearch = (q: string) => {
    setDraft(q)
    setQuery(q)
  }

  return (
    <div>
      <section className="pb-6">
        <h1 className="text-2xl font-bold">やりたいことから、社内のツールを探す</h1>
        <p className="mt-1.5 text-muted-foreground">
          システム名を知らなくても大丈夫です。「日程を調整したい」など、やりたいことをそのまま入力してください。
        </p>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            setQuery(draft)
          }}
        >
          <Input
            aria-label="やりたいこと"
            className="h-11 text-base md:text-base"
            placeholder="例：部署内アンケートを集計したい"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
          />
          <Button type="submit" className="h-11 px-6">
            探す
          </Button>
          {(query || category) && (
            <Button
              type="button"
              variant="ghost"
              className="h-11"
              onClick={() => {
                runSearch("")
                setCategory(null)
              }}
            >
              条件をクリア
            </Button>
          )}
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-sm">
          <span className="text-muted-foreground">入力例：</span>
          {EXAMPLES.map((e) => (
            <Chip key={e} onClick={() => runSearch(e)}>
              {e}
            </Chip>
          ))}
        </div>
      </section>

      <div className="mb-5 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-sm text-muted-foreground">カテゴリから探す：</span>
        <Chip active={!category} onClick={() => setCategory(null)}>
          すべて
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
            {c}
          </Chip>
        ))}
      </div>

      <p className="mb-3 text-sm text-muted-foreground">
        {results.length}件のツールが見つかりました{query.trim() && "（合いそうな順）"}
      </p>

      {results.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <ToolCard key={r.tool.id} tool={r.tool} hits={r.hits} />
          ))}
        </div>
      ) : (
        <Notice>
          合うツールが見つかりませんでした。別の言葉（例：「集計」「共有」「申請」）で探すか、情報システム部門へご相談ください。
          <br />
          社内で使っているのに載っていないツールがあれば、
          <Link href="/submit" className="underline">
            届け出
          </Link>
          をお願いします。
        </Notice>
      )}
    </div>
  )
}
