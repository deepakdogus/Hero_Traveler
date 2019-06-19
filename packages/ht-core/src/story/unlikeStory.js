import {Story, StoryLike} from '../models'

export default function unlikeStory(storyId, userId) {
  const params = {
    user: userId,
    story: storyId,
  }
  return StoryLike.findOne(params)
  .then((storyLike) => {
    if (!storyLike) return
    return StoryLike.findOneAndRemove({
      _id: storyLike.id
    })
    .then((response) => {
      return Story.findOneAndUpdate({
        _id: storyId
      }, {
        $inc: {'counts.likes': -1}
      }, {
        new: true
      })
    })
  })
}
