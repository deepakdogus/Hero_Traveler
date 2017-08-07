import {Story} from '@hero/ht-core'

export default function getCategoryStories(req, res) {
  return Story.getCategoryStories(req.params.categoryId, req.query.type)
}
