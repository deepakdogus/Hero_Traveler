import {Models} from '@hero/ht-core'

export default function(req, res) {
  return Models.Story.findByIdAndUpdate(
    req.params.id,
    { $set: { flagged: true}},
    { new: true }
  )
}
