import {Story} from '../models'
import getDraft from './getDraft'
import _ from 'lodash'
import {parseAndInsertStoryCategories} from '../story/createStory'

// Merge + Save (instead of update) so we run the save
// Mongoose hooks
export default async function updateDraft(draftId, attrs) {
	let draft = await Story.findById(draftId)

  _.assign(draft, attrs)

  if (attrs.categories && _.size(attrs.categories)) {
    // @TODO: this should probably happen in middleware
    draft.categories = await parseAndInsertStoryCategories(attrs.categories)
  }

  return draft.save()
	  .then(() => {
	    // use getDraft so we return the populated document
		  return getDraft(draftId)
	  })
}
