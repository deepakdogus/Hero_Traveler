import express from 'express'
import endpointWrapper from '../../utils/endpointWrapper'
import {hasValidOauth} from '../../middleware'

// route functions
import getStory from './getStory'
import getUser from './getUser'
import create from './create'
import getUserFeed from './getUserFeed'
import getCategoryStories from './getCategoryStories'

const router = express.Router()

router.get('/user/:userId', hasValidOauth, getUser)
router.get('/user/:userId/feed', hasValidOauth, getUserFeed);
router.get('/category/:categoryId', endpointWrapper(getCategoryStories));
router.get('/:id', endpointWrapper(getStory));
router.post('/', hasValidOauth, create)

export default router
