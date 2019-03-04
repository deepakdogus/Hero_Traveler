import convertUrlsToImageFormat from './convertUrlsToImageFormat'

export default function prepareCategoryImages(values) {
  const { thumbnail, heroImage, categorySponsorLogo, interstitialImage } = values
  if ((thumbnail && thumbnail.public_id)
      || (heroImage && heroImage.public_id)) {
    values.image = convertUrlsToImageFormat(thumbnail, heroImage, 'categoryImage')
  }
  if (categorySponsorLogo && categorySponsorLogo.public_id) {
    values.categorySponsorLogo
      = convertUrlsToImageFormat(undefined, categorySponsorLogo, 'categorySponsorLogo')
  }
  if (interstitialImage && interstitialImage.public_id) {
    values.interstitialImage
      = convertUrlsToImageFormat(undefined, interstitialImage, 'interstitialImage')
  }
  return values
}
