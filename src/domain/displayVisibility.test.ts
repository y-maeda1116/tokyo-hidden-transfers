import { describe, expect, it } from 'vitest'
import {
  INITIAL_DISPLAY_STATE,
  displayReducer,
  isLayerVisible,
  isLineVisible,
  type DisplayState,
} from './displayVisibility.ts'

describe('isLineVisible', () => {
  const line = { id: 'yamanote', category: 'jr' as const }

  it('個別・カテゴリとも表示なら visible', () => {
    expect(isLineVisible(line, INITIAL_DISPLAY_STATE)).toBe(true)
  })

  it('個別OFFなら非表示', () => {
    const state: DisplayState = {
      ...INITIAL_DISPLAY_STATE,
      hiddenLineIds: new Set(['yamanote']),
    }
    expect(isLineVisible(line, state)).toBe(false)
  })

  it('カテゴリOFFなら非表示（個別ONでもカテゴリ優先）', () => {
    const state: DisplayState = {
      ...INITIAL_DISPLAY_STATE,
      categoryHidden: new Set(['jr']),
    }
    expect(isLineVisible(line, state)).toBe(false)
  })

  it('個別・カテゴリ両方OFFなら非表示', () => {
    const state: DisplayState = {
      categoryHidden: new Set(['jr']),
      hiddenLineIds: new Set(['yamanote']),
      layerHidden: new Set(),
    }
    expect(isLineVisible(line, state)).toBe(false)
  })
})

describe('isLayerVisible', () => {
  it('layerHidden に無ければ visible', () => {
    expect(isLayerVisible('stations', INITIAL_DISPLAY_STATE)).toBe(true)
  })

  it('layerHidden にあれば非表示', () => {
    const state: DisplayState = {
      ...INITIAL_DISPLAY_STATE,
      layerHidden: new Set(['stations', 'bus']),
    }
    expect(isLayerVisible('stations', state)).toBe(false)
    expect(isLayerVisible('bus', state)).toBe(false)
    expect(isLayerVisible('transfers', state)).toBe(true)
  })
})

describe('displayReducer', () => {
  it('toggleCategory がカテゴリを隠す/再表示する', () => {
    const hidden = displayReducer(INITIAL_DISPLAY_STATE, {
      type: 'toggleCategory',
      category: 'jr',
    })
    expect(hidden.categoryHidden.has('jr')).toBe(true)
    const shown = displayReducer(hidden, { type: 'toggleCategory', category: 'jr' })
    expect(shown.categoryHidden.has('jr')).toBe(false)
  })

  it('toggleLine が路線を隠す/再表示する', () => {
    const hidden = displayReducer(INITIAL_DISPLAY_STATE, {
      type: 'toggleLine',
      lineId: 'ginza',
    })
    expect(hidden.hiddenLineIds.has('ginza')).toBe(true)
  })

  it('toggleLayer が要素を隠す/再表示する', () => {
    const hidden = displayReducer(INITIAL_DISPLAY_STATE, {
      type: 'toggleLayer',
      layer: 'bus',
    })
    expect(hidden.layerHidden.has('bus')).toBe(true)
  })

  it('元の state を破壊しない（イミュータブル）', () => {
    displayReducer(INITIAL_DISPLAY_STATE, { type: 'toggleCategory', category: 'jr' })
    displayReducer(INITIAL_DISPLAY_STATE, { type: 'toggleLine', lineId: 'ginza' })
    displayReducer(INITIAL_DISPLAY_STATE, { type: 'toggleLayer', layer: 'bus' })
    expect(INITIAL_DISPLAY_STATE.categoryHidden.size).toBe(0)
    expect(INITIAL_DISPLAY_STATE.hiddenLineIds.size).toBe(0)
    expect(INITIAL_DISPLAY_STATE.layerHidden.size).toBe(0)
  })
})
