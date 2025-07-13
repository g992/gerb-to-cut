export function computeBBox(primitives) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const p of primitives) {
    switch (p.type) {
      case 'line':
        minX = Math.min(minX, p.x1, p.x2)
        minY = Math.min(minY, p.y1, p.y2)
        maxX = Math.max(maxX, p.x1, p.x2)
        maxY = Math.max(maxY, p.y1, p.y2)
        break
      case 'flash':
      case 'circle':
        const r = p.r || 0
        minX = Math.min(minX, p.cx - r)
        minY = Math.min(minY, p.cy - r)
        maxX = Math.max(maxX, p.cx + r)
        maxY = Math.max(maxY, p.cy + r)
        break
      default:
        break
    }
  }
  if (!isFinite(minX)) return null
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  }
}
