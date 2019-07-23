import { connect } from 'react-redux'
import _ from 'lodash'
import { Actions as NavActions } from 'react-native-router-flux'

import {
  isStoryLiked,
  isStoryBookmarked,
  isGuideLiked,
} from '../Shared/Redux/Entities/Users'
import UserActions, { getFollowers } from '../Shared/Redux/Entities/Users'
import FeedItemPreview from '../Components/FeedItemPreview'
import StoryActions from '../Shared/Redux/Entities/Stories'
import GuideActions from '../Shared/Redux/Entities/Guides'
import { navToProfile } from '../Navigation/NavigationRouter'
import { tabTypes } from './GuideReadingScreen'

function getAreInRenderLocation(state, ownProps) {
  if (
    !ownProps.renderLocation
    || ownProps.renderLocation === state.routes.scene.name
  ) {
    return true
  }
  else if (
    ownProps.renderLocation === 'myFeed'
    || ownProps.renderLocation === 'tabbar'
  ) {
    return (
      (state.routes.scene.name === 'tabbar'
        && state.routes.scene.index === 0)
      || (ownProps.renderLocation === 'tabbar'
        && state.routes.scene.name === 'myFeed')
    )
  }
  else if (ownProps.renderLocation === 'explore_categoryFeed') {
    return (
      state.routes.scene.name === 'tabbar' && state.routes.scene.index === 1
    )
  }
  else if (ownProps.renderLocation === 'profile') {
    return (
      state.routes.scene.name === 'tabbar' && state.routes.scene.index === 4
    )
  }
}

function areAlreadyInProfileScreen(
  sceneName,
  profileId,
  authorId,
  sessionUserId,
) {
  return (
    (sceneName === 'profile' && authorId === sessionUserId)
    || (sceneName === 'readOnlyProfile' && authorId === profileId)
  )
}

function onPressUser(sessionUserId, sceneName, profileId) {
  return userId => {
    // avoids naving to the scene we are already in
    if (areAlreadyInProfileScreen(sceneName, profileId, userId, sessionUserId)) return
    if (sessionUserId === userId) {
      navToProfile()
    }
    else {
      NavActions.readOnlyProfile({ userId })
    }
  }
}

function getSelectedStories(stories, storyIds, selectedTab) {
  return storyIds
    .filter(id => {
      return stories[id] && stories[id].type === selectedTab
    })
    .map(id => {
      return stories[id]
    })
}

const mapStateToProps = (state, ownProps) => {
  const { session, entities } = state
  const { feedItem, isStory, selectedTab, isReadingScreen } = ownProps

  if (!feedItem) return {}
  const sessionUserId = session.userId

  // the storyProps conditional is necessary because without it,
  // the below configuration will throw errors when the user deletes a story
  let storyProps = null
  if (feedItem) {
    const { name, userId } = state.routes.scene

    storyProps = {
      user: entities.users.entities[feedItem.author],
      isStoryLiked: isStoryLiked(entities.users, sessionUserId, feedItem.id),
      isBookmarked: isStoryBookmarked(
        entities.users,
        sessionUserId,
        feedItem.id,
      ),
      myFollowedUsers: getFollowers(entities.users, 'following', sessionUserId),
      areInRenderLocation: getAreInRenderLocation(state, ownProps),
      onPressUser: onPressUser(sessionUserId, name, userId),
    }
  }

  const isVisible = true
  const isShowCover
    = !isReadingScreen || isStory || selectedTab === tabTypes.overview

  const selectedStories
    = isStory || !isReadingScreen
      ? []
      : getSelectedStories(
        entities.stories.entities,
        feedItem.stories,
        ownProps.selectedTab,
      )

  const accessToken = _.find(state.session.tokens, { type: 'access' })

  const location = state.routes.scene.name

  return {
    ...storyProps,
    accessToken: accessToken ? accessToken.value : null,
    isVisible,
    isGuideLiked: isGuideLiked(entities.users, sessionUserId, feedItem.id),
    isShowCover,
    isAuthor: feedItem && feedItem.author === sessionUserId,
    sessionUserId,
    selectedStories,
    location,
  }
}

const mapDispatchToProps = (dispatch, props) => {
  const { userId, feedItem } = props
  const feedItemId = feedItem && feedItem.id
  return {
    onPressStory: title => NavActions.story({ storyId: feedItemId, title }),
    onPressGuide: title => NavActions.guide({ guideId: feedItemId, title }),
    deleteGuide: () =>
      dispatch(GuideActions.deleteGuideRequest(feedItemId, userId)),
    deleteStory: () => dispatch(StoryActions.deleteStory(userId, feedItemId)),
    onPressStoryLike: (storyId, sessionUserId) => {
      dispatch(StoryActions.likeStoryRequest(storyId, sessionUserId))
    },
    onPressStoryUnlike: (storyId, sessionUserId) => {
      dispatch(StoryActions.unlikeStoryRequest(storyId, sessionUserId))
    },
    onPressGuideLike: (guideId, sessionUserId) => {
      dispatch(GuideActions.likeGuideRequest(guideId, sessionUserId))
    },
    onPressGuideUnlike: (guideId, sessionUserId) => {
      dispatch(GuideActions.unlikeGuideRequest(guideId, sessionUserId))
    },
    onPressBookmark: () =>
      dispatch(StoryActions.bookmarkStoryRequest(feedItemId)),
    onPressRemoveBookmark: () =>
      dispatch(StoryActions.removeStoryBookmarkRequest(feedItemId)),
    onPressFollow: idToFollow =>
      dispatch(UserActions.followUser(userId, idToFollow)),
    onPressUnfollow: idToUnfollow =>
      dispatch(UserActions.unfollowUser(userId, idToUnfollow)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FeedItemPreview)
