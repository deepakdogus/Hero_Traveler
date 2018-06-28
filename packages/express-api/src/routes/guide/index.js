import express from 'express'
import {hasValidOauth, hasClientId} from '../../middleware'
import endpointWrapper from '../../utils/endpointWrapper'
import create from './create'
import update from './update'
import getGuide from './getGuide'
import deleteGuide from './deleteGuide'
import getUserGuides from './getUserGuides'
import getUserFeedGuides from './getUserFeedGuides'
import getCategoryGuides from './getCategoryGuides'
import bulkSaveStoryToGuide from './bulkSaveStoryToGuide'
import likeGuide from './likeGuide'
import unlikeGuide from './unlikeGuide'
import getGuideComments from './getGuideComments'
import createGuideComment from './createGuideComment'

const router = express.Router()

router.post('/',
  hasValidOauth,
  endpointWrapper(create),
)

router.put('/:guideId',
  hasValidOauth,
  endpointWrapper(update)
)

router.get('/:guideId',
  hasValidOauth,
  endpointWrapper(getGuide)
)

router.delete('/:guideId',
  hasValidOauth,
  endpointWrapper(deleteGuide)
)

router.get('/user/:userId',
  hasValidOauth,
  endpointWrapper(getUserGuides)
)

router.get('/user/:userId/feed',
  hasValidOauth,
  endpointWrapper(getUserFeedGuides)
)

router.get('/category/:categoryId',
  hasValidOauth,
  endpointWrapper(getCategoryGuides)
)

router.put('/story/:storyId',
  hasValidOauth,
  endpointWrapper(bulkSaveStoryToGuide)
)

router.put('/:guideId/like',
  hasValidOauth,
  endpointWrapper(likeGuide)
)

router.put('/:guideId/unlike',
  hasValidOauth,
  endpointWrapper(unlikeGuide)
)

router.get('/:guideId/comment',
  hasValidOauth,
  endpointWrapper(getGuideComments)
)

router.post('/:guideId/comment',
  hasValidOauth,
  endpointWrapper(createGuideComment)
)

export default router
