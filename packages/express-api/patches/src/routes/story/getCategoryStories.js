import {Story} from '@hero/ht-core'
import removeStreamlessStories from '../../utils/removeStreamlessStories'

export default function getCategoryStories(req, res) {
  return Story.getCategoryStories(req.params.categoryId, req.query.type)
  .then(removeStreamlessStories)
}
