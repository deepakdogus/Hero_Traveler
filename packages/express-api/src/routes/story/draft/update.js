import {StoryDraft} from '@rwoody/ht-core'

export default function updateDraft(req, res) {
  const draftId = req.params.id
  const {story: attrs} = req.body
  return StoryDraft.update(draftId, attrs)
}
