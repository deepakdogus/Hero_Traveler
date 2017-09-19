import _ from 'lodash'
import Env from '../../Config/Env'

export function getVideoUrlBase() {
  return Env.cdnBaseUrl + 'video/upload'
}

export default function getVideoUrl(video: object): ?string {
  if (!_.has(video, 'original')) return undefined
  let url
  if (video.streamingFormats && video.streamingFormats.HLS) {
    url = video.streamingFormats.HLS
  }
  else {
    const {path, folders} = video.original
    const filename = _.last(path.split('/'))
    url = `${getVideoUrlBase()}/${folders.join('/')}/${filename}`
  }
  return url
}
