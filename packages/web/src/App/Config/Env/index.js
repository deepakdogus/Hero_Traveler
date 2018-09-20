// import devSettings from './dev'
import prodSettings from './prod'

export {
  API_URL: process.env.API_URL,
  cdnBaseUrl: process.env.CDN_BASE_URL,
  cloudName: process.env.CLOUD_NAME,
  imagePreset: process.env.IMAGE_PRESET,
  videoPreset: process.env.VIDEO_PRESET,

  SEARCH_APP_NAME: process.env.SEARCH_APP_NAME,
  SEARCH_API_KEY: process.env.SEARCH_API_KEY,
  SEARCH_STORY_INDEX: process.env.SEARCH_STORY_INDEX,
  SEARCH_USER_INDEX: process.env.SEARCH_USER_INDEX,
  SEARCH_CATEGORIES_INDEX: process.env.SEARCH_CATEGORIES_INDEX,
  SEARCH_HASHTAGS_INDEX: process.env.SEARCH_HASHTAGS_INDEX,
}

export default process.env.NODE_ENV === 'development' ? prodSettings : prodSettings
