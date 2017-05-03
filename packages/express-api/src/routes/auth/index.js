import express from 'express'
import passport from 'passport'
import {hasClientId, hasValidOauth} from '../../middleware'
import login from './login'
import refresh from './refresh'
import revoke from './revoke'
import endpointWrapper from '../../utils/endpointWrapper'

const router = express.Router()

router.post('/',
  hasClientId,
  passport.authenticate(['basic'], {
    session: false
  }),
  endpointWrapper(login)
)

router.post('/refresh',
  hasValidOauth,
  endpointWrapper(refresh)
)

router.post('/revoke',
  hasValidOauth,
  revoke
)

export default router
