import _ from 'lodash'
export default function getVideoUrl(video: object): ?string {
  const baseUrl = 'https://s3.amazonaws.com/hero-traveler/'
  const original = _.get(video, 'original.path', undefined)
  const mobile = _.get(video, 'versions.mobile.path', undefined)

  if (mobile) {
    return baseUrl + mobile
  }

  if (original) {
    return baseUrl + original
  }

  return undefined
}
