import {StoryDraft} from '@rwoody/ht-core'

export default function createDraft(req, res) {
  const author = req.user._id
  return StoryDraft.create({
    author
  })
}
