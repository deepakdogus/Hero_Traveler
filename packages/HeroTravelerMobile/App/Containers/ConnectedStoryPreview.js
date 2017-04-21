import { connect } from 'react-redux'

import {isStoryLiked} from '../Redux/SessionRedux'
import StoryPreview from '../Components/StoryPreview'

const mapStateToProps = (state, ownProps) => {
  const {entities} = state
  const story = entities.stories.entities[ownProps.storyId]
  return {
    story,
    user: entities.users.entities[story.author],
    isLiked: isStoryLiked(state.session, story.id)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryPreview)