import { connect } from 'react-redux'
import R from 'ramda'
import _ from 'lodash'

import SessionActions from '../Shared/Redux/SessionRedux'
import FeedList from '../Components/FeedList'

const mapStateToProps = (state, ownProps) => {
  const {entities} = state
  // mapping Ids to actual stories or guides
  let mapFunc
  if (ownProps.isStory) {
    const getStoryFromEntities = (storyId) => _.get(entities, `stories.entities[${storyId}]`)
    // console.log(getStoryFromEntities,'these are the props on connectedFeedList')
    if (ownProps.isDraftsTab) {
      mapFunc = (storyId) => {
        return getStoryFromEntities(storyId)
          || _.get(state.pendingUpdates, `pendingUpdates[${storyId}].story`)
      }
    }
    else mapFunc = getStoryFromEntities
  }
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
