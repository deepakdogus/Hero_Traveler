import {Story} from '@hero/ht-core'

export default function(req, res) {
  return Story.findBookmarks(req.params.userId)
}
