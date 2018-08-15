import React, { Component } from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import _ from 'lodash'
import Modal from 'react-modal'
import PropTypes from 'prop-types'

import StoryCreateActions from '../Shared/Redux/StoryCreateRedux'
import createLocalDraft from '../Shared/Lib/createLocalDraft'
import AuthRoute from './AuthRoute'
import UXActions from '../Redux/UXRedux'
import CreateStoryCoverContent from './CreateStory/1_CoverContent'
import CreateStoryDetails from './CreateStory/2_Details'
import FooterToolbar from '../Components/CreateStory/FooterToolbar'
import {Title, Text} from '../Components/Modals/Shared'

const Container = styled.div``

const ContentWrapper = styled.div`
  margin: 0 17%;
`

const ItemContainer = styled.div`
  margin: 40px 0;
`

const customModalStyles = {
  content: {
    border: '0',
    bottom: 'auto',
    minHeight: '10rem',
    left: '50%',
    padding: '2rem',
    position: 'fixed',
    right: 'auto',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    minWidth: '20rem',
    maxWidth: '28rem',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0, .5)',
    zIndex: 100,
  }
}

const isEqual = (firstItem, secondItem) => {
  if (!!firstItem && !secondItem || !firstItem && !!secondItem) {
    return false
  } else if (!!firstItem && !!secondItem) {
    // lodash will take of equality check for all objects
    return _.isEqual(firstItem, secondItem)
  } else {
    return true
  }
}

/*
this container is in charge of creating/loading the appropriate draft
and dealing with save and publish logic
*/
class EditStory extends Component {
  static propTypes = {
    match: PropTypes.object,
    // mapped from state
    isPublished: PropTypes.bool,
    isRepublished: PropTypes.bool,
    subPath: PropTypes.string,
    accessToken: PropTypes.string,
    originalDraft: PropTypes.object,
    workingDraft: PropTypes.object,
    cachedStory: PropTypes.object,
    userId: PropTypes.string,
    storyId: PropTypes.string,
    // dispatch methods
    registerDraft: PropTypes.func,
    loadDraft: PropTypes.func,
    setWorkingDraft: PropTypes.func,
    discardDraft: PropTypes.func,
    updateDraft: PropTypes.func,
    updateWorkingDraft: PropTypes.func,
    publish: PropTypes.func,
    resetCreateStore: PropTypes.func,
    reroute: PropTypes.func,
    updateGlobalModalParams: PropTypes.func,
    syncProgressSteps: PropTypes.number,
    syncProgress: PropTypes.number,

  }

  constructor(props){
    super(props)
    this.state = {
      error: {},
    }
  }

  componentWillMount() {
    const {
      userId, cachedStory,
      registerDraft, loadDraft, setWorkingDraft,
    } = this.props

    let storyId = _.get(this.props, "match.params.storyId");

    if (!storyId || storyId === 'new') {
      registerDraft(createLocalDraft(userId))
    }
    // should only load publish stories since locals do not exist in DB
    else if (storyId.substring(0,6) !== 'local-'){
      loadDraft(storyId, cachedStory)
    }
    else {
      setWorkingDraft(cachedStory)
    }
  }

  componentWillReceiveProps(nextProps) {
    const {match, reroute, originalDraft} = nextProps
    if (this.hasPublished(nextProps)){
      this.next()
      return
    }
    // once our draft is loaded be sure to reroute
    if (originalDraft && originalDraft.id && match.isExact) {
      reroute(`/editStory/${originalDraft.id}/cover`)
    }
    if(this.props.globalModal.modalName !== 'saveEdits' && nextProps.globalModal.modalName === 'saveEdits'){
      this.props.updateGlobalModalParams({
        resetCreateStore: this.props.resetCreateStore,
        updateDraft: this._updateDraft,
      })
    }
  }

  componentDidUpdate(){
    if (this.props.syncProgress > 0 && this.props.syncProgressSteps === this.props.syncProgress) {
      this.props.reroute('/feed')
      this.props.resetCreateStore()
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
    const {originalDraft, workingDraft, subPath} = this.props
    const isRepublishing = !workingDraft.draft && subPath === 'details'
    this.props.updateDraft(
      originalDraft.id,
      this.cleanDraft(workingDraft),
      null,
      isRepublishing
    )
  }

  _discardDraft = () => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      this.props.discardDraft(this.props.originalDraft.id);
      this.props.reroute('/');
    }
  }

  onLeft = () => {
    const {subPath, reroute, originalDraft} = this.props
    if (subPath === 'details') reroute(`/editStory/${originalDraft.id}/cover`)
  }

  onRight = () => {
    const {subPath} = this.props
    if (subPath === 'cover') this.saveCover()
    else if (subPath === 'details') this.saveDetails()
  }

  isValid() {
    return _.every([
      !!this.props.workingDraft.coverImage || !!this.props.workingDraft.coverVideo,
      !!_.trim(this.props.workingDraft.title)
    ])
  }

  setValidationErrorState = (text) => {
    this.setState({
      error: {
        title: 'Validation Error',
        text,
      }
    })
  }

  hasFieldChanged(field) {
    return !isEqual(this.props.workingDraft[field], this.props.originalDraft[field])
  }

  cleanDraft(draft){
    const cleanedDraft = _.merge({}, draft)
    if (this.hasFieldChanged('title')) cleanedDraft.title = _.trim(cleanedDraft.title)
    if (this.hasFieldChanged('description')) cleanedDraft.description = _.trim(cleanedDraft.description)
    if (this.hasFieldChanged('coverCaption')) cleanedDraft.coverCaption = _.trim(cleanedDraft.coverCaption)
    cleanedDraft.draftjsContent = this.getEditorState()
    return cleanedDraft
  }

  // this only saves it at the redux level
  softSaveDraft() {
    const cleanedDraft = this.cleanDraft(this.props.workingDraft)
    return Promise.resolve(this.props.updateWorkingDraft(cleanedDraft))
  }

  nextScreen() {
    this.props.reroute(`/editStory/${this.props.workingDraft.id}/details`);
  }

  saveCover = () => {
    const hasVideoSelected = !!this.state.coverVideo
    const hasImageSelected = !!this.state.coverImage
    const hasImageChanged = this.hasFieldChanged('coverImage')
    const hasVideoChanged = this.hasFieldChanged('coverVideo')
    const hasTitleChanged = this.hasFieldChanged('title')
    const hasDescriptionChanged = this.hasFieldChanged('description')
    const hasCoverCaptionChanged = this.hasFieldChanged('coverCaption')
    const nothingHasChanged = _.every([
      hasVideoSelected || hasImageSelected,
      !hasImageChanged,
      !hasVideoChanged,
      !hasTitleChanged,
      !hasDescriptionChanged,
      !hasCoverCaptionChanged
    ])
    // If nothing has changed, let the user go forward if they navigated back
    if (nothingHasChanged) {
      this.softSaveDraft()
        .then(() => {
          this.nextScreen()
        })
    }
    if (!this.isValid()) {
      this.setValidationErrorState('Please add a cover and title to continue');
      return
    }
    if ((hasImageSelected || hasVideoSelected) && (hasVideoChanged || hasImageChanged) && !this.state.file) {
      this.setState({error: 'Sorry, could not process file. Please try another file.'})
      return
    }
    this.softSaveDraft()
      .then(() => {
        this.nextScreen()
      })

  }

  saveDetails = () => {
    const {workingDraft, publish} = this.props
    if (!workingDraft.type) {
      this.setValidationErrorState('Please include an activity')
    } else if (!_.get(workingDraft, 'locationInfo.name')) {
      this.setValidationErrorState('Please include a location')
    } else if (workingDraft.draft) {
      publish(this.cleanDraft(workingDraft))
    } else {
      this._updateDraft()
    }
  }

  hasCover = () => {
    const {workingDraft} = this.props
    return workingDraft.tempCover || workingDraft.coverImage || workingDraft.coverVideo
  }

  closeModal = () => {
    this.setState({error: {}})
  }

  setGetEditorState = getEditorState => this.getEditorState = getEditorState

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
                setGetEditorState={this.setGetEditorState}
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

function mapStateToProps(state, props) {
  const accessToken = _.find(state.session.tokens, {type: 'access'})
  return {
    userId: state.session.userId,
    cachedStory: state.entities.stories.entities[props.storyId],
    accessToken: accessToken.value,
    subPath: getSubPath(state.routes.location),
    originalDraft: state.storyCreate.draft,
    workingDraft: state.storyCreate.workingDraft,
    syncProgress: state.storyCreate.sync.syncProgress,
    syncProgressSteps: state.storyCreate.sync.syncProgressSteps,
    backgroundFailures: state.entities.stories.backgroundFailures,
    globalModal: state.ux
  }
}

function mapDispatchToProps(dispatch) {
  return {
    registerDraft: (draft) => dispatch(StoryCreateActions.registerDraftSuccess(draft)),
    loadDraft: (draftId) => dispatch(StoryCreateActions.editStory(draftId)),
    discardDraft: (draftId) => dispatch(StoryCreateActions.discardDraft(draftId)),
    updateDraft: (draftId, attrs, doReset, isRepublishing) =>
      dispatch(StoryCreateActions.updateDraft(draftId, attrs, doReset, isRepublishing)),
    updateWorkingDraft: (update) => dispatch(StoryCreateActions.updateWorkingDraft(update)),
    // Emre when you refactor this you should be able to remove publishDraft function and
    // reducer from StoryCreateRedux
    publish: (draft) => dispatch(StoryCreateActions.publishLocalDraft(draft)),
    resetCreateStore: () => dispatch(StoryCreateActions.resetCreateStore()),
    reroute: (path) => dispatch(push(path)),
    setWorkingDraft: (cachedStory) => dispatch(StoryCreateActions.editStorySuccess(cachedStory)),
    updateGlobalModalParams: (params) => dispatch(UXActions.updateGlobalModalParams(params))

  }
}


export default connect(mapStateToProps, mapDispatchToProps)(EditStory)
