import {Story, StoryLike} from '../models'

export default function unlikeStory(storyId, userId) {
  const params = {
    user: userId,
    story: storyId,
  }
  return StoryLike.findOne(params)
  .then((storyLike) => {
    if (!storyLike) throw new Error('This story doesn\'t have likes')
    return StoryLike.findOneAndRemove({
      _id: storyLike.id
    })
    .then(() => {
      return Story.findOneAndUpdate({
        _id: storyId,
        'counts.likes': {$gte: 1}
      }, {
        $inc: {'counts.likes': -1}
      }, {
        new: true
      })
    })
  })
}
