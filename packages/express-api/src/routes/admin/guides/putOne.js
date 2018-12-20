import {Guide} from '@hero/ht-core'
import {Constants} from '@hero/ht-util'
import _ from 'lodash'


export default async function updateUser(req) {
  const attrs = Object.assign({}, req.body)
  const guideIdToUpdate = req.params.id
  
  const guidePromise = Guide.getGuideById({_id: req.params.id})

  return guidePromise
  .then((guide) => {

    for (let key in attrs) {
      guide[key] = attrs[key]
    }

    return guide.save();
  });
}
