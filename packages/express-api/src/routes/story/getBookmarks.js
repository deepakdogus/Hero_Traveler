import {Story} from '@rwoody/ht-core'

export default function(req, res) {
  return Story.findBookmarks(req.user._id)
}