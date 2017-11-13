import { connect } from 'react-redux'
import _ from 'lodash'
import { Actions as NavActions } from 'react-native-router-flux'

import {isStoryLiked, isStoryBookmarked} from '../Shared/Redux/Entities/Users'
import UserActions, {getFollowers} from '../Shared/Redux/Entities/Users'
import StoryPreview from '../Components/StoryPreview'
import StoryActions from '../Shared/Redux/Entities/Stories'

const mapStateToProps = (state, ownProps) => {
  const {session, entities} = state
  const sessionUserId = session.userId
  const story = entities.stories.entities[ownProps.storyId]

  // the storyProps conditional is necessary because without it, the below configuration will throw errors when the user deletes a story
  let storyProps = null
  if (story) {
    storyProps = {
      user: entities.users.entities[story.author],
      isLiked: isStoryLiked(entities.users, sessionUserId, story.id),
      isBookmarked: isStoryBookmarked(entities.users, sessionUserId, story.id),
      myFollowedUsers: getFollowers(entities.users, 'following', sessionUserId)
    }
  }

  return {
    ...storyProps,
    story,
    accessToken: _.find(session.tokens, {type: 'access'}).value,
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
