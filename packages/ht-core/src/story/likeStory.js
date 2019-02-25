import {
  Story,
  StoryLike,
  ActivityStoryLike,
} from '../models'

export default function likeStory(storyId, userId) {
  const params = {
    user: userId,
    story: storyId,
  }
  return StoryLike.findOne(params)
  .then((storyLike) => {
    if (storyLike) throw new Error('Already liked')
    return StoryLike.create(params)
    .then(() => {
      return Story.findOneAndUpdate({
        _id: storyId
      }, {
        $inc: {'counts.likes': 1}
      }, {
        new: true
      })
      .populate('author')
    })
    .then((story) => {
      // add ActivityStoryLike
      return ActivityStoryLike.add(
        story.author,
        userId,
        storyId,
      )
      .then(({isNew}) => {
        return {story, notify: isNew}
      })
    })
  })
}
