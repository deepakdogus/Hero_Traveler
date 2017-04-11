import {Story, StoryDraft} from '@rwoody/ht-core'

export default function createStory(req, res) {
  const {story: storyAttrs} = req.body
  const author = req.user._id

  return Story.create(Object.assign(
    {},
    storyAttrs,
    {author}
  ))
  .then(story => {
    let promise

    // if we were passed a draft, remove it
    if (storyAttrs.id) {
      promise = StoryDraft.remove(storyAttrs.id)
    } else {
      promise = Promise.resolve()
    }

    return promise.then(() => story)
  })
}
