export default function getPendingDrafts(pendingUpdates) {
  return pendingUpdates.updateOrder.reduce((pendingDrafts, key) => {
    const story = pendingUpdates.pendingUpdates[key].story
    if (story.draft) pendingDrafts.push(story)
    return pendingDrafts
  }, [])
}
