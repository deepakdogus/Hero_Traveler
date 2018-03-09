import { connect } from 'react-redux'
import R from 'ramda'

import StoryList from '../Components/StoryList'

const mapStateToProps = (state, ownProps) => {
  const {entities} = state

  const storyFromStoryId = (storyId) => entities.stories.entities[storyId]
  const stories = R.map(storyFromStoryId, ownProps.storiesById)

  return {
    stories,
  }
}

export default connect(
  mapStateToProps,
  null
)(StoryList)
