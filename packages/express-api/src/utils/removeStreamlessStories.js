import _ from 'lodash'

export default function removeStreamlessStories(stories) {
  if (process.env.NODE_ENV === 'development') return stories
  return stories.filter((story, index) => {
    if (story.coverVideo && !_.get(story, 'coverVideo.streamingFormats.HLS')) {
      return false
    }
    return true
  })
}
