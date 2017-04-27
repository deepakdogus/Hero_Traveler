import _ from 'lodash'
export default function getImageUrl(image: object): ?string {
  const baseUrl = 'https://s3.amazonaws.com/hero-traveler/'
  const original = _.get(image, 'original.path', null)
  const mobile = _.get(image, 'versions.mobile.path', null)

  if (mobile) {
    return baseUrl + mobile
  }

  if (original) {
    return baseUrl + original
  }

  return null
}
