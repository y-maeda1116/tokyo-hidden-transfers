// scripts/rail-coords/overpassClient.test.ts
import { describe, expect, it, vi } from 'vitest'
import { buildRequestUrl, queryOverpass } from './overpassClient.ts'

function res(opts: {
  ok: boolean
  status: number
  json?: () => Promise<unknown>
  text?: () => Promise<string>
}): Response {
  return opts as unknown as Response
}

describe('buildRequestUrl', () => {
  it('エンドポイントとクエリから GET URL を生成する', () => {
    expect(buildRequestUrl('https://overpass-api.de/api/interpreter', 'out:json;node;')).toBe(
      'https://overpass-api.de/api/interpreter?data=out%3Ajson%3Bnode%3B',
    )
  })
})

describe('queryOverpass', () => {
  it('成功時は JSON レスポンスを返す', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      res({ ok: true, status: 200, json: () => Promise.resolve({ elements: [] }) }),
    )
    const result = await queryOverpass('q', {
      fetchImpl: fetchImpl as unknown as typeof fetch,
      sleepImpl: () => Promise.resolve(),
    })
    expect(result.elements).toEqual([])
    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })

  it('429 は指数バックオフでリトライして成功する', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(res({ ok: false, status: 429 }))
      .mockResolvedValueOnce(
        res({ ok: true, status: 200, json: () => Promise.resolve({ elements: [] }) }),
      )
    const result = await queryOverpass('q', {
      fetchImpl: fetchImpl as unknown as typeof fetch,
      sleepImpl: () => Promise.resolve(),
    })
    expect(fetchImpl).toHaveBeenCalledTimes(2)
    expect(result.elements).toEqual([])
  })

  it('リトライ上限に達したらエラーを投げる', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(res({ ok: false, status: 429 }))
    await expect(
      queryOverpass('q', {
        fetchImpl: fetchImpl as unknown as typeof fetch,
        maxRetries: 2,
        sleepImpl: () => Promise.resolve(),
      }),
    ).rejects.toThrow()
    // attempt 0,1,2 の 3 回呼ばれる
    expect(fetchImpl).toHaveBeenCalledTimes(3)
  })

  it('4xx（429 以外）はリトライせず即座にエラー', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      res({ ok: false, status: 400, text: () => Promise.resolve('bad request') }),
    )
    await expect(
      queryOverpass('q', {
        fetchImpl: fetchImpl as unknown as typeof fetch,
        maxRetries: 3,
        sleepImpl: () => Promise.resolve(),
      }),
    ).rejects.toThrow()
    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })
})
