import _ from 'lodash'
import Env from '../Config/Env'
export function getImageUrlBase() {
  return Env.cdnBaseUrl + 'image/upload'
}

export default function getImageUrl(image: object): ?string {
  if (!_.has(image, 'original')) return undefined
  const {path, folders} = image.original
  const filename = _.last(path.split('/'))
  // hot fix to avoid search crashing. Need to bulk update algolia
  const folderPath = folders ? folders.join('/') : 'files'
  const url = `${getImageUrlBase()}/${folderPath}/${filename}`
  return url
}
