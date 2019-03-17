import _ from 'lodash'
import {getLocationInfo} from '@hero/ht-util'
import {Postcard, Image, Video, User} from '../models'

export async function getUserDetails(userId) {
  return User.findOne({_id:userId})
}

export async function addCover(postcard, assetFormater){
  const {coverImage, coverVideo} = postcard
  const isCoverImage = !!coverImage
  const cover = await createCover(
    coverImage || coverVideo,
    assetFormater,
    !!coverImage ? 'coverImage' : 'coverVideo'
  )
  postcard.coverImage = isCoverImage ? cover._id : undefined
  postcard.coverVideo = isCoverImage ? undefined : cover._id
}

export default async function createPostcard(postcardData, assetFormater) {
  let newPostcard

  const postcardObject = {
    ...postcardData
  }

  if (
    postcardObject.locationInfo
    && !postcardObject.locationInfo.latitude
  ) {
    postcardObject.locationInfo = await getLocationInfo(postcardObject.locationInfo.name)
  }

  await addCover(postcardObject, assetFormater)
  postcardObject.publishedDate = new Date()
  newPostcard = await Postcard.create(postcardObject)
  console.log('__________', newPostcard)
  const populatedPostcard = await Postcard.get({'_id': newPostcard._id})
  console.log('__________', populatedPostcard)
  return {
    postcard: populatedPostcard,
  }
}

function createCover(cover, assetFormater, purpose) {
  if (typeof cover === 'string') cover = JSON.parse(cover)
  const createMethod = purpose === 'coverImage' ? Image : Video
  return createMethod.create(
    assetFormater(
      cover,
      {purpose}
    )
  )
}
