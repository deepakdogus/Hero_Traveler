import {Story} from '@hero/ht-core'

export default function findDeletedStories(req, res) {
  const userId = req.user._id
  return Story.findDeletedStories(userId)
}
