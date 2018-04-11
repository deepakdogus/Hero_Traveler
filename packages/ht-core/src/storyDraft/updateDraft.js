import {getLocationInfo} from '@hero/ht-util'
import _ from 'lodash'

import {Story} from '../models'
import getDraft from './getDraft'
import {parseAndInsertStoryCategories, parseAndInsertStoryHashtags, addCover} from '../story/createStory'

// Merge + Save (instead of update) so we run the save
// Mongoose hooks
function hasNewCover(draft){
  return (draft.coverImage && !draft.coverImage._id) ||
  (draft.coverVideo && !draft.coverVideo._id)
}

function isNewLocation(draft, attrs) {
  if (!attrs.locationInfo) return false
  // need custom because draft.locationInfo has an extra mongoose $init param
  const customIsEqual = Object.keys(attrs.locationInfo).every(key => {
    return draft.locationInfo[key] === attrs.locationInfo[key]
  })
  return !customIsEqual && !attrs.locationInfo.latitude
}

export default async function updateDraft(draftId, attrs, assetFormater) {
  let draft = await Story.findById(draftId)
  attrs =  _.omit(attrs, 'author')

  if (isNewLocation(draft, attrs)){
    attrs.locationInfo = await getLocationInfo(attrs.locationInfo.name)
  }

  if (hasNewCover(attrs)) await addCover(attrs, assetFormater)

  if (attrs.categories && _.size(attrs.categories)) {
    // @TODO: this should probably happen in middleware
    attrs.categories = await parseAndInsertStoryCategories(attrs.categories)
  }

  if (attrs.hashtags && _.size(attrs.hashtags)) {
    // @TODO: this should probably happen in middleware
    attrs.hashtags = await parseAndInsertStoryHashtags(attrs.hashtags)
  }

  return draft.update(attrs)
    .then((draft) => {
      // use getDraft so we return the populated document
      return getDraft(draftId)
    })
}
