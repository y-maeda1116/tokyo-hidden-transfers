import type { Transfer } from '../domain/types.ts'

/**
 * 徒歩連絡による「非公式乗換」のダミーデータ。
 * 同名で別位置の駅、あるいは物理的に離れた別駅同士を結ぶ。
 * 追加する場合は TransferSchema の制約（id/fromStationId/toStationId 必須、
 * walkMinutes は1以上の整数）を満たすこと。from/to の駅は lines/* に定義済みであること。
 */
export const transfers: readonly Transfer[] = [
  {
    id: 'kuramae-transfer',
    fromStationId: 'kuramae-asakusa',
    toStationId: 'kuramae-oedo',
    walkMinutes: 6,
    note: '地下通路で連絡（別ホーム）',
  },
  {
    id: 'asakusa-ginza-tx',
    fromStationId: 'asakusa-ginza',
    toStationId: 'asakusa-tx',
    walkMinutes: 12,
    note: '約1km離れた別駅',
  },
  {
    id: 'asakusa-ginza-asakusa',
    fromStationId: 'asakusa-ginza',
    toStationId: 'asakusa-asakusa',
    walkMinutes: 10,
    note: '銀座線と都営浅草線の連絡',
  },
]
