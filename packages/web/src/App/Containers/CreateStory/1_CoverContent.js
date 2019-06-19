import React, { Component } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import Immutable from 'seamless-immutable'
import _ from 'lodash'

import AddCoverTitles from '../../Components/CreateStory/AddCoverTitles'
import BodyEditor from '../../Components/CreateStory/Editor'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'

class CreateStoryCoverContent extends Component {
  static propTypes = {
    author: PropTypes.object,
    workingDraft: PropTypes.object,
    updateWorkingDraft: PropTypes.func,
    setGetEditorState: PropTypes.func,
    uploadMedia: PropTypes.func,
    isPendingUpdateOverride: PropTypes.bool,
  }

  onInputChange = (update) => {
    this.props.updateWorkingDraft(update)
  }

  getContent() {
    if (_.keys(this.props.workingDraft.draftjsContent).length) {
      const content = Immutable.asMutable(this.props.workingDraft.draftjsContent, {deep: true})
      if (!content.entityMap) content.entityMap = {}
      return {value: content}
    }
    else {
      return {}
    }
  }

  setEditorRef = (ref) => this.editor = ref

  render() {
    return (
      <div>
        <AddCoverTitles
          onInputChange={this.onInputChange}
          workingDraft={this.props.workingDraft}
          uploadMedia={this.props.uploadMedia}
          isPendingUpdateOverride={this.props.isPendingUpdateOverride}
        />
        <BodyEditor
          onInputChange={this.onInputChange}
          setGetEditorState={this.props.setGetEditorState}
          author={this.props.author}
          {...this.getContent()}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const workingDraft = state.storyCreate.workingDraft
  const author = _.get(state, `entities.users.entities[${workingDraft.author}]`, undefined)

  return {
    author,
    isPendingUpdateOverride: state.storyCreate.isPendingUpdateOverride,
    workingDraft: {...workingDraft},
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateWorkingDraft: (update) => dispatch(StoryCreateActions.updateWorkingDraft(update)),
    uploadMedia: (file, callback, mediaType) =>
      dispatch(StoryCreateActions.uploadMedia(file, callback, mediaType)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateStoryCoverContent)
