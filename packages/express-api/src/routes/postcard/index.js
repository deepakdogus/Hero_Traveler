import express from 'express'
import endpointWrapper from '../../utils/endpointWrapper'
import { hasValidOauth } from '../../middleware'

// route functions
import createPostcard from './createPostcard'
import deletePostcard from './deletePostcard'
import getPostcards from './getPostcards'
import getPostcard from './getPostcard'

const router = express.Router()

router.post('/', hasValidOauth, endpointWrapper(createPostcard))
router.get('/', hasValidOauth, endpointWrapper(getPostcards))
router.get('/:id', hasValidOauth, endpointWrapper(getPostcard))
router.delete('/:id', hasValidOauth, endpointWrapper(deletePostcard))

export default router
