import isLocalDraft from './isLocalDraft'

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
