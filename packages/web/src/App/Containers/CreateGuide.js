import React from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import { push } from 'react-router-redux'
import Modal from 'react-modal'

import UXActions from '../Redux/UXRedux'
import GuideActions from '../Shared/Redux/Entities/Guides'
import CategoryActions from '../Shared/Redux/Entities/Categories'
import AddCoverTitles from '../Components/CreateStory/AddCoverTitles'
import StoryDetails from '../Components/CreateStory/StoryDetails'
import CenteredButtons from '../Components/CenteredButtons'
import RoundedButton from '../Components/RoundedButton'
import {
  SharedCreateGuide,
  mapStateToProps,
  mapDispatchToProps,
} from '../Shared/Lib/CreateGuideHelpers'
import {
  Container,
  ContentWrapper,
  customModalStyles,
} from './EditStory'
import {Title, Text} from '../Components/Modals/Shared'

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
    const {
      guide,
      loadDefaultCategories,
      guideId,
      getGuide,
    } = this.props

    loadDefaultCategories()
    if (guide) {
      this.setState({
        guide,
      })
    }
    else if (guideId !== 'new') getGuide(guideId)
  }

  renderButtonLeft = () => {
    return (
      <RoundedButton
        text={'Cancel'}
        margin='none'
        padding='even'
        type='blackWhite'
        onClick={this.rerouteAway}
      />
    )
  }

  renderButtonRight = () => {
    const actionVerb = this.isExistingGuide ? 'Save' : 'Create'
    return (
      <RoundedButton
        text={`${actionVerb} Guide`}
        margin='none'
        padding='even'
        onClick={this.onDone}
      />
    )
  }

  onSuccessfullSave = () => {
    const {
      guide,
      reroute,
    } = this.props
    if (this.isExistingGuide()) reroute(`/guide/${guide.id}`)
    else this.rerouteAway()
  }

  rerouteAway = () => {
     const {
      reroute,
      storyId,
      openGlobalModal,
    } = this.props
    if (storyId) {
      reroute(`/story/${storyId}`)
      openGlobalModal('guidesSelect', { storyId })
    }
    else reroute(`/feed`)
  }


  render() {
    const errorMessage = _.get(this, 'props.error.message')

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
          <CenteredButtons
            buttonsToRender={[
              this.renderButtonLeft,
              this.renderButtonRight,
            ]}
          />
        </ContentWrapper>
        {
        <Modal
          isOpen={!!errorMessage}
          contentLabel="Guide Modal"
          onRequestClose={this.props.dismissError}
          style={customModalStyles}
        >
          <Title>Error</Title>
          <Text>{errorMessage}</Text>
        </Modal>
        }
      </Container>
    )
  }
}

function extendedMapStateToProps(state, ownProps) {
  const stateMapping = mapStateToProps(state, ownProps)
  const guideId = ownProps.match.params.guideId
  stateMapping.categories = state.entities.categories.entities
  stateMapping.storyId = state.ux.params.storyId
  stateMapping.guide = state.entities.guides.entities[ownProps.match.params.guideId]
  stateMapping.guideId = guideId
  return stateMapping
}

function extendedMapDispatchToProps(dispatch, ownProps) {
  const dispatchMapping = mapDispatchToProps(dispatch)
  dispatchMapping.loadDefaultCategories = () => dispatch(CategoryActions.loadCategoriesRequest())
  dispatchMapping.reroute = (path) => dispatch(push(path))
  dispatchMapping.openGlobalModal = (modalName, params) => {
    dispatch(UXActions.openGlobalModal(modalName, params))
  }
  dispatchMapping.dismissError = () => dispatch(GuideActions.dismissError())
  dispatchMapping.getGuide = (guideId) => dispatch(GuideActions.getGuideRequest(guideId))
  return dispatchMapping
}


export default connect(extendedMapStateToProps, extendedMapDispatchToProps)(CreateGuide)
