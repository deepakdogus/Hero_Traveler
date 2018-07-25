import {Guide} from '../models'

export default async function bulkSaveStoryToGuide(storyId, isInGuide) {
  const guideIds = Object.keys(isInGuide)
  return Guide.list(
  {
    _id: { $in : guideIds}
  },
  true
  )
  .then((guides) => {
    return Promise.all(guides.map(guide => {
      if (isInGuide[guide.id] && guide.stories.indexOf(storyId) === -1) {
        if (guide.stories.length) {
          guide.stories = [...guide.storyies, storyId]
        }
        else guide.stories = [storyId]
        return guide.save()
      }
      else if (!isInGuide[guide.id] && guide.stories.indexOf(storyId) !== -1) {
        guide.stories = guide.stories.filter(id => String(id) !== storyId)
        return guide.save()
      }
      return guide
    }))
  })
}
