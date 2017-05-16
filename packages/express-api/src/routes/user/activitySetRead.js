import {Models} from '@rwoody/ht-core'

export default function activitySetRead(req, res) {
  const {activityId} = req.params
  return Models.Activity.setRead(activityId)
}
