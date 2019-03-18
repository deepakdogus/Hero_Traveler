import React, { Component } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {push} from 'react-router-redux'

import FeedItemDetails from '../../Components/CreateStory/FeedItemDetails'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import CategoryActions from '../../Shared/Redux/Entities/Categories'
import UXActions from '../../Redux/UXRedux'

class CreateStoryCoverContent extends Component {
  static propTypes = {
    categories: PropTypes.object,
    workingDraft: PropTypes.object,
    loadDefaultCategories: PropTypes.func,
    updateWorkingDraft: PropTypes.func,
    reroute: PropTypes.func,
    openGlobalModal: PropTypes.func,
  }

  onInputChange = (update) => {
    this.props.updateWorkingDraft(update)
  }

  componentWillMount(){
    this.props.loadDefaultCategories()
  }

  componentDidMount() {
    const { coverVideo, coverImage } = this.props.workingDraft
    if (!coverVideo && !coverImage) {
      this.props.reroute('/editStory/new')
    }
  }

  render() {
    return (
      <FeedItemDetails
        onInputChange={this.onInputChange}
        workingDraft={this.props.workingDraft}
        categories={this.props.categories}
        reroute={this.props.reroute}
        openGlobalModal={this.props.openGlobalModal}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    categories: state.entities.categories.entities,
    workingDraft: state.storyCreate.workingDraft,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadDefaultCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    updateWorkingDraft: (story) => dispatch(StoryCreateActions.updateWorkingDraft(story)),
    reroute: (path) => dispatch(push(path)),
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateStoryCoverContent)
