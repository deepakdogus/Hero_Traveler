import {Guide} from '@hero/ht-core'

export default function getCategoryGuides(req, res) {
  return Guide.getCategoryGuides(req.params.categoryId)
}
