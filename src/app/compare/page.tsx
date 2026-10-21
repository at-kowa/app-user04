"use client"

import Link from "next/link"
import type * as React from "react"

import { useAppState } from "@/components/app-state"
import { ListText, Notice, PageTitle, useCostDisplay } from "@/components/common"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Tool } from "@/lib/types"

export default function ComparePage() {
  const { compareIds, tools, toggleCompare } = useAppState()
  const costOf = useCostDisplay()
  const selected = compareIds.map((id) => tools.find((t) => t.id === id)).filter((t): t is Tool => !!t)

  if (selected.length < 2)
    return (
      <div>
        <PageTitle title="候補を比較する" />
        <Notice>
          比較するには、検索結果で「比較に追加」にチェックを入れてください（2〜3個）。
          <div className="mt-2">
            <Link href="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
              ツールを探す
            </Link>
          </div>
        </Notice>
      </div>
    )

  const rows: [string, (t: Tool) => React.ReactNode][] = [
    ["カテゴリ", (t) => t.category],
    ["概要", (t) => t.summary],
    ["できること", (t) => <ListText items={t.can} />],
    ["向いている用途", (t) => <ListText items={t.goodFor} />],
    ["向いていない用途", (t) => <ListText items={t.notGoodFor} />],
    ["利用中の部署", (t) => <ListText items={t.depts} />],
    ["利用申請の方法", (t) => t.howToApply || "—"],
    ["問い合わせ窓口", (t) => t.contact || "—"],
    ["費用", (t) => costOf(t) ?? <span className="text-muted-foreground">—</span>],
    ["契約期間", (t) => t.term || "—"],
    ["ライセンス数", (t) => (t.licTotal ? `${t.licTotal}（うち使用中 ${t.licUsed}）` : "—")],
  ]

  return (
    <div>
      <PageTitle title="候補を比較する" description="似たツールを並べて、違いを確認できます。" />
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40" />
              {selected.map((t) => (
                <TableHead key={t.id} className="min-w-56">
                  <div className="flex items-center gap-2">
                    <Link href={`/tools/${t.id}`} className="text-base font-semibold text-foreground hover:underline">
                      {t.name}
                    </Link>
                    <span className="flex-1" />
                    <Button variant="ghost" size="sm" onClick={() => toggleCompare(t.id)}>
                      外す
                    </Button>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(([label, render]) => (
              <TableRow key={label}>
                <TableHead className="bg-muted/50 align-top">{label}</TableHead>
                {selected.map((t) => (
                  <TableCell key={t.id} className="align-top whitespace-normal">
                    {render(t)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
