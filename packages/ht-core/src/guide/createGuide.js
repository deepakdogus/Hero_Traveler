import _ from 'lodash'
import { algoliaHelper} from '@hero/ht-util'
import {Guide, Story, Category, Image, Video} from '../models'
import createCategories from '../category/create'

export async function addCover(guide, assetFormater){
  const {coverImage, coverVideo} = guide
  const isCoverImage = !!coverImage
  const cover = await createCover(
    coverImage || coverVideo,
    assetFormater,
    !!coverImage ? 'coverImage' : 'coverVideo'
  )
  guide.coverImage = isCoverImage ? cover._id : undefined
  guide.coverVideo = isCoverImage ? undefined : cover._id
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

// Separate the new categories (text string) from the existing
// categories (_ids)
export async function parseAndInsertStoryCategories(categories) {
  const newCategoryTitles = _.filter(categories, c => !_.has(c, '_id'))
  const existingCategories = _.filter(categories, c => _.has(c, '_id'))
  const newCategories = await createCategories(newCategoryTitles)

  return _.map(existingCategories.concat(newCategories), c => {
    return {_id: c._id}
  })
}

export default async function createGuide(guideData, assetFormater) {
  const {coverImage, coverVideo} = guideData
  // lets us know which Story method to follow and how to handle media assets
  let newGuide

  const guideObject = {
    ...guideData,
    categories: await parseAndInsertStoryCategories(guideData.categories)
  }

  await addCover(guideObject, assetFormater)
  guideData.id = undefined
  newGuide = await Guide.create(guideObject)
  newGuide = await Guide.get({_id: newGuide.id})
  algoliaHelper.addGuideToIndex(newGuide)

  return newGuide
}

