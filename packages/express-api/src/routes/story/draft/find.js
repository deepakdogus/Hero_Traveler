import {StoryDraft} from '@hero/ht-core'

export default function updateDraft(req, res) {
  const userId = req.user._id
  return StoryDraft.find(userId)
}
