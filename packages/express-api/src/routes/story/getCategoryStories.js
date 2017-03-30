import {Story} from '@rwoody/ht-core'

export default function getCategoryStories(req, res) {
  return Story.getCategoryStories(req.params.userId)
}
