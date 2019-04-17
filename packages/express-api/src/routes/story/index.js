import express from 'express'
import endpointWrapper from '../../utils/endpointWrapper'
import {hasValidOauth, isStoryAuthor} from '../../middleware'

// route functions
import getStory from './getStory'
import getUserStories from './getUserStories'
import createStory from './createStory'
import createStoryOld from './createStoryOld'
import getUserFeed from './getUserFeed'
import getUserFeedOld from './getUserFeedOld'
import getNearbyFeed from './getNearbyFeed'
import getBadgeUserFeed from './getBadgeUserFeed'
import getUserLikes from './getUserLikes'
import getUserLikesOld from './getUserLikesOld'
import getCategoryStories from './getCategoryStories'
import toggleLike from './toggleLike'
import likeStory from './likeStory'
import unlikeStory from './unlikeStory'
import toggleBookmark from './toggleBookmark'
import addBookmark from './addBookmark'
import removeBookmark from './removeBookmark'
import getBookmarks from './getBookmarks'
import getComments from './getComments'
import createComment from './createComment'
import deleteStory from './deleteStory'
import flagStory from './flagStory'
import getGuideStories from './getGuideStories'
import findDeletedStories from './findDeletedStories'

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

router.get('/user/:userId', getUserStories)
// deprecated - included for backwards compatability
router.get('/user/:userId/feed/v2', hasValidOauth, endpointWrapper(getUserFeed))
// deprecated - included for backwards compatability
router.get('/user/:userId/feed', hasValidOauth, endpointWrapper(getUserFeedOld))
router.get('/user/:userId/like/v2', hasValidOauth, endpointWrapper(getUserLikes))
router.get('/user/:userId/like', hasValidOauth, endpointWrapper(getUserLikesOld))
router.get('/category/:categoryId', endpointWrapper(getCategoryStories))
router.get('/user/:userId/bookmark', hasValidOauth, endpointWrapper(getBookmarks))
router.get('/user/:userId/deleted', hasValidOauth, endpointWrapper(findDeletedStories))

// feed routes return a subset of stories based on criteria
router.get('/feed/userfeed/:userId', hasValidOauth, endpointWrapper(getUserFeed))
router.get('/feed/nearby', hasValidOauth, endpointWrapper(getNearbyFeed))
router.get('/feed/badgeUsers', hasValidOauth, endpointWrapper(getBadgeUserFeed))

// webhook for uploading a video
router.post('/draft/cover-video', endpointWrapper(uploadDraftCoverVideoWebhook))

// Story draft related routes
router.get('/draft', hasValidOauth, endpointWrapper(findDrafts))
router.get('/draft/:id', hasValidOauth, endpointWrapper(getDraft))
router.delete('/draft/:id', hasValidOauth, endpointWrapper(removeDraft))
router.put('/draft/:id',
  hasValidOauth,
  isStoryAuthor,
  endpointWrapper(updateDraft),
)

router.put('/draft/:id/cover-image',
  hasValidOauth,
  isStoryAuthor,
  endpointWrapper(uploadDraftCoverImage)
)

router.put('/draft/:id/cover-video',
  hasValidOauth,
  isStoryAuthor,
  endpointWrapper(uploadDraftCoverVideo)
)

router.put('/draft/:id/video',
  hasValidOauth,
  isStoryAuthor,
  endpointWrapper(uploadDraftVideo)
)

router.put('/draft/:id/image',
  hasValidOauth,
  isStoryAuthor,
  endpointWrapper(uploadDraftImage)
)
router.post('/draft', hasValidOauth, endpointWrapper(createDraft))

router.delete('/:id',
  hasValidOauth,
  isStoryAuthor,
  endpointWrapper(deleteStory),
)

router.get('/:id/comment', hasValidOauth, endpointWrapper(getComments))
router.post('/:id/comment', hasValidOauth, endpointWrapper(createComment))

router.get('/:id', endpointWrapper(getStory))
router.put('/:id/like', hasValidOauth, endpointWrapper(likeStory))
router.put('/:id/unlike', hasValidOauth, endpointWrapper(unlikeStory))
router.get('/:id/like', hasValidOauth, endpointWrapper(toggleLike))
router.get('/:id/bookmark', hasValidOauth, endpointWrapper(toggleBookmark))
router.post('/:id/bookmark', hasValidOauth, endpointWrapper(addBookmark))
router.delete('/:id/bookmark', hasValidOauth, endpointWrapper(removeBookmark))
router.put('/:id/flag', hasValidOauth, endpointWrapper(flagStory))
router.post('/', hasValidOauth, endpointWrapper(createStoryOld))
router.post('/v2', hasValidOauth, endpointWrapper(createStory))

router.get(
  '/guide/:guideId',
  endpointWrapper(getGuideStories)
)

export default router
