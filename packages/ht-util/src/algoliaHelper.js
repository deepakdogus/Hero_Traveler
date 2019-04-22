import algoliasearchModule from 'algoliasearch'

const client = algoliasearchModule(process.env.ALGOLIA_ACCT_KEY, process.env.ALGOLIA_API_KEY)
const storyIndex = client.initIndex(process.env.ALGOLIA_STORY_INDEX)
const guideIndex = client.initIndex(process.env.ALGOLIA_GUIDE_INDEX)
const categoryIndex = client.initIndex(process.env.ALGOLIA_CATEGORY_INDEX)
const hashtagIndex = client.initIndex(process.env.ALGOLIA_HASHTAG_INDEX)
const userIndex = client.initIndex(process.env.ALGOLIA_USER_INDEX)
userIndex.setSettings({
  searchableAttributes: [
    'username',
    'profile.fullName',
    'username_suffixes'
  ]
})

//utils

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

function mapForTitleAndId(array) {
  return array.map(item => {
    return {
      title: item.title,
      _id: item.id,
      objectID: item.id,
    }
  })
}

// users
function formatUserSearchObject(user) {
  let suffixes = []
  let username = user.username;

  for(let i = 1; i < username.length; i++){
    suffixes.push(username.slice(i))
  }

  return {
    username: user.profile.username,
    username_suffixes: suffixes,
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

// for patches only
function addUsersToIndex(users) {
  return algoliaAction(userIndex, 'addObjects', users.map(formatUserSearchObject))
}

function updateUserIndex(user) {
  return algoliaAction(userIndex, 'partialUpdateObject', formatUserSearchObject(user))
}

function updateUsersIndex(users) {
  return algoliaAction(userIndex, 'partialUpdateObjects', users.map(formatUserSearchObject))
}

function deleteUserFromIndex(userId) {
  return algoliaAction(userIndex, 'deleteObject', userId)
}

// stories
function formatStorySearchObject(story) {
  return {
    _id: story._id,
    id: story._id,
    objectID: story._id,
    title: story.title,
    author: story.author.username,
    authorId: story.author.id,
    coverImage: story.coverImage,
    coverVideo: story.coverVideo,
    type: story.type,
    locationInfo: story.locationInfo,
    draftjsContent: story.draftjsContent,
    draft: story.draft,
    currency: story.currency,
    cost: story.cost,
    hashtags: story.hashtags,
    content: story.content,
    _geoloc: {
      lat: story.locationInfo.latitude,
      lng: story.locationInfo.longitude,
    }
  }
}

function addStoryToIndex(story) {
  return algoliaAction(storyIndex, 'addObject', formatStorySearchObject(story))
}

// for patches only
function addMultipleStoriesToIndex(stories) {
  const formattedStories = stories.map(formatStorySearchObject)
  return algoliaAction(storyIndex, 'addObjects', formattedStories)
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

// guides
function formatGuideSearchObject(guide) {
  const _geoloc = []
  const locationInfo = []
  guide.locations.forEach(({latitude: lat, longitude: lng, country}) => {
    _geoloc.push({lat, lng})
    locationInfo.push({country})
  })

  return {
    _id: guide._id,
    id: guide._id,
    objectID: guide._id,
    author: guide.author.username,
    authorId: guide.author.id,
    title: guide.title,
    description: guide.description,
    coverImage: guide.coverImage,
    coverVideo: guide.coverVideo,
    cost: guide.cost,
    duration: guide.duration,
    _geoloc,
    locationInfo,
  }
}

function addGuideToIndex(guide) {
  return algoliaAction(guideIndex, 'addObject', formatGuideSearchObject(guide))
}

function addMultipleGuidesToIndex(guides) {
  const formattedGuides = guides.map(formatGuideSearchObject)
  return algoliaAction(guideIndex, 'addObjects', formattedGuides)
}

function updateGuideIndex(guide) {
  return algoliaAction(guideIndex, 'partialUpdateObject', formatGuideSearchObject(guide))
}

function updateMultipleGuides(guides) {
  const formattedGuides = guides.map(formatGuideSearchObject)
  return algoliaAction(guideIndex, 'partialUpdateObjects', formattedGuides)
}

function deleteGuideFromIndex(guideId) {
  return algoliaAction(guideIndex, 'deleteObject', guideId)
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
  updateUsersIndex,
  deleteUserFromIndex,
  addStoryToIndex,
  addMultipleStoriesToIndex,
  updateStoryIndex,
  updateMultipleStories,
  deleteStoryFromIndex,
  addGuideToIndex,
  addMultipleGuidesToIndex,
  updateGuideIndex,
  updateMultipleGuides,
  deleteGuideFromIndex,
  addHashtagsToIndex,
  addCategoriesToIndex,
}
