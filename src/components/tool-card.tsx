"use client"

import Link from "next/link"

import { useAppState } from "@/components/app-state"
import { ListText } from "@/components/common"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { Tool } from "@/lib/types"

export function ToolCard({ tool, hits }: { tool: Tool; hits: string[] }) {
  const { compareIds, toggleCompare, maxCompare } = useAppState()
  const checked = compareIds.includes(tool.id)
  const full = !checked && compareIds.length >= maxCompare
  const checkboxId = `compare-${tool.id}`

  return (
    <Card>
      <CardHeader>
        <div>
          <Badge variant="outline">{tool.category}</Badge>
        </div>
        <CardTitle className="text-lg font-semibold">
          <Link href={`/tools/${tool.id}`} className="hover:underline">
            {tool.name}
          </Link>
        </CardTitle>
        <CardDescription>{tool.summary}</CardDescription>
        <CardAction>
          <label
            htmlFor={checkboxId}
            className="flex cursor-pointer items-center gap-2 text-xs whitespace-nowrap"
            title={full ? `比較できるのは${maxCompare}つまでです` : undefined}
          >
            <Checkbox id={checkboxId} checked={checked} disabled={full} onCheckedChange={() => toggleCompare(tool.id)} />
            比較に追加
          </label>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-1.5 text-sm">
        {hits.length > 0 && (
          <p className="flex flex-wrap items-center gap-1">
            <span className="text-xs text-muted-foreground">一致した言葉：</span>
            {hits.map((h) => (
              <mark key={h} className="rounded bg-yellow-200 px-1">
                {h}
              </mark>
            ))}
          </p>
        )}
        <p>
          <b>向いている：</b>
          <ListText items={tool.goodFor} />
        </p>
        <p className="text-muted-foreground">
          <b>向いていない：</b>
          <ListText items={tool.notGoodFor} />
        </p>
      </CardContent>
      <CardFooter>
        <Link href={`/tools/${tool.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
          詳しく見る
        </Link>
      </CardFooter>
    </Card>
  )
}
