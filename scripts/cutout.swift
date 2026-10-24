// تفريغ خلفية صورة السيارة بإطار Vision من آبل، واختيار أكبر جسم في منتصف الصورة
import Foundation
import Vision
import CoreImage
import AppKit

let args = CommandLine.arguments
let input = URL(fileURLWithPath: args[1]), output = URL(fileURLWithPath: args[2])
let ci = CIImage(contentsOf: input)!
let handler = VNImageRequestHandler(ciImage: ci)
let req = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([req])
guard let obs = req.results?.first else { print("no subject"); exit(1) }
// اختر الكائن الأكبر مساحة
var best = IndexSet(), bestArea = 0
for inst in obs.allInstances {
  let m = try obs.generateScaledMaskForImage(forInstances: IndexSet(integer: inst), from: handler)
  CVPixelBufferLockBaseAddress(m, .readOnly)
  let w = CVPixelBufferGetWidth(m), h = CVPixelBufferGetHeight(m), rb = CVPixelBufferGetBytesPerRow(m)
  let p = CVPixelBufferGetBaseAddress(m)!.assumingMemoryBound(to: Float32.self)
  var a = 0
  for y in stride(from: 0, to: h, by: 4) { for x in stride(from: 0, to: w, by: 4) { if p[y * rb / 4 + x] > 0.5 { a += 1 } } }
  CVPixelBufferUnlockBaseAddress(m, .readOnly)
  print("instance", inst, "area", a)
  if a > bestArea { bestArea = a; best = IndexSet(integer: inst) }
}
let mask = try obs.generateScaledMaskForImage(forInstances: best, from: handler)
let maskImg = CIImage(cvPixelBuffer: mask)
let out = ci.applyingFilter("CIBlendWithMask", parameters: [kCIInputBackgroundImageKey: CIImage.empty(), kCIInputMaskImageKey: maskImg])
let ctx = CIContext()
let cg = ctx.createCGImage(out, from: ci.extent)!
// قصّ الحواف الشفافة
let rep = NSBitmapImageRep(cgImage: cg)
var minX = rep.pixelsWide, minY = rep.pixelsHigh, maxX = 0, maxY = 0
for y in 0..<rep.pixelsHigh { for x in 0..<rep.pixelsWide {
  if (rep.colorAt(x: x, y: y)?.alphaComponent ?? 0) > 0.05 { minX = min(minX, x); maxX = max(maxX, x); minY = min(minY, y); maxY = max(maxY, y) }
} }
let crop = cg.cropping(to: CGRect(x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1))!
let data = NSBitmapImageRep(cgImage: crop).representation(using: .png, properties: [:])!
try data.write(to: output)
print("ok", crop.width, crop.height)
