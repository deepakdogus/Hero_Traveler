import {Guide} from '../models'

export default async function bulkSaveStoryToGuide(storyId, isInGuide) {
  const guideIds = Object.keys(isInGuide)
  return Guide.list({
    _id: { $in : guideIds}
  })
  .then((guides) => {
    return Promise.all(guides.map(guide => {
      if (isInGuide[guide.id] && guide.stories.indexOf(storyId) === -1) {
        guide.stories.push(storyId)
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
