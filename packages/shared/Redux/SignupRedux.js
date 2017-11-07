import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  signupEmail: ['fullName', 'username', 'email', 'password'],
  signupEmailSuccess: null,
  signupEmailFailure: ['error'],
  signupFacebook: ['fbid', 'email', 'name', 'pictureUrl'],
  signupFacebookSuccess: null,
  signupFacebookFailure: ['error'],
  signupGetUsersCategories: [],
  signupGetUsersCategoriesSuccess: ['categoryIds'],
  signupFollowCategory: ['categoryId'],
  signupFollowCategorySuccess: ['categoryId'],
  signupFollowCategoryFailure: ['categoryId', 'error'],
  signupUnfollowCategory: ['categoryId'],
  signupUnfollowCategorySuccess: ['categoryId'],
  signupUnfollowCategoryFailure: ['categoryId', 'error'],
  signupFollowUser: ['userId'],
  signupFollowUserSuccess: ['userId'],
  signupFollowUserFailure: ['userId', 'error'],
  signupUnfollowUser: ['userId'],
  signupUnfollowUserSuccess: ['userId'],
  signupUnfollowUserFailure: ['userId', 'error'],
})

export const SignupTypes = Types
export default Creators

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
  error: null,
  fetching: false,
  saving: false,
  signedUp: false,
  selectedCategories: [],
  selectedUsers: []
})

/* ------------- Reducers ------------- */
export const signupEmail = (state) => state.merge({fetching: true})

export const signupEmailSuccess = (state) =>
  state.merge({fetching: false, error: null, signedUp: true})

export const signupFacebook = (state) => state.merge({fetching: true})

export const signupFacebookSuccess = (state) =>
  state.merge({fetching: false, error: null, signedUp: true})

export const failure = (state, { error }) =>
  state.merge({ fetching: false, error })

export const followCategory = (state, {categoryId}) =>
  state.merge({selectedCategories: state.selectedCategories.concat(categoryId)})

export const followCategoryFailure = (state, {categoryId}) =>
  state.merge({selectedCategories: _.without(state.selectedCategories, categoryId), error: 'Failed to add category'})

export const getUsersCategoriesSuccess = (state, {categoryIds}) =>
  state.merge({selectedCategories: categoryIds})

export const followCategorySuccess = (state, {categoryId}) =>
  state.merge({error: null})

export const unfollowCategory = (state, {categoryId}) =>
  state.merge({selectedCategories: _.without(state.selectedCategories, categoryId)})

export const unfollowCategoryFailure = (state, {categoryId}) =>
  state.merge({selectedCategories: state.selectedCategories.concat(categoryId), error: 'Failed to remove category'})

export const unfollowCategorySuccess = (state, {categoryId}) =>
  state.merge({error: null})

export const followUser = (state, {userId}) =>
  state.merge({selectedUsers: state.selectedUsers.concat(userId)})

export const followUserFailure = (state, {userId}) =>
  state.merge({selectedUsers: _.without(state.selectedUsers, userId), error: 'Failed to follow user'})

export const followUserSuccess = (state, {userId}) =>
  state.merge({error: null})

export const unfollowUser = (state, {userId}) =>
  state.merge({selectedUsers: _.without(state.selectedUsers, userId)})

export const unfollowUserFailure = (state, {userId}) =>
  state.merge({selectedUsers: state.selectedUsers.concat(userId), error: 'Failed to follow user'})

export const unfollowUserSuccess = (state, {userId}) =>
  state.merge({error: null})

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.SIGNUP_EMAIL]: signupEmail,
  [Types.SIGNUP_EMAIL_SUCCESS]: signupEmailSuccess,
  [Types.SIGNUP_EMAIL_FAILURE]: failure,
  [Types.SIGNUP_FACEBOOK]: signupFacebook,
  [Types.SIGNUP_FACEBOOK_SUCCESS]: signupFacebookSuccess,
  [Types.SIGNUP_FACEBOOK_FAILURE]: failure,
  [Types.SIGNUP_GET_USERS_CATEGORIES_SUCCESS]: getUsersCategoriesSuccess,
  [Types.SIGNUP_FOLLOW_CATEGORY]: followCategory,
  [Types.SIGNUP_FOLLOW_CATEGORY_SUCCESS]: followCategorySuccess,
  [Types.SIGNUP_FOLLOW_CATEGORY_FAILURE]: followCategoryFailure,
  [Types.SIGNUP_UNFOLLOW_CATEGORY]: unfollowCategory,
  [Types.SIGNUP_UNFOLLOW_CATEGORY_SUCCESS]: unfollowCategorySuccess,
  [Types.SIGNUP_UNFOLLOW_CATEGORY_FAILURE]: unfollowCategoryFailure,
  [Types.SIGNUP_FOLLOW_USER]: followUser,
  [Types.SIGNUP_FOLLOW_USER_SUCCESS]: followUserSuccess,
  [Types.SIGNUP_FOLLOW_USER_FAILURE]: followUserFailure,
  [Types.SIGNUP_UNFOLLOW_USER]: unfollowUser,
  [Types.SIGNUP_UNFOLLOW_USER_SUCCESS]: unfollowUserSuccess,
  [Types.SIGNUP_UNFOLLOW_USER_FAILURE]: unfollowUserFailure,
})

export const hasSignedUp = (signupState) => signupState.signedUp
