import _ from 'lodash'
import Config from '../../Config/AppConfig'
import {Metrics} from '../Themes'
import {PixelRatio} from 'react-native'

const baseUrl = 'https://d13na0u3ury9av.cloudfront.net/'

export default function getS3ImageUrl(image, path) {
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
