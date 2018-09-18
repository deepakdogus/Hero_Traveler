import React from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'

import CategoryActions from '../Shared/Redux/Entities/Categories'
import AddCoverTitles from '../Components/CreateStory/AddCoverTitles'
import StoryDetails from '../Components/CreateStory/StoryDetails'
import {
  SharedCreateGuide,
  mapStateToProps,
  mapDispatchToProps,
} from '../Shared/Lib/CreateGuideHelpers'
import {
  Container,
  ContentWrapper,
} from './EditStory'

class CreateGuide extends SharedCreateGuide {
  updateGuide = (update) => {
    const guide = _.merge({}, this.state.guide)
    for (const key in update) {
      guide[key] = update[key]
    }
    this.setState({
      guide
    })
  }

  componentWillMount() {
    const {guide, loadDefaultCategories} = this.props
    loadDefaultCategories()
    if (guide) {
      this.setState({
        guide,
      })
    }
  }

  render() {
    return (
      <Container>
        <ContentWrapper>
          <AddCoverTitles
            onInputChange={this.updateGuide}
            workingDraft={this.state.guide}
            isGuide
          />
          <StoryDetails
            onInputChange={this.updateGuide}
            workingDraft={this.state.guide}
            categories={this.props.categories}
            isGuide
          />
        </ContentWrapper>
      </Container>
    )
  }
}

function extendedMapStateToProps(state, props) {
  const stateMapping = mapStateToProps(state, props)
  stateMapping.categories = state.entities.categories.entities
  return stateMapping
}

function extendedMapDispatchToProps(dispatch) {
  const dispatchMapping = mapDispatchToProps(dispatch)
  dispatchMapping.loadDefaultCategories = () => dispatch(CategoryActions.loadCategoriesRequest())
  return dispatchMapping
}


export default connect(extendedMapStateToProps, extendedMapDispatchToProps)(CreateGuide)
