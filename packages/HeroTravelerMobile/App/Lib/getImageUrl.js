import _ from 'lodash'
import Env from '../Config/Env'

export function getImageUrlBase() {
  return Env.cdnBaseUrl + 'image/upload'
}

export default function getImageUrl(image: object): ?string {
  if (!_.has(image, 'original')) return undefined

  const {path, folders} = image.original
  const filename = _.last(path.split('/'))
  const url = `${getImageUrlBase()}/${folders.join('/')}/${filename}`
  return url
}
