// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import {isArray} from 'lodash'
import {normalize, schema} from 'normalizr'
import {getToken as getPushToken} from '../../Config/PushConfig'
import env from '../../Config/Env'
import CloudinaryAPI from '../../Services/CloudinaryAPI'
import _ from 'lodash'

const User = new schema.Entity('users')
const Category = new schema.Entity('categories')
const Hashtag = new schema.Entity('hashtags')
const Story = new schema.Entity('stories', {
  author: User,
  category: Category
})
const Guide = new schema.Entity('guides', {
  author: User,
  category: Category,
})
const Activity = new schema.Entity('activities', {
  fromUser: User,
  story: Story,
  guide: Guide,
})

const videoTimeout = 120 * 1000
const imageTimeout = 45 * 1000

function putMediaResponse(api, url, response, timeout){
  return api.put(url, {
    file: response.data
  }, {
    timeout
  })
}

function safeNormalize(response, schema, path = 'data'){
  if (!response.ok) return response
  if (!_.get(response, path)) {
    response.ok = false
    response.problem = 'No data'
    return response
  }
  return Object.assign({}, response, {
    data: normalize(_.get(response, path), schema)
  })
}

// our "constructor"
const create = () => {
  const api = apisauce.create({
    baseURL: env.API_URL,
    headers: {
      // @TODO client-id
      'client-id': 'xzy',
      'Cache-Control': 'no-cache',
    },
    timeout: 15000
  })

  // Wrap api's addMonitor to allow the calling code to attach
  // additional monitors in the future.  But only in process.env.NODE_ENV === 'development' and only
  // if we've attached Reactotron to console (it isn't during unit tests).
  if (process.env.NODE_ENV === 'development' && console.tron) {
    api.addMonitor(console.tron.apisauce)
  }

  const setAuth = (accessToken) => {
    api.setHeader('Authorization', `Bearer ${accessToken}`)
    return Promise.resolve()
  }

  const unsetAuth = () => {
    const newHeaders = Object.assign({}, api.headers)
    delete newHeaders.Authorization
    api.setHeaders(newHeaders)
    return Promise.resolve()
  }

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //
  // const getRoot = () => api.get('')
  // const getRate = () => api.get('rate_limit')
  // const getUser = (username) => api.get('search/users', {q: username})
  const signupEmail = (name, username, email, password) => {
    return api.post('user', {
      user: {
        name,
        username,
        email,
        password
      },
      deviceId: getPushToken()
    })
  }

  const signupFacebook = (fbid, email, name, pictureUrl) => {
    return api.post('user/facebook', {
      user: {
        fbid,
        name,
        email,
        pictureUrl
      },
      deviceId: getPushToken()
    })
  }

  const connectFacebook = (fbid, email) => {
    return api.post('user/connectFacebook', {fbid, email})
  }

  const deleteUser = (userId) => {
    return api.delete(`user/${userId}`);
  }

  const login = (username, password) => {
    return api.post('auth', {}, {
      auth: {
        username,
        password
      }
    })
  }

  const logout = (tokens) => {
    return api.post('auth/revoke', {
      tokens: tokens
    })
  }

  const updateDevice = (userId) => {
    if (!getPushToken) return
    return api.put(`user/${userId}/device`, {
      device: getPushToken()
    })
  }

  const removeDevice = (userId) => {
    const device = getPushToken()
    if (device === null) return Promise.resolve()
    return api.delete(`user/${userId}/device/${device.token}`)
  }

  const refreshTokens = (refreshToken) => {
    return api.post('auth/refresh', {
      refreshToken: refreshToken
    })
  }

  const resetPasswordRequest = (email) => {
    return api.post('user/resetPasswordRequest', {email})
  }

  const resetPassword = (token, password) => {
    return api.put('user/resetPassword', {
      token,
      password
    })
  }

  const verifyEmail = (token) => {
    return api.get(`user/verify-email/${token}`)
  }

  const getMe = () => {
    return api.get('user')
    .then(response => safeNormalize(response, User))
  }

  const getUser = (userId) => {
    return api.get(`user/${userId}`)
    .then(response => safeNormalize(response, User))
  }

  const updateUser = (userId, attrs) => {
    return api.put(`user/${userId}`, attrs)
  }

  const getUserFeed = (userId, params) => {
    return api.get(`story/user/${userId}/feed/v2`, params)
    .then(response => {
      if (!response.ok) return response
      return {
        count: response.data.count,
        ...safeNormalize(response, [Story], 'data.feed'),
      }
    })
  }

  const getNearbyFeed = (userId, nearbyStoryIds) => {
    return api
      .get(`story/user/${userId}/feed/nearby`, {
        nearbyStoryIds: JSON.stringify(nearbyStoryIds)
      })
      .then(response => {
        if (!response.ok) return response
        return {
          count: response.data.count,
          ...safeNormalize(response, [Story], 'data.feed')
        }
      })
  }

  const getBadgeUserFeed = userId => {
    return api.get(`story/user/${userId}/feed/badgeUsers`)
    .then(response => {
      if (!response.ok) return response
      return {
        count: response.data.count,
        ...safeNormalize(response, [Story], 'data.feed'),
      }
    })
  }

  const getUserFeedOld = (userId, params) => {
    return api.get(`story/user/${userId}/feed`, {
      params
    })
    .then(response => safeNormalize(response, [Story]))
  }

  const getUserStories = (userId, params) => {
    return api.get(`story/user/${userId}`, params)
    .then(response => safeNormalize(response, [Story]))
  }

  const getUsersDeletedStories = (userId) => {
    return api.get(`story/user/${userId}/deleted`)
  }

  const getCategoryStories = (categoryId, params = {}) => {
    return api.get(`story/category/${categoryId}`, params)
    .then(response => safeNormalize(response, [Story]))
  }

  // publishes a draft
  const createStory = (story) => {
    return api.post('story/v2', {story})
  }

  const createDraft = () => {
    return api.post(`story/draft`)
  }

  const updateDraft = (id, attrs) => {
    return api.put(`story/draft/${id}`, {
      story: attrs
    })
    .then(response => safeNormalize(response, Story))
  }

  const removeDraft = (draftId) => {
    return api.delete(`story/draft/${draftId}`)
  }

  const deleteStory = (storyId) => {
    return api.delete(`story/${storyId}`)
  }

  const getStory = (storyId) => {
    return api.get(`story/${storyId}`)
    .then(response => safeNormalize(response, Story))
  }

  const getDrafts = () => {
    return api.get(`story/draft`)
    .then(response => safeNormalize(response, [Story]))
  }

  const getGuideStories = (guideId) => {
    return api.get(`story/guide/${guideId}`)
    .then(response => safeNormalize(response, [Story]))
  }

  const getCategories = () => {
    return api.get('category')
    .then(response => safeNormalize(response, [Category]))
  }

  const getHashtags = () => {
    return api.get('hashtag')
    .then(response => safeNormalize(response, [Hashtag]))
  }

  const getSuggestedUsers = (params) => {
    return api.get('user/suggestFollowers', {
      params
    })
    .then(response => safeNormalize(response, [User]))
  }

  const followUser = (userId) => {
    return api.post(`user/follow/user/${userId}`)
  }

  const unfollowUser = (userId) => {
    return api.put(`user/unfollow/user/${userId}`)
  }

  const getUsersCategories = () => {
    return api.get('user/categories')
  }

  const followCategory = (categoryIds) => {
    const categories = isArray(categoryIds) ? categoryIds : [categoryIds]
    return api.post(`user/follow/category`, {
      categories
    })
  }

  const unfollowCategory = (categoryIds) => {
    const categories = isArray(categoryIds) ? categoryIds : [categoryIds]
    return api.put(`user/unfollow/category`, {
      categories
    })
  }

  const getUserFollowers = (userId) => {
    return api.get(`user/${userId}/followers`)
    .then(response => safeNormalize(response, [User]))
  }

  const getUserFollowing = (userId) => {
    return api.get(`user/${userId}/following`)
    .then(response => safeNormalize(response, [User]))
  }

  const getUserLikes = (userId) => {
    return api.get(`story/user/${userId}/like/v2`)
  }

  const likeStory = (storyId) => {
    return api.put(`story/${storyId}/like`)
  }

  const unlikeStory = (storyId) => {
    return api.put(`story/${storyId}/unlike`)
  }

  const flagStory = (storyId) => {
    return api.put(`story/${storyId}/flag`)
  }

  const bookmarkStory = (storyId) => {
    return api.post(`story/${storyId}/bookmark`)
  }

  const removeStoryBookmark = (storyId) => {
    return api.delete(`story/${storyId}/bookmark`)
  }

  const getBookmarks = (userId) => {
    return api.get(`story/user/${userId}/bookmark`)
    .then(response => safeNormalize(response, [Story]))
  }

  const getComments = (storyId) => {
    return api.get(`story/${storyId}/comment`)
  }

  const getGuideComments = (guideId) => {
    return api.get(`guide/${guideId}/comment`)
  }

  const createComment = (storyId, text) => {
    return api.post(`story/${storyId}/comment`, {
      content: text
    })
  }

  const createGuideComment = (guideId, text) => {
    return api.post(`guide/${guideId}/comment`, {
      content: text
    })
  }

  const uploadCoverImage = (draftId, pathToFile) => {
    const url = `story/draft/${draftId}/cover-image`
    return CloudinaryAPI.uploadMediaFile(pathToFile, 'image')
    .then(response => putMediaResponse(api, url, response, imageTimeout))
  }

  const uploadCoverVideo = (draftId, pathToFile) => {
    const url = `story/draft/${draftId}/cover-video`
    return CloudinaryAPI.uploadMediaFile(pathToFile, 'video')
    .then(response => putMediaResponse(api, url, response, videoTimeout))
  }

  const uploadAvatarImage = (userId, pathToFile) => {
    const url = `user/${userId}/avatar`
    return CloudinaryAPI.uploadMediaFile(pathToFile, 'image')
    .then(response => putMediaResponse(api, url, response, imageTimeout))
  }

  const removeAvatarImage = (userId) => api.put(`user/${userId}/avatar`)

  const uploadUserCoverImage = (userId, pathToFile) => {
    const url = `user/${userId}/cover`
    return CloudinaryAPI.uploadMediaFile(pathToFile, 'image')
    .then(response => putMediaResponse(api, url, response, imageTimeout))

  }

  const uploadStoryImage = (draftId, pathToFile) => {
    const url = `story/draft/${draftId}/image`
    return CloudinaryAPI.uploadMediaFile(pathToFile, 'image')
    .then(response => putMediaResponse(api, url, response, imageTimeout))
  }

  const uploadStoryVideo = (draftId, pathToFile) => {
    const url = `story/draft/${draftId}/video`
    return CloudinaryAPI.uploadMediaFile(pathToFile, 'video')
    .then(response => putMediaResponse(api, url, response, videoTimeout))
  }

  const getActivity = () => {
    return api.get(`user/activity`)
    .then(response => safeNormalize(response, [Activity]))
  }

  const setActivityRead = (activityId) => {
    return api.put(`user/activity/${activityId}`)
  }

  const changePassword = (userId, oldPassword, newPassword) => {
    return api.put(`user/changePassword`, {userId, oldPassword, newPassword})
  }

  const signupCheck = (vals) => {
    const {username, email} = vals
    return api.post('user/signupCheck', {username, email})
  }

  const createGuide = (guide) => {
    return api.post('guide', {guide})
    .then(response => safeNormalize(response, Guide))
  }

  const updateGuide = (guide) => {
    return api.put(`guide/${guide.id}`, {guide})
    .then(response => safeNormalize(response, Guide))
  }

  const bulkSaveStoryToGuide = (storyId, isInGuide) => {
    return api.put(`guide/story/${storyId}`, {isInGuide})
    .then(response => safeNormalize(response, [Guide]))
  }

  const getGuide = (guideId) => {
    return api.get(`guide/${guideId}`)
    .then(response => safeNormalize(response, Guide))
  }

  const deleteGuide = (guideId) => {
    return api.delete(`guide/${guideId}`)
  }

  const getUserGuides = (userId) => {
    return api.get(`guide/user/${userId}`)
    .then(response => safeNormalize(response, [Guide]))
  }

  const getUserFeedGuides = (userId) => {
    return api.get(`guide/user/${userId}/feed`)
    .then(response => safeNormalize(response, [Guide]))
  }

  const getCategoryGuides = (categoryId) => {
    return api.get(`guide/category/${categoryId}`)
    .then(response => safeNormalize(response, [Guide]))
  }

  const likeGuide = (guideId) => {
    return api.put(`guide/${guideId}/like`)
  }

  const unlikeGuide = (guideId) => {
    return api.put(`guide/${guideId}/unlike`)
  }

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    setAuth,
    unsetAuth,
    login,
    logout,
    refreshTokens,
    getMe,
    updateUser,
    getUser,
    resetPasswordRequest,
    resetPassword,
    deleteUser,
    signupEmail,
    signupFacebook,
    connectFacebook,
    getUserFeed,
    getUserFeedOld,
    getNearbyFeed,
    getBadgeUserFeed,
    createStory,
    getCategories,
    getHashtags,
    getUserStories,
    getUsersDeletedStories,
    getCategoryStories,
    getSuggestedUsers,
    getUserFollowers,
    getUserFollowing,
    followUser,
    unfollowUser,
    getUsersCategories,
    followCategory,
    unfollowCategory,
    getUserLikes,
    likeStory,
    unlikeStory,
    bookmarkStory,
    removeStoryBookmark,
    getStory,
    getDrafts,
    getGuideStories,
    updateDraft,
    createDraft,
    removeDraft,
    getBookmarks,
    getComments,
    getGuideComments,
    createComment,
    createGuideComment,
    uploadCoverImage,
    uploadCoverVideo,
    uploadStoryImage,
    uploadStoryVideo,
    uploadAvatarImage,
    removeAvatarImage,
    uploadUserCoverImage,
    removeDevice,
    updateDevice,
    verifyEmail,
    getActivity,
    setActivityRead,
    deleteStory,
    changePassword,
    signupCheck,
    flagStory,
    createGuide,
    updateGuide,
    deleteGuide,
    bulkSaveStoryToGuide,
    getGuide,
    getUserGuides,
    getUserFeedGuides,
    getCategoryGuides,
    likeGuide,
    unlikeGuide,
  }
}

// let's return back our create method as the default.
export default {
  create
}
