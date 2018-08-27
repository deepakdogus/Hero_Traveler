// these are all public keys so they can be exposed on the front-end
const devSettings = {
  API_URL: 'http://localhost:3000/',
  cdnBaseUrl: 'https://res.cloudinary.com/drhj5jtbz/',
  cloudName: 'drhj5jtbz',
  imagePreset: 'ucbvn9yw',
  videoPreset: 's7vx5wfh',

  SEARCH_APP_NAME: 'BEEW4KQKOP',
  SEARCH_API_KEY: '318fa67b79fd7fdd680d68798d666786',
  SEARCH_STORY_INDEX: 'bryan_dev_STORIES',
  SEARCH_USER_INDEX: 'bryan_dev_USERS',
  SEARCH_CATEGORIES_INDEX: 'bryan_dev_CATEGORIES',
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
