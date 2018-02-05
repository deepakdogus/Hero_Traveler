import { connect } from 'react-redux'
import _ from 'lodash'
import { Actions as NavActions } from 'react-native-router-flux'

import {isStoryLiked, isStoryBookmarked} from '../Shared/Redux/Entities/Users'
import UserActions, {getFollowers} from '../Shared/Redux/Entities/Users'
import StoryPreview from '../Components/StoryPreview'
import StoryActions from '../Shared/Redux/Entities/Stories'

function getAreInRenderLocation(state, ownProps){
  // console.log("state.routes is", state.routes)
  // console.log("ownProps.renderLocation",ownProps.renderLocation)
  if (!ownProps.renderLocation || ownProps.renderLocation  === state.routes.scene.name) return true
  else if (ownProps.renderLocation === 'myFeed' || ownProps.renderLocation === 'tabbar') {
    // myFeed is also the initial state so there are actually two valid matches
    // console.log("render bool1", ownProps.renderLocation  === state.routes.scene.name)
    // console.log("render bool2", state.routes.scene.name === 'tabbar' && state.routes.scene.index === 0)
    // console.log("render bool3", ownProps.renderLocation === 'tabbar' && state.routes.scene.name === 'myFeed')
    // console.log("render combined", ownProps.renderLocation  === state.routes.scene.name ||
    // (state.routes.scene.name === 'tabbar' && state.routes.scene.index === 0) ||
    // (ownProps.renderLocation === 'tabbar' && state.routes.scene.name === 'myFeed'))
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

const mapStateToProps = (state, ownProps) => {
  const {session, entities} = state
  const sessionUserId = session.userId
  const story = entities.stories.entities[ownProps.storyId]

  // the storyProps conditional is necessary because without it, the below configuration will throw errors when the user deletes a story
  let storyProps = null
  // console.log("\nownProps.index", ownProps.index)
  if (story) {
    storyProps = {
      user: entities.users.entities[story.author],
      isLiked: isStoryLiked(entities.users, sessionUserId, story.id),
      isBookmarked: isStoryBookmarked(entities.users, sessionUserId, story.id),
      myFollowedUsers: getFollowers(entities.users, 'following', sessionUserId),
      areInRenderLocation: getAreInRenderLocation(state, ownProps)
    }
  }

  const isVisible = ownProps.index !== undefined ?
    state.ux.storyListPlayingRow == ownProps.index : undefined

  const shouldHideCover = ownProps.index !== undefined ?
    _.includes(state.ux.storyListVisibleRows, ownProps.index) : false
  // console.log("isVisible", isVisible)
  return {
    ...storyProps,
    story,
    accessToken: _.find(session.tokens, {type: 'access'}).value,
    isVisible,
    shouldHideCover,
    isAuthor: story && story.author === sessionUserId,
  }
}

const mapDispatchToProps = (dispatch, props) => {
  const {userId, storyId} = props
  return {
    onPress: () => NavActions.story({storyId}),
    deleteStory: () => dispatch(StoryActions.deleteStory(userId, storyId)),
    onPressLike: () => dispatch(StoryActions.storyLike(userId, storyId)),
    onPressBookmark: () => dispatch(StoryActions.storyBookmark(userId, storyId)),
    onPressFollow: (idToFollow) => {dispatch(UserActions.followUser(userId, idToFollow))},
    onPressUnfollow: (idToUnfollow) => dispatch(UserActions.unfollowUser(userId, idToUnfollow)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryPreview)
