import {Story} from '@hero/ht-core'
import removeStreamlessStories from '../../utils/removeStreamlessStories'

export default function getGuideStories(req, res) {
    const {guideId} = req.params
    return Story.getGuideStories(guideId)
}
