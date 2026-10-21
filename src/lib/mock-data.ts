// 第1版の架空データ。実在の社名・個人名・実データは含まない。
// データベースへの接続は今後の手順で行い、このファイルは置き換える。
import type { HistoryEntry, Role, Submission, Tool, User } from "./types"

// 試作用の利用者（社員番号は架空。一般社員向けの画面には表示しない）
export const USERS: Record<Role, User> = {
  general: { id: "000000", dept: "営業部" },
  admin: { id: "000001", dept: "情報システム部門" },
}

const MANUAL = "社内ポータルの「マニュアル」ページ"

export const INITIAL_TOOLS: Tool[] = [
  {
    id: "A", name: "ツールA", category: "情報共有",
    summary: "部署内の資料や連絡事項を共有するツール",
    can: ["ファイル共有", "掲示板", "簡易アンケート"],
    goodFor: ["部署内の情報共有", "少人数のアンケート"],
    notGoodFor: ["大量データの集計", "社外との共有"],
    keywords: ["情報共有", "掲示板", "アンケート", "資料置き場", "ファイル共有", "お知らせ"],
    depts: ["営業部", "管理部"],
    howToApply: "所定の申請フォームから申請", contact: "情報システム部門", manual: MANUAL,
    cost: "月額 500円／1ライセンス", costPublic: true, term: "1年（毎年更新）", licTotal: 50, licUsed: 42,
  },
  {
    id: "B", name: "ツールB", category: "申請・承認",
    summary: "各種申請と承認の流れを電子化する基幹システム",
    can: ["申請書の作成", "多段階の承認", "承認状況の確認"],
    goodFor: ["休暇・出張などの定型申請", "稟議の回覧"],
    notGoodFor: ["自由形式の情報共有", "アンケートの集計"],
    keywords: ["申請", "承認", "稟議", "ワークフロー", "決裁", "休暇", "出張", "回覧", "電子化"],
    depts: ["全部署"],
    howToApply: "利用者登録は情報システム部門が一括で実施", contact: "情報システム部門", manual: MANUAL,
    cost: "年額 ○○○万円（一括契約）", costPublic: false, term: "3年（満了時に見直し）", licTotal: 300, licUsed: 281,
  },
  {
    id: "C", name: "ツールC", category: "データ集計",
    summary: "アンケートフォームを作り、回答を自動で集計するツール",
    can: ["アンケートの作成", "回答の自動集計", "グラフ表示", "集計結果の書き出し"],
    goodFor: ["部署内アンケートの集計", "数十〜数百件の回答の集計", "研修後のアンケート"],
    notGoodFor: ["個人情報を含む調査", "売上など業務データの分析"],
    keywords: ["アンケート", "集計", "回答", "フォーム", "グラフ", "調査", "意見"],
    depts: ["管理部", "人事部"],
    howToApply: "所定の申請フォームから申請", contact: "情報システム部門", manual: MANUAL,
    cost: "月額 300円／1ライセンス", costPublic: true, term: "1年（毎年更新）", licTotal: 30, licUsed: 12,
  },
  {
    id: "D", name: "ツールD", category: "日程・会議",
    summary: "予定の共有と日程調整、会議室の予約ができるツール",
    can: ["予定の共有", "日程調整（候補日の投票）", "会議室の予約"],
    goodFor: ["複数人の日程調整", "会議室の空き確認"],
    notGoodFor: ["社外の人との日程調整", "勤怠の記録"],
    keywords: ["日程", "調整", "スケジュール", "会議室", "予約", "打ち合わせ", "予定", "会議"],
    depts: ["全部署"],
    howToApply: "申請不要（全社員が利用可）", contact: "情報システム部門", manual: MANUAL,
    cost: "月額 400円／1ライセンス", costPublic: true, term: "1年（毎年更新）", licTotal: 300, licUsed: 290,
  },
  {
    id: "E", name: "ツールE", category: "データ集計",
    summary: "大量の業務データを集計・分析し、グラフで見える化するツール",
    can: ["大量データの集計", "ダッシュボード作成", "定期レポートの自動作成"],
    goodFor: ["売上・生産実績の分析", "定期的な数値報告"],
    notGoodFor: ["アンケートの作成", "少量データの単発集計"],
    keywords: ["集計", "分析", "グラフ", "売上", "ダッシュボード", "大量データ", "見える化", "レポート"],
    depts: ["営業部", "製造部"],
    howToApply: "所属長の承認後、情報システム部門へ申請", contact: "情報システム部門", manual: MANUAL,
    cost: "月額 ○○○○円／1ライセンス", costPublic: false, term: "1年（毎年更新）", licTotal: 10, licUsed: 9,
  },
  {
    id: "F", name: "ツールF", category: "文書・資料作成",
    summary: "複数人で同時に文書を編集できるツール",
    can: ["文書の共同編集", "コメント", "変更履歴の確認"],
    goodFor: ["議事録の作成", "手順書・マニュアルの作成"],
    notGoodFor: ["複雑な表計算", "申請・承認の管理"],
    keywords: ["文書", "共同編集", "議事録", "マニュアル", "資料作成", "手順書"],
    depts: ["管理部", "製造部"],
    howToApply: "所定の申請フォームから申請", contact: "情報システム部門", manual: MANUAL,
    cost: "月額 600円／1ライセンス", costPublic: true, term: "1年（毎年更新）", licTotal: 80, licUsed: 51,
  },
  {
    id: "G", name: "ツールG", category: "問い合わせ管理",
    summary: "社内からの問い合わせや依頼を受け付け、対応状況を管理するツール",
    can: ["受付票の作成", "担当の割り当て", "対応状況の管理"],
    goodFor: ["部署への依頼の受付", "対応漏れの防止"],
    notGoodFor: ["社外からの問い合わせ対応", "雑談・連絡"],
    keywords: ["問い合わせ", "受付", "対応状況", "依頼", "チケット", "対応漏れ"],
    depts: ["情報システム部門", "総務部"],
    howToApply: "所定の申請フォームから申請", contact: "情報システム部門", manual: MANUAL,
    cost: "月額 800円／1ライセンス", costPublic: true, term: "1年（毎年更新）", licTotal: 20, licUsed: 15,
  },
  {
    id: "H", name: "ツールH", category: "情報共有",
    summary: "部署やプロジェクト単位でやり取りできる社内チャット",
    can: ["チャット", "グループ作成", "通知", "ファイル送信"],
    goodFor: ["すぐの連絡・相談", "プロジェクト内のやり取り"],
    notGoodFor: ["正式な記録の保管", "申請・承認"],
    keywords: ["チャット", "連絡", "メッセージ", "通知", "情報共有", "相談"],
    depts: ["全部署"],
    howToApply: "申請不要（全社員が利用可）", contact: "情報システム部門", manual: MANUAL,
    cost: "月額 400円／1ライセンス", costPublic: true, term: "1年（毎年更新）", licTotal: 300, licUsed: 275,
  },
]

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    no: 12, submitterId: "000000", dept: "営業部", date: "2026/09/30", status: "差し戻し",
    reason: "「向いている用途」の記入をお願いします",
    tool: {
      name: "ツールI", category: "日程・会議", summary: "社内の打ち合わせをオンラインで行うツール",
      can: ["オンライン会議", "画面共有"], goodFor: [], notGoodFor: [],
      keywords: ["会議", "オンライン", "打ち合わせ"], depts: ["営業部"],
      howToApply: "", contact: "情報システム部門", manual: "",
    },
  },
  {
    no: 13, submitterId: "000002", dept: "製造部", date: "2026/10/10", status: "未確認", reason: "",
    tool: {
      name: "ツールJ", category: "データ集計", summary: "設備の稼働状況を記録・集計するツール",
      can: ["稼働記録", "日報の集計"], goodFor: ["設備の稼働率の把握"], notGoodFor: ["事務作業の集計"],
      keywords: ["稼働", "設備", "日報", "集計"], depts: ["製造部"],
      howToApply: "製造部へ相談", contact: "情報システム部門", manual: "",
    },
  },
]

export const INITIAL_HISTORY: HistoryEntry[] = [
  { at: "2026/09/01 10:00", by: "000001", target: "ツールA の基本情報", op: "修正", detail: "「できること」に簡易アンケートを追記" },
  { at: "2026/09/30 14:20", by: "000000", target: "届出No.12", op: "追加", detail: "ツールI を届出" },
  { at: "2026/10/02 09:15", by: "000001", target: "届出No.12", op: "差し戻し", detail: "理由：「向いている用途」の記入をお願いします" },
  { at: "2026/10/10 16:40", by: "000002", target: "届出No.13", op: "追加", detail: "ツールJ を届出" },
]
