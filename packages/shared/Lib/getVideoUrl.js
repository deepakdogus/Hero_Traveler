import _ from 'lodash'
import Env from '../../Config/Env'

export function getVideoUrlBase() {
  return `https://res.cloudinary.com/${Env.cloudName}/video/upload`
}

export function isLocalMediaAsset(asset) {
  return typeof asset === 'string'
  && (asset.substring(0,7) === 'file://' || asset.substring(0,6) === '/Users')
}

export default function getVideoUrl(video: object, stream = true): ?string {
  // special cases where video has not been fully synced

  if (video.uri || video.secure_url) return video.uri || video.secure_url
  // uncertain if this if ever gets hit but keeping just in case
  if (isLocalMediaAsset(video)) return video

  if (!_.has(video, 'original')) return undefined
  let url
  if (stream && video.streamingFormats && video.streamingFormats.HLS) {
    const {folders} = video.original
    const filename = _.last(video.streamingFormats.HLS.split('/'))
    url = `${getVideoUrlBase()}/sp_full_hd/${folders.join('/')}/${filename}`
  } else {
    const {path, folders} = video.original
    const filename = _.last(path.split('/'))
    url = `${getVideoUrlBase()}/vc_auto/${folders.join('/')}/${filename}`
  }
  return url
}
