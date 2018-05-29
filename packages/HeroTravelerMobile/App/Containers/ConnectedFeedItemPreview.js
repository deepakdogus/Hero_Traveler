import { connect } from 'react-redux'
import _ from 'lodash'
import { Actions as NavActions } from 'react-native-router-flux'

import {isStoryLiked, isStoryBookmarked} from '../Shared/Redux/Entities/Users'
import UserActions, {getFollowers} from '../Shared/Redux/Entities/Users'
import FeedItemPreview from '../Components/FeedItemPreview'
import StoryActions from '../Shared/Redux/Entities/Stories'
import {navToProfile} from '../Navigation/NavigationRouter'

function getAreInRenderLocation(state, ownProps){
  if (!ownProps.renderLocation || ownProps.renderLocation  === state.routes.scene.name) return true
  else if (ownProps.renderLocation === 'myFeed' || ownProps.renderLocation === 'tabbar') {
    return (state.routes.scene.name === 'tabbar' && state.routes.scene.index === 0) ||
      (ownProps.renderLocation === 'tabbar' && state.routes.scene.name === 'myFeed')
  }
  else if (ownProps.renderLocation === 'explore_categoryFeed') {
    return state.routes.scene.name === 'tabbar' && state.routes.scene.index === 1
  }
  else if (ownProps.renderLocation === 'profile') {
    return state.routes.scene.name === 'tabbar' && state.routes.scene.index === 4
  }
}

function areAlreadyInProfileScreen(sceneName, profileId, authorId, sessionUserId){
  return (sceneName === 'profile' && authorId === sessionUserId)
  || (sceneName === 'readOnlyProfile' && authorId === profileId)
}

function onPressUser(sessionUserId, sceneName, profileId) {
  return (userId) => {
    // avoids naving to the scene we are already in
    if (areAlreadyInProfileScreen(sceneName, profileId, userId, sessionUserId)) return
    if (sessionUserId === userId) {
      navToProfile()
    } else {
      NavActions.readOnlyProfile({userId})
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const {session, entities} = state
  const {feedItem} = ownProps
  const sessionUserId = session.userId

  // the storyProps conditional is necessary because without it,
  // the below configuration will throw errors when the user deletes a story
  let storyProps = null
  if (feedItem) {
    const {name, userId} = state.routes.scene

    storyProps = {
      user: entities.users.entities[feedItem.author],
      isLiked: isStoryLiked(entities.users, sessionUserId, feedItem.id),
      isBookmarked: isStoryBookmarked(entities.users, sessionUserId, feedItem.id),
      myFollowedUsers: getFollowers(entities.users, 'following', sessionUserId),
      areInRenderLocation: getAreInRenderLocation(state, ownProps),
      onPressUser: onPressUser(sessionUserId, name, userId),
    }
  }

  const isVisible = true
  const shouldHideCover = false

  return {
    ...storyProps,
    accessToken: _.find(session.tokens, {type: 'access'}).value,
    isVisible,
    shouldHideCover,
    isAuthor: feedItem && feedItem.author === sessionUserId,
  }
}

const mapDispatchToProps = (dispatch, props) => {
  const {userId, feedItem} = props
  const storyId = feedItem && feedItem.id
  return {
    onPressStory: (title) => NavActions.story({storyId, title}),
    onPressGuide: (title) => NavActions.guide({storyId, title}),
    deleteStory: () => dispatch(StoryActions.deleteStory(userId, storyId)),
    removeDraft: () => dispatch(StoryActions.removeDraft(storyId)),
    onPressLike: () => dispatch(StoryActions.storyLike(userId, storyId)),
    onPressBookmark: () => dispatch(StoryActions.storyBookmark(userId, storyId)),
    onPressFollow: (idToFollow) => {dispatch(UserActions.followUser(userId, idToFollow))},
    onPressUnfollow: (idToUnfollow) => dispatch(UserActions.unfollowUser(userId, idToUnfollow)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedItemPreview)
