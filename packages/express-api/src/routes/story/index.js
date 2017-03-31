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

const router = express.Router()

router.get('/user/:userId', hasValidOauth, getUser)
router.get('/user/:userId/feed', hasValidOauth, getUserFeed);
router.get('/category/:categoryId', endpointWrapper(getCategoryStories));
router.get('/:id', endpointWrapper(getStory));
router.get('/:id/like', hasValidOauth, endpointWrapper(toggleLike));
router.get('/:id/bookmark', hasValidOauth, endpointWrapper(toggleBookmark));
router.post('/', hasValidOauth, create)

export default router
