import {Story} from '../models'
import getDraft from './getDraft'
import _ from 'lodash'

// Merge + Save (instead of update) so we run the save
// Mongoose hooks
export default function updateDraft(draftId, attrs) {
	return Story.findById(draftId)
	.then(draft => {
		_.assign(draft, attrs)
		return draft.save()
	})
	.then((updatedDraft) => {
		return getDraft(draftId)
	})
}
