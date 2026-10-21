"use client"

import { useAppState } from "@/components/app-state"
import { AdminOnly, PageTitle } from "@/components/common"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function HistoryPage() {
  const { history } = useAppState()
  const rows = [...history].reverse()

  return (
    <AdminOnly>
      <PageTitle
        title="変更履歴"
        description="ツール情報・届出の追加・修正・差し戻し・公開・削除を記録しています。記録は編集・削除できません。"
      />
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>変更日時</TableHead>
              <TableHead>変更者の社員番号</TableHead>
              <TableHead>対象</TableHead>
              <TableHead>操作</TableHead>
              <TableHead>変更内容</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((h, i) => (
              <TableRow key={`${h.at}-${i}`}>
                <TableCell>{h.at}</TableCell>
                <TableCell>{h.by}</TableCell>
                <TableCell>{h.target}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{h.op}</Badge>
                </TableCell>
                <TableCell className="whitespace-normal">{h.detail}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </AdminOnly>
  )
}
