import _ from 'lodash'
import Config from '../../Config/AppConfig'

export default function getVideoUrl(video: object): ?string {
  const baseUrl = Config.cdnBaseUrl
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
