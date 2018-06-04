import {Guide} from '../models'

export default function deleteGuide(guideId) {
  return Guide.delete({_id: guideId})
  // likely need to add bookmark handling - will deal with later
  // .then(() => {
  //   return StoryBookmark.remove({story: storyId})
  // })
}
