import _ from 'lodash'
import Env from '../../Config/Env'

export function getVideoUrlBase() {
  return `https://res.cloudinary.com/${Env.cloudName}/video/upload`
}

export default function getVideoUrl(video: object, stream = true): ?string {
  if (!_.has(video, 'original')) return undefined
  let url
  if (stream && video.streamingFormats && video.streamingFormats.HLS) {
    url = video.streamingFormats.HLS
  }
  else {
    const {path, folders} = video.original
    const filename = _.last(path.split('/'))
    url = `${getVideoUrlBase()}/vc_auto/${folders.join('/')}/${filename}`
  }
  return url
}
