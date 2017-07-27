import _ from 'lodash'
import Env from '../Config/Env'

export function getVideoUrlBase() {
  return Env.cdnBaseUrl + 'video/upload'
}

export default function getVideoUrl(video: object): ?string {
  if (!_.has(video, 'original')) return undefined

  const {path, folders} = video.original
  const filename = _.last(path.split('/'))
  const url = `${getVideoUrlBase()}/${folders.join('/')}/${filename}`
  return url
}
