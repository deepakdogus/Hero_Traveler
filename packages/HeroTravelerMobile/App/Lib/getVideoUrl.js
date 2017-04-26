import _ from 'lodash'
export default function getVideoUrl(video: object): ?string {
  const baseUrl = 'https://s3.amazonaws.com/hero-traveler/'
  const original = _.get(video, 'original.path', null)
  const mobile = _.get(video, 'versions.mobile.path', null)

  if (mobile) {
    return baseUrl + mobile
  }

  if (original) {
    return baseUrl + original
  }

  return null
}
