import {Story, Guide} from '../models'

export default function getGuidestories(guideId) {
  return Guide.findOne({_id: guideId})
  .select('stories')
  .then(guide => {
    return Story.list({
      _id: {
        $in: guide.stories
      }
    })
  })
}
