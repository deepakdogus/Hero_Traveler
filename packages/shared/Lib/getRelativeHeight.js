export default function(targetWidth, imageMetrics){
  return targetWidth / imageMetrics.width * imageMetrics.height
}
