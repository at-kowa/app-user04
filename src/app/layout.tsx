import type { Metadata } from "next"
import { Suspense } from "react"
import type * as React from "react"

import { AppStateProvider } from "@/components/app-state"
import { CompareBar } from "@/components/compare-bar"
import { SiteHeader } from "@/components/site-header"
import "./globals.css"

export const metadata: Metadata = {
  title: "社内ツール案内",
  description: "やりたいことから社内のツールを逆引きする案内アプリ（第1版・架空データ）",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <AppStateProvider>
          {/* ヘッダー・比較バー・ツール詳細は URL を読むため、Suspense の内側に置く（Next.js 16 の要件） */}
          <Suspense fallback={<p className="p-6 text-sm text-muted-foreground">読み込み中…</p>}>
            <SiteHeader />
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 pt-8 pb-32">{children}</main>
            <CompareBar />
          </Suspense>
        </AppStateProvider>
      </body>
    </html>
  )
}
