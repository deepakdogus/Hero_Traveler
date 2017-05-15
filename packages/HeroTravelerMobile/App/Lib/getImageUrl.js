import _ from 'lodash'
export default function getImageUrl(image: object): ?string {
  const baseUrl = 'https://s3.amazonaws.com/hero-traveler/'
  const original = _.get(image, 'original.path', undefined)
  const mobile = _.get(image, 'versions.mobile.path', undefined)

  if (mobile) {
    return baseUrl + mobile
  }

  if (original) {
    return baseUrl + original
  }

  return undefined
}
