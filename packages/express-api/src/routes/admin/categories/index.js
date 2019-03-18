import express from 'express'
import {hasValidOauth, populatesUser, isAdmin} from '../../../middleware'
import endpointWrapper from '../../../utils/endpointWrapper'
import getAll from '../../category/getAll'
import getOne from '../../category/getOne'
import putOne from '../../category/putOne'
import postOne from '../../category/postOne'
import deleteOne from '../../category/deleteOne'
import restoreCategories from '../../category/restoreCategories'

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

router.post(
  '/',
  hasValidOauth,
  populatesUser,
  isAdmin,
  endpointWrapper(postOne)
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
  endpointWrapper(restoreCategories)
)


export default router
