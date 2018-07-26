import {Guide, GuideLike, ActivityStoryLike} from '../models'

export default function unlikeGuide(guideId, userId) {
  const params = {
    user: userId,
    guide: guideId,
  }
  return GuideLike.findOne(params)
  .then((guideLike) => {
    if (!guideLike) return
    return GuideLike.findOneAndRemove({
      _id: guideLike.id
    })
    .then((response) => {
      return Guide.findOneAndUpdate({
        _id: guideId
      }, {
        $inc: {'counts.likes': -1}
      }, {
        new: true
      })
    })
  })
}
