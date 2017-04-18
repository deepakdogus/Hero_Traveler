import {Story} from '../models'
import algoliasearchModule from 'algoliasearch'

const client = algoliasearchModule(process.env.ALGOLIA_ACCT_KEY, process.env.ALGOLIA_API_KEY)

const storyIndex = client.initIndex('dev_STORIES')

const addStoryToIndex = (story) => new Promise((resolve, reject) => {
  storyIndex.addObject(story, (err, content) => {
    if (err) reject(err)
    if (content) resolve(content)
  })
})

export default function createStory(storyData) {
  return Story.create(storyData)
    .then(newStory => {
      addStoryToIndex(newStory)
    })
    .catch(err => console.error(err))
}
