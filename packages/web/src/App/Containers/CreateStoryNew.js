import React, { Component } from 'react'
import styled from 'styled-components'
import {Route} from 'react-router-dom'
import {connect} from 'react-redux'
import {push} from 'react-router-redux';
import _ from 'lodash'
import Modal from 'react-modal'

import StoryCreateActions from '../Shared/Redux/StoryCreateRedux'
import API from '../Shared/Services/HeroAPI'

import CreateStoryCoverContent from './CreateStory/1_CoverContent'
import CreateStoryDetails from './CreateStory/2_Details'
import FooterToolbar from '../Components/CreateStory/FooterToolbar'
import {Title, Text} from '../Components/Modals/Shared'

const api = API.create()

const Container = styled.div``

const ContentWrapper = styled.div`
  margin: 0 17%;
`

const ItemContainer = styled.div`
  margin: 40px 0;
`

function isNew(props) {
  const draftId = props.match.params.draftId
  return draftId === 'new'
}

const customModalStyles = {
  content: {
    width: 420,
    margin: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0, .5)',
    zIndex: 100,
  }
}

/*
this container is in charge of creating/loading the appropriate draft
and dealing with update logic
*/
class CreateStory extends Component {
  constructor(props){
    super(props)
    this.state = {
      error: {},
    }
  }

  componentWillMount() {
    const draftId = this.props.match.params.draftId
    if (isNew(this.props)) {
      this.props.registerDraft()
    }
    else if (draftId && !this.props.draft) {
      this.props.loadDraft(draftId)
    }
    // if draftId and no draft - load story
  }

  componentWillReceiveProps(nextProps) {
    const {match, reroute, draft} = nextProps
    // once our draft is loaded be sure to reroute
    if (draft.id && match.isExact) {
      reroute(`/createStoryNew/${draft.id}/cover`)
    }
  }

  _updateDraft = () => {
    const {draft, workingDraft, accessToken} = this.props
    let coverPromise;
    if (workingDraft.tempCover) {
      api.setAuth(accessToken)
      coverPromise = api.uploadCoverImage(workingDraft.id, workingDraft.tempCover)
      .then(response => response.data)
    }
    else coverPromise = Promise.resolve(workingDraft)
    return coverPromise.then(response => {
      const cleanedWorkingDraft = _.omit(workingDraft, 'tempCover')
      this.props.updateDraft(draft.id, cleanedWorkingDraft)
    })
  }

  _discardDraft = () => {
    this.props.discardDraft(this.props.draft.id)
  }

  onRight = () => {
    const subPath = this.getSubPath(this.props.location)
    if (subPath === 'cover') this.coverContentOnRight()
    else if (subPath === 'details') this.detailsOnRight()
  }

  getSubPath(location) {
    const splitPath = location.pathname.split('/')
    return splitPath[splitPath.length - 1]
  }

  setValidationErrorState = (text) => {
    this.setState({
      error: {
        title: 'Validation Error',
        text,
      }
    })
  }

  coverContentOnRight = () => {
    const {workingDraft, reroute, draft} = this.props
    if (!workingDraft.title || !this.hasCover()) {
      this.setValidationErrorState('Please include story cover and title')
    }
    else {
      this._updateDraft()
      .then(() => reroute(`/createStoryNew/${draft.id}/details`))
    }
  }

  detailsOnRight = () => {
    if (!this.props.workingDraft.type) {
      this.setValidationErrorState('Please include an activity')
    }
  }

  hasCover = () => {
    const {workingDraft} = this.props
    return workingDraft.tempCover || workingDraft.coverImage || workingDraft.coverVideo
  }

  closeModal = () => {
    this.setState({error: {}})
  }

  render() {
    const {workingDraft, match} = this.props
    const error = this.state.error
    return (
      <Container>
        <ContentWrapper>
          { workingDraft &&
            <ItemContainer>
              <Route
                path={`${match.url}/cover`}
                component={CreateStoryCoverContent}
              />
              <Route
                path={`${match.url}/details`}
                component={CreateStoryDetails}
              />
            </ItemContainer>
          }
        </ContentWrapper>
        <FooterToolbar
          discardDraft={this._discardDraft}
          updateDraft={this._updateDraft}
          isDetailsView={false}
          onRight={this.onRight}
        />
        <Modal
          isOpen={!!error.title}
          contentLabel="Signup Modal"
          onRequestClose={this.closeModal}
          style={customModalStyles}
        >
          <Title>{error.title}</Title>
          <Text>{error.text}</Text>
        </Modal>
      </Container>
    )
  }
}


function isAccessToken(token){
  return token.type === 'access'
}

function mapStateToProps(state) {
  const accessToken = state.session.tokens.find(isAccessToken) || {}
  return {
    location: state.routes.location,
    accessToken: accessToken.value,
    draft: state.storyCreate.draft,
    workingDraft: state.storyCreate.workingDraft,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    registerDraft: () => dispatch(StoryCreateActions.registerDraft()),
    loadDraft: (draftId) => dispatch(StoryCreateActions.editStory(draftId)),
    reroute: (path) => dispatch(push(path)),
    discardDraft: (draftId) => dispatch(StoryCreateActions.discardDraft(draftId)),
    updateDraft: (draftId, attrs, doReset) =>
      dispatch(StoryCreateActions.updateDraft(draftId, attrs, doReset)),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateStory)
