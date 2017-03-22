import express from 'express'
import passport from 'passport'
import {hasValidOauth, hasClientId} from '../../middleware'
import endpointWrapper from '../../utils/endpointWrapper'
import getMe from './getMe'
import create from './create'
import suggestFollowers from './suggestFollowers'

const router = express.Router()

router.get(
  '/',
  hasValidOauth,
  endpointWrapper(getMe)
)

router.get(
  '/suggestFollowers',
  // hasValidOauth,
  endpointWrapper(suggestFollowers)
)

router.post('/',
  hasClientId,
  endpointWrapper(create)
)

export default router
