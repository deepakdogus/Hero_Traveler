import {Models} from '../../ht-core'

// patch used to set stories to flagged to false
export default function setFlag() {
  Models.Story.find({ "flagged" : {"$ne": true} })
  .then(stories => {
    return stories.map(story => {
      story.flagged = false
      return story.save()
    })
  })
}
