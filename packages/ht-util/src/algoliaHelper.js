import algoliasearchModule from 'algoliasearch'

const client = algoliasearchModule(process.env.ALGOLIA_ACCT_KEY, process.env.ALGOLIA_API_KEY)
const categoryIndex = client.initIndex(process.env.ALGOLIA_CATEGORY_INDEX)
const hashtagIndex = client.initIndex(process.env.ALGOLIA_HASHTAG_INDEX)
const storyIndex = client.initIndex(process.env.ALGOLIA_STORY_INDEX)
const userIndex = client.initIndex(process.env.ALGOLIA_USER_INDEX)
userIndex.setSettings({
  searchableAttributes: [
    'username',
    'profile.fullName',
  ]
})

// methodParam is an object for all cases but delete when it is an id
function algoliaAction(index, method, methodParam){
  return new Promise((resolve, reject) => {
    if (process.env.DISABLE_ALGOLIA) return resolve({})
    index[method](methodParam, (err, content) => {
      if (err) return reject(err)
      return resolve(content)
    })
  })
}

// users
function formatUserSearchObject(user){
  return {
    username: user.username,
    profile: {
      fullName: user.profile.fullName,
      avatar: user.profile.avatar,
    },
    _id: user._id,
    objectID: user._id,
  }
}

function addUserToIndex(user){
  return algoliaAction(userIndex, 'addObject', formatUserSearchObject(user))
}

function updateUserIndex(user){
  return algoliaAction(userIndex, 'partialUpdateObject', formatUserSearchObject(user))
}

// stories
function addStoryToIndex(story){
  return algoliaAction(storyIndex, 'addObject', story)
}

function updateStoryIndex(story){
  return algoliaAction(storyIndex, 'partialUpdateObject', story)
}

function deleteStoryFromIndex(storyId){
  return algoliaAction(storyIndex, 'deleteObject', storyId)
}


function mapForTitleAndId(array){
  return array.map(item => {
    return {
      title: item.title,
      _id: item.id,
      objectID: item.id,
    }
  })
}

// hashtags
function addHashtagsToIndex(hashtags){
  return algoliaAction(hashtagIndex, 'addObjects', mapForTitleAndId(hashtags))
}

// categories
function addCategoriesToIndex(categories){
  return algoliaAction(categoryIndex, 'addObjects', mapForTitleAndId(categories))
}

export default {
  addUserToIndex,
  updateUserIndex,
  addStoryToIndex,
  updateStoryIndex,
  deleteStoryFromIndex,
  addHashtagsToIndex,
  addCategoriesToIndex,
}
