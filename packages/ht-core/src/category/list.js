import {Category} from '../models'

export default function listCategories(query) {
  return Category.list(query)
}
