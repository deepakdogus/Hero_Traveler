import express from 'express'
import endpointWrapper from '../../utils/endpointWrapper'
import find from './find'
const router = express.Router()

router.get(
  '/',
  endpointWrapper(find)
)

export default router
