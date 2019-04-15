import {StoryDraft} from '@hero/ht-core'

export default function removeDraft(req, res) {
  const storyId = req.params.id
  return StoryDraft.remove(storyId)
}
