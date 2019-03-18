import {Story} from '@hero/ht-core'

const restoreStory = async(id) => {
  return Story.restoreStory(id)
}


export default function restoreStories(req, res) {
  const ids = req.body.ids
  const restoreTasks = ids.map(i => restoreStory(i))
  return Promise.all(restoreTasks)
}
