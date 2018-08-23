// these are all public keys so they can be exposed on the front-end
const devSettings = {
  API_URL: 'http://localhost:3000/',
  cdnBaseUrl: 'https://res.cloudinary.com/di6rehjqx/',
  cloudName: 'di6rehjqx',
  imagePreset: 'xoj70ai1',
  videoPreset: 'tojnfdos',

  SEARCH_APP_NAME: 'BEEW4KQKOP',
  SEARCH_API_KEY: '318fa67b79fd7fdd680d68798d666786',
  SEARCH_STORY_INDEX: 'matthew_dev_STORIES',
  SEARCH_USER_INDEX: 'matthew_dev_USERS',
  SEARCH_CATEGORIES_INDEX: 'matthew_dev_CATEGORIES',
}

const prodSettings = {
  API_URL: 'http://ht-api.rehashstudio.com/',
  cdnBaseUrl: 'https://res.cloudinary.com/rehash-studio/',
  cloudName: 'rehash-studio',
  imagePreset: 'xoaf1z88',
  videoPreset: 'frbe5p09',

  SEARCH_APP_NAME: 'BEEW4KQKOP',
  SEARCH_API_KEY: '318fa67b79fd7fdd680d68798d666786',
  SEARCH_STORY_INDEX: 'prod_STORIES',
  SEARCH_USER_INDEX: 'prod_USERS',
  SEARCH_CATEGORIES_INDEX: 'prod_CATEGORIES',
}

export default process.env.NODE_ENV === 'development' ? devSettings : prodSettings
