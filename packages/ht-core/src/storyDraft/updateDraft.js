import {StoryDraft} from '../models'
import getDraft from './getDraft'
import _ from 'lodash'

export default function updateDraft(draftId, attrs) {
	return StoryDraft.findById(draftId)
	.then(draft => {
		_.assign(draft, attrs.data);
		return draft.save()
	})
	.then((updatedDraft) => {
		return getDraft(draftId)
	})
}
