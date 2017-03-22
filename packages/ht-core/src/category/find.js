import {Category} from '../models'

export default function findCategories(query) {
  return Category.find(query)
}
