import express from 'express'
import endpointWrapper from '../../utils/endpointWrapper'
import { hasValidOauth } from '../../middleware'

// route functions
import createPostcard from './createPostcard'
import deletePostcard from './deletePostcard'
import getPostcards from './getPostcards'
import getPostcard from './getPostcard'

const router = express.Router()

router.post('/postcard', hasValidOauth, endpointWrapper(createPostcard))
router.delete('/postcard/:id', hasValidOauth, endpointWrapper(deletePostcard))
router.get('/postcards', hasValidOauth, endpointWrapper(getPostcards))
router.get('/postcard/:id', hasValidOauth, endpointWrapper(getPostcard))

export default router
