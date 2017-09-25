import RNFetchBlob from 'react-native-fetch-blob'

import env from '../../Config/Env'

function getCloudinaryUploadUrl(resourceType){
  return `https://api.cloudinary.com/v1_1/${env.cloudName}/${resourceType}/upload`
}

export function uploadImageFile(fileData){
  const uploadURL = getCloudinaryUploadUrl('image')
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
      data: env.imagePreset,
    }
    ]
  )
}

export function uploadVideoFile(fileData){
  const uploadURL = getCloudinaryUploadUrl('video')
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
      data: env.videoPreset,
    }
    ]
  )
}
