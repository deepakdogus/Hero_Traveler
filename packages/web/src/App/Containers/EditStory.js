import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import _ from 'lodash'
import Modal from 'react-modal'
import PropTypes from 'prop-types'

import StoryActions from '../Shared/Redux/Entities/Stories'
import StoryCreateActions from '../Shared/Redux/StoryCreateRedux'
import createLocalDraft from '../Shared/Lib/createLocalDraft'
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
    cachedStory: PropTypes.object,
    userId: PropTypes.string,
    storyId: PropTypes.string,
    // dispatch methods
    addLocalDraft: PropTypes.func,
    loadDraft: PropTypes.func,
    setWorkingDraft: PropTypes.func,
    discardDraft: PropTypes.func,
    saveDraftToCache: PropTypes.func,
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
  }

  constructor(props){
    super(props)
    this.state = {
      error: {},
    }
  }

  componentWillMount() {
    const {
      userId, cachedStory, storyId,
      addLocalDraft, loadDraft, setWorkingDraft,
    } = this.props

    if (!storyId || storyId === 'new') {
      addLocalDraft(createLocalDraft(userId))
    }
    // should only load saved stories since locals do not exist in DB
    else if (!this.isLocalStory()){
      loadDraft(storyId, cachedStory)
    }
    else {
      setWorkingDraft(cachedStory)
    }
  }

  componentDidMount() {
    const {
      userId,
      addLocalDraft,
      workingDraft,
    } = this.props

    if (workingDraft === null && this.isLocalStory()) {
      addLocalDraft(createLocalDraft(userId))
    }
  }

  componentWillReceiveProps(nextProps) {
    const {match, reroute, originalDraft} = nextProps
    // once our draft is loaded be sure to reroute
    if (originalDraft && originalDraft.id && match.isExact) {
      reroute(`/editStory/${originalDraft.id}/cover`)
    }
    if (
      this.props.globalModal.modalName !== 'saveEdits'
      && nextProps.globalModal.modalName === 'saveEdits'
    ) {
      this.props.updateGlobalModalParams({
        resetCreateStore: this.props.resetCreateStore,
        updateDraft: this._updateDraft,
      })
    }
  }

  componentDidUpdate(prevProps){
    if (
      this.props.syncProgress > 0
      && this.props.syncProgressSteps === this.props.syncProgress
      && prevProps.syncProgress !== this.props.syncProgress
      && this.props.subPath === 'details'
    ) {
      this.props.reroute('/feed')
      this.props.resetCreateStore()
    }

    const { workingDraft, originalDraft } = this.props
    if (haveFieldsChanged(workingDraft, originalDraft)) {
      window.onbeforeunload = (e) => {
        e.preventDefault()
        return true
      }
    }
  }

  componentWillUnmount(){
    window.onbeforeunload = () => null
  }

  isLocalStory() {
    return this.props.storyId.substring(0,6) === 'local-'
  }

  _updateDraft = () => {
    const {
      originalDraft,
      workingDraft,
      subPath,
      saveDraftToCache,
    } = this.props

    if (workingDraft.draft) {
      saveDraftToCache(this.cleanDraft(workingDraft))
      this.setState({draftSaveMessage: 'Saving Draft'})
      setTimeout(() => this.setState({draftSaveMessage: ''}), 1000)
    }
    else {
      const isRepublishing = !workingDraft.draft && subPath === 'details'
      this.props.updateDraft(
        originalDraft.id,
        this.cleanDraft(workingDraft),
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

  cleanDraft(draft){
    const {workingDraft, originalDraft} = this.props
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
    cleanedDraft.draftjsContent = this.getEditorState()
    return cleanedDraft
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
    const {workingDraft, originalDraft} = this.props
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
      saveDraft(this.cleanDraft(workingDraft))
    }
    else {
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
          syncProgressMessage={this.state.draftSaveMessage || syncProgressMessage}
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
  const storyId = _.get(props, 'match.params.storyId')

  return {
    userId: state.session.userId,
    storyId,
    cachedStory: state.entities.stories.entities[storyId],
    accessToken: accessToken.value,
    subPath: getSubPath(state.routes.location),
    originalDraft: state.storyCreate.draft,
    workingDraft: state.storyCreate.workingDraft,
    syncProgress: state.storyCreate.sync.syncProgress,
    syncProgressSteps: state.storyCreate.sync.syncProgressSteps,
    syncProgressMessage: state.storyCreate.sync.message,
    backgroundFailures: state.entities.stories.backgroundFailures,
    globalModal: state.ux,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addLocalDraft: (draft) => dispatch(StoryCreateActions.addLocalDraft(draft)),
    loadDraft: (draftId, cachedStory) => dispatch(StoryCreateActions.editStory(draftId, cachedStory)),
    discardDraft: (draftId) => dispatch(StoryCreateActions.discardDraft(draftId)),
    saveDraftToCache: (draft) => dispatch(StoryActions.addDraft(draft)),
    updateDraft: (draftId, attrs, doReset, isRepublishing) =>
      dispatch(StoryCreateActions.updateDraft(draftId, attrs, doReset, isRepublishing)),
    updateWorkingDraft: (update) => dispatch(StoryCreateActions.updateWorkingDraft(update)),
    saveDraft: (draft) => dispatch(StoryCreateActions.saveLocalDraft(draft)),
    resetCreateStore: () => dispatch(StoryCreateActions.resetCreateStore()),
    reroute: (path) => dispatch(push(path)),
    setWorkingDraft: (cachedStory) => dispatch(StoryCreateActions.editStorySuccess(cachedStory)),
    updateGlobalModalParams: (params) => dispatch(UXActions.updateGlobalModalParams(params)),
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditStory)
