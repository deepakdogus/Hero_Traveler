import {Guide} from '../models'

export default function getCategoryGuides(categoryId) {
  return Guide
  .list({ categories: categoryId })
  .exec()
}
