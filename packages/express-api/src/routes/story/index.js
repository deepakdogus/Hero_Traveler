import express from 'express'
import endpointWrapper from '../../utils/endpointWrapper'
import {hasValidOauth, multer} from '../../middleware'

// route functions
import getStory from './getStory'
import getUser from './getUser'
import create from './create'
import getUserFeed from './getUserFeed'
import getUserLikes from './getUserLikes'
import getCategoryStories from './getCategoryStories'
import toggleLike from './toggleLike'
import toggleBookmark from './toggleBookmark'
import getBookmarks from './getBookmarks'
import getComments from './getComments'
import createComment from './createComment'

import getDraft from './draft/get'
import findDrafts from './draft/find'
import createDraft from './draft/create'
import removeDraft from './draft/remove'
import updateDraft from './draft/update'
import uploadDraftImage from './draft/upload'
import uploadDraftVideo from './draft/upload_video'

const router = express.Router()

router.get('/user/:userId', hasValidOauth, getUser)
router.get('/user/:userId/feed', hasValidOauth, getUserFeed);
router.get('/user/:userId/like', hasValidOauth, endpointWrapper(getUserLikes));
router.get('/category/:categoryId', endpointWrapper(getCategoryStories));
router.get('/user/:userId/bookmark', hasValidOauth, endpointWrapper(getBookmarks))

// Story draft related routes
router.get('/draft', hasValidOauth, endpointWrapper(findDrafts))
router.get('/draft/:id', hasValidOauth, endpointWrapper(getDraft))
router.delete('/draft/:id', hasValidOauth, endpointWrapper(removeDraft))
router.put('/draft/:id', hasValidOauth, endpointWrapper(updateDraft))
router.put('/draft/:id/cover-image',
  hasValidOauth,
  multer.single('image'),
  endpointWrapper(uploadDraftImage)
)
router.put('/draft/:id/cover-video',
  hasValidOauth,
  multer.single('video'),
  endpointWrapper(uploadDraftVideo)
)
router.post('/draft', hasValidOauth, endpointWrapper(createDraft))

router.get('/:id/comment', hasValidOauth, endpointWrapper(getComments))
router.post('/:id/comment', hasValidOauth, endpointWrapper(createComment))

router.get('/:id', endpointWrapper(getStory));
router.get('/:id/like', hasValidOauth, endpointWrapper(toggleLike));
router.get('/:id/bookmark', hasValidOauth, endpointWrapper(toggleBookmark));
router.post('/', hasValidOauth, endpointWrapper(create))

export default router
