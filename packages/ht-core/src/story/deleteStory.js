import {Story} from '../models'
import algoliasearchModule from 'algoliasearch'

const client = algoliasearchModule(process.env.ALGOLIA_ACCT_KEY, process.env.ALGOLIA_API_KEY)
const storyIndex = client.initIndex(process.env.ALGOLIA_STORY_INDEX)

const deleteStoryFromIndex = (storyId) => new Promise((resolve, reject) => {
  storyIndex.deleteObject(storyId, (error) => {
    if (error) reject(error)
    else resolve('sucessfully deleted')
  })
})

export default function deleteStory (storyId) {
  return Story.delete({_id: storyId})
    .then(() => deleteStoryFromIndex(storyId))
}
