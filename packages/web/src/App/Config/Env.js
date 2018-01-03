// these are all public keys so they can be exposed on the front-end
const devSettings = {
  API_URL: 'http://localhost:3000/',
  cdnBaseUrl: 'https://res.cloudinary.com/duuyquprs/',
  cloudName: 'duuyquprs',
  imagePreset: 'aurqaif8',
  videoPreset: 'fhcwbr7j',

  SEARCH_APP_NAME: 'BEEW4KQKOP',
  SEARCH_API_KEY: '318fa67b79fd7fdd680d68798d666786',
  SEARCH_STORY_INDEX: 'kat_dev_STORIES',
  SEARCH_USER_INDEX: 'kat_dev_USERS',
  SEARCH_CATEGORIES_INDEX: 'kat_dev_CATEGORIES',
} 

const prodSettings = {
  API_URL: 'http://ht-api.rehashstudio.com/',
  cdnBaseUrl: 'https://res.cloudinary.com/rehash-studio/',
  cloudName: 'rehash-studio',
  imagePreset: 'xoaf1z88',
  videoPreset: 'hyyupvie',

  SEARCH_APP_NAME: 'BEEW4KQKOP',
  SEARCH_API_KEY: '318fa67b79fd7fdd680d68798d666786',
  SEARCH_STORY_INDEX: 'prod_STORIES',
  SEARCH_USER_INDEX: 'prod_USERS',
  SEARCH_CATEGORIES_INDEX: 'prod_CATEGORIES',
}

export default process.env.NODE_ENV === 'development' ? devSettings : prodSettings
