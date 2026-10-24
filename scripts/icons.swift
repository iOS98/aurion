// يرسم أيقونة التطبيق: خلفية متدرجة وصورة السيارة
import AppKit
let car = NSImage(contentsOfFile: CommandLine.arguments[1])!
let outDir = CommandLine.arguments[2]
for size in [180, 192, 512] {
  let s = CGFloat(size)
  let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: size, pixelsHigh: size, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
  NSGraphicsContext.saveGraphicsState()
  NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
  let g = NSGradient(colors: [NSColor(red: 0.05, green: 0.10, blue: 0.27, alpha: 1), NSColor(red: 0.11, green: 0.21, blue: 0.59, alpha: 1), NSColor(red: 0.0, green: 0.62, blue: 0.80, alpha: 1)])!
  g.draw(in: NSRect(x: 0, y: 0, width: s, height: s), angle: 60)
  let glow = NSGradient(colors: [NSColor(white: 1, alpha: 0.22), NSColor(white: 1, alpha: 0)])!
  glow.draw(fromCenter: NSPoint(x: s * 0.3, y: s * 0.8), radius: 0, toCenter: NSPoint(x: s * 0.3, y: s * 0.8), radius: s * 0.7, options: [])
  // ظل تحت السيارة
  NSColor(white: 0, alpha: 0.35).setFill()
  NSBezierPath(ovalIn: NSRect(x: s * 0.12, y: s * 0.24, width: s * 0.76, height: s * 0.07)).fill()
  let w = s * 0.86, h = w * car.size.height / car.size.width
  car.draw(in: NSRect(x: (s - w) / 2, y: s * 0.26, width: w, height: h))
  NSGraphicsContext.restoreGraphicsState()
  try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: "\(outDir)/icon-\(size).png"))
}
print("icons ok")
