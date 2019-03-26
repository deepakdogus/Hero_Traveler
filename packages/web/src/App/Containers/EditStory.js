import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import _ from 'lodash'
import Modal from 'react-modal'
import PropTypes from 'prop-types'

import StoryCreateActions from '../Shared/Redux/StoryCreateRedux'
import createLocalDraft from '../Shared/Lib/createLocalDraft'
import isLocalDraft from '../Shared/Lib/isLocalDraft'
import AuthRoute from './AuthRoute'
import UXActions from '../Redux/UXRedux'
import CreateStoryCoverContent from './CreateStory/1_CoverContent'
import CreateStoryDetails from './CreateStory/2_Details'
import FooterToolbar from '../Components/CreateStory/FooterToolbar'
import {
  Title,
  Text,
} from '../Components/Modals/Shared'
import {
  haveFieldsChanged,
  isFieldSame,
} from '../Shared/Lib/draftChangedHelpers'
import { getPendingDraftById } from '../Shared/Lib/getPendingDrafts'

export const Container = styled.div`
  display: flex;
  justify-content: center;
`

export const ContentWrapper = styled.div`
  width: 800px;
  padding: 0 100px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0;
    padding: 0;
  }
`

const ItemContainer = styled.div`
  margin: 40px 0;
`

export const customModalStyles = {
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
  },
}

/*
this container is in charge of creating/loading the appropriate draft
and dealing with save and publish logic
*/
class EditStory extends Component {
  static propTypes = {
    match: PropTypes.object,
    // mapped from state
    subPath: PropTypes.string,
    accessToken: PropTypes.string,
    originalDraft: PropTypes.object,
    workingDraft: PropTypes.object,
    hasPendingUpdate: PropTypes.bool,
    story: PropTypes.object,
    userId: PropTypes.string,
    storyId: PropTypes.string,
    // dispatch methods
    addLocalDraft: PropTypes.func,
    loadDraft: PropTypes.func,
    setWorkingDraft: PropTypes.func,
    discardDraft: PropTypes.func,
    updateDraft: PropTypes.func,
    updateWorkingDraft: PropTypes.func,
    saveDraft: PropTypes.func,
    resetCreateStore: PropTypes.func,
    reroute: PropTypes.func,
    updateGlobalModalParams: PropTypes.func,
    globalModal: PropTypes.object,
    syncProgressSteps: PropTypes.number,
    syncProgressMessage: PropTypes.string,
    syncProgress: PropTypes.number,
    openGlobalModal: PropTypes.func,
    draftIdToDBId: PropTypes.object,
    pendingMediaUploads: PropTypes.number,
  }

  constructor(props){
    super(props)
    this.state = {
      error: {},
    }
    if (props.hasPendingUpdate && !this.isLocalStory()) {
      props.openGlobalModal(
        'existingUpdateWarning',
        { storyId: props.storyId },
      )
    }
  }

  componentWillMount() {
    const {
      userId, story, storyId,
      addLocalDraft, loadDraft, setWorkingDraft,
    } = this.props

    if (!storyId || storyId === 'new') {
      addLocalDraft(createLocalDraft(userId))
    }
    // should only load saved stories since locals do not exist in DB
    else if (!this.isLocalStory()){
      loadDraft(storyId, story)
    }
    else {
      setWorkingDraft(story)
    }
  }

  componentDidMount() {
    const {
      userId,
      addLocalDraft,
      story,
    } = this.props

    if (!story && this.isLocalStory()) {
      addLocalDraft(createLocalDraft(userId))
    }
  }

  componentDidUpdate(prevProps){
    const {
      reroute,
      match,
      originalDraft,
      workingDraft,
    } = this.props

    const hasCompletedSave = this.props.syncProgress > 0
      && this.props.syncProgressSteps === this.props.syncProgress
      && prevProps.syncProgress !== this.props.syncProgress

    if (originalDraft && originalDraft.id && match.isExact) {
      return reroute(`/editStory/${originalDraft.id}/cover`)
    }
    // this check is for navbar's conditional links
    // do not set values when isPending so we do not
    // override params set internally from saveCover call
    if (
      prevProps.globalModal.modalName !== 'saveEdits'
      && this.props.globalModal.modalName === 'saveEdits'
      && !this.props.isPending
    ) {
      return this.props.updateGlobalModalParams({
        resetCreateStore: this.props.resetCreateStore,
        updateDraft: this._updateDraft,
      })
    }

    if (hasCompletedSave) {
      if (this.state.saveAction === 'publish') {
        this.props.reroute('/feed')
        this.props.resetCreateStore()
      }
    }

    if (haveFieldsChanged(workingDraft, originalDraft)) {
      window.onbeforeunload = (e) => {
        e.preventDefault()
        return true
      }
    }
  }

  componentWillUnmount(){
    window.onbeforeunload = () => null
    this.props.resetCreateStore()
  }

  isLocalStory() {
    return isLocalDraft(this.props.storyId)
  }

  _updateDraft = (publish) => {
    const {
      workingDraft,
      subPath,
      saveDraft,
    } = this.props

    // publish is sometimes an event so we need to expressly check if true
    this.setState({ saveAction: publish === true ? 'publish' : 'update' })

    const cleanedDraft = this.cleanDraft(workingDraft)

    if (isLocalDraft(cleanedDraft.id)) {
      saveDraft(cleanedDraft, !(publish === true))
    }
    else {
      if (publish && cleanedDraft.draft) cleanedDraft.draft = false
      const isRepublishing = !workingDraft.draft && subPath === 'details'
      this.props.updateDraft(
        cleanedDraft.id,
        cleanedDraft,
        null,
        isRepublishing,
      )
    }
  }

  _discardDraft = () => {
    const { originalDraft } = this.props
    this.props.openGlobalModal(
      'deleteFeedItem',
      {
        feedItemId: originalDraft.id,
        type: 'story',
      },
    )
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
      !!_.trim(this.props.workingDraft.title),
    ])
  }

  setValidationErrorState = (text) => {
    this.setState({
      error: {
        title: 'Whoops!',
        text,
      },
    })
  }

  cleanDraft = (draft) => {
    const {workingDraft, originalDraft, draftIdToDBId} = this.props
    const cleanedDraft = _.merge({}, draft)
    if (!isFieldSame('title', workingDraft, originalDraft)) {
      cleanedDraft.title = _.trim(cleanedDraft.title)
    }
    if (!isFieldSame('description', workingDraft, originalDraft)) {
     cleanedDraft.description = _.trim(cleanedDraft.description)
    }
    if (!isFieldSame('coverCaption', workingDraft, originalDraft)) {
      cleanedDraft.coverCaption = _.trim(cleanedDraft.coverCaption)
    }
    if (!cleanedDraft.tripDate) cleanedDraft.tripDate = Date.now()
    cleanedDraft.draftjsContent = this.removeLoaders(this.getEditorState())
    if (draftIdToDBId[workingDraft.id]) cleanedDraft.id = draftIdToDBId[workingDraft.id]
    return cleanedDraft
  }

  removeLoaders(draftjsContent) {
    draftjsContent.blocks = draftjsContent.blocks.filter(block => {
      return block.type !== 'atomic'
        || (block.type === 'atomic' && _.get(block, 'data.type') !== 'loader')
    })
    return draftjsContent
  }

  // this only saves it at the redux level
  softSaveDraft() {
    const cleanedDraft = this.cleanDraft(this.props.workingDraft)
    return Promise.resolve(this.props.updateWorkingDraft(cleanedDraft))
  }

  nextScreen() {
    this.props.reroute(`/editStory/${this.props.workingDraft.id}/details`)
  }

  saveCover = () => {
    const {
      openGlobalModal,
      originalDraft,
      pendingMediaUploads,
      workingDraft,
    } = this.props
    if (pendingMediaUploads) {
      return openGlobalModal(
        'saveEdits',
        {
          updateDraft: this.saveCover,
          isPending: true,
        },
      )
    }
    const hasVideoSelected = !!this.state.coverVideo
    const hasImageSelected = !!this.state.coverImage
    const isImageSame = isFieldSame('coverImage', workingDraft, originalDraft)
    const isVideoSame = isFieldSame('coverVideo', workingDraft, originalDraft)
    const isTitleSame = isFieldSame('title', workingDraft, originalDraft)
    const isDescriptionSame = isFieldSame('description', workingDraft, originalDraft)
    const isCoverCaptionSame = isFieldSame('coverCaption', workingDraft, originalDraft)
    const nothingHasChanged = _.every([
      hasVideoSelected || hasImageSelected,
      isImageSame,
      isVideoSame,
      isTitleSame,
      isDescriptionSame,
      isCoverCaptionSame,
    ])
    // If nothing has changed, let the user go forward if they navigated back
    if (nothingHasChanged) {
      this.softSaveDraft()
        .then(() => {
          this.nextScreen()
        })
    }
    if (!this.isValid()) {
      this.setValidationErrorState('Please add a cover and title to continue')
      return
    }
    if ((hasImageSelected || hasVideoSelected) && (!isVideoSame || !isImageSame) && !this.state.file) {
      this.setState({error: 'Sorry, could not process file. Please try another file.'})
      return
    }
    this.softSaveDraft()
      .then(() => {
        this.nextScreen()
      })
  }

  saveDetails = () => {
    const {workingDraft, saveDraft} = this.props
    if (!workingDraft.type) {
      this.setValidationErrorState('Please include an activity')
    }
    else if (!_.get(workingDraft, 'locationInfo.name')) {
      this.setValidationErrorState('Please include a location')
    }
    else if (workingDraft.draft) {
      this.setState({ saveAction: 'publish' })
      saveDraft(this.cleanDraft(workingDraft), false)
    }
    else {
      this._updateDraft(true)
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
    const {
      workingDraft,
      match,
      subPath,
      syncProgressMessage,
    } = this.props
    const error = this.state.error

    return (
      <Container>
        <ContentWrapper>
          { workingDraft && (
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
          )}
        </ContentWrapper>
        <FooterToolbar
          discardDraft={this._discardDraft}
          updateDraft={this._updateDraft}
          isDetailsView={subPath === 'details'}
          onRight={this.onRight}
          onLeft={this.onLeft}
          syncProgressMessage={syncProgressMessage}
        />
        <Modal
          isOpen={!!error.title}
          contentLabel="Error Modal"
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
  const storyId = _.get(props, 'match.params.storyId')
  const {
    syncProgress,
    syncProgressSteps,
    message,
  } = state.storyCreate.sync
  const {
    backgroundFailures,
    entities: stories,
  } = state.entities.stories

  const syncProgressMessage = syncProgress === syncProgressSteps
    ? ''
    : message
  const pendingDraft = getPendingDraftById(state, storyId)

  return {
    userId: state.session.userId,
    storyId,
    story: stories[storyId] || pendingDraft,
    hasPendingUpdate: !!pendingDraft,
    accessToken: accessToken.value,
    subPath: getSubPath(state.routes.location),
    originalDraft: state.storyCreate.draft,
    workingDraft: state.storyCreate.workingDraft,
    syncProgress,
    syncProgressSteps,
    syncProgressMessage,
    backgroundFailures,
    globalModal: state.ux,
    draftIdToDBId: state.storyCreate.draftIdToDBId,
    pendingMediaUploads: state.storyCreate.pendingMediaUploads,
    isPending: state.ux.params.isPending,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addLocalDraft: (draft) => dispatch(StoryCreateActions.addLocalDraft(draft)),
    loadDraft: (draftId, story) => dispatch(StoryCreateActions.editStory(draftId, story)),
    discardDraft: (draftId) => dispatch(StoryCreateActions.discardDraft(draftId)),
    updateDraft: (draftId, attrs, doReset, isRepublishing) =>
      dispatch(StoryCreateActions.updateDraft(draftId, attrs, doReset, isRepublishing)),
    updateWorkingDraft: (update) => dispatch(StoryCreateActions.updateWorkingDraft(update)),
    saveDraft: (draft, saveAsDraft) => dispatch(StoryCreateActions.saveLocalDraft(draft, saveAsDraft)),
    resetCreateStore: () => dispatch(StoryCreateActions.resetCreateStore()),
    reroute: (path) => dispatch(push(path)),
    setWorkingDraft: (story) => dispatch(StoryCreateActions.editStorySuccess(story)),
    updateGlobalModalParams: (params) => dispatch(UXActions.updateGlobalModalParams(params)),
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditStory)
