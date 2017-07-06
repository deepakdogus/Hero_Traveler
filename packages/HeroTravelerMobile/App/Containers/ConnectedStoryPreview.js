import { connect } from 'react-redux'
import _ from 'lodash'

import {isStoryLiked, isStoryBookmarked} from '../Shared/Redux/Entities/Users'
import StoryPreview from '../Components/StoryPreview'
import StoryActions from '../Shared/Redux/Entities/Stories'

const mapStateToProps = (state, ownProps) => {
  const {session: {userId}, entities} = state
  const story = entities.stories.entities[ownProps.storyId]

  // the storyProps conditional is necessary because without it, the below configuration will throw errors when the user deletes a story
  let storyProps = null
  if (story) {
    storyProps = {
      user: entities.users.entities[story.author],
      isLiked: isStoryLiked(entities.users, userId, story.id),
      isBookmarked: isStoryBookmarked(entities.users, userId, story.id),
    }
  }
  return {
    ...storyProps,
    story,
    accessToken: _.find(state.session.tokens, {type: 'access'}).value,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteStory: (userId, storyId) => dispatch(StoryActions.deleteStory(userId, storyId))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryPreview)
