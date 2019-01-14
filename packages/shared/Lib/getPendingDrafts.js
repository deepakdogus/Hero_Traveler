import isLocalDraft from './isLocalDraft'
import _ from 'lodash'

export default function getPendingDrafts(pendingUpdates) {
  return pendingUpdates.updateOrder.reduce((pendingDrafts, key) => {
    const story = pendingUpdates.pendingUpdates[key].story
    if (story.draft || isLocalDraft(story.id)) pendingDrafts.push(story)
    return pendingDrafts
  }, [])
}

export function getPendingDraftsIds(pendingUpdates) {
  return getPendingDrafts(pendingUpdates)
  .map(story => story.id)
}

export function getPendingDraftById(state, id) {
  return _.get(state, `pendingUpdates.pendingUpdates[${id}].story`)
}
