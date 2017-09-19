import {StoryDraft, Models} from '@hero/ht-core'

export default function uploadDraftMedia(req, res, next) {
  const draftId = req.params.id
  const path = `${req.body.public_id}.mov`
  Models.Video.findOne({'original.path': path})
  .then(video => {
    if (video) {
      req.body.eager.forEach(streamingTransformation => {
        const format = streamingTransformation.transformation.split('/')[1]
        if (format === 'm3u8') video.streamingFormats.HLS = streamingTransformation.secure_url
        if (format === 'mpd') video.streamingFormats.DASH = streamingTransformation.secure_url
      })
      return video.save()
    }
    return video
  })
}
