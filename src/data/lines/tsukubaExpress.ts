import type { Line } from '../../domain/types.ts'

// つくばエクスプレス（浅草の乗換を表現するための最小駅セット）
export const tsukubaExpress: Line = {
  id: 'tsukuba-express',
  name: 'つくばエクスプレス',
  color: '#005bac',
  stations: [
    { id: 'asakusa-tx', name: '浅草', lineId: 'tsukuba-express', lon: 139.7978, lat: 35.7081 },
    { id: 'kitasenju', name: '北千住', lineId: 'tsukuba-express', lon: 139.8030, lat: 35.7440 },
  ],
}
