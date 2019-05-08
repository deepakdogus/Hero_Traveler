const preparePicData = (fileData) => {
  console.log('fileData', fileData)
  const format = fileData.format === 'jpg' || 'jpeg' ? 'jpeg' : fileData.format
  const preFn = fileData.public_id.substring(fileData.public_id.lastIndexOf('/') + 1)
  const filename = `${preFn}.${fileData.format}`
  const imageName = filename.split(' ').join('-')
  return {
    filename: filename,
    path: `v${fileData.version}/${fileData.public_id.split('/')[0]}/${imageName}`,
    folders: [`v${fileData.version}`, fileData.public_id.split('/')[0]],
    width: fileData.width,
    height: fileData.height,
    meta: {
      mimeType: `${fileData.resource_type}/${format}`,
    },
  }
}

export default function convertUrlsToImageFormat(thumbnail, heroImage, altText){
  const result = {
    altText,
  }
  if (thumbnail) {
    result.versions = {
      thumbnail240: preparePicData(thumbnail),
    }
  }
  if (heroImage) {
    result.original = preparePicData(heroImage)
  }
  return result
}
