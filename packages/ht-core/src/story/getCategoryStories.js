import {Story} from '../models'
import findStories from './_find'

export default function getCategoryStories(categoryId) {
  return findStories({
    category: categoryId
  })
}
