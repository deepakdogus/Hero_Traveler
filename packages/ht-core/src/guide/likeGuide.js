import {Guide, GuideLike, ActivityStoryLike} from '../models'

export default function likeGuide(guideId, userId) {
  const params = {
    user: userId,
    guide: guideId,
  }
  return GuideLike.findOne(params)
  .then((guideLike) => {
    if (guideLike) throw new Error('Already liked')
    return GuideLike.create(params)
    .then(() => {
      return Guide.findOneAndUpdate({
        _id: guideId
      }, {
        $inc: {'counts.likes': 1}
      }, {
        new: true
      })
    })
    .then(() => {
      // add ActivityGuideLike
      return
    })
  })
}
