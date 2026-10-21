import type { Tool } from "./types"

export type SearchResult = { tool: Tool; score: number; hits: string[] }

/**
 * 入力文に含まれるキーワード・用途を拾って点数化する。
 * 「部署内アンケートを集計したい」のような文のままでも候補が出るようにするため、
 * 「入力語がツール側の文に含まれる」と「ツール側のキーワードが入力文に含まれる」の両方向で照合する。
 */
export function scoreTool(tool: Tool, query: string): SearchResult {
  const terms = query.split(/[\s　、,，。]+/).filter(Boolean)
  const haystack = [tool.name, tool.category, tool.summary, ...tool.can, ...tool.goodFor, ...tool.keywords].join(" ")
  const hits = new Set<string>()
  let score = 0
  for (const term of terms) {
    if (haystack.includes(term)) {
      score += 3
      hits.add(term)
    }
    for (const k of tool.keywords) {
      if (term.includes(k)) {
        score += 2
        hits.add(k)
      }
    }
    for (const g of tool.goodFor) {
      if (term.includes(g)) {
        score += 2
        hits.add(g)
      }
    }
  }
  return { tool, score, hits: [...hits] }
}

export function searchTools(tools: Tool[], query: string, category: string | null): SearchResult[] {
  const inCategory = tools.filter((t) => !category || t.category === category)
  const q = query.trim()
  if (!q) return inCategory.map((tool) => ({ tool, score: 0, hits: [] }))
  return inCategory
    .map((t) => scoreTool(t, q))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
}
