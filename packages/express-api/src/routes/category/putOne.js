import {Category} from '@hero/ht-core'
import _ from 'lodash'


export default async function updateUser(req) {
  const attrs = Object.assign({}, req.body)
  const categoryIdToUpdate = req.params.id
  
  const categoryPromise = Category.get({_id: req.params.id})

  return categoryPromise
  .then((category) => {

    for (let key in attrs) {
      category[key] = attrs[key]
    }

    return category.save()
  });
}
