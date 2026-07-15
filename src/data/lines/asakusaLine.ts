import type { Line } from '../../domain/types.ts'

// 都営浅草線（非公式乗換を表現する範囲の最小駅セット）
export const asakusaLine: Line = {
  id: 'asakusa',
  name: '都営浅草線',
  color: '#e8472e',
  stations: [
    { id: 'asakusa-asakusa', name: '浅草', lineId: 'asakusa', lon: 139.8059, lat: 35.7119 },
    { id: 'kuramae-asakusa', name: '蔵前', lineId: 'asakusa', lon: 139.7955, lat: 35.7116 },
    { id: 'sengakuji', name: '泉岳寺', lineId: 'asakusa', lon: 139.7394, lat: 35.7396 },
  ],
}
