import express from 'express'
import {hasValidOauth, hasClientId} from '../../middleware'
import endpointWrapper from '../../utils/endpointWrapper'
import create from './create'
import update from './update'
import getGuide from './getGuide'
import getUserGuides from './getUserGuides'
import getUserFeedGuides from './getUserFeedGuides'

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

router.get('/user/:userId',
  hasValidOauth,
  endpointWrapper(getUserGuides)
)

router.get('/user/:userId/feed',
  hasValidOauth,
  endpointWrapper(getUserFeedGuides)
)

export default router
