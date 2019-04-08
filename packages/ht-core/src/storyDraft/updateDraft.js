import {getLocationInfo, algoliaHelper} from '@hero/ht-util'
import _ from 'lodash'

import {Story} from '../models'
import getDraft from './getDraft'
import {
  parseAndInsertStoryCategories,
  parseAndInsertStoryHashtags,
  addCover,
  addSlideshow,
} from '../story/createStory'

// Merge + Save (instead of update) so we run the save
// Mongoose hooks
function hasNewCover(attrs){
  return (attrs.coverImage && !attrs.coverImage._id) ||
  (attrs.coverVideo && !attrs.coverVideo._id)
}

function hasNewSlideshow(attrs){
  return attrs.slideshow && !_.isEmpty(_.filter(attrs.slideshow, s => _.has(s, 'uri')))
}

function shouldGetLocation(draft, attrs){
  if (!attrs.locationInfo) return false
  // need custom because draft.locationInfo has an extra mongoose $init param
  const customIsEqual = Object.keys(attrs.locationInfo).every(key => {
    return draft.locationInfo[key] === attrs.locationInfo[key]
  })
  return !customIsEqual && !attrs.locationInfo.latitude
}

function hasNewLocation(draft, attrs){
  return draft.locationInfo.latitude !== attrs.locationInfo.latitude
    || draft.locationInfo.longitude !== attrs.locationInfo.longitude
}

function shouldUpdateAlgolia(draft, attrs){
  return true
  // for now we are basically saving for everything. may revert later
  // return hasNewCover(attrs)
  //   || hasNewLocation(draft, attrs)
  //   || draft.title !== attrs.title
  //   || draft.type !== attrs.type
}

export default async function updateDraft(draftId, attrs, assetFormater){
  let draft = await Story.findById(draftId)
  attrs =  _.omit(attrs, 'author')
  // need to do this before draft changes
  const originalShouldUpdateAlgolia = shouldUpdateAlgolia(draft, attrs)

  if (shouldGetLocation(draft, attrs)){
    attrs.locationInfo = await getLocationInfo(attrs.locationInfo.name)
  }

  if (hasNewCover(attrs)) await addCover(attrs, assetFormater)
  if (hasNewSlideshow(attrs)) await addSlideshow(attrs, assetFormater)

  if (attrs.categories && _.size(attrs.categories)) {
    // @TODO: this should probably happen in middleware
    attrs.categories = await parseAndInsertStoryCategories(attrs.categories)
  }

  if (attrs.hashtags && _.size(attrs.hashtags)) {
    // @TODO: this should probably happen in middleware
    attrs.hashtags = await parseAndInsertStoryHashtags(attrs.hashtags)
  }

  if (draft.draft === true && attrs.draft === false) {
    attrs.publishedDate = new Date();
  }

  return draft.update(attrs)
  .then((draft) => {
    // use getDraft so we return the populated document
    return getDraft(draftId)
  })
  .then((draft) => {
    if (!draft.draft && originalShouldUpdateAlgolia) {
      algoliaHelper.updateStoryIndex(draft)
    }
    return draft
  })
}
