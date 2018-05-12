import _ from 'lodash'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import StoryCoverScreen from './2_StoryCoverScreen'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import createLocalDraft from '../../Shared/Lib/createLocalDraft'

class CreateStoryScreen extends Component {
  static propTypes = {
    storyId: PropTypes.string,
    cachedStory: PropTypes.object,
    userId: PropTypes.string,
    registerDraft: PropTypes.func,
    loadDraft: PropTypes.func,
    discardDraft: PropTypes.func,
    publish: PropTypes.func,
    resetCreateStore: PropTypes.func,
    reroute: PropTypes.func,
  }

  componentWillMount() {
    const {
      storyId, userId, cachedStory,
      registerDraft, loadDraft, setWorkingDraft,
    } = this.props
    if (!storyId) {
      registerDraft(createLocalDraft(userId))
    }
    // should only load publish stories since locals do not exist in DB
    else if (storyId.substring(0,6) !== 'local-'){
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
    cachedStory: state.entities.stories.entities[props.storyId],
    accessToken: accessToken.value,
    draft: state.storyCreate.draft,
    workingDraft: state.storyCreate.workingDraft,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    registerDraft: (draft) => dispatch(StoryCreateActions.registerDraftSuccess(draft)),
    loadDraft: (draftId, cachedStory) => dispatch(StoryCreateActions.editStory(draftId, cachedStory)),
    setWorkingDraft: (cachedStory) => dispatch(StoryCreateActions.editStorySuccess(cachedStory)),
    discardDraft: (draftId) => dispatch(StoryCreateActions.discardDraft(draftId)),
    publish: (draft) => dispatch(StoryCreateActions.publishDraft(draft)),
    resetCreateStore: () => dispatch(StoryCreateActions.resetCreateStore()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateStoryScreen)
