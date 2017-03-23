import express from 'express'
import passport from 'passport'
import {hasValidOauth, hasClientId} from '../../middleware'
import endpointWrapper from '../../utils/endpointWrapper'
import getMe from './getMe'
import create from './create'
import suggestFollowers from './suggestFollowers'
import getFollowers from './getFollowers'
import getFollowees from './getFollowees'
import getCategories from './getCategories'
import followUser from './followUser'
import unfollowUser from './unfollowUser'
import followCategory from './followCategory'
import unfollowCategory from './unfollowCategory'

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

router.get(
  '/suggestFollowers',
  hasValidOauth,
  endpointWrapper(suggestFollowers)
)

// Who is following me?
router.get(
  '/followers',
  hasValidOauth,
  endpointWrapper(getFollowees)
)

// Who do I follow?
router.get(
  '/following',
  hasValidOauth,
  endpointWrapper(getFollowers)
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

router.post('/follow/category/:categoryId',
  hasValidOauth,
  endpointWrapper(followCategory)
)

router.put('/unfollow/category/:categoryId',
  hasValidOauth,
  endpointWrapper(unfollowCategory)
)

export default router
