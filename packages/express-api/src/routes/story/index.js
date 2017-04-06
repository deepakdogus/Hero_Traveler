import express from 'express'
import endpointWrapper from '../../utils/endpointWrapper'
import {hasValidOauth} from '../../middleware'

// route functions
import getStory from './getStory'
import getUser from './getUser'
import create from './create'
import getUserFeed from './getUserFeed'
import getCategoryStories from './getCategoryStories'
import toggleLike from './toggleLike'
import toggleBookmark from './toggleBookmark'

import getDraft from './draft/get'
import findDrafts from './draft/find'
import createDraft from './draft/create'
import removeDraft from './draft/remove'
import updateDraft from './draft/update'

const router = express.Router()

router.get('/user/:userId', hasValidOauth, getUser)
router.get('/user/:userId/feed', hasValidOauth, getUserFeed);
router.get('/category/:categoryId', endpointWrapper(getCategoryStories));
router.get('/:id', endpointWrapper(getStory));
router.get('/:id/like', hasValidOauth, endpointWrapper(toggleLike));
router.get('/:id/bookmark', hasValidOauth, endpointWrapper(toggleBookmark));
router.post('/', hasValidOauth, create)

// Story draft related routes
router.get('/draft', hasValidOauth, endpointWrapper(findDrafts))
router.get('/draft/:id', hasValidOauth, endpointWrapper(getDraft))
router.delete('/draft/:id', hasValidOauth, endpointWrapper(removeDraft))
router.put('/draft/:id', hasValidOauth, endpointWrapper(updateDraft))
router.post('/draft', hasValidOauth, endpointWrapper(createDraft))

export default router
