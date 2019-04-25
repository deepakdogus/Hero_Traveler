import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import * as _ from 'lodash'

import { Grid } from '../Components/FlexboxGrid'
import HeaderAnonymous from '../Components/Headers/HeaderAnonymous'
import HeaderLoggedIn from '../Components/Headers/HeaderLoggedIn'
import LoginActions from '../Shared/Redux/LoginRedux'
import StoryCreateActions from '../Shared/Redux/StoryCreateRedux'
import UserActions from '../Shared/Redux/Entities/Users'
import SessionActions from '../Shared/Redux/SessionRedux'
import UXActions from '../Redux/UXRedux'
import StoryActions from '../Shared/Redux/Entities/Stories'
import GuideActions from '../Shared/Redux/Entities/Guides'
import HeaderModals from '../Components/HeaderModals'
import { sizes } from '../Themes/Metrics'
import {
  haveFieldsChanged,
  hasChangedSinceSave,
} from '../Shared/Lib/draftChangedHelpers'
import { itemsPerQuery } from './ContainerWithFeedList'
/*global branch*/

// If we don't explicity prevent 'fixed' from being passed to Grid, we get an error about unknown prop on div element
// because apparently react-flexbox-grid passes all props down to underlying React elements
const StyledGrid = styled(({ fixed, hasBlackBackground, ...rest }) => <Grid {...rest} />)`
  padding: 15px;
  z-index: 3;
  position: ${props => props.fixed ? 'fixed' : 'absolute'};
  width: 100%;
  top: 0;
  padding-right: 10px;
  background-color: ${props => props.hasBlackBackground ? '#1a1c21' : 'rgba(0,0,0,0)'};
`

const HeaderSpacer = styled.div`
  height: ${props => props.spacerSize};
`

/**
 * This function will log CompletedRegistration App Event
 * @param {string} registrationMethod
 * pulled from https://developers.facebook.com/docs/app-events/getting-started-app-events-web#predefined-events
 * To Generate Code for a Standard Event
 */
function logCompletedRegistrationEvent(registrationMethod) {
    const FB = window.FB
    var params = {}
    // params[FB.AppEvents.ParameterNames.REGISTRATION_METHOD] = registrationMethod
    FB.AppEvents.logEvent(FB.AppEvents.EventNames.COMPLETED_REGISTRATION, null, params)
}

class Header extends React.Component {
  static propTypes = {
    currentUserId: PropTypes.string,
    currentUserProfile: PropTypes.object,
    currentUserEmail: PropTypes.string,
    currentUserNotificationTypes: PropTypes.arrayOf(PropTypes.string),
    currentUsernameIsTemporary: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    loginReduxFetching: PropTypes.bool,
    loginReduxError: PropTypes.string,
    blackHeader: PropTypes.bool,
    attemptLogout: PropTypes.func,
    attemptChangePassword: PropTypes.func,
    attemptGetUserFeed: PropTypes.func,
    attemptGetUserGuides: PropTypes.func,
    closeGlobalModal: PropTypes.func,
    openGlobalModal: PropTypes.func,
    globalModalThatIsOpen: PropTypes.string,
    globalModalParams: PropTypes.object,
    reroute: PropTypes.func,
    attemptUpdateUser: PropTypes.func,
    userEntitiesUpdating: PropTypes.bool,
    userEntitiesError: PropTypes.object,
    activitiesById: PropTypes.array,
    activities: PropTypes.object,
    originalDraft: PropTypes.object,
    workingDraft: PropTypes.object,
    draftToBeSaved: PropTypes.object,
    resetCreateStore: PropTypes.func,
    markSeen: PropTypes.func,
    pathname: PropTypes.string,
    signedUp: PropTypes.bool,
    flagStory: PropTypes.func,
    deleteStory: PropTypes.func,
    pendingMediaUploads: PropTypes.number,
  }

  constructor(props) {
    super(props)
    this.state = {
      modal: undefined,
      navbarEngaged: false,
      nextPathAfterSave: undefined,
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize)
    window.addEventListener('scroll', this.handleScroll)

    branch.data((err, data) => {
      if (err) return

      let feedItemUrl = data.data_parsed['$canonical_url']
      if (feedItemUrl) this.props.reroute(feedItemUrl)
    })
  }

  componentWillMount() {
    this.handleWindowResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize)
    window.removeEventListener('scroll', this.handleScroll)
  }

  componentDidUpdate(prevProps) {
    const {
      attemptGetUserFeed,
      attemptGetUserGuides,
      currentUserId,
      currentUsernameIsTemporary,
      globalModalThatIsOpen,
      isLoggedIn,
      openGlobalModal,
      pathname,
      reroute,
      signedUp,
    } = this.props

    if (currentUserId && prevProps.currentUserId !== currentUserId) {
      attemptGetUserFeed(currentUserId, {
        perPage: itemsPerQuery,
        page: 1,
      })
      attemptGetUserGuides(currentUserId)
      if (currentUsernameIsTemporary) {
        openGlobalModal('changeTempUsername')
      }
    }
    if (!prevProps.signedUp && signedUp) {
      logCompletedRegistrationEvent()
      reroute('/signup/info')
    }
    if (prevProps.pathname !== pathname) {
      window.scrollTo({
        top: 0,
        behavior: 'instant',
      })
    }
    if (prevProps.isLoggedIn && !isLoggedIn) {
      reroute('/')
      openGlobalModal('login')
    }
    if (
      !prevProps.isLoggedIn && this.props.isLoggedIn
      && prevProps.globalModalThatIsOpen === 'login'
    ) {
      this.closeModal()
      reroute('/feed')
    }
    if (
      prevProps.globalModalThatIsOpen === 'documentation'
      && !globalModalThatIsOpen
      && !isLoggedIn
    ) {
      reroute('/')
      openGlobalModal('login')
    }
  }

  shouldDisengageNavbar = () => {
    return window.scrollY < 65
    && this.state.navbarEngaged
    && window.innerWidth >= sizes.tablet
  }

  handleWindowResize = event => {
    let windowWidth = window.innerWidth
    const tabletSize = sizes.tablet
    if (windowWidth <= tabletSize) {
      this.setState({ navbarEngaged: true })
    }
    else if (this.shouldDisengageNavbar()) {
      this.setState({ navbarEngaged: false })
    }
  }

  handleScroll = event => {
    // If header is transparent, it should mark itself as "engaged" so we know to style it differently (aka black background)
    if (!this.props.blackHeader) {
      if (window.scrollY > 65 && !this.state.navbarEngaged) {
        this.setState({ navbarEngaged: true })
      }
      else if (this.shouldDisengageNavbar()) {
        this.setState({ navbarEngaged: false })
      }
    }
  }

  openLoginModal = () => {
    this.setState({ modal: 'login' })
  }

  openSaveEditsModal = path => {
    const {
      draftToBeSaved,
      originalDraft,
      pathname,
      pendingMediaUploads,
      workingDraft,
    } = this.props

    if (
      pendingMediaUploads || (
        pathname.includes('editStory')
        && workingDraft
        && haveFieldsChanged(workingDraft, originalDraft)
        // extra check to ensure we dont show modal after they click save and nav away
        // without making further edits to the draft
        && hasChangedSinceSave(workingDraft, draftToBeSaved)
      )
    ) {
      this.setState({
        nextPathAfterSave: path,
      })
      this.props.openGlobalModal('saveEdits')
    }
    else {
      this.props.reroute(path)
    }
  }

  _resetCreateStore = () => {
    this.props.resetCreateStore(this.props.originalDraft.id)
  }

  // name correspond to icon name and button name
  openModal = event => {
    const name = event.target.name
    let modalToOpen
    if (name === 'inbox' || name === 'loginEmail') modalToOpen = 'inbox'
    this.setState({ modal: modalToOpen })
  }

  closeModal = () => {
    this.setState({ modal: undefined })
  }

  render() {
    const {
      isLoggedIn,
      loginReduxFetching,
      loginReduxError,
      attemptLogout,
      attemptChangePassword,
      closeGlobalModal,
      openGlobalModal,
      currentUserId,
      currentUserProfile,
      currentUserEmail,
      currentUserNotificationTypes,
      globalModalThatIsOpen,
      globalModalParams,
      reroute,
      attemptUpdateUser,
      userEntitiesUpdating,
      userEntitiesError,
      activitiesById,
      activities,
      markSeen,
      pathname,
      workingDraft,
      originalDraft,
      flagStory,
      deleteStory,
      pendingMediaUploads,
    } = this.props

    const spacerSize = this.props.blackHeader ? '65px' : '0px'
    const hasBlackBackground = this.props.blackHeader || this.state.navbarEngaged

    return (
      <div>
        <StyledGrid
          fluid
          fixed
          hasBlackBackground={hasBlackBackground}
        >
          {isLoggedIn && (
            <HeaderLoggedIn
              userId={currentUserId}
              openModal={this.openModal}
              pathname={pathname}
              openSaveEditsModal={this.openSaveEditsModal}
              openGlobalModal={openGlobalModal}
              closeGlobalModal={closeGlobalModal}
              reroute={reroute}
              attemptLogout={attemptLogout}
              activities={activities}
              activitiesById={activitiesById}
              resetCreateStore={this._resetCreateStore}
              haveFieldsChanged={haveFieldsChanged}
              workingDraft={workingDraft}
              originalDraft={originalDraft}
            />
          )}
          {!isLoggedIn && (
            <HeaderAnonymous
              openLoginModal={this.openLoginModal}
              pathname={pathname}
              openGlobalModal={openGlobalModal}
              reroute={reroute}
            />
          )}
          <HeaderModals
            closeModal={this.closeModal}
            closeGlobalModal={closeGlobalModal}
            attemptLogout={attemptLogout}
            userId={currentUserId}
            currentUserProfile={currentUserProfile}
            currentUserEmail={currentUserEmail}
            currentUserNotificationTypes={currentUserNotificationTypes}
            modal={this.state.modal}
            globalModalThatIsOpen={globalModalThatIsOpen}
            globalModalParams={globalModalParams}
            attemptChangePassword={attemptChangePassword}
            loginReduxFetching={loginReduxFetching}
            loginReduxError={loginReduxError}
            attemptUpdateUser={attemptUpdateUser}
            userEntitiesUpdating={userEntitiesUpdating}
            userEntitiesError={userEntitiesError}
            activities={activities}
            activitiesById={activitiesById}
            markSeen={markSeen}
            nextPathAfterSave={this.state.nextPathAfterSave}
            pendingMediaUploads={pendingMediaUploads}
            reroute={reroute}
            resetCreateStore={this._resetCreateStore}
            flagStory={flagStory}
            deleteStory={deleteStory}
            openGlobalModal={openGlobalModal}
          />
        </StyledGrid>
        <HeaderSpacer spacerSize={spacerSize} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const pathname = state.routes.location ? state.routes.location.pathname : ''
  const users = state.entities.users.entities
  const currentUserId = state.session.userId
  const currentUser = users[currentUserId]

  return {
    isLoggedIn: !state.session.isLoggedOut,
    loginReduxFetching: state.login.fetching,
    loginReduxError: state.login.error,
    blackHeader: _.includes(['/', '/feed', ''], pathname) ? false : true,
    globalModalThatIsOpen: state.ux.modalName,
    globalModalParams: state.ux.params,
    userEntitiesUpdating: state.entities.users.updating,
    userEntitiesError: state.entities.users.error,
    currentUserId: currentUserId,
    currentUserProfile: currentUser && currentUser.profile,
    currentUserEmail: currentUser && currentUser.email,
    currentUserNotificationTypes: currentUser && currentUser.notificationTypes,
    currentUsernameIsTemporary: currentUser && currentUser.usernameIsTemporary,
    activitiesById: state.entities.users.activitiesById,
    activities: state.entities.users.activities,
    originalDraft: state.storyCreate.draft,
    workingDraft: state.storyCreate.workingDraft,
    draftToBeSaved: state.storyCreate.draftToBeSaved,
    pathname: pathname,
    signedUp: state.signup.signedUp,
    pendingMediaUploads: state.storyCreate.pendingMediaUploads,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    attemptLogout: tokens => dispatch(SessionActions.logout(tokens)),
    attemptChangePassword: (userId, oldPassword, newPassword) =>
      dispatch(LoginActions.changePasswordRequest(userId, oldPassword, newPassword)),
    attemptGetUserFeed: (userId, params) => dispatch(StoryActions.feedRequest(userId, params)),
    attemptGetUserGuides: userId => dispatch(GuideActions.getUserGuides(userId)),
    closeGlobalModal: () => dispatch(UXActions.closeGlobalModal()),
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
    reroute: route => dispatch(push(route)),
    attemptUpdateUser: updates => dispatch(UserActions.updateUser(updates)),
    resetCreateStore: () => dispatch(StoryCreateActions.resetCreateStore()),
    flagStory: (sessionUserId, storyId) => dispatch(StoryActions.flagStory(sessionUserId, storyId)),
    deleteStory: (userId, storyId) => dispatch(StoryActions.deleteStory(userId, storyId)),
    markSeen: activityId => dispatch(UserActions.activitySeen(activityId)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header)
