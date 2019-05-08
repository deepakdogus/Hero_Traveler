import express from 'express'
import {hasValidOauth, populatesUser, isAdmin} from '../../../middleware'
import endpointWrapper from '../../../utils/endpointWrapper'
import getNew from './getNew'
import getTotal from './getTotal'
const router = express.Router()

router.get(
  '/new',
  hasValidOauth,
  populatesUser,
  isAdmin,
  endpointWrapper(getNew)
)

router.get(
  '/total',
  hasValidOauth,
  populatesUser,
  isAdmin,
  endpointWrapper(getTotal)
)

export default router
