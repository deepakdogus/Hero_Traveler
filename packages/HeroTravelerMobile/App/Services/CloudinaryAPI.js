import RNFetchBlob from 'react-native-fetch-blob'

import env from '../Config/Env'

function getCloudinaryUploadUrl(resourceType){
  return `https://api.cloudinary.com/v1_1/${env.cloudName}/${resourceType}/upload`
}

/*
we expect type to be a string of either 'image' or 'video'
this directly uploads the file to Cloudinary
To modify the presets go to the relevant Cloudinary account
*/
export function uploadMediaFile(fileData, type){
  const uploadURL = getCloudinaryUploadUrl(type)
  const preset = type === 'image' ? env.imagePreset : env.videoPreset
  if (fileData.uri.startsWith('file://')) fileData.uri = fileData.uri.substr(7)
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
      data: RNFetchBlob.wrap(fileData.uri)
    }, {
      name: 'upload_preset',
      data: preset,
    }]
  )
}
