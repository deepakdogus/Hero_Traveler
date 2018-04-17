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
  return new Promise((resolve, reject) => {
    if (process.env.DISABLE_ALGOLIA) return resolve({})

    userIndex.addObject(formatUserSearchObject(user), (err, content) => {
      if (err) return reject(err)
      return resolve(content)
    })
  })
}

function updateUserIndex(user){
  return new Promise((resolve, reject) => {
    if (process.env.DISABLE_ALGOLIA) return resolve()

    userIndex.partialUpdateObject(formatUserSearchObject(user), (err, content) => {
      if (err) return reject(err)
      return resolve(content)
    })
  })

}


// stories
function formatStorySearchObject(story){
  return {
    title: story.title,
    author: story.author.username,
    coverImage: story.coverImage,
    coverVideo: story.coverVideo,
    type: story.type,
    locationInfo: story.locationInfo,
    _id: story._id,
    objectID: story._id,
  }
}

function addStoryToIndex(story){
  return new Promise((resolve, reject) => {
    if (process.env.DISABLE_ALGOLIA) return resolve()
    storyIndex.addObject(formatStorySearchObject(story), (err, content) => {
      if (err) return reject(err)
      return resolve(content)
    })
  })
}

function updateStoryIndex(story){
  return new Promise((resolve, reject) => {
    if (process.env.DISABLE_ALGOLIA) return resolve()
    console.log("update being called")
    storyIndex.partialUpdateObject(formatStorySearchObject(story), (err, content) => {
      if (err) return reject(err)
      return resolve(content)
    })
  })
}

function deleteStoryFromIndex(storyId){
  return new Promise((resolve, reject) => {
    if (process.env.DISABLE_ALGOLIA) return resolve()
    storyIndex.deleteObject(storyId, (error) => {
      if (error) return reject(error)
      return resolve('sucessfully deleted')
    })
  })
}


function mapForTitleAndId(array){
  return array.map(item => {
    return {
      _id: item.id,
      title: item.title
    }
  })
}

// hashtags
function addHashtagsToIndex(hashtags){
  return new Promise((resolve, reject) => {
    if (process.env.DISABLE_ALGOLIA) return resolve()

    hashtagIndex.addObjects(mapForTitleAndId(hashtags), (err, content) => {
      if (err) reject(err)
      if (content) resolve(content)
    })
  })
}

// categories
function addCategoriesToIndex(categories){
  return new Promise((resolve, reject) => {
    if (process.env.DISABLE_ALGOLIA) return resolve()

    categoryIndex.addObjects(mapForTitleAndId(categories), (err, content) => {
      if (err) reject(err)
      if (content) resolve(content)
    })
  })
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
