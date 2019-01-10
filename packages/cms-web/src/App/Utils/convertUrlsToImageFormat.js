export default function convertUrlsToImageFormat(thumbnail, heroImage, altText){
  const thumbFormat = thumbnail.format === 'jpg' || 'jpeg' ? 'jpeg' : thumbnail.format
  const heroFormat = heroImage.format === 'jpg' || 'jpeg' ? 'jpeg' : heroImage.format
  const heroImageName = `${heroImage.public_id.substring(heroImage.public_id.lastIndexOf('/') + 1)}.${heroImage.format}`
  const heroDashSpacedImageName = heroImageName.split(' ').join('-')
  const thumbnailName = `${thumbnail.public_id.substring(thumbnail.public_id.lastIndexOf('/') + 1)}.${thumbnail.format}`
  const thumbnailDashSpacedImageName = thumbnailName.split(' ').join('-')
  return {
    altText,
    original: {
      filename: heroImageName,
      path: `v${heroImage.version}/${heroImage.public_id.split('/')[0]}/${heroDashSpacedImageName}`,
      folders: [`v${heroImage.version}`, heroImage.public_id.split('/')[0]],
      width: heroImage.width,
      height: heroImage.height,
      meta: {
        mimeType: `${heroImage.resource_type}/${heroFormat}`,
      },
    },
    versions: {
      thumbnail240: {
        filename: thumbnailName,
        path: `v${thumbnail.version}/${thumbnail.public_id.split('/')[0]}/${thumbnailDashSpacedImageName}`,
        folders: [`v${thumbnail.version}`, thumbnail.public_id.split('/')[0]],
        width: thumbnail.width,
        height: thumbnail.height,
        meta: {
          mimeType: `${thumbnail.resource_type}/${thumbFormat}`,
        },
      },
    },
  }
}
