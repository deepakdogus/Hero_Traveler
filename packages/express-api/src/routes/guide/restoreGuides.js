import {Guide} from '@hero/ht-core'

const restoreGuide = async(id) => {
  return Guide.restoreGuide(id)
}

export default function restoreGuides(req, res) {
  const { ids } = req.body
  const restoreTasks = ids.map(id => restoreGuide(id))
  return Promise.all(restoreTasks)
}
