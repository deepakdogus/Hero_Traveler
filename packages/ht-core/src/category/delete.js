import {Category} from '../models'

export default function deleteCategory(id) {
  const categoryPromise = Category.findOne({_id: id})

  return categoryPromise
    .then((category) => {
      return category.delete();
    });
}
