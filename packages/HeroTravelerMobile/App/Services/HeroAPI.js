// a library to wrap and simplify api calls
import {Platform} from 'react-native'
import apisauce from 'apisauce'
import {get, isArray} from 'lodash'
import {normalize, schema} from 'normalizr'

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

const devURL = Platform.OS === 'ios' ? 'http://localhost:3000/' : 'http://10.0.3.2:3000/'

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
  const signupEmail = (fullName, username, email, password) => {
    return api.post('user', {
      profile: {
        fullName
      },
      username,
      email,
      password
    })
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
      tokens
    })
  }

  const resetPassword = (email) => {
    return api.post('user/resetPassword', {email})
  }


  const getMe = () => {
    return api.get('user')
  }

  const getUserFeed = (userId, params) => {
    return api.get(`story/user/${userId}/feed`, {
        params
      })
      .then(response => {
        return Object.assign({}, response, {
          data: normalize(response.data, [Story]).entities
        })
      })
  }

  const getUserStories = (userId, params) => {
    return api.get(`story/user/${userId}`, {
        params
      })
      .then(response => {
        console.log('normalize(response.data, [Story])', normalize(response.data, [Story]))
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
          data: normalize(response.data, [Story]).entities
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
          data: normalize(response.data, [Category]).entities
        })
      })
  }

  const getSuggestedUsers = (params) => {
    return api.get('user/suggestFollowers', {
        params
      })
      .then(response => {
        return  Object.assign({}, response, {
          data: normalize(response.data, [User]).entities
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

  const likeStory = (storyId) => {
    return api.get(`story/${storyId}/like`)
  }

  const bookmarkStory = (storyId) => {
    return api.get(`story/${storyId}/bookmark`)
  }
  
  const getBookmarks = (storyId) => {
    return api.get(`story/bookmark`)
      .then(response => {
        console.log('normalize(response.data, [Bookmarks])', normalize(response.data, [Bookmarks]))
        return  Object.assign({}, response, {
          data: normalize(response.data, [Bookmarks])
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
    console.log('pathToFile', pathToFile)
    data.append('image', pathToFile)
    return api.put(`story/draft/${draftId}/cover-image`, data)
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
    getMe,
    login,
    logout,
    signupEmail,
    getUserFeed,
    createStory,
    getCategories,
    getUserStories,
    getSuggestedUsers,
    followUser,
    unfollowUser,
    followCategory,
    unfollowCategory,
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
    uploadCoverImage
  }
}

// let's return back our create method as the default.
export default {
  create
}
