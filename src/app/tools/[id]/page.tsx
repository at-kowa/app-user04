"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import type * as React from "react"

import { useAppState } from "@/components/app-state"
import { ListText, Notice, useCostDisplay } from "@/components/common"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[180px_1fr] border-b py-2.5 last:border-b-0">
      <dt className="text-sm font-semibold text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

function Bullets({ items }: { items: string[] }) {
  if (!items.length) return <p className="text-muted-foreground">（未記入）</p>
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  )
}

export default function ToolDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { tools, isAdmin, compareIds, toggleCompare, maxCompare } = useAppState()
  const costOf = useCostDisplay()
  const tool = tools.find((t) => t.id === id)

  if (!tool)
    return (
      <Notice>
        ツールが見つかりません。<Link href="/" className="underline">検索に戻る</Link>
      </Notice>
    )

  const inCompare = compareIds.includes(tool.id)
  const cost = costOf(tool)

  return (
    <div className="grid gap-5">
      <div>
        <Link href="/" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          ← 検索に戻る
        </Link>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1">
          <Badge variant="outline">{tool.category}</Badge>
          <h1 className="mt-2 text-2xl font-bold">{tool.name}</h1>
          <p className="mt-1 text-muted-foreground">{tool.summary}</p>
        </div>
        <Button
          variant="outline"
          size="lg"
          className="px-4"
          onClick={() => toggleCompare(tool.id)}
          disabled={!inCompare && compareIds.length >= maxCompare}
        >
          {inCompare ? "比較から外す" : "比較に追加"}
        </Button>
        {isAdmin && (
          <Link href={`/tools/${tool.id}/edit`} className={buttonVariants({ size: "lg", className: "px-4" })}>
            ツール情報を更新
          </Link>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>向いている用途</CardTitle>
          </CardHeader>
          <CardContent>
            <Bullets items={tool.goodFor} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>向いていない用途</CardTitle>
          </CardHeader>
          <CardContent>
            <Bullets items={tool.notGoodFor} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>詳細</CardTitle>
        </CardHeader>
        <CardContent>
          <dl>
            <Row label="できること">
              <ListText items={tool.can} />
            </Row>
            <Row label="利用中の部署">
              <ListText items={tool.depts} />
            </Row>
            <Row label="利用申請の方法">{tool.howToApply || "—"}</Row>
            <Row label="問い合わせ窓口">{tool.contact || "—"}</Row>
            <Row label="操作マニュアル">{tool.manual || "—"}</Row>
            {isAdmin && (
              <Row label="キーワード">
                <ListText items={tool.keywords} />
              </Row>
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>契約情報</CardTitle>
        </CardHeader>
        <CardContent>
          <dl>
            {cost !== null && <Row label="費用">{cost}</Row>}
            <Row label="契約期間">{tool.term || "—"}</Row>
            <Row label="ライセンス数">{tool.licTotal ? `${tool.licTotal}（うち使用中 ${tool.licUsed}）` : "—"}</Row>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            利用申請の手続きや操作方法は、各ツールの案内・マニュアルをご確認ください。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
