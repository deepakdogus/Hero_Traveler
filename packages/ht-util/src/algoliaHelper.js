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
function algoliaAction(index, method, methodParam) {
  return new Promise((resolve, reject) => {
    if (process.env.DISABLE_ALGOLIA) return resolve({})
    index[method](methodParam, (err, content) => {
      if (err) return reject(err)
      return resolve(content)
    })
  })
}

// users
function formatUserSearchObject(user) {
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

function addUserToIndex(user) {
  return algoliaAction(userIndex, 'addObject', formatUserSearchObject(user))
}

// only used for patch normally but because it works
function addUsersToIndex(users) {
  return algoliaAction(userIndex, 'addObjects', users.map(formatUserSearchObject))
}

function updateUserIndex(user) {
  return algoliaAction(userIndex, 'partialUpdateObject', formatUserSearchObject(user))
}

function updateUsersIndex(users) {
  return algoliaAction(userIndex, 'partialUpdateObjects', users.map(formatUserSearchObject))
}


// stories
function formatStorySearchObject(story) {
  return {
    title: story.title,
    author: story.author.username,
    coverImage: story.coverImage,
    coverVideo: story.coverVideo,
    type: story.type,
    locationInfo: story.locationInfo,
    draftjsContent: story.draftjsContent,
    currency: story.currency,
    cost: story.cost,
    _id: story._id,
    hashtags: story.hashtags,
    content: story.content,
    objectID: story._id,
  }
}

function addStoryToIndex(story) {
  return algoliaAction(storyIndex, 'addObject', formatStorySearchObject(story))
}

function updateStoryIndex(story) {
  return algoliaAction(storyIndex, 'partialUpdateObject', formatStorySearchObject(story))
}

function updateMultipleStories(stories) {
  const formattedStories = stories.map(formatStorySearchObject)
  return algoliaAction(storyIndex, 'partialUpdateObjects', formattedStories)
}

function deleteStoryFromIndex(storyId) {
  return algoliaAction(storyIndex, 'deleteObject', storyId)
}

function deleteUserFromIndex(userId) {
  return algoliaAction(userIndex, 'deleteObject', userId)
}

function mapForTitleAndId(array) {
  return array.map(item => {
    return {
      title: item.title,
      _id: item.id,
      objectID: item.id,
    }
  })
}

// hashtags
function addHashtagsToIndex(hashtags) {
  return algoliaAction(hashtagIndex, 'addObjects', mapForTitleAndId(hashtags))
}

// categories
function addCategoriesToIndex(categories) {
  return algoliaAction(categoryIndex, 'addObjects', mapForTitleAndId(categories))
}

export default {
  addUserToIndex,
  addUsersToIndex,
  updateUserIndex,
  addStoryToIndex,
  updateStoryIndex,
  deleteStoryFromIndex,
  deleteUserFromIndex,
  addHashtagsToIndex,
  addCategoriesToIndex,
  updateMultipleStories,
  updateUsersIndex,
}
