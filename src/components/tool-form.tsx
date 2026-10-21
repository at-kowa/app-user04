"use client"

import * as React from "react"

import { validateBasic } from "@/components/app-state"
import { Notice } from "@/components/common"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CATEGORIES, type Tool, type ToolBasic, type ToolContract } from "@/lib/types"

type FieldType = "text" | "textarea" | "list" | "category" | "costPublic" | "number"
type Field<K extends string> = { key: K; label: string; type: FieldType; help?: string }

export const BASIC_FIELDS: Field<keyof ToolBasic>[] = [
  { key: "name", label: "ツール名", type: "text", help: "必須" },
  { key: "category", label: "カテゴリ", type: "category", help: "必須" },
  { key: "summary", label: "概要", type: "textarea", help: "必須。どんなツールかを1〜2文で" },
  { key: "can", label: "できること", type: "list", help: "読点（、）区切りで複数入力できます" },
  { key: "goodFor", label: "向いている用途", type: "list", help: "例：部署内の情報共有、少人数のアンケート" },
  { key: "notGoodFor", label: "向いていない用途", type: "list", help: "例：大量データの集計、社外との共有" },
  { key: "keywords", label: "キーワード", type: "list", help: "「やりたいこと」で探されそうな言葉" },
  { key: "depts", label: "利用中の部署", type: "list" },
  { key: "howToApply", label: "利用申請の方法", type: "text" },
  { key: "contact", label: "問い合わせ窓口", type: "text", help: "部署名のみ（個人名は書かない）" },
  { key: "manual", label: "操作マニュアルの所在", type: "text" },
]

export const CONTRACT_FIELDS: Field<keyof ToolContract>[] = [
  { key: "cost", label: "費用", type: "text", help: "例：月額 ○○円／1ライセンス" },
  {
    key: "costPublic",
    label: "費用公開区分",
    type: "costPublic",
    help: "基幹システムは非公開。月額ライセンス型は原則公開。契約で価格の社内公開が認められていない場合は非公開",
  },
  { key: "term", label: "契約期間", type: "text" },
  { key: "licTotal", label: "ライセンス数", type: "number" },
  { key: "licUsed", label: "うち使用中", type: "number" },
]

export const FIELD_LABELS: Record<string, string> = Object.fromEntries(
  [...BASIC_FIELDS, ...CONTRACT_FIELDS].map((f) => [f.key, f.label])
)

type Values = Record<string, string>

function toValues(src: Partial<Tool>, fields: Field<string>[]): Values {
  const rec = src as Record<string, unknown>
  return Object.fromEntries(
    fields.map((f) => {
      const v = rec[f.key]
      if (f.type === "list") return [f.key, ((v as string[] | undefined) ?? []).join("、")]
      if (f.type === "costPublic") return [f.key, v ? "公開" : "非公開"]
      return [f.key, v === undefined || v === null ? "" : String(v)]
    })
  )
}

function fromValues(values: Values, fields: Field<string>[]) {
  return Object.fromEntries(
    fields.map((f) => {
      const v = values[f.key] ?? ""
      if (f.type === "list") return [f.key, v.split(/[、,，\n]/).map((s) => s.trim()).filter(Boolean)]
      if (f.type === "costPublic") return [f.key, v === "公開"]
      if (f.type === "number") return [f.key, v === "" ? 0 : Math.max(0, Number(v) || 0)]
      return [f.key, v.trim()]
    })
  )
}

function FieldInput({ field, value, onChange }: { field: Field<string>; value: string; onChange: (v: string) => void }) {
  const id = `field-${field.key}`
  let input: React.ReactNode
  if (field.type === "textarea") {
    input = <Textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} />
  } else if (field.type === "category" || field.type === "costPublic") {
    const options = field.type === "category" ? [...CATEGORIES] : ["公開", "非公開"]
    input = (
      <Select value={value || null} onValueChange={(v) => onChange(v ? String(v) : "")}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue>{(v: string | null) => v || <span className="text-muted-foreground">選択してください</span>}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  } else {
    input = (
      <Input
        id={id}
        type={field.type === "number" ? "number" : "text"}
        min={field.type === "number" ? 0 : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  }
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{field.label}</Label>
      {input}
      {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
    </div>
  )
}

export function ToolForm({
  initial,
  withContract = false,
  submitLabel,
  onSubmit,
  onCancel,
  cancelLabel = "やめる",
}: {
  initial: Partial<Tool>
  withContract?: boolean
  submitLabel: string
  onSubmit: (value: ToolBasic & Partial<ToolContract>) => void
  onCancel?: () => void
  cancelLabel?: string
}) {
  const fields: Field<string>[] = withContract ? [...BASIC_FIELDS, ...CONTRACT_FIELDS] : BASIC_FIELDS
  const [values, setValues] = React.useState<Values>(() => toValues(initial, fields))
  const [error, setError] = React.useState<string | null>(null)

  const set = (key: string, v: string) => setValues((s) => ({ ...s, [key]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = fromValues(values, fields) as ToolBasic & Partial<ToolContract>
    const err = validateBasic(result)
    setError(err)
    if (!err) onSubmit(result)
  }

  const section = (title: string, fs: Field<string>[]) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        {fs.map((f) => (
          <FieldInput key={f.key} field={f} value={values[f.key] ?? ""} onChange={(v) => set(f.key, v)} />
        ))}
      </CardContent>
    </Card>
  )

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {section("基本情報・利用状況", BASIC_FIELDS)}
      {withContract && section("契約情報", CONTRACT_FIELDS)}
      {error && <Notice tone="danger">{error}</Notice>}
      <div className="flex gap-2">
        <Button type="submit" size="lg" className="px-4">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" size="lg" onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
      </div>
    </form>
  )
}
