import express from 'express'
import passport from 'passport'
import {hasClientId, hasValidOauth, isAdmin} from '../../../middleware'
import login from './login'
import endpointWrapper from '../../../utils/endpointWrapper'
import getMe from '../../user/getMe'

const router = express.Router()

router.post('/',
  hasClientId,
  passport.authenticate(['basic'], {
    session: false
  }),
  endpointWrapper(login)
)


router.get(
  '/me',
  hasValidOauth,
  isAdmin,
  endpointWrapper(getMe)
)

export default router
