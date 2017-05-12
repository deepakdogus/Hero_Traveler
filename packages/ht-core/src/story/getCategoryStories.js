import {Story} from '../models'
import findStories from './_find'

export default function getCategoryStories(categoryId, storyType) {
  const query = {
    categories: categoryId
  }

  if (storyType) {
    query.type = storyType
  }

  return findStories(query)
}
