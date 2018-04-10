import _ from 'lodash'
import {Story, Category, Image, Video} from '../models'
import updateDraft from '../storyDraft/updateDraft'
import createCategories from '../category/create'
import createHashtags from '../hashtag/create'
import algoliasearchModule from 'algoliasearch'

const client = algoliasearchModule(process.env.ALGOLIA_ACCT_KEY, process.env.ALGOLIA_API_KEY)
const storyIndex = client.initIndex(process.env.ALGOLIA_STORY_INDEX)

const addStoryToIndex = (story) => new Promise((resolve, reject) => {
  // return early if we are not seeding
  if (process.env.DISABLE_ALGOLIA) {
    return resolve()
  }
  storyIndex.addObject(story, (err, content) => {
    if (err) reject(err)
    if (content) resolve(content)
  })
})

async function incCounts(catIds) {
  const  asyncCalls = _.map(catIds, async cid => {
    const cat = await Category.findOne({_id: cid})
    cat.counts.stories = (cat.counts.stories || 0) + 1
    return cat.save()
  })

  return await Promise.all(asyncCalls)
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

// Just like above
export async function parseAndInsertStoryHashtags(hashtags) {
  const newHashtagTitles = _.filter(hashtags, h => !_.has(h, '_id'))
  const existingHashtags = _.filter(hashtags, h => _.has(h, '_id'))
  const newHashtags = await createHashtags(newHashtagTitles)

  return _.map(existingHashtags.concat(newHashtags), h => {
    return {_id: h._id}
  })
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
  const isLocalStory = storyData.draft
  let newStory

  const storyObject = {
    ...storyData,
    draft: false,
    categories: await parseAndInsertStoryCategories(storyData.categories),
    hashtags: await parseAndInsertStoryHashtags(storyData.hashtags)
  }

  if (isLocalStory) {
    await addCover(storyObject, assetFormater)
    storyData.id = undefined
    newStory = await Story.create(storyObject)
  }
  else newStory = await updateDraft(storyData.id, storyObject)

  // make a query for the story with just the fields
  // we want for the search index
  const populatedStory = await Story.get({_id: newStory._id})
  await addStoryToIndex({
    ...populatedStory.toObject(),
    author: _.get(populatedStory, 'author.profile.fullName'),
    objectID: newStory.id
  })
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
