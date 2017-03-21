// a library to wrap and simplify api calls
import {Platform} from 'react-native'
import apisauce from 'apisauce'
import {get} from 'lodash'

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

  const getUserFeed = (userId) => {
    return api.get(`story/${userId}/feed`)
  }

  const getUserStories = (userId) => {
    return api.get(`story/user/${userId}`)
  }

  const createStory = (story) => {
    return api.post('story', {story})
  }

  const updateStoryCover = (story) => {
    return api.put(`story/${story._id}/cover`)
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
    signupEmail,
    getUserFeed,
    createStory
  }
}

// let's return back our create method as the default.
export default {
  create
}
