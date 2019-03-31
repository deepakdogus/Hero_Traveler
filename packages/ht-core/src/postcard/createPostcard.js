import _ from 'lodash'
import { getLocationInfo } from '@hero/ht-util'
import { Postcard } from '../models'
import { addCover } from '../story/createStory'

export default async function createPostcard(postcardData, assetFormater) {
  let newPostcard

  const postcardObject = {
    ...postcardData
  }

  if (postcardObject.locationInfo && !postcardObject.locationInfo.latitude) {
    postcardObject.locationInfo = await getLocationInfo(
      postcardObject.locationInfo.name
    )
  }

  await addCover(postcardObject, assetFormater)
  postcardObject.publishedDate = new Date()
  newPostcard = await Postcard.create(postcardObject)
  const populatedPostcard = await Postcard.findOne({
    _id: newPostcard._id
  }).populate('coverImage coverVideo')
  return {
    postcard: populatedPostcard
  }
}
