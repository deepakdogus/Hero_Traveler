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
    updateDraft: PropTypes.func,
    publish: PropTypes.func,
    resetCreateStore: PropTypes.func,
    reroute: PropTypes.func,
  }

  componentWillMount() {
    const {storyId, userId, cachedStory} = this.props
    if (!storyId) {
      this.props.registerDraft(createLocalDraft(userId))
    } else {
      this.props.loadDraft(storyId, cachedStory)
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
    isPublished: state.storyCreate.isPublished,
    isRepublished: state.storyCreate.isRepublished,
    accessToken: accessToken.value,
    draft: state.storyCreate.draft,
    workingDraft: state.storyCreate.workingDraft,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    registerDraft: (draft) => dispatch(StoryCreateActions.registerDraftSuccess(draft)),
    loadDraft: (draftId, cachedStory) => dispatch(StoryCreateActions.editStory(draftId, cachedStory)),
    discardDraft: (draftId) => dispatch(StoryCreateActions.discardDraft(draftId)),
    updateDraft: (draftId, attrs, doReset, isRepublishing) =>
      dispatch(StoryCreateActions.updateDraft(draftId, attrs, doReset, isRepublishing)),
    publish: (draft) => dispatch(StoryCreateActions.publishDraft(draft)),
    resetCreateStore: () => dispatch(StoryCreateActions.resetCreateStore()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateStoryScreen)
