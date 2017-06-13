import _ from 'lodash'
export default function getImageUrl(image, path) {
  const baseUrl = 'https://s3.amazonaws.com/hero-traveler/'
  const original = _.get(image, 'original.path', undefined)
  const mobile = _.get(image, path ? path : 'versions.mobile.path', undefined)

  if (mobile) {
    return baseUrl + mobile
  }

  if (original) {
    return baseUrl + original
  }

  return undefined
}
