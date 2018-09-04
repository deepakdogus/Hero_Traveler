import _ from 'lodash'
import Env from '../../Config/Env'

export function getVideoUrlBase() {
  return `https://res.cloudinary.com/${Env.cloudName}/video/upload`
}

export function isLocalMediaAsset(asset) {
  return typeof asset === 'string'
  && (
    asset.substring(0,7) === 'file://'
    || asset.substring(0,6) === '/Users'
    || asset.startsWith('data:')
  )
}

export function getVideoUrlFromString(video: string, stream = true): ?string {
  if (isLocalMediaAsset(video)) {
    return video
  }

  // If not local, then it should be in the folder/filename.mov format that we have after cloudinary upload
  if (stream) {
    // Strip extension
    let baseFilename = video.substr(0, video.lastIndexOf('.')) || video
    return `${getVideoUrlBase()}/sp_full_hd/${baseFilename}.m3u8`
  } else {
    return `${getVideoUrlBase()}/vc_auto/${video}`
  }
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

  // if a video is under 10 minutes long we force the mp4 version
  // this ensures we have enough time to prepare all the streamingFormats
  // const streamBufferTime = moment().subtract(10, 'minutes')
  // const timeFromBuffer = streamBufferTime.to(moment(video.createdAt))
  // const bufferHasPassed = timeFromBuffer.split(" ")[2] === 'ago'

  return getVideoUrlFromString(video.original.path, stream)
  // return getVideoUrlFromString(video.original.path, bufferHasPassed && stream)
}
