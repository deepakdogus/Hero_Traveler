import express from 'express'
import {hasValidOauth, populatesUser, isAdmin} from '../../../middleware'
import endpointWrapper from '../../../utils/endpointWrapper'
import getAll from '../../guide/getAll'
import getGuide from '../../guide/getGuide'
import putOne from '../../guide/putOne'
import deleteGuide from '../../guide/deleteGuide'
import restoreGuides from '../../guide/restoreGuides'

const router = express.Router()

router.get(
  '/',
  hasValidOauth,
  populatesUser,
  isAdmin,
  getAll
)

router.get(
  '/:guideId',
  hasValidOauth,
  populatesUser,
  isAdmin,
  endpointWrapper(getGuide)
)

router.put(
  '/:id',
  hasValidOauth,
  populatesUser,
  isAdmin,
  endpointWrapper(putOne)
)

router.delete(
  '/:id',
  hasValidOauth,
  populatesUser,
  isAdmin,
  endpointWrapper(deleteGuide)
)

router.post(
  '/restore',
  hasValidOauth,
  populatesUser,
  isAdmin,
  endpointWrapper(restoreGuides)
)


export default router
