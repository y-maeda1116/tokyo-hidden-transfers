import { describe, expect, it } from 'vitest'
import type { Station, Transfer } from '../../domain/types.ts'
import { buildStationTooltip, buildTransferTooltip } from './tooltipHtml.ts'

const lineNameById = new Map([
  ['asakusa', '都営浅草線'],
  ['oedo', '都営大江戸線'],
])

const station: Station = {
  id: 'kuramae-asakusa',
  name: '蔵前',
  lineId: 'asakusa',
  lon: 139.7955,
  lat: 35.7116,
}

describe('buildStationTooltip', () => {
  it('駅名と路線名を含む', () => {
    const html = buildStationTooltip(station, lineNameById)
    expect(html).toContain('蔵前')
    expect(html).toContain('都営浅草線')
  })

  it('XSS: 危険文字をエスケープする', () => {
    const evil: Station = { ...station, name: '<script>alert(1)</script>' }
    const html = buildStationTooltip(evil, lineNameById)
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('路線名が未解決でも路線IDを代替表示する', () => {
    const html = buildStationTooltip(station, new Map())
    expect(html).toContain('asakusa')
  })
})

describe('buildTransferTooltip', () => {
  const from: Station = {
    id: 'kuramae-asakusa',
    name: '蔵前',
    lineId: 'asakusa',
    lon: 139.7955,
    lat: 35.7116,
  }
  const to: Station = {
    id: 'kuramae-oedo',
    name: '蔵前',
    lineId: 'oedo',
    lon: 139.7942,
    lat: 35.7106,
  }
  const transfer: Transfer = {
    id: 't1',
    fromStationId: 'kuramae-asakusa',
    toStationId: 'kuramae-oedo',
    walkMinutes: 6,
    note: '地下通路で連絡',
  }

  it('両路線名と「徒歩約 N 分」を含む', () => {
    const html = buildTransferTooltip(transfer, from, to, lineNameById)
    expect(html).toContain('徒歩約 6 分')
    expect(html).toContain('都営浅草線')
    expect(html).toContain('都営大江戸線')
  })

  it('note を含む', () => {
    const html = buildTransferTooltip(transfer, from, to, lineNameById)
    expect(html).toContain('地下通路で連絡')
  })

  it('路線名未解決かつ note なしでも安全に描画する', () => {
    const noNote: Transfer = {
      id: 't2',
      fromStationId: 'a',
      toStationId: 'b',
      walkMinutes: 5,
    }
    const html = buildTransferTooltip(noNote, from, to, new Map())
    expect(html).toContain('asakusa')
    expect(html).toContain('oedo')
    expect(html).not.toContain('tooltip-note')
  })

  it('XSS: note の危険文字をエスケープする', () => {
    const evil: Transfer = { ...transfer, note: '<img src=x onerror=alert(1)>' }
    const html = buildTransferTooltip(evil, from, to, lineNameById)
    expect(html).not.toContain('<img')
    expect(html).toContain('&lt;img')
  })
})
