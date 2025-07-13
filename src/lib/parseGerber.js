import { createParser } from '@tracespace/parser'

export function parseGerber(content) {
  const parser = createParser()
  try {
    parser.feed(content)
  } catch (e) {
    throw new Error('Failed to parse file')
  }
  const tree = parser.results()
  if (!tree.filetype) throw new Error('Unsupported file type')

  let units = 'mm'
  let format = [2, 5]
  let zero = 'leading'
  let mode = 'absolute'
  const toolShapes = {}
  let currentTool = null
  let x = 0
  let y = 0
  const result = []

  function num(str) {
    if (str == null) return null
    const neg = str.startsWith('-')
    if (neg) str = str.slice(1)
    const total = format[0] + format[1]
    if (zero === 'leading') str = str.padStart(total, '0')
    else str = str.padEnd(total, '0')
    const intPart = str.slice(0, format[0]) || '0'
    const decPart = str.slice(format[0]) || '0'
    let val = parseInt(intPart, 10) + parseInt(decPart, 10) / 10 ** format[1]
    if (neg) val = -val
    if (units === 'in') val *= 25.4
    return val
  }

  for (const node of tree.children) {
    switch (node.type) {
      case 'units':
        units = node.units
        break
      case 'coordinateFormat':
        if (node.format) format = node.format
        if (node.zeroSuppression) zero = node.zeroSuppression
        if (node.mode) mode = node.mode
        break
      case 'toolDefinition':
        if (node.code) toolShapes[node.code] = node.shape
        break
      case 'toolChange':
        currentTool = node.code
        break
      case 'graphic': {
        let nx = node.coordinates.x ? num(node.coordinates.x) : x
        let ny = node.coordinates.y ? num(node.coordinates.y) : y
        if (mode === 'incremental') {
          nx += x
          ny += y
        }
        if (node.graphic === 'segment') {
          result.push({ type: 'line', x1: x, y1: y, x2: nx, y2: ny })
        } else if (node.graphic === 'shape') {
          const shape = toolShapes[currentTool]
          if (shape?.type === 'circle') {
            result.push({
              type: 'flash',
              cx: nx,
              cy: ny,
              r: shape.diameter / 2,
            })
          } else {
            result.push({ type: 'flash', cx: nx, cy: ny })
          }
        } else if (node.graphic === 'drill') {
          const shape = toolShapes[currentTool]
          const dia = shape?.diameter || 0
          result.push({ type: 'circle', cx: nx, cy: ny, r: dia / 2 })
        }
        x = nx
        y = ny
        break
      }
      default:
        break
    }
  }
  return result
}
