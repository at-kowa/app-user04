export const CATEGORIES = [
  "申請・承認",
  "情報共有",
  "データ集計",
  "日程・会議",
  "文書・資料作成",
  "問い合わせ管理",
] as const

/** 届出でも入力する基本情報・利用状況 */
export type ToolBasic = {
  name: string
  category: string
  summary: string
  can: string[]
  goodFor: string[]
  notGoodFor: string[]
  keywords: string[]
  depts: string[]
  howToApply: string
  contact: string
  manual: string
}

/** 契約情報（情報システム部門のみ編集） */
export type ToolContract = {
  cost: string
  costPublic: boolean
  term: string
  licTotal: number
  licUsed: number
}

export type Tool = ToolBasic & ToolContract & { id: string }

export type SubmissionStatus = "未確認" | "差し戻し" | "公開済み"

export type Submission = {
  no: number
  submitterId: string
  dept: string
  date: string
  status: SubmissionStatus
  reason: string
  tool: ToolBasic
}

export type HistoryOp = "追加" | "修正" | "差し戻し" | "公開" | "削除"

export type HistoryEntry = {
  at: string
  by: string
  target: string
  op: HistoryOp
  detail: string
}

export type Role = "general" | "admin"

export type User = { id: string; dept: string }
