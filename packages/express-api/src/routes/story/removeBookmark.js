import {Story} from '@hero/ht-core'

export default function unlikeStory(req, res) {
  return Story.removeBookmark(req.params.id, req.user.id)
}
