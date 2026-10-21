"use client"

import * as React from "react"

import { useAppState } from "@/components/app-state"
import { Notice, PageTitle, StatusBadge } from "@/components/common"
import { ToolForm } from "@/components/tool-form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SubmitPage() {
  const { submissions, user, submit, resubmit } = useAppState()
  const [editingNo, setEditingNo] = React.useState<number | null>(null)
  const [message, setMessage] = React.useState<string | null>(null)
  // 送信後にフォームを空に戻すためのキー
  const [formKey, setFormKey] = React.useState(0)

  // 本人の届出のみ表示する（他人の届出は見えない）
  const mine = submissions.filter((s) => s.submitterId === user.id).sort((a, b) => b.no - a.no)
  const editing = mine.find((s) => s.no === editingNo && s.status === "差し戻し")

  const done = (text: string) => {
    setMessage(text)
    setEditingNo(null)
    setFormKey((k) => k + 1)
    window.scrollTo(0, 0)
  }

  return (
    <div>
      <PageTitle
        title="新しいツールを届け出る"
        description="部署で導入したツールを届け出てください。情報システム部門が内容を確認したうえで一覧に公開します。確認が終わるまでは、届出者本人と情報システム部門にのみ表示されます。"
      />
      {message && <Notice className="mb-4">{message}</Notice>}
      <Notice tone="warn" className="mb-4">
        <b>入力時の注意</b>：個人名・取引先名・契約書の本文は書かないでください。問い合わせ窓口は部署名のみを記入してください。
      </Notice>
      {editing && (
        <Notice tone="danger" className="mb-4">
          <b>届出No.{editing.no} の修正</b>（差し戻し理由：{editing.reason}）
        </Notice>
      )}

      <ToolForm
        key={`${formKey}-${editing?.no ?? "new"}`}
        initial={editing?.tool ?? {}}
        submitLabel={editing ? "修正して再提出する" : "届け出る"}
        onCancel={editing ? () => setEditingNo(null) : undefined}
        cancelLabel="修正をやめる"
        onSubmit={(v) => {
          if (editing) {
            resubmit(editing.no, v)
            done(`届出No.${editing.no} を再提出しました。`)
          } else {
            const no = submit(v)
            done(`届出No.${no} として受け付けました。情報システム部門の確認後に公開されます。`)
          }
        }}
      />

      <Separator className="my-8" />

      <h2 className="mb-3 text-lg font-bold">あなたの届出</h2>
      {mine.length ? (
        <Card className="py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>届出No.</TableHead>
                <TableHead>ツール名</TableHead>
                <TableHead>届出日</TableHead>
                <TableHead>確認状況</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {mine.map((s) => (
                <TableRow key={s.no}>
                  <TableCell>{s.no}</TableCell>
                  <TableCell>{s.tool.name}</TableCell>
                  <TableCell>{s.date}</TableCell>
                  <TableCell className="whitespace-normal">
                    <StatusBadge status={s.status} />
                    {s.status === "差し戻し" && <div className="mt-1 text-xs">理由：{s.reason}</div>}
                  </TableCell>
                  <TableCell>
                    {s.status === "差し戻し" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingNo(s.no)
                          setMessage(null)
                          window.scrollTo(0, 0)
                        }}
                      >
                        修正する
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <p className="text-muted-foreground">まだ届出はありません。</p>
      )}
    </div>
  )
}
