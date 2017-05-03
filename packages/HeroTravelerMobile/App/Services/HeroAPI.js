// a library to wrap and simplify api calls
import {Platform} from 'react-native'
import apisauce from 'apisauce'
import _, {get, isArray} from 'lodash'
import {normalize, schema} from 'normalizr'
import {getToken as getPushToken} from '../Config/PushConfig'

const User = new schema.Entity('users')
const Category = new schema.Entity('categories')
const Story = new schema.Entity('stories', {
  author: User,
  category: Category
})
const Followers = new schema.Entity('follows', {
  follower: User,
  followee: User
})
const Bookmarks = new schema.Entity('bookmarks', {
  user: User,
  story: Story
})

const devURL = Platform.OS === 'ios' ? 'http://10.0.0.218:3000/' : 'http://10.0.3.2:3000/'

// our "constructor"
const create = () => {
  const api = apisauce.create({
    baseURL: __DEV__ ? devURL : 'http://ht-api-dev.rehashstudio.com/',
    headers: {
      // @TODO client-id
      'client-id': 'xzy',
      'Cache-Control': 'no-cache'
    },
    timeout: 10000
  })

  // Wrap api's addMonitor to allow the calling code to attach
  // additional monitors in the future.  But only in __DEV__ and only
  // if we've attached Reactotron to console (it isn't during unit tests).
  if (__DEV__ && console.tron) {
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

  const login = (username, password) => {
    console.log('getPushToken()', getPushToken())
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

  const resetPassword = (email) => {
    return api.post('user/resetPassword', {email})
  }


  const getMe = () => {
    return api.get('user')
      .then(response => {
        return Object.assign({}, response, {
          data: normalize(response.data, User)
        })
      })
  }

  const getUser = (userId) => {
    return api.get(`user/${userId}`)
    .then(response => {
      return Object.assign({}, response, {
        data: normalize(response.data, User)
      })
    })
  }

  const updateUser = (userId, attrs) => {
    return api.put(`user/${userId}`, attrs)
  }

  const getUserFeed = (userId, params) => {
    return api.get(`story/user/${userId}/feed`, {
        params
      })
      .then(response => {
        return Object.assign({}, response, {
          data: normalize(response.data, [Story])
        })
      })
  }

  const getUserStories = (userId, params) => {
    return api.get(`story/user/${userId}`, {
        params
      })
      .then(response => {
        return Object.assign({}, response, {
          data: normalize(response.data, [Story])
        })
      })
  }

  const getCategoryStories = (categoryId, params) => {
    return api.get(`story/category/${categoryId}`, {
        params
      })
      .then(response => {
        return Object.assign({}, response, {
          data: normalize(response.data, [Story])
        })
      })
  }

  // publishes a draft
  const createStory = (story) => {
    console.log('posting', story)
    return api.post('story', {story})
  }

  const createDraft = () => {
    return api.post(`story/draft`)
  }

  const updateDraft = (id, attrs) => {
    return api.put(`story/draft/${id}`, {
      story: attrs
    })
  }

  const removeDraft = (draftId) => {
    return api.delete(`story/draft/${draftId}`)
  }

  const getDraft = (draftId) => {
    return api.get(`story/draft/${draftId}`)
  }

  const getDrafts = () => {
    return api.get(`story/draft`)
  }

  const updateStoryCover = (story) => {
    return api.put(`story/${story.id}/cover`)
  }

  const getCategories = () => {
    return api.get('category')
      .then(response => {
        return  Object.assign({}, response, {
          data: normalize(response.data, [Category])
        })
      })
  }

  const getSuggestedUsers = (params) => {
    return api.get('user/suggestFollowers', {
        params
      })
      .then(response => {
        return  Object.assign({}, response, {
          data: normalize(response.data, [User])
        })
      })
  }

  const followUser = (userId) => {
    return api.post(`user/follow/user/${userId}`)
  }

  const unfollowUser = (userId) => {
    return api.put(`user/unfollow/user/${userId}`)
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
      .then(response => {
        return  Object.assign({}, response, {
          data: normalize(response.data, [User])
        })
      })
  }

  const getUserFollowing = (userId) => {
    return api.get(`user/${userId}/following`)
      .then(response => {
        return  Object.assign({}, response, {
          data: normalize(response.data, [User])
        })
      })
  }

  const getUserLikes = (userId) => {
    return api.get(`story/user/${userId}/like`)
  }

  const likeStory = (storyId) => {
    return api.get(`story/${storyId}/like`)
  }

  const bookmarkStory = (storyId) => {
    return api.get(`story/${storyId}/bookmark`)
  }

  const getBookmarks = (userId) => {
    return api.get(`story/user/${userId}/bookmark`)
      .then(response => {
        console.log('getBookmarks', response.data)
        return  Object.assign({}, response, {
          data: normalize(response.data, [Story])
        })
      })
  }

  const getComments = (storyId) => {
    return api.get(`story/${storyId}/comment`)
  }

  const createComment = (storyId, text) => {
    return api.post(`story/${storyId}/comment`, {
      content: text
    })
  }

  const uploadCoverImage = (draftId, pathToFile) => {
    const data = new FormData()
    data.append('image', pathToFile)
    return api.put(`story/draft/${draftId}/cover-image`, data)
  }

  const uploadCoverVideo = (draftId, pathToFile) => {
    const data = new FormData()
    data.append('video', pathToFile)
    return api.put(`story/draft/${draftId}/cover-video`, data)
  }

  const uploadStoryImage = (draftId, pathToFile) => {
    const data = new FormData()
    data.append('image', pathToFile)
    return api.put(`story/draft/xyz/image`, data)
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
    resetPassword,
    signupEmail,
    signupFacebook,
    getUserFeed,
    createStory,
    getCategories,
    getUserStories,
    getCategoryStories,
    getSuggestedUsers,
    getUserFollowers,
    getUserFollowing,
    followUser,
    unfollowUser,
    followCategory,
    unfollowCategory,
    getUserLikes,
    likeStory,
    bookmarkStory,
    getDraft,
    getDrafts,
    updateDraft,
    createDraft,
    removeDraft,
    getBookmarks,
    getComments,
    createComment,
    uploadCoverImage,
    uploadCoverVideo,
    uploadStoryImage,
    removeDevice,
    updateDevice,
  }
}

// let's return back our create method as the default.
export default {
  create
}
