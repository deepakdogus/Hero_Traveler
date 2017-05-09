import _ from 'lodash'
import {Story, Category} from '../models'
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
  const attrs = {...storyData}
  const newCategoryTitles = _.filter(attrs.categories, c => !_.has(c, '_id'))
  const existingCategories = _.filter(attrs.categories, c => _.has(c, '_id'))
  const newCategories = await createCategories(newCategoryTitles)
  attrs.categories = _.map(existingCategories.concat(newCategories), c => {
    return {_id: c._id}
  })
  const updateCategoryCounts = incCounts(_.map(attrs.categories, '_id'))
  const newStory = await Story.create(attrs)
  const populatedStory = await Story.findOne({
    _id: newStory._id
  })
  .select('title description createdAt content location tripDate coverImage coverVideo author')
  .populate('coverImage coverVideo author')

  return addStoryToIndex({
    ...populatedStory.toObject(),
    author: _.get(populatedStory, 'author.profile.fullName')
  })
}
