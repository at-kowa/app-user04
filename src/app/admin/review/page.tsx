"use client"

import * as React from "react"

import { useAppState } from "@/components/app-state"
import { AdminOnly, ListText, Notice, PageTitle, StatusBadge } from "@/components/common"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Submission } from "@/lib/types"

function SubmissionCard({ s, onMessage }: { s: Submission; onMessage: (m: { tone: "info" | "danger"; text: string }) => void }) {
  const { publish, reject, removeSubmission } = useAppState()
  const [rejecting, setRejecting] = React.useState(false)
  const [reason, setReason] = React.useState("")
  const t = s.tool

  const rows: [string, React.ReactNode][] = [
    ["カテゴリ", t.category],
    ["概要", t.summary],
    ["できること", <ListText key="can" items={t.can} />],
    ["向いている用途", <ListText key="good" items={t.goodFor} />],
    ["向いていない用途", <ListText key="ng" items={t.notGoodFor} />],
    ["キーワード", <ListText key="kw" items={t.keywords} />],
    ["利用中の部署", <ListText key="dept" items={t.depts} />],
    ["利用申請の方法", t.howToApply || "—"],
    ["問い合わせ窓口", t.contact || "—"],
    ...(s.reason ? ([["差し戻し理由", s.reason]] as [string, React.ReactNode][]) : []),
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          届出No.{s.no}　{t.name}
          <StatusBadge status={s.status} />
        </CardTitle>
        <CardDescription>
          {s.dept}／社員番号 {s.submitterId}／{s.date}
        </CardDescription>
        <CardAction>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (!window.confirm(`届出No.${s.no}（${t.name}）を削除します。よろしいですか？`)) return
              removeSubmission(s.no)
              onMessage({ tone: "info", text: `届出No.${s.no} を削除しました。` })
            }}
          >
            削除
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <dl>
          {rows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[160px_1fr] border-b py-2 last:border-b-0">
              <dt className="text-sm font-semibold text-muted-foreground">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
      {s.status === "未確認" && (
        <CardFooter className="block">
          {rejecting ? (
            <form
              className="grid gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (!reason.trim()) return
                reject(s.no, reason.trim())
                setRejecting(false)
                onMessage({ tone: "info", text: `届出No.${s.no} を差し戻しました。` })
              }}
            >
              <Label htmlFor={`reason-${s.no}`}>差し戻し理由</Label>
              <Textarea
                id={`reason-${s.no}`}
                placeholder="例：「向いている用途」の記入をお願いします"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={!reason.trim()}>
                  差し戻す
                </Button>
                <Button type="button" variant="ghost" onClick={() => setRejecting(false)}>
                  やめる
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const err = publish(s.no)
                  onMessage(
                    err
                      ? { tone: "danger", text: `公開できません：${err}` }
                      : { tone: "info", text: `${t.name} を公開しました。費用・契約情報はツール詳細の「ツール情報を更新」から設定してください。` }
                  )
                }}
              >
                公開する
              </Button>
              <Button variant="outline" onClick={() => setRejecting(true)}>
                差し戻す
              </Button>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

export default function ReviewPage() {
  const { submissions } = useAppState()
  const [message, setMessage] = React.useState<{ tone: "info" | "danger"; text: string } | null>(null)
  const sorted = [...submissions].sort((a, b) => b.no - a.no)

  return (
    <AdminOnly>
      <PageTitle title="届出の確認" description="内容を確認・整えたうえで公開してください。不備があれば理由を付けて差し戻します。" />
      {message && (
        <Notice tone={message.tone} className="mb-4">
          {message.text}
        </Notice>
      )}
      <Notice tone="warn" className="mb-4">
        <b>確認のポイント</b>：個人名・取引先名・契約書の本文などの個人情報や機密が書かれていないかを確認してください。費用・契約情報は公開後に「ツール情報を更新」から設定します。
      </Notice>
      <div className="grid gap-4">
        {sorted.length ? (
          sorted.map((s) => <SubmissionCard key={s.no} s={s} onMessage={setMessage} />)
        ) : (
          <p className="text-muted-foreground">届出はありません。</p>
        )}
      </div>
    </AdminOnly>
  )
}
