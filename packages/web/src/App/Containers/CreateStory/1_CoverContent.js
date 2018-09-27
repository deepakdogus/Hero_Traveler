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
    workingDraft: PropTypes.object,
    updateWorkingDraft: PropTypes.func,
    setGetEditorState: PropTypes.func,
  }

  onInputChange = (update) => {
    this.props.updateWorkingDraft(update)
  }

  getContent() {
    if (_.keys(this.props.workingDraft.draftjsContent).length) {
      const content = Immutable.asMutable(this.props.workingDraft.draftjsContent, {deep: true})
      if (!content.entityMap) content.entityMap = {}
      return {value: content}
    } else {
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
        />
        <BodyEditor
          onInputChange={this.onInputChange}
          setGetEditorState={this.props.setGetEditorState}
          {...this.getContent()}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    workingDraft: {...state.storyCreate.workingDraft},
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateWorkingDraft: (update) => dispatch(StoryCreateActions.updateWorkingDraft(update)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateStoryCoverContent)
