import { all, call, put } from 'redux-saga/effects'
import UserActions from '../Redux/Entities/Users'
import MediaUploadActions from '../Redux/MediaUploadRedux'

function getUploadMethod(api, uploadType){

  switch (uploadType){
    case 'avatar':
      return api.uploadAvatarImage
    case 'userCover':
      return api.uploadUserCoverImage
    case 'coverImage':
      return api.uploadCoverImage
    case 'coverVideo':
      return api.uploadCoverVideo
    case 'storyImage':
      return api.uploadStoryImage
    case 'storyVideo':
    default:
      return api.uploadCoverVideo
  }
}

// objectId will be draftId or userId depending on uploadType
export function *uploadMediaAsset (api, {objectId, file, uploadType}) {
  const uploadMethod = getUploadMethod(api, uploadType)
  const response = yield call(
    uploadMethod,
    objectId,
    file
  )
  // for now we actually only deal with avater + userCover - laying groundwork for the rest
  if (response.ok) {
    yield all([
      put(UserActions.updateUserSuccess(response.data)),
      put(MediaUploadActions.uploadSuccess())
    ])
  } else {
    yield put(MediaUploadActions.uploadFailure(new Error('Failed to upload media file')))
  }
}
