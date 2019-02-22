import _ from 'lodash'
import moment from 'moment'
import Env from '../../Config/Env'

export function getVideoUrlBase() {
  return `https://res.cloudinary.com/${Env.cloudName}/video/upload`
}

export function getBodyVideoUrls(partialUrl) {
  const videoKey = partialUrl.split('.')[0]
  return {
    src: `${getVideoUrlBase()}/${partialUrl}`,
    webmSrc: `${getVideoUrlBase()}/vc_vp8/${videoKey}.webm`,
    mp4Src: `${getVideoUrlBase()}/vc_auto/${videoKey}.mp4`
  }
}

export function isLocalMediaAsset(asset) {
  return typeof asset === 'string'
  && (
    asset.substring(0,7) === 'file://'
    || asset.substring(0,6) === '/Users'
    || asset.startsWith('data:')
  )
}

// all transformations we do here should match the cloudinary presets
// if they do not the url will fail for large videos
export function getVideoUrlFromString(video: string, stream = true, createdAt): ?string {
  if (isLocalMediaAsset(video)) {
    return video
  }

  // If not local, then it should be in the folder/filename.mov format that we have after cloudinary upload
  if (stream) {
    // Strip extension
    let baseFilename = video.substr(0, video.lastIndexOf('.')) || video
    return `${getVideoUrlBase()}/sp_full_hd/${baseFilename}.m3u8`
  }

  // 10 minute buffer for cloudinary eager transformation to complete
  const tenMinutesAgo = moment().subtract({minutes: 10})
  const isTenMinutesOld = moment(createdAt).isBefore(tenMinutesAgo)
  if (!isTenMinutesOld) return `${getVideoUrlBase()}/${video}`
  return `${getVideoUrlBase()}/q_auto/${video}`
}


export function getVideoUrls(video, stream) {
  const src = getVideoUrl(video, stream)
  return {
    ...getBodyVideoUrls(getPartialUrl(src)),
    src,
  }
}

function getPartialUrl(videoSrc) {
  const split = videoSrc.split('/')
  return split.slice(split.length - 2).join('/')
}

export default function getVideoUrl(video: object, stream = true): ?string {
  if(!video) return undefined
  if (typeof video === 'string') {
    return getVideoUrlFromString(video, stream)
  }

  // special cases where video has not been fully synced
  if (video.uri || video.secure_url) {
    return video.uri || video.secure_url
  }

  if (!_.has(video, 'original')) return undefined

  return getVideoUrlFromString(video.original.path, stream, video.createdAt)
}
