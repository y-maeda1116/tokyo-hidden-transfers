import type { Line } from '../../domain/types.ts'

// つくばエクスプレス 都内区間（秋葉原→北千住）。座標は主要駅ベースの推定値。
export const tsukubaExpress: Line = {
  id: 'tsukuba-express',
  name: 'つくばエクスプレス',
  color: '#005bac',
  category: 'other',
  stations: [
    { id: 'tx00', name: '秋葉原', lineId: 'tsukuba-express', lon: 139.7733, lat: 35.6995 },
    { id: 'tx01', name: '新御徒町', lineId: 'tsukuba-express', lon: 139.7830, lat: 35.7075 },
    { id: 'asakusa-tx', name: '浅草', lineId: 'tsukuba-express', lon: 139.792333, lat: 35.713222 },
    { id: 'kitasenju', name: '北千住', lineId: 'tsukuba-express', lon: 139.8030, lat: 35.7440 },
  ],
}
