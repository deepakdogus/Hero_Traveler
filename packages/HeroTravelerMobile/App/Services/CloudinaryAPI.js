import { NativeModules } from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'

import env from '../Config/Env'
import {isLocalMediaAsset} from '../Shared/Lib/getVideoUrl'

const VideoManager = NativeModules.VideoManager

function getCloudinaryUploadUrl(resourceType){
  return `https://api.cloudinary.com/v1_1/${env.cloudName}/${resourceType}/upload`
}

/*
we expect type to be a string of either 'image' or 'video'
this directly uploads the file to Cloudinary
To modify the presets go to the relevant Cloudinary account
*/
async function uploadMediaFile(fileData, type){
  const uploadURL = getCloudinaryUploadUrl(type)
  const preset = type === 'image' ? env.imagePreset : env.videoPreset
  let dataUri = await VideoManager.fixFilePath(fileData.uri)
  if (isLocalMediaAsset(dataUri)) dataUri = decodeURIComponent(dataUri.substr(7))

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
    return {
      error: {
        status: '',
        problem: error.message,
      }
    }
  })
}

export default {
  uploadMediaFile
}
