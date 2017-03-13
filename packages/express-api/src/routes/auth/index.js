import express from 'express'
import passport from 'passport'
import {hasClientId, hasValidOauth} from '../../middleware'
import login from './login'
import refresh from './refresh'
import revoke from './revoke'

const router = express.Router()

router.post('/',
  hasClientId,
  login
)

router.post('/refresh',
  hasValidOauth,
  refresh
)

router.post('/revoke',
  hasValidOauth,
  revoke
)

export default router
