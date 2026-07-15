import type { Line } from '../../domain/types.ts'

// 都営大江戸線（蔵前の乗換を表現するための最小駅セット）
export const oedoLine: Line = {
  id: 'oedo',
  name: '都営大江戸線',
  color: '#b6007a',
  stations: [
    { id: 'kuramae-oedo', name: '蔵前', lineId: 'oedo', lon: 139.7942, lat: 35.7106 },
    { id: 'ryogoku', name: '両国', lineId: 'oedo', lon: 139.7909, lat: 35.6906 },
    { id: 'kasuga', name: '春日', lineId: 'oedo', lon: 139.7513, lat: 35.6989 },
  ],
}
