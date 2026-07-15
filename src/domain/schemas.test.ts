import { describe, expect, it } from 'vitest'
import { LineSchema, StationSchema, TransferSchema } from './schemas.ts'

const validStation = {
  id: 'kuramae-asakusa',
  name: '蔵前',
  lineId: 'asakusa',
  lon: 139.795,
  lat: 35.711,
} as const

describe('StationSchema', () => {
  it('有効な駅を受理する', () => {
    const station = StationSchema.parse(validStation)
    expect(station.id).toBe('kuramae-asakusa')
    expect(station.name).toBe('蔵前')
  })

  it('空の id を拒否する', () => {
    expect(() => StationSchema.parse({ ...validStation, id: '' })).toThrow()
  })

  it('空の name を拒否する', () => {
    expect(() => StationSchema.parse({ ...validStation, name: '' })).toThrow()
  })

  it('lon/lat が数値でない場合を拒否する', () => {
    expect(() =>
      StationSchema.parse({ ...validStation, lon: '139' as unknown as number }),
    ).toThrow()
  })
})

describe('LineSchema', () => {
  const baseLine = {
    id: 'asakusa',
    name: '都営浅草線',
    color: '#e60012',
    stations: [
      { ...validStation },
      { ...validStation, id: 's2', name: '駅2' },
    ],
  }

  it('有効な路線を受理する', () => {
    expect(LineSchema.parse(baseLine).color).toBe('#e60012')
  })

  it('無効な color 形式を拒否する', () => {
    expect(() => LineSchema.parse({ ...baseLine, color: 'red' })).toThrow()
  })

  it('color が3桁の短縮形でも拒否する（6桁必須）', () => {
    expect(() => LineSchema.parse({ ...baseLine, color: '#abc' })).toThrow()
  })

  it('駅が2駅未満の場合を拒否する', () => {
    expect(() =>
      LineSchema.parse({ ...baseLine, stations: [validStation] }),
    ).toThrow()
  })
})

describe('TransferSchema', () => {
  const validTransfer = {
    id: 'kuramae-transfer',
    fromStationId: 'kuramae-asakusa',
    toStationId: 'kuramae-oedo',
    walkMinutes: 6,
  }

  it('有効な乗換を受理する', () => {
    expect(TransferSchema.parse(validTransfer).walkMinutes).toBe(6)
  })

  it('walkMinutes が 0 以下の場合を拒否する', () => {
    expect(() =>
      TransferSchema.parse({ ...validTransfer, walkMinutes: 0 }),
    ).toThrow()
  })

  it('walkMinutes が整数でない場合を拒否する', () => {
    expect(() =>
      TransferSchema.parse({ ...validTransfer, walkMinutes: 5.5 }),
    ).toThrow()
  })

  it('note は省略可能', () => {
    expect(
      TransferSchema.parse({ ...validTransfer, note: '地下通路' }).note,
    ).toBe('地下通路')
  })
})
