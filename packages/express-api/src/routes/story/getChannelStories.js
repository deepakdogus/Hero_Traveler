import {Story} from '@hero/ht-core'
import removeStreamlessStories from '../../utils/removeStreamlessStories'

export default function getChannelStories(req, res) {
  return Story.getUserStories(req.params.channelId)
  .then(removeStreamlessStories)
}
