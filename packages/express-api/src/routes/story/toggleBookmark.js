import {Story} from '@rwoody/ht-core'

export default function toggleBookmark(req, res) {
  const userId = req.user._id
  const storyId = req.params.id
  return Story.toggleBookmark(storyId, userId)
}
