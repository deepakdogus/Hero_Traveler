import express from 'express'
import {hasValidOauth, populatesUser, isAdmin} from '../../../middleware'
import endpointWrapper from '../../../utils/endpointWrapper'
import getAll from './getAll'

const router = express.Router()

router.get(
  '/',
  hasValidOauth,
  populatesUser,
  isAdmin,
  getAll
)

// router.get(
//   '/:id',
//   hasValidOauth,
//   populatesUser,
//   isAdmin,
//   endpointWrapper(getOne)
// )


export default router
