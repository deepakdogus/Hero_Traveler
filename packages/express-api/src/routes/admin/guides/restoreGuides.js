import {Guide} from '@hero/ht-core'

const restoreGuide = async(id) => {
  const guidePromise = Guide.getGuideById({ _id: id })

  return guidePromise
  .then((guide) => {
    guide.isDeleted = false
    return guide.save()
  });
}

export default function restoreGuides(req, res) {
  const ids = req.body.ids
  const restoreTasks = ids.map(i => restoreGuide(i))
  return Promise.all(restoreTasks)
}
