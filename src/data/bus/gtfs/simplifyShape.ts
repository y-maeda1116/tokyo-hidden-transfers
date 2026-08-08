// src/data/bus/gtfs/simplifyShape.ts

/**
 * Douglas-Peucker 法で経路（[lon, lat] の列）を簡略化する（純粋関数）。
 * 始点・終点は常に保持し、直線からの垂直距離が tolerance 未満の点を再帰的に除去する。
 * 座標は平面近似（簡略化用途で十分）。tolerance は度単位（0.00005 度 ≒ 5.5m）。
 */
export function simplifyShape(
  points: readonly [number, number][],
  tolerance: number,
): [number, number][] {
  if (points.length <= 2) return points.map((p) => [p[0], p[1]])

  const start = points[0]
  const end = points[points.length - 1]

  // 始点・終点から最も離れた点を探す
  let maxDist = 0
  let maxIndex = 0
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i], start, end)
    if (d > maxDist) {
      maxDist = d
      maxIndex = i
    }
  }

  if (maxDist <= tolerance) {
    return [start, end].map((p) => [p[0], p[1]])
  }

  // 最大距離の点で分割して再帰
  const left = simplifyShape(points.slice(0, maxIndex + 1), tolerance)
  const right = simplifyShape(points.slice(maxIndex), tolerance)
  // 左側の末尾と右側の先頭は同じ点なので重複を除く
  return [...left, ...right.slice(1)]
}

/** 点 p から直線 (a-b) への垂直距離（平面近似）。 */
function perpendicularDistance(
  p: [number, number],
  a: [number, number],
  b: [number, number],
): number {
  const [x, y] = p
  const [x1, y1] = a
  const [x2, y2] = b
  // a == b の場合は p と a の距離
  if (x1 === x2 && y1 === y2) {
    return Math.hypot(x - x1, y - y1)
  }
  // 点と直線の距離公式
  const num = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1)
  const den = Math.hypot(y2 - y1, x2 - x1)
  return num / den
}
