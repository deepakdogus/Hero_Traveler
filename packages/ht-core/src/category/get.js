import {Category} from '../models'

export default function getCategory(query, options) {
  return Category.findOne(query)
             .populate('author')
}
