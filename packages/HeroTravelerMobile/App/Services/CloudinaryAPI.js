import { NativeModules } from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'
import _ from 'lodash'

import env from '../Config/Env'
import {isLocalMediaAsset, getVideoUrlFromString} from '../Shared/Lib/getVideoUrl'

const VideoManager = NativeModules.VideoManager

function getCloudinaryUploadUrl(resourceType){
  const url = `https://api.cloudinary.com/v1_1/${env.cloudName}/${resourceType}/upload`
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
  const uploadURL = getCloudinaryUploadUrl(type)
  const meta = _.get(file, 'original.meta', {})
  const preset = type === 'image' ? env.imagePreset : env.videoPreset
  let dataUri
  let cropParams

  if (_.startsWith(fileData.uri, 'assets-library')) {
    dataUri = fileData.uri
  }
  else {
    dataUri = await VideoManager.fixFilePath(fileData.uri)
    if (isLocalMediaAsset(dataUri)) dataUri = decodeURIComponent(dataUri.substr(7))
  }
  const parameters = [
    {
      name: 'file',
      filename: fileData.name,
      type: fileData.type,
      data: RNFetchBlob.wrap(dataUri),
    },
    {
      name: 'upload_preset',
      data: preset,
    },
  ]
  if (meta && meta.crop) {
    cropParams = {
      x: parseInt(meta.crop[0]),
      y: parseInt(meta.crop[1]),
      width: parseInt(meta.crop[2]),
      height: parseInt(meta.crop[3]),
    }
    parameters.push({
      name: 'custom_coordinates',
      data: `${cropParams.x},${cropParams.y},${cropParams.width},${cropParams.height}`,
    })
  }


  return RNFetchBlob.fetch(
    'POST',
    uploadURL,
    {
      'Content-Type': 'multipart/form-data',
    },
    parameters,
  )
  .catch(error => {
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
