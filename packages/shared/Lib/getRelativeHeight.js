export default function(targetWidth, imageMetrics){
  if (!targetWidth || !imageMetrics.width || !imageMetrics.height) return 0
  return targetWidth / imageMetrics.width * imageMetrics.height
}
