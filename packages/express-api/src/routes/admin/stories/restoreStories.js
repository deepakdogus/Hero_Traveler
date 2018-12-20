import {Story} from '@hero/ht-core'

const restoreStory = async(id) => {
  const guidePromise = Story.get({ _id: id })

  return guidePromise
  .then((guide) => {
    guide.isDeleted = false
    return guide.save()
  });
}

export default function restoreStories(req, res) {
  const ids = req.body.ids
  const restoreTasks = ids.map(i => restoreStory(i))
  return Promise.all(restoreTasks)
}
