import {StoryDraft} from '@rwoody/ht-core'

export default function removeDraft(req, res) {
  const storyId = req.params.id
  return StoryDraft.delete(storyId)
}
