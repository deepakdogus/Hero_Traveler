const mb = 1000 * 1000
const cloudinaryPixelLimit = 25000000 // 25 megapixels

function isImage(file) {
  return file.type.includes('image')
}

function isVideo(file) {
  return file.type.includes('video')
}

function isValidSize(file) {
  return (isVideo(file) && file.size < 100 * mb)
  || (isImage(file) && file.size < 20 * mb)
}

function uploadAlert(onload) {
  alert('We are sorry, the file you uploaded is in an unsupported format. We accept PNG and JPG images up to 20MB and 5000x5000 pixels; and MP4, MOV videos up to 60 seconds long and 100MB')
  onload()
}

function imagePixelCheck(event, onload, file) {
  let image = new Image()
  image.src = event.target.result
  image.onload = function() {
    if (this.height * this.width > cloudinaryPixelLimit) {
      return uploadAlert(onload)
    }
    else onload(file)
  }
}

function videoLengthCheck(onload, file) {
  const URL = window.URL || window.webkitURL
  var video = document.createElement('video')
  video.preload = 'metadata'

  video.onloadedmetadata = function(){
    URL.revokeObjectURL(video.src)
    if (video.duration > 60){
      return uploadAlert(onload)
    }
    else onload(file)
  }
  video.src = URL.createObjectURL(file)
}

export default function uploadFile(event, componentThis, onload){
  event.preventDefault()
  let files
  if (event.dataTransfer) {
    files = event.dataTransfer.files
  }
  else if (event.target) {
    files = event.target.files
  }
  const reader = new FileReader()
  const file = files[0]
  if (!file) return onload()
  if (!isValidSize(file)) return uploadAlert(onload)

  reader.onload = (event) => {
    file.uri = reader.result
    if (isImage(file)) imagePixelCheck(event, onload, file)
    else if (isVideo(file)) videoLengthCheck(onload, file)
    else onload(file)
  }
  reader.readAsDataURL(file)
}

const imageFormats = '.png, .jpg'
const videoFormats = '.mp4, .mov'

export function getAcceptedFormats(format) {
  if (format == 'image') return imageFormats
  else if (format === 'video') return videoFormats
  else if (format === 'both') {
    return imageFormats + ', ' + videoFormats
  }
  return imageFormats
}
