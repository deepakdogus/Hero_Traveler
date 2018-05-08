import React, { Component } from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import _ from 'lodash'
import Modal from 'react-modal'
import PropTypes from 'prop-types'

import StoryCreateActions from '../Shared/Redux/StoryCreateRedux'
import API from '../Shared/Services/HeroAPI'
import AuthRoute from './AuthRoute'

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

function cleanDraft(draft){
  return _.omit(draft, 'tempCover')
}

/*
this container is in charge of creating/loading the appropriate draft
and dealing with save and publish logic
*/
class CreateStoryNew extends Component {
  static propTypes = {
    match: PropTypes.object,
    // mapped from state
    isPublished: PropTypes.bool,
    isRepublished: PropTypes.bool,
    subPath: PropTypes.string,
    accessToken: PropTypes.string,
    draft: PropTypes.object,
    workingDraft: PropTypes.object,
    // dispatch methods
    registerDraft: PropTypes.func,
    loadDraft: PropTypes.func,
    discardDraft: PropTypes.func,
    updateDraft: PropTypes.func,
    publish: PropTypes.func,
    resetCreateStore: PropTypes.func,
    reroute: PropTypes.func,
  }

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
  }

  componentWillReceiveProps(nextProps) {
    const {match, reroute, draft} = nextProps
    if (this.hasPublished(nextProps)){
      this.next()
      return
    }
    // once our draft is loaded be sure to reroute
    if (draft.id && match.isExact) {
      reroute(`/createStoryNew/${draft.id}/cover`)
    }
  }

  hasPublished(nextProps){
    return (!this.props.isPublished && nextProps.isPublished) ||
    (!this.props.isRepublished && nextProps.isRepublished)
  }

  next() {
    this.props.resetCreateStore()
    this.props.reroute('/')
  }

  _updateDraft = () => {
    const {draft, workingDraft, accessToken, subPath} = this.props
    let coverPromise;
    if (workingDraft.tempCover) {
      api.setAuth(accessToken)
      coverPromise = api.uploadCoverImage(workingDraft.id, workingDraft.tempCover)
      .then(response => response.data)
    }
    else coverPromise = Promise.resolve(workingDraft)
    return coverPromise.then(response => {
      const isRepublishing = !workingDraft.draft && subPath === 'details'
      this.props.updateDraft(draft.id, cleanDraft(workingDraft), null, isRepublishing)
    })
  }

  _discardDraft = () => {
    this.props.discardDraft(this.props.draft.id)
  }

  onLeft = () => {
    const {subPath, reroute, draft} = this.props
    if (subPath === 'details') reroute(`/createStoryNew/${draft.id}/cover`)
  }

  onRight = () => {
    const {subPath} = this.props
    if (subPath === 'cover') this.coverContentOnRight()
    else if (subPath === 'details') this.detailsOnRight()
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
    const {workingDraft, publish} = this.props
    if (!workingDraft.type) {
      this.setValidationErrorState('Please include an activity')
    }
    else {
      if (workingDraft.draft){
        publish(cleanDraft(workingDraft))
      }
      else {
        this._updateDraft()
      }
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
    const {workingDraft, match, subPath} = this.props
    const error = this.state.error
    return (
      <Container>
        <ContentWrapper>
          { workingDraft &&
            <ItemContainer>
              <AuthRoute
                path={`${match.url}/cover`}
                component={CreateStoryCoverContent}
              />
              <AuthRoute
                path={`${match.url}/details`}
                component={CreateStoryDetails}
              />
            </ItemContainer>
          }
        </ContentWrapper>
        <FooterToolbar
          discardDraft={this._discardDraft}
          updateDraft={this._updateDraft}
          isDetailsView={subPath === 'details'}
          onRight={this.onRight}
          onLeft={this.onLeft}
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


function getSubPath(location) {
  const splitPath = location.pathname.split('/')
  return splitPath[splitPath.length - 1]
}

function isAccessToken(token){
  return token.type === 'access'
}

function mapStateToProps(state) {
  const accessToken = state.session.tokens.find(isAccessToken) || {}
  return {
    isPublished: state.storyCreate.isPublished,
    isRepublished: state.storyCreate.isRepublished,
    subPath: getSubPath(state.routes.location),
    accessToken: accessToken.value,
    draft: state.storyCreate.draft,
    workingDraft: state.storyCreate.workingDraft,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    registerDraft: () => dispatch(StoryCreateActions.registerDraft()),
    loadDraft: (draftId) => dispatch(StoryCreateActions.editStory(draftId)),
    discardDraft: (draftId) => dispatch(StoryCreateActions.discardDraft(draftId)),
    updateDraft: (draftId, attrs, doReset, isRepublishing) =>
      dispatch(StoryCreateActions.updateDraft(draftId, attrs, doReset, isRepublishing)),
    // Emre when you refactor this you should be able to remove publishDraft function and
    // reducer from StoryCreateRedux
    publish: (draft) => dispatch(StoryCreateActions.publishDraft(draft)),
    resetCreateStore: () => dispatch(StoryCreateActions.resetCreateStore()),
    reroute: (path) => dispatch(push(path)),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateStoryNew)
