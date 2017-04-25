import express from 'express'
import passport from 'passport'
import {hasValidOauth, hasClientId, multer} from '../../middleware'
import endpointWrapper from '../../utils/endpointWrapper'
import getMe from './getMe'
import getUser from './getUser'
import create from './create'
import createFacebook from './createFacebook'
import update from './update'
import updateAvatar from './updateAvatar'
import updateCover from './updateCover'
import suggestFollowers from './suggestFollowers'
import getFollowers from './getFollowers'
import getFollowees from './getFollowees'
import getCategories from './getCategories'
import followUser from './followUser'
import unfollowUser from './unfollowUser'
import followCategory from './followCategory'
import unfollowCategory from './unfollowCategory'
import resetPassword from './resetPassword'
import activityList from './activityList'
import activitySetRead from './activitySetRead'
import threadList from './threadList'
import threadMessageList from './threadMessageList'
import threadCreate from './threadCreate'
import threadCreateMessage from './threadCreateMessage'

const router = express.Router()

router.get(
  '/',
  hasValidOauth,
  endpointWrapper(getMe)
)

router.post('/',
  hasClientId,
  endpointWrapper(create)
)

router.post('/resetPassword',
  hasClientId,
  endpointWrapper(resetPassword)
)

router.post('/facebook',
  hasClientId,
  endpointWrapper(createFacebook)
)

router.get(
  '/suggestFollowers',
  hasValidOauth,
  endpointWrapper(suggestFollowers)
)

router.get(
  '/categories',
  hasValidOauth,
  endpointWrapper(getCategories)
)

router.post('/follow/user/:userId',
  hasValidOauth,
  endpointWrapper(followUser)
)

router.put('/unfollow/user/:userId',
  hasValidOauth,
  endpointWrapper(unfollowUser)
)

router.post('/follow/category',
  hasValidOauth,
  endpointWrapper(followCategory)
)

router.put('/unfollow/category',
  hasValidOauth,
  endpointWrapper(unfollowCategory)
)

router.get('/activity',
  hasValidOauth,
  endpointWrapper(activityList)
)

router.put('/activity/:id',
  hasValidOauth,
  endpointWrapper(activitySetRead)
)

router.get('/threads',
  hasValidOauth,
  endpointWrapper(threadList)
)

router.get('/threads/:id',
  hasValidOauth,
  endpointWrapper(threadMessageList)
)

router.post('/threads',
  hasValidOauth,
  endpointWrapper(threadCreate)
)

router.post('/threads/:id',
  hasValidOauth,
  endpointWrapper(threadCreateMessage)
)

router.get('/:id',
  hasValidOauth,
  endpointWrapper(getUser)
)

router.put('/:id',
  hasValidOauth,
  endpointWrapper(update)
)

router.put('/:id/avatar',
  hasValidOauth,
  multer.single('image'),
  endpointWrapper(updateAvatar)
)

router.put('/:id/cover',
  hasValidOauth,
  multer.single('image'),
  endpointWrapper(updateCover)
)

// Who is following a user?
router.get(
  '/:id/followers',
  hasValidOauth,
  endpointWrapper(getFollowees)
)

// Who does a user follow?
router.get(
  '/:id/following',
  hasValidOauth,
  endpointWrapper(getFollowers)
)

export default router
