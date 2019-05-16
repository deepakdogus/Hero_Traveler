import { NativeModules } from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'
import _ from 'lodash'

import env from '../Config/Env'
import {isLocalMediaAsset, getVideoUrlFromString} from '../Shared/Lib/getVideoUrl'

const VideoManager = NativeModules.VideoManager

function getCloudinaryUploadUrl(resourceType, params){
  let url = `https://api.cloudinary.com/v1_1/${env.cloudName}/${resourceType}/upload`
  if (params && params.crop) {
    const cropParams = {
      x: parseInt(params.crop[0]),
      y: parseInt(params.crop[1]),
      width: parseInt(params.crop[2]),
      height: parseInt(params.crop[3]),
    }
    url += `/x_${cropParams.x},y_${cropParams.y},w_${cropParams.width},h_${cropParams.height},c_crop`
  }
  return url
}

export function moveVideoToPreCache(draftStoryId, videoFileUri, cloudinaryPath) {
  const streamUrl = getVideoUrlFromString(cloudinaryPath, true)
  VideoManager.moveVideoToPreCache(draftStoryId, videoFileUri, streamUrl)
}

export function moveVideosFromPrecacheToCache(draftStoryId) {
  VideoManager.moveVideosFromPrecacheToCache(draftStoryId)
}

/*
we expect type to be a string of either 'image' or 'video'
this directly uploads the file to Cloudinary
To modify the presets go to the relevant Cloudinary account
*/
async function uploadMediaFile(fileData, type, file){
  console.log('uploadMediaFile fileData', file)
  const uploadURL = getCloudinaryUploadUrl(type, _.get(file, 'original.meta'))
  const preset = type === 'image' ? env.imagePreset : env.videoPreset
  let dataUri

  if (_.startsWith(fileData.uri, 'assets-library')) {
    dataUri = fileData.uri
  }
  else {
    dataUri = await VideoManager.fixFilePath(fileData.uri)
    if (isLocalMediaAsset(dataUri)) dataUri = decodeURIComponent(dataUri.substr(7))
  }
  console.log('uploadURL', uploadURL)
  return RNFetchBlob.fetch(
    'POST',
    uploadURL,
    {
      'Content-Type': 'multipart/form-data'
    },
    [{
      name: 'file',
      filename: fileData.name,
      type: fileData.type,
      data: RNFetchBlob.wrap(dataUri)
    }, {
      name: 'upload_preset',
      data: preset,
    }]
  )
  .catch(error => {
    console.log('Cloudinary api error', error)
    return {
      error: {
        status: '',
        problem: _.get(error, 'message'),
      }
    }
  })
}

export default {
  uploadMediaFile
}
