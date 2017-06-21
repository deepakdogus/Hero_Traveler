import _ from 'lodash'
import Config from '../Config/AppConfig'

export default function getImageUrl(image, path) {
  const baseUrl = Config.cdnBaseUrl
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
