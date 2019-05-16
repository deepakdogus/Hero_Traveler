import _ from 'lodash'
import {getLocationInfo, algoliaHelper} from '@hero/ht-util'

import {Story, Category, Hashtag, Image, Video, User} from '../models'
import {Constants} from '@hero/ht-util'
import updateDraft from '../storyDraft/updateDraft'
import createCategories from '../category/create'
import createHashtags from '../hashtag/create'
import parseAndInsertRefToStory from '../utils/parseAndInsertRefToStory'

export async function parseAndInsertStoryCategories(categories) {
  return parseAndInsertRefToStory(Category, categories, createCategories)
}

export async function parseAndInsertStoryHashtags(hashtags) {
  return parseAndInsertRefToStory(Hashtag, hashtags, createHashtags)
}

export async function getUserDetails(userId) {
  return User.findOne({_id:userId})
}

export async function addSlideshow(draft, assetFormater){
  return await Promise.all(draft.slideshow.map(image => {
    console.log('addSlideshow image', image);
    const type = image.resource_type === 'image' ? 'coverImage' : 'coverVideo'
    return createCover(image, assetFormater, type)
  }))
}

export async function addCover(draft, assetFormater){
  const {coverImage, coverVideo} = draft
  const isCoverImage = !!coverImage
  const cover = await createCover(
    coverImage || coverVideo,
    assetFormater,
    !!coverImage ? 'coverImage' : 'coverVideo'
  )
  draft.coverImage = isCoverImage ? cover._id : undefined
  draft.coverVideo = isCoverImage ? undefined : cover._id
}

export default async function createStory(storyData, assetFormater) {
  const {coverImage, coverVideo} = storyData

  // lets us know which Story method to follow and how to handle media assets
  const isLocalStory = storyData.id.startsWith('local-')
  let newStory

  const storyObject = {
    ...storyData,
    categories: await parseAndInsertStoryCategories(storyData.categories),
    hashtags: await parseAndInsertStoryHashtags(storyData.hashtags),
  }

  const authorDetails = await getUserDetails(storyData.author)
  if (authorDetails) {
    storyObject.featured = (
      authorDetails.role == Constants.USER_ROLES_FOUNDING_MEMBER_VALUE
      || authorDetails.role == Constants.USER_ROLES_CONTRIBUTOR_VALUE
      || authorDetails.role == Constants.USER_ROLES_FELLOW_VALUE
      || authorDetails.role == Constants.USER_ROLES_LOCAL_HERO_VALUE
    )
  } else {
    throw new Error('Could not find the author for this story')
  }

  if (
    storyObject.locationInfo
    && !storyObject.locationInfo.latitude
  ) {
    storyObject.locationInfo = await getLocationInfo(storyObject.locationInfo.name)
  }

  if (storyObject.draft === false) {
    storyObject.publishedDate = new Date()
  }

  if (isLocalStory) {
    if (storyObject.slideshow && !_.isEmpty(storyObject.slideshow)) {
      const slideshow = await addSlideshow(storyObject, assetFormater)
      storyObject.slideshow = slideshow
    } else {
      await addCover(storyObject, assetFormater)
    }
    storyData.id = undefined
    newStory = await Story.create(storyObject)
  }
  else newStory = await updateDraft(storyData.id, storyObject)

  // make a query for the story with just the fields
  // we want for the search index
  const populatedStory = await Story.get({_id: newStory._id})
  if (!populatedStory.draft) algoliaHelper.addStoryToIndex(populatedStory)

  return {
    story: populatedStory,
    author: storyData.author // only want to pass the ID
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
