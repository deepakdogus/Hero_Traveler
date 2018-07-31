import React, { Component } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import AddCoverTitles from '../../Components/CreateStory/AddCoverTitles'
import BodyEditor from '../../Components/CreateStory/Editor'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'


class CreateStoryCoverContent extends Component {
  static propTypes = {
    workingDraft: PropTypes.object,
    updateWorkingDraft: PropTypes.func,
  }

  onInputChange = (update) => {
    this.props.updateWorkingDraft(update)
  }

  render() {
    return (
      <div>
        <AddCoverTitles
          onInputChange={this.onInputChange}
          workingDraft={this.props.workingDraft}
        />
        <BodyEditor

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
