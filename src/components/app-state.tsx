"use client"

// 第1版はデータをメモリ上で持つ（再読み込みで初期状態に戻る）。
// データベース接続・社内アカウントでのログインは今後の手順で置き換える。
import * as React from "react"

import { INITIAL_HISTORY, INITIAL_SUBMISSIONS, INITIAL_TOOLS, USERS } from "@/lib/mock-data"
import type { HistoryEntry, HistoryOp, Role, Submission, Tool, ToolBasic, User } from "@/lib/types"

const MAX_COMPARE = 3

function pad(n: number) {
  return String(n).padStart(2, "0")
}
function today() {
  const d = new Date()
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`
}
function now() {
  const d = new Date()
  return `${today()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function validateBasic(t: ToolBasic): string | null {
  const missing = [!t.name && "ツール名", !t.category && "カテゴリ", !t.summary && "概要"].filter(Boolean)
  return missing.length ? `${missing.join("・")}を入力してください。` : null
}

type AppState = {
  role: Role
  setRole: (r: Role) => void
  user: User
  isAdmin: boolean
  tools: Tool[]
  submissions: Submission[]
  history: HistoryEntry[]
  query: string
  setQuery: (q: string) => void
  category: string | null
  setCategory: (c: string | null) => void
  compareIds: string[]
  maxCompare: number
  toggleCompare: (id: string) => void
  clearCompare: () => void
  submit: (tool: ToolBasic) => number
  resubmit: (no: number, tool: ToolBasic) => void
  publish: (no: number) => string | null
  reject: (no: number, reason: string) => void
  removeSubmission: (no: number) => void
  updateTool: (id: string, next: Omit<Tool, "id">, changedLabels: string[]) => void
}

const AppStateContext = React.createContext<AppState | null>(null)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = React.useState<Role>("general")
  const [tools, setTools] = React.useState<Tool[]>(INITIAL_TOOLS)
  const [submissions, setSubmissions] = React.useState<Submission[]>(INITIAL_SUBMISSIONS)
  const [history, setHistory] = React.useState<HistoryEntry[]>(INITIAL_HISTORY)
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState<string | null>(null)
  const [compareIds, setCompareIds] = React.useState<string[]>([])
  const nextNo = React.useRef(Math.max(...INITIAL_SUBMISSIONS.map((s) => s.no)) + 1)

  const user = USERS[role]

  const log = (target: string, op: HistoryOp, detail: string) =>
    setHistory((h) => [...h, { at: now(), by: user.id, target, op, detail }])

  const value: AppState = {
    role,
    setRole,
    user,
    isAdmin: role === "admin",
    tools,
    submissions,
    history,
    query,
    setQuery,
    category,
    setCategory,
    compareIds,
    maxCompare: MAX_COMPARE,
    toggleCompare: (id) =>
      setCompareIds((ids) =>
        ids.includes(id) ? ids.filter((x) => x !== id) : ids.length < MAX_COMPARE ? [...ids, id] : ids
      ),
    clearCompare: () => setCompareIds([]),
    submit: (tool) => {
      const no = nextNo.current++
      setSubmissions((s) => [
        ...s,
        { no, submitterId: user.id, dept: user.dept, date: today(), status: "未確認", reason: "", tool },
      ])
      log(`届出No.${no}`, "追加", `${tool.name} を届出`)
      return no
    },
    resubmit: (no, tool) => {
      setSubmissions((s) => s.map((x) => (x.no === no ? { ...x, tool, status: "未確認", reason: "" } : x)))
      log(`届出No.${no}`, "修正", `差し戻し分を修正し再提出（${tool.name}）`)
    },
    publish: (no) => {
      const sub = submissions.find((x) => x.no === no)
      if (!sub) return "届出が見つかりません。"
      const err = validateBasic(sub.tool)
      if (err) return err
      // 契約情報は公開後に「ツール情報を更新」から設定する。費用は設定されるまで非公開扱い
      setTools((t) => [
        ...t,
        { id: `N${no}`, ...sub.tool, cost: "", costPublic: false, term: "", licTotal: 0, licUsed: 0 },
      ])
      setSubmissions((s) => s.map((x) => (x.no === no ? { ...x, status: "公開済み" } : x)))
      log(`届出No.${no}`, "公開", `${sub.tool.name} を一覧に公開`)
      return null
    },
    reject: (no, reason) => {
      setSubmissions((s) => s.map((x) => (x.no === no ? { ...x, status: "差し戻し", reason } : x)))
      log(`届出No.${no}`, "差し戻し", `理由：${reason}`)
    },
    removeSubmission: (no) => {
      const sub = submissions.find((x) => x.no === no)
      setSubmissions((s) => s.filter((x) => x.no !== no))
      log(`届出No.${no}`, "削除", `${sub?.tool.name ?? ""} の届出を削除`)
    },
    updateTool: (id, next, changedLabels) => {
      if (!changedLabels.length) return
      setTools((t) => t.map((x) => (x.id === id ? { ...next, id } : x)))
      log(`${next.name} の基本情報`, "修正", `${changedLabels.join("・")}を更新`)
    },
  }

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = React.useContext(AppStateContext)
  if (!ctx) throw new Error("useAppState は AppStateProvider の内側で使ってください")
  return ctx
}
