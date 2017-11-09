export default function(targetWidth, cover){
  return targetWidth / cover.original.meta.width * cover.original.meta.height
}
