import React, { Component } from 'react'
import {connect} from 'react-redux'

import StoryDetails from '../../Components/CreateStory/StoryDetails'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import CategoryActions from '../../Shared/Redux/Entities/Categories'

class CreateStoryCoverContent extends Component {
  onInputChange = (update) => {
    this.props.updateWorkingDraft(update)
  }

  componentWillMount(){
    this.props.loadDefaultCategories()
  }

  render() {
    return (
      <StoryDetails
        onInputChange={this.onInputChange}
        workingDraft={this.props.workingDraft}
        categories={this.props.categories}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    categories: state.entities.categories.entities,
    workingDraft: state.storyCreate.workingDraft
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadDefaultCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    updateWorkingDraft: (story) => dispatch(StoryCreateActions.updateWorkingDraft(story)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateStoryCoverContent)
