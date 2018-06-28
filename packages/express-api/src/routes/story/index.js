import express from 'express'
import endpointWrapper from '../../utils/endpointWrapper'
import {hasValidOauth} from '../../middleware'

// route functions
import getStory from './getStory'
import getUser from './getUser'
import create from './create'
import getUserFeed from './getUserFeed'
import getUserLikes from './getUserLikes'
import getUserLikesOld from './getUserLikesOld'
import getCategoryStories from './getCategoryStories'
import toggleLike from './toggleLike'
import toggleBookmark from './toggleBookmark'
import getBookmarks from './getBookmarks'
import getComments from './getComments'
import createComment from './createComment'
import deleteStory from './deleteStory'
import flagStory from './flagStory'

import getDraft from './draft/get'
import findDrafts from './draft/find'
import createDraft from './draft/create'
import removeDraft from './draft/remove'
import updateDraft from './draft/update'
import uploadDraftCoverImage from './draft/upload'
import uploadDraftCoverVideo from './draft/upload_video'
import uploadDraftCoverVideoWebhook from './draft/upload_video_webhook'
import uploadDraftImage from './draft/upload_story_image'
import uploadDraftVideo from './draft/upload_story_video'


const router = express.Router()

router.get('/user/:userId', hasValidOauth, getUser)
router.get('/user/:userId/feed', hasValidOauth, getUserFeed);
router.get('/user/:userId/like/v2', hasValidOauth, endpointWrapper(getUserLikes))
router.get('/user/:userId/like', hasValidOauth, endpointWrapper(getUserLikesOld))
router.get('/category/:categoryId', endpointWrapper(getCategoryStories));
router.get('/user/:userId/bookmark', hasValidOauth, endpointWrapper(getBookmarks))

// webhook for uploading a video
router.post('/draft/cover-video', endpointWrapper(uploadDraftCoverVideoWebhook))

// Story draft related routes
router.get('/draft', hasValidOauth, endpointWrapper(findDrafts))
router.get('/draft/:id', hasValidOauth, endpointWrapper(getDraft))
router.delete('/draft/:id', hasValidOauth, endpointWrapper(removeDraft))
router.put('/draft/:id', hasValidOauth, endpointWrapper(updateDraft))

router.put('/draft/:id/cover-image',
  hasValidOauth,
  endpointWrapper(uploadDraftCoverImage)
)

router.put('/draft/:id/cover-video',
  hasValidOauth,
  endpointWrapper(uploadDraftCoverVideo)
)

router.put('/draft/:id/video',
  hasValidOauth,
  endpointWrapper(uploadDraftVideo)
)

router.put('/draft/:id/image',
  hasValidOauth,
  endpointWrapper(uploadDraftImage)
)
router.post('/draft', hasValidOauth, endpointWrapper(createDraft))

router.delete('/:id', hasValidOauth, endpointWrapper(deleteStory))

router.get('/:id/comment', hasValidOauth, endpointWrapper(getComments))
router.post('/:id/comment', hasValidOauth, endpointWrapper(createComment))

router.get('/:id', endpointWrapper(getStory))
router.get('/:id/like', hasValidOauth, endpointWrapper(toggleLike))
router.get('/:id/bookmark', hasValidOauth, endpointWrapper(toggleBookmark))
router.put('/:id/flag', hasValidOauth, endpointWrapper(flagStory))
router.post('/', hasValidOauth, endpointWrapper(create))

export default router
