export default function(targetWidth, imageMetrics){
  if (!targetWidth || !imageMetrics.width || !imageMetrics.height) return
  return targetWidth / imageMetrics.width * imageMetrics.height
}
