import {Story, StoryLike} from '../models'

export default function toggleLike(storyId, userId) {
  const record = {
    user: userId,
    story: storyId
  }
  return StoryLike.findOne(record)
    .then(storyLike => {
      if (storyLike) {
        return StoryLike.findOneAndRemove({
            _id: storyLike._id
          })
          .then(() => false)
      } else {
        return StoryLike.create(record)
          .then(() => true)
      }
    })
    .then(isLiked => {
      return Story.update({
        _id: storyId
      }, {
        $inc: {'counts.likes': isLiked ? 1 : -1}
      })
      .then(() => {isLiked})
    })
}
