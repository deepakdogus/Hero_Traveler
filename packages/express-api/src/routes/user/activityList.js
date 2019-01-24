import {Models} from '@hero/ht-core'

export default function activityList(req, res) {
  const userId = req.user._id
  return Models.Activity.list(userId)
}
