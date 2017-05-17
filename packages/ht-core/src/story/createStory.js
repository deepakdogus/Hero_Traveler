import _ from 'lodash'
import {Story, Category} from '../models'
import updateDraft from '../storyDraft/updateDraft'
import createCategories from '../category/create'
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

export default async function createStory(storyData) {
  const attrs = {...storyData, draft: false}

  // Separate the new categories (text string) from the existing
  // categories (_ids)
  const newCategoryTitles = _.filter(attrs.categories, c => !_.has(c, '_id'))
  const existingCategories = _.filter(attrs.categories, c => _.has(c, '_id'))
  const newCategories = await createCategories(newCategoryTitles)
  attrs.categories = _.map(existingCategories.concat(newCategories), c => {
    return {_id: c._id}
  })
  let newStory = await updateDraft(attrs.id, attrs)

  // make a query for the story with just the fields
  // we want for the search index
  const populatedStory = await Story.getSearchStory(newStory._id)

  return addStoryToIndex({
    ...populatedStory.toObject(),
    author: _.get(populatedStory, 'author.profile.fullName')
  })
}
