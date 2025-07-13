import { DxfWriter, point3d, Units } from '@tarikjabiri/dxf'

/**
 * Generate DXF string from primitives grouped by layer.
 * @param {Array<{name:string, primitives:any[]}>} layers
 * @param {{units:'mm'|'inch', scale:number, invert?:boolean}} options
 * @returns {string}
 */
export function generateDxf(layers, options = {}) {
  const writer = new DxfWriter()
  const { units = 'mm', scale = 1 } = options
  const insUnits = units === 'mm' ? Units.Millimeters : Units.Inches
  writer.setUnits(insUnits)
  for (const { name, primitives } of layers) {
    writer.addLayer(name, 7, 'CONTINUOUS')
    writer.setCurrentLayerName(name)
    for (const p of primitives) {
      switch (p.type) {
        case 'line':
          writer.addLine(
            point3d(p.x1 * scale, p.y1 * scale),
            point3d(p.x2 * scale, p.y2 * scale)
          )
          break
        case 'circle':
        case 'flash':
          writer.addCircle(
            point3d(p.cx * scale, p.cy * scale),
            (p.r || 0) * scale
          )
          break
        default:
          break
      }
    }
  }
  return writer.stringify()
}
