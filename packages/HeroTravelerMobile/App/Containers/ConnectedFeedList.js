import { connect } from 'react-redux'
import R from 'ramda'

import SessionActions from '../Shared/Redux/SessionRedux'
import FeedList from '../Components/FeedList'

const mapStateToProps = (state, ownProps) => {
  const {entities} = state

  // mapping Ids to actual stories or guides
  let mapFunc
  if (ownProps.isStory) mapFunc = (storyId) => entities.stories.entities[storyId]
  else mapFunc = (guideId) => entities.guides.entities[guideId]

  return {
    targetEntities: R.map(mapFunc, ownProps.entitiesById),
    sessionError: state.session.error,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearSessionError: () => dispatch(SessionActions.clearError()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FeedList)
