import { call, put, select } from 'redux-saga/effects'
import StoryActions from '../Redux/Entities/Stories'
import GuideActions from '../Redux/Entities/Guides'
import UserActions, {isInitialAppDataLoaded, isStoryLiked, isStoryBookmarked} from '../Redux/Entities/Users'
import CategoryActions from '../Redux/Entities/Categories'
import StoryCreateActions from '../Redux/StoryCreateRedux'
import {getNewCover, saveCover} from '../Redux/helpers/coverUpload'
import CloudinaryAPI from '../../Services/CloudinaryAPI'
import pathAsFileObject from '../Lib/pathAsFileObject'
import _ from 'lodash'
import Immutable from 'seamless-immutable'

function * createCover(api, guide){
  const isImageCover = guide.coverImage
  const cover = getNewCover(guide.coverImage, guide.coverVideo)
  if (!cover) return guide
  const cloudinaryCover = yield CloudinaryAPI.uploadMediaFile(cover, isImageCover ? 'image' : 'video')
  if (cloudinaryCover.error) return cloudinaryCover
  cloudinaryCover.data = JSON.parse(cloudinaryCover.data)
  if (isImageCover) guide.coverImage = cloudinaryCover.data
  else guide.coverVideo = cloudinaryCover.data
  return guide
}

export function * createGuide (api, action) {
  const {guide} = action
  const coverResponse = yield createCover(api, guide)
  // add error handling here
  const response = yield call(api.createGuide, guide)
  if (response.ok) {
    const guide = response.data.guide
    const guides = {}
    guides[guide.id] = guide
    yield put(GuideActions.receiveGuides(guides))
  }
}
