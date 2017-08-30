import _ from 'lodash'
import Config from '../../Config/AppConfig'
// import Env from '../../Config/Env'

export function getVideoUrlBase() {
  return Config.cdnBaseUrl + 'video/upload'
}

export default function getVideoUrl(video: object): ?string {
  if (!_.has(video, 'original')) return undefined

  const {path, folders} = video.original
  const filename = _.last(path.split('/'))
  const url = `${getVideoUrlBase()}/${folders.join('/')}/${filename}`
  return url
}
