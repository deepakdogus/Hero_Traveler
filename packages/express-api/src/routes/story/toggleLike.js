import {Story} from '@rwoody/ht-core'

export default function toggleLike(req, res) {
  const userId = req.user._id
  const storyId = req.params.id
  return Story.toggleLike(storyId, userId)
}
