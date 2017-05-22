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

export default async function createStory(storyData) {
  const newStory = await updateDraft(storyData.id, {
    ...storyData,
    draft: false,
    categories: await parseAndInsertStoryCategories(storyData.categories)
  })

  // make a query for the story with just the fields
  // we want for the search index
  const populatedStory = await Story.getSearchStory(newStory._id)

  return addStoryToIndex({
    ...populatedStory.toObject(),
    author: _.get(populatedStory, 'author.profile.fullName')
  })
}
