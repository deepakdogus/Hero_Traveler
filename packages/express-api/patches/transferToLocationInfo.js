import {Models} from '../../ht-core'

// patch used to properly set the paths of the default categories
export default function transferToLocationInfo() {
  Models.Story.where('location').exists(true)
  .then(stories => {
    return Promise.all(stories.map(story => {
      story.locationInfo.name = story.location
      story.locationInfo.latitude = story.latitude
      story.locationInfo.longitude = story.longitude
      return story.save()
    }))
  })
}