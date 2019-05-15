import {
  takeLatest,
} from 'redux-saga/effects'

/* ------------- Types ------------- */
import { UserTypes } from '../Redux/Entities/Users'
import { CategoryTypes } from '../Redux/Entities/Categories'
import { GuideTypes } from '../Redux/Entities/Guides'
import { StoryTypes } from '../Redux/Entities/Stories'
import { AdminStatsTypes } from '../Redux/Admin/Stats'

import {
  adminGetUsers,
  adminGetUser,
  adminPutUser,
  adminDeleteUser,
  adminRestoreUsers
} from './UserSagas'

import {
  adminGetCategories,
  adminGetCategory,
  adminPutCategory,
  adminDeleteCategory,
  adminRestoreCategories,
  adminPostCategory,
} from './CategorySagas'

import {
  adminGetStories,
  adminGetStory,
  adminPutStory,
  adminDeleteStory,
  adminRestoreStories,
} from './StorySagas'

import {
  adminGetGuides,
  adminGetGuide,
  adminPutGuide,
  adminDeleteGuide,
  adminRestoreGuides,
} from './GuideSagas'

import { 
  adminGetNewStats,
  adminGetTotalStats,
} from './Admin/StatsSagas'


const getAdditionalSagas = (heroAPI) => {
  return [
    //Admin
    takeLatest(UserTypes.ADMIN_GET_USERS, adminGetUsers, heroAPI),
    takeLatest(UserTypes.ADMIN_GET_USER, adminGetUser, heroAPI),
    takeLatest(UserTypes.ADMIN_PUT_USER, adminPutUser, heroAPI),
    takeLatest(UserTypes.ADMIN_DELETE_USER, adminDeleteUser, heroAPI),
    takeLatest(UserTypes.ADMIN_RESTORE_USERS, adminRestoreUsers, heroAPI),

    takeLatest(CategoryTypes.ADMIN_GET_CATEGORIES, adminGetCategories, heroAPI),
    takeLatest(CategoryTypes.ADMIN_GET_CATEGORY, adminGetCategory, heroAPI),
    takeLatest(CategoryTypes.ADMIN_PUT_CATEGORY, adminPutCategory, heroAPI),
    takeLatest(CategoryTypes.ADMIN_DELETE_CATEGORY, adminDeleteCategory, heroAPI),
    takeLatest(CategoryTypes.ADMIN_RESTORE_CATEGORIES, adminRestoreCategories, heroAPI),
    takeLatest(CategoryTypes.ADMIN_POST_CATEGORY, adminPostCategory, heroAPI),

    takeLatest(StoryTypes.ADMIN_GET_STORIES, adminGetStories, heroAPI),
    takeLatest(StoryTypes.ADMIN_GET_STORY, adminGetStory, heroAPI),
    takeLatest(StoryTypes.ADMIN_PUT_STORY, adminPutStory, heroAPI),
    takeLatest(StoryTypes.ADMIN_DELETE_STORY, adminDeleteStory, heroAPI),
    takeLatest(StoryTypes.ADMIN_RESTORE_STORIES, adminRestoreStories, heroAPI),

    takeLatest(GuideTypes.ADMIN_GET_GUIDES, adminGetGuides, heroAPI),
    takeLatest(GuideTypes.ADMIN_GET_GUIDE, adminGetGuide, heroAPI),
    takeLatest(GuideTypes.ADMIN_PUT_GUIDE, adminPutGuide, heroAPI),
    takeLatest(GuideTypes.ADMIN_DELETE_GUIDE, adminDeleteGuide, heroAPI),
    takeLatest(GuideTypes.ADMIN_RESTORE_GUIDES, adminRestoreGuides, heroAPI),

    takeLatest(AdminStatsTypes.ADMIN_GET_TOTAL_STATS, adminGetTotalStats, heroAPI),
    takeLatest(AdminStatsTypes.ADMIN_GET_NEW_STATS, adminGetNewStats, heroAPI),
  ]
}

export default getAdditionalSagas

