import express from 'express'
import passport from 'passport'
import {hasValidOauth, hasClientId} from '../../middleware'
import endpointWrapper from '../../utils/endpointWrapper'
import getMe from './getMe'
import create from './create'

const router = express.Router()

router.get(
  '/',
  hasValidOauth,
  endpointWrapper(getMe)
)

router.post('/',
  hasClientId,
  endpointWrapper(create)
)

export default router
