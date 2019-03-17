
import {
  call,
  put,
  select,
} from 'redux-saga/effects'
import Reactotron from 'reactotron-react-native'
import _ from 'lodash'

import PostcardActions from '../Redux/PostcardRedux'
import {
  getNewCover,
} from '../Redux/helpers/coverUpload'
import
CloudinaryAPI, {
  moveVideoToPreCache,
  moveVideosFromPrecacheToCache,
} from '../../Services/CloudinaryAPI'
import UXActions from '../../Redux/UXRedux'
import pathAsFileObject from '../Lib/pathAsFileObject'
import {
  isLocalMediaAsset,
} from '../Lib/getVideoUrl'
import hasConnection from '../../Lib/hasConnection'
import {
  currentUserId,
} from './SessionSagas'


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

// used exclusively by web to immediately upload cloudinary assets
export function * uploadMedia(api, {uri, callback, mediaType = 'image'}) {
  const cloudinaryMedia = yield CloudinaryAPI.uploadMediaFile(
    pathAsFileObject(uri),
    mediaType,
  )

  if (typeof cloudinaryMedia.data === "string") {
    cloudinaryMedia.data = JSON.parse(cloudinaryMedia.data)
  }
  const failureMessage = _.get(cloudinaryMedia, 'data.error')
    || _.get(cloudinaryMedia, 'problem')
  if (failureMessage) {
    callback(null, failureMessage)
    yield [
      put(StoryCreateActions.uploadMediaFailure(failureMessage)),
      put(UXActions.openGlobalModal(
        'error',
        {
          title: 'Upload Failure',
          message: 'There was a problem uploading your file. Please retry.',
        }
      ))
    ]
  }
  else {
    callback(cloudinaryMedia.data)
    yield put(StoryCreateActions.uploadMediaSuccess())
  }
}

export function * createCover(api, postcard){
  Reactotron.log(postcard)
  const videoFileUri =
    postcard.coverVideo && postcard.coverVideo.uri && isLocalMediaAsset(postcard.coverVideo.uri)
    ? postcard.coverVideo.uri
    : undefined
  const isImageCover = postcard.coverImage
  const cover = getNewCover(postcard.coverImage, postcard.coverVideo)
  Reactotron.log(cover)
  if (!cover) return postcard

  const cloudinaryCover = yield CloudinaryAPI.uploadMediaFile(cover, isImageCover ? 'image' : 'video')

  // Web and mobile receive two different responses.
  if (typeof cloudinaryCover.data === "string") {
    cloudinaryCover.data = JSON.parse(cloudinaryCover.data)
  }

  if (_.get(cloudinaryCover, 'data.error'))
    return cloudinaryCover.data

  if (_.get(cloudinaryCover, 'error'))
    return cloudinaryCover

  if (isImageCover) {
    postcard.coverImage = cloudinaryCover.data
  } else {
    postcard.coverVideo = cloudinaryCover.data
  }

  // if (!isGuide)
  //   yield put(StoryCreateActions.incrementSyncProgress())

  if (videoFileUri && cloudinaryCover.data && cloudinaryCover.data.public_id) {
    moveVideoToPreCache(postcard.id, videoFileUri, cloudinaryCover.data.public_id)
  }

  return postcard
}

function * createPostcardErrorHandling(postcard, response){
  let err = new Error('Failed to publish postcard')
  // TODO: I tried {...response, ...err} but that seemed to strip the Error instance of it's
  //       methods, maybe Object.assign(err, response) is better?
  err.status = response.status
  err.problem = response.problem

  yield put(PostcardActions.createPostcardFailure(err))
  return err
}

export function * createPostcard(api, action) {
  const { postcard } = action
  // yield [
  //   put(PendingUpdatesActions.addPendingUpdate(
  //     draft,
  //     'Failed to publish',
  //     'saveLocalDraft',
  //     'retrying',
  //   )),
  //   put(StoryCreateActions.initializeSyncProgress(
  //     getSyncProgressSteps(draft),
  //     `${saveAsDraft ? 'Saving' : 'Publishing'} Story`
  //   )),
  // ]

  const coverResponse = yield createCover(api, postcard)
  if (coverResponse.error) {
    yield createPostcardErrorHandling(postcard, coverResponse.error)
    return
  }

  const response = yield call(api.createPostcard, postcard)
  if (response.ok) {
    moveVideosFromPrecacheToCache(postcard.id)
    const { postcard } = response.data
    yield [
      put(PostcardActions.createPostcardSuccess(postcard)),
    ]
  }
  else {
    yield createPostcardErrorHandling(postcard, response)
  }
}

export function * getPostcard(api, { cardId }) {
  const response = yield call(
    api.getPostcard,
    cardId
  )

  if (response.ok) {
    const postcard = response.data
    yield put(PostcardActions.getPostcardSuccess(postcard))
  } else {
    yield put(PostcardActions.getPostcardFailure(new Error('Failed to load story')))
  }
}

export function * getPostcards(api) {
  const response = yield call(
    api.getPostcards
  )

  if (response.ok) {
    const postcards = response.data.feed
    yield put(PostcardActions.getPostcardsSuccess(postcards))
  } else {
    yield put(StoryActions.getPostcardFailure(
      new Error('Failed to load drafts'),
    ))
  }
}

export function * deletePostcard(api, { cardId }){
  const response = yield call(
    api.deletePostcard,
    cardId
  )

  if (response.ok) {
    yield [
      put(PostcardActions.deletePostcardSuccess(cardId)),
    ]
  }
}
