import { describe, expect, it, vi } from 'vitest'
import { busDataUrl, fetchBusData } from './busData.ts'

describe('busDataUrl', () => {
  it('base 付きの URL を生成する', () => {
    expect(busDataUrl('/tokyo-hidden-transfers/', 'routes')).toBe(
      '/tokyo-hidden-transfers/data/bus-routes.json',
    )
    expect(busDataUrl('/tokyo-hidden-transfers/dev/', 'stops')).toBe(
      '/tokyo-hidden-transfers/dev/data/bus-stops.json',
    )
  })
})

describe('fetchBusData', () => {
  const routesFc = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [[139.7, 35.7], [139.8, 35.8]] },
        properties: { kind: 'bus-route', shortName: '上26', color: '#00853F' },
      },
    ],
  }
  const stopsFc = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [139.7, 35.7] },
        properties: { kind: 'bus-stop', stopId: '0032', name: '浅草雷門' },
      },
    ],
  }

  it('正常系: routes/stops を fetch し zod 検証して返す', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(routesFc) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(stopsFc) })
    const data = await fetchBusData(
      '/tokyo-hidden-transfers/',
      fetchImpl as unknown as typeof fetch,
    )
    expect(data.routes.type).toBe('FeatureCollection')
    expect(data.routes.features).toHaveLength(1)
    expect(data.stops.features[0].properties?.name).toBe('浅草雷門')
  })

  it('異常系: HTTP エラーは throw する', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 404, json: () => Promise.resolve({}) })
    await expect(
      fetchBusData('/tokyo-hidden-transfers/', fetchImpl as unknown as typeof fetch),
    ).rejects.toThrow()
  })

  it('異常系: 不正 GeoJSON は zod 検証で throw する', async () => {
    const bad = { type: 'NotACollection', features: [] }
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(bad) })
    await expect(
      fetchBusData('/tokyo-hidden-transfers/', fetchImpl as unknown as typeof fetch),
    ).rejects.toThrow()
  })
})
