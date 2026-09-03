import { afterEach, describe, expect, it } from 'vitest'
import {
  readStoredMode,
  resolveDisplayMode,
  safeLocalStorage,
  writeStoredMode,
} from './useDisplayMode.ts'

/** インメモリStorage（プライベートモード等のテスト用） */
function createMemoryStorage(): Storage {
  const map = new Map<string, string>()
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value)
    },
    removeItem: (key: string) => {
      map.delete(key)
    },
    clear: () => {
      map.clear()
    },
    key: () => null,
    get length() {
      return map.size
    },
  } as Storage
}

/** 常にthrowするStorage（localStorage無効環境のテスト用） */
function createThrowingStorage(): Storage {
  const fail = () => {
    throw new Error('storage unavailable')
  }
  return {
    getItem: fail,
    setItem: fail,
    removeItem: fail,
    clear: fail,
    key: fail,
    get length() {
      return 0
    },
  } as Storage
}

describe('resolveDisplayMode', () => {
  it('手動上書きcompactは幅に関係なくcompact', () => {
    expect(resolveDisplayMode('compact', false)).toBe('compact')
    expect(resolveDisplayMode('compact', true)).toBe('compact')
  })

  it('手動上書きfullは幅に関係なくfull', () => {
    expect(resolveDisplayMode('full', false)).toBe('full')
    expect(resolveDisplayMode('full', true)).toBe('full')
  })

  it('未指定なら自動判定: 窄画面はcompact', () => {
    expect(resolveDisplayMode(null, true)).toBe('compact')
  })

  it('未指定なら自動判定: 広画面はfull', () => {
    expect(resolveDisplayMode(null, false)).toBe('full')
  })
})

describe('readStoredMode', () => {
  it('保存値があれば返す', () => {
    const storage = createMemoryStorage()
    storage.setItem('display-mode', 'compact')
    expect(readStoredMode(storage)).toBe('compact')
  })

  it('保存値fullも返す', () => {
    const storage = createMemoryStorage()
    storage.setItem('display-mode', 'full')
    expect(readStoredMode(storage)).toBe('full')
  })

  it('不正値はnull（自動判定へフォールバック）', () => {
    const storage = createMemoryStorage()
    storage.setItem('display-mode', 'hoge')
    expect(readStoredMode(storage)).toBeNull()
  })

  it('未保存はnull', () => {
    expect(readStoredMode(createMemoryStorage())).toBeNull()
  })

  it('storageが例外を投げてもnullを返しクラッシュしない', () => {
    expect(readStoredMode(createThrowingStorage())).toBeNull()
  })

  it('storageがnullでもnullを返す', () => {
    expect(readStoredMode(null)).toBeNull()
  })
})

describe('writeStoredMode', () => {
  it('書き込める', () => {
    const storage = createMemoryStorage()
    writeStoredMode(storage, 'compact')
    expect(storage.getItem('display-mode')).toBe('compact')
  })

  it('storageが例外を投げてもクラッシュしない', () => {
    expect(() =>
      writeStoredMode(createThrowingStorage(), 'full'),
    ).not.toThrow()
  })

  it('storageがnullでもクラッシュしない', () => {
    expect(() => writeStoredMode(null, 'compact')).not.toThrow()
  })
})

describe('safeLocalStorage', () => {
  const windowProp = 'window' as const
  const originalWindow = (globalThis as Record<string, unknown>)[windowProp]

  afterEach(() => {
    if (originalWindow === undefined) {
      delete (globalThis as Record<string, unknown>)[windowProp]
    } else {
      ;(globalThis as Record<string, unknown>)[windowProp] = originalWindow
    }
  })

  it('localStorageへのアクセスが例外を投げる環境ではnullを返す', () => {
    ;(globalThis as Record<string, unknown>)[windowProp] = {
      get localStorage(): Storage {
        throw new Error('SecurityError')
      },
    }
    expect(safeLocalStorage()).toBeNull()
  })

  it('アクセス可能ならlocalStorageを返す', () => {
    const storage = createMemoryStorage()
    ;(globalThis as Record<string, unknown>)[windowProp] = { localStorage: storage }
    expect(safeLocalStorage()).toBe(storage)
  })
})
