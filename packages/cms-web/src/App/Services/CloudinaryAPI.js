import env from '../Config/Env'
import apisauce from 'apisauce'

function getCloudinaryUploadUrl(resourceType){
  return `https://api.cloudinary.com/v1_1/${env.cloudName}/${resourceType}/upload`
}

// This method is only used on mobile, so providing an empty function here
export function moveVideoToPreCache(draftStoryId, videoFileUri, cloudinaryPath) {
}

// This method is only used on mobile, so providing an empty function here
export function moveVideosFromPrecacheToCache(draftStoryId) {
}

const create = () => {
  const cloudinaryApi = apisauce.create({
    baseURL: '/',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 30000
  })

  // Wrap api's addMonitor to allow the calling code to attach
  // additional monitors in the future.  But only in process.env.NODE_ENV === 'development' and only
  // if we've attached Reactotron to console (it isn't during unit tests).
  if (process.env.NODE_ENV === 'development' && console.tron) {
    cloudinaryApi.addMonitor(console.tron.apisauce)
  }

  const uploadMediaFile = (fileObject, type) => {
    const uploadURL = getCloudinaryUploadUrl(type)
    const preset = type === 'image' ? env.imagePreset : env.videoPreset
    const data = new FormData()
    if (fileObject.uri) {
      data.append('file', fileObject.uri)
    } else {
      fileObject.uri = fileObject.url
      data.append('file', fileObject.uri)
    }
    data.append('upload_preset', preset)
    console.log('type, preset', type, preset)
    return cloudinaryApi.post(uploadURL, data)
  }

  return {
    uploadMediaFile,
  }
}

const cloudinaryApi = create()
export default cloudinaryApi
