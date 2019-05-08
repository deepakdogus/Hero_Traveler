import {Guide} from '../models'

export default function getCountCategoryGuides(categoryId) {
  return Guide
  .count({ categories: categoryId })
  .exec()
}
