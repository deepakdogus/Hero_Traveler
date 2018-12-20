import {Guide} from '@hero/ht-core'
import _ from 'lodash'

export default async function deleteGuide(req) {
  const guideIdToUpdate = req.params.id

  const guidePromise = Guide.getGuideById({_id: req.params.id})
  return guidePromise
  .then((guide) => {
    guide.isDeleted = true;

    return guide.save().then(guide => {
      return guide;
    }).catch((err) => {
      if (err) {
        return Promise.reject(Error("Guide could not be updated"));
      }
    });
  });
}
