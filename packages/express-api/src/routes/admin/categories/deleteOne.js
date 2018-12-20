import {Category} from '@hero/ht-core'
import _ from 'lodash'

export default async function deleteCategory(req) {
  const categoryIdToUpdate = req.params.id

  const categoryPromise = Category.get({_id: req.params.id})
  return categoryPromise
  .then((category) => {
    category.isDeleted = true;

    return category.save().then(category => {
      return category;
    }).catch((err) => {
      if (err) {
        return Promise.reject(Error("Category could not be updated"));
      }
    });
  });
}
