import _ from 'lodash'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import StoryCoverScreen from './2_StoryCoverScreen'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import createLocalDraft from '../../Shared/Lib/createLocalDraft'
import isLocalDraft from '../../Shared/Lib/isLocalDraft'

class CreateStoryScreen extends Component {
  static propTypes = {
    storyId: PropTypes.string,
    cachedStory: PropTypes.object,
    userId: PropTypes.string,
    addLocalDraft: PropTypes.func,
    loadDraft: PropTypes.func,
    discardDraft: PropTypes.func,
    publish: PropTypes.func,
    resetCreateStore: PropTypes.func,
    reroute: PropTypes.func,
    setWorkingDraft: PropTypes.func,
  }

  componentWillMount() {
    const {
      storyId, userId, cachedStory,
      addLocalDraft, loadDraft, setWorkingDraft,
    } = this.props
    if (!storyId) {
      addLocalDraft(createLocalDraft(userId))
    }
    // should only load publish stories since locals do not exist in DB
    else if (isLocalDraft(storyId)) {
      loadDraft(storyId, cachedStory)
    }
    else {
      setWorkingDraft(cachedStory)
    }
  }

  render () {
    return (
      <StoryCoverScreen {...this.props}/>
    )
  }
}

function mapStateToProps(state, props) {
  const accessToken = _.find(state.session.tokens, {type: 'access'})

  return {
    userId: state.session.userId,
    cachedStory: _.get(state, `pendingUpdates.pendingUpdates[${props.storyId}].story`),
    accessToken: accessToken.value,
    draft: state.storyCreate.draft,
    workingDraft: state.storyCreate.workingDraft,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addLocalDraft: (draft) => dispatch(StoryCreateActions.addLocalDraft(draft)),
    loadDraft: (draftId, cachedStory) => dispatch(StoryCreateActions.editStory(draftId, cachedStory)),
    setWorkingDraft: (cachedStory) => dispatch(StoryCreateActions.editStorySuccess(cachedStory)),
    discardDraft: (draftId) => dispatch(StoryCreateActions.discardDraft(draftId)),
    resetCreateStore: () => dispatch(StoryCreateActions.resetCreateStore()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateStoryScreen)
