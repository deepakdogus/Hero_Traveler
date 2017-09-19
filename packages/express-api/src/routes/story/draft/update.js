import {StoryDraft, Models} from '@hero/ht-core'

function isVideoBlock(block) {
  return block.type === 'atomic' && block.data && block.data.type === 'video'
}

export default function updateDraft(req, res) {
  const draftId = req.params.id
  const {story: attrs} = req.body

  /*
  making sure to include the streaming urls
  ---
  nota bene: if they finish editing before the cloudinary callback arrives
  they will have a normal video url instead of a streaming one. For expediency
  not adding any further steps to correct this on callback reception
  */
  if (attrs.draftjsContent){
    return Promise.all(attrs.draftjsContent.blocks.map(block => {
      if (isVideoBlock(block) && !block.data.HLSUrl) {
        return Models.Video.findOne({'original.path': block.data.url})
        .then(video => {
          const formats = video.streamingFormats
          if (formats) {
            if (formats.HLS) block.data.HLSUrl = formats.HLS
            if (formats.DASH) block.data.DASHUrl = formats.DASH
          }
        })
      }
      return
    }))
    .then(() => {
      return StoryDraft.update(draftId, attrs)
    })
  }
  return StoryDraft.update(draftId, attrs)
}
