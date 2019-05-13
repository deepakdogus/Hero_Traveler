import {Story} from '@hero/ht-core'

const restoreStory = async(id) => {
  return Story.restoreStory(id)
}


export default function restoreStories(req, res) {
  const { ids } = req.body
  const restoreTasks = ids.map(id => restoreStory(id))
  return Promise.all(restoreTasks)
}
