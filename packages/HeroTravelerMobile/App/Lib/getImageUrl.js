import _ from 'lodash'
export default function getImageUrl(image: object): ?string {
  const path = _.get(image, 'original.path', null)
  if (!path) {
    return null
  }
  return `https://s3.amazonaws.com/hero-traveler/${path}`
}