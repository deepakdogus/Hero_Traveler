import _ from 'lodash'
import
CloudinaryAPI from '../../Services/CloudinaryAPI'

export const extractUploadData = (uploadData) => {
  if (typeof uploadData === 'string') uploadData = JSON.parse(uploadData)
  const baseObject = {
    url: `${uploadData.public_id}.${uploadData.format}`,
    height: uploadData.height,
    width: uploadData.width,
  }
  if (uploadData.resource_type === 'video') {
    let baseUrl = uploadData.secure_url.split('.')
    baseUrl.pop()
    baseUrl = baseUrl.join('.')
    baseObject.HLSUrl = baseUrl + '.m3u8'
    baseObject.MPDUrl = baseUrl + '.mpd'

  }
  return baseObject
}

export function * uploadMedia(api, {uri, callback, mediaType = 'image'}) {
  const cloudinaryMedia = yield CloudinaryAPI.uploadMediaFile(
    pathAsFileObject(uri),
    mediaType,
  )

  if (typeof cloudinaryMedia.data === 'string') {
    cloudinaryMedia.data = JSON.parse(cloudinaryMedia.data)
  }
  const failureMessage = _.get(cloudinaryMedia, 'data.error')
    || _.get(cloudinaryMedia, 'problem')
  if (failureMessage) {
    callback(null, failureMessage)
  }
  else {
    callback(cloudinaryMedia.data)
  }
}
