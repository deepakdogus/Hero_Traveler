import express from 'express'
import {hasValidOauth, hasClientId} from '../../middleware'
import endpointWrapper from '../../utils/endpointWrapper'
import create from './create'

const router = express.Router()

router.post('/',
  hasClientId,
  endpointWrapper(create),
)

export default router
