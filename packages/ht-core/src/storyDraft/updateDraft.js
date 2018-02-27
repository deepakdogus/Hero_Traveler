import {Story} from '../models'
import getDraft from './getDraft'
import _ from 'lodash'
import {parseAndInsertStoryCategories, addCover} from '../story/createStory'

// Merge + Save (instead of update) so we run the save
// Mongoose hooks
function hasNewCover(draft){
  return (draft.coverImage && !draft.coverImage._id) ||
  (draft.coverVideo && !draft.coverVideo._id)
}

export default async function updateDraft(draftId, attrs, assetFormater) {
	let draft = await Story.findById(draftId)
  attrs =  _.omit(attrs, 'author')
  if (hasNewCover(attrs)) await addCover(attrs, assetFormater)

  if (attrs.categories && _.size(attrs.categories)) {
    // @TODO: this should probably happen in middleware
    attrs.categories = await parseAndInsertStoryCategories(attrs.categories)
  }

  return draft.update(attrs)
	  .then((draft) => {
	    // use getDraft so we return the populated document
		  return getDraft(draftId)
	  })
}
