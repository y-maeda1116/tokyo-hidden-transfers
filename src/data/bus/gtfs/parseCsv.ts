// src/data/bus/gtfs/parseCsv.ts
import { parse } from 'csv-parse/sync'

/**
 * CSV テキストをレコードの配列に変換する（純粋関数）。
 * 先頭行をヘッダーとみなし、各列をキーとしたレコードを生成する。
 * 引用符・空行を適切に処理する（csv-parse/sync に委譲）。
 */
export function parseCsv(csvText: string): ReadonlyArray<Record<string, string>> {
  if (csvText.trim() === '') return []
  return parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  })
}
