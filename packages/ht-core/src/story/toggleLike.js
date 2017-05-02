import {Story, StoryLike, ActivityStoryLike} from '../models'

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
      return [
        isLiked,
        Story.findOneAndUpdate({
          _id: storyId
        }, {
          $inc: {'counts.likes': isLiked ? 1 : -1}
        }, {
          new: true
        })
      ]
    })
    .spread((isLiked, story) => {
      if (isLiked) {
        return ActivityStoryLike.add(
          story.author,
          userId,
          storyId
        ).then(() => Promise.resolve({isLiked, story}))
      }

      return Promise.resolve({isLiked, story})
    })
}
