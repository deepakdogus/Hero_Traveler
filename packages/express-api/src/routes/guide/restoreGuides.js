import {Guide} from '@hero/ht-core'

const restoreGuide = async(id) => {
  return Guide.restoreGuide(id)
}

export default function restoreGuides(req, res) {
  const ids = req.body.ids
  const restoreTasks = ids.map(i => restoreGuide(i))
  return Promise.all(restoreTasks)
}
