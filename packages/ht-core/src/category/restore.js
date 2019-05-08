import {Category} from '../models'

export default function restoreCategory(id) {
  return Category.restore({_id: id})
}
