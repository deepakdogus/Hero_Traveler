import express from 'express'
import {hasValidOauth, populatesUser, isAdmin} from '../../../middleware'
import endpointWrapper from '../../../utils/endpointWrapper'
import getAll from './getAll'
import getOne from './getOne'
import putOne from './putOne'
import deleteOne from './deleteOne'
import restoreGuides from './restoreGuides'

const router = express.Router()

router.get(
  '/',
  hasValidOauth,
  populatesUser,
  isAdmin,
  getAll
)

router.get(
  '/:id',
  hasValidOauth,
  populatesUser,
  isAdmin,
  endpointWrapper(getOne)
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
  endpointWrapper(deleteOne)
)

router.post(
  '/restore',
  hasValidOauth,
  populatesUser,
  isAdmin,
  endpointWrapper(restoreGuides)
)


export default router
