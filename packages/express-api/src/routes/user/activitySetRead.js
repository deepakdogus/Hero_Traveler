import {Models} from '@rwoody/ht-core'

export default function activitySetRead(req, res) {
  const activityId = req.params.id
  return Models.Activity.setRead(activityId)
}