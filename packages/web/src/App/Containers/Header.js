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
import HeaderModals from '../Components/HeaderModals'
import { sizes } from '../Themes/Metrics'
import { haveFieldsChanged } from '../Shared/Lib/draftChangedHelpers'
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

class Header extends React.Component {
  static propTypes = {
    currentUserId: PropTypes.string,
    currentUserProfile: PropTypes.object,
    currentUserEmail: PropTypes.string,
    currentUserNotificationTypes: PropTypes.arrayOf(PropTypes.string),
    isLoggedIn: PropTypes.bool,
    loginReduxFetching: PropTypes.bool,
    loginReduxError: PropTypes.string,
    blackHeader: PropTypes.bool,
    attemptLogout: PropTypes.func,
    attemptChangePassword: PropTypes.func,
    attemptGetUserFeed: PropTypes.func,
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
    resetCreateStore: PropTypes.func,
    markSeen: PropTypes.func,
    pathname: PropTypes.string,
    signedUp: PropTypes.bool,
    flagStory: PropTypes.func,
    deleteStory: PropTypes.func,
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
    const { currentUserId } = this.props
    if (currentUserId && prevProps.currentUserId !== currentUserId) {
      this.props.attemptGetUserFeed(currentUserId)
    }
    if (!prevProps.signedUp && this.props.signedUp) {
      this.props.reroute('/signup/topics')
    }
    if (prevProps.pathname !== this.props.pathname) {
      window.scrollTo({
        top: 0,
        behavior: 'instant',
      })
    }
    if (prevProps.isLoggedIn && !this.props.isLoggedIn) {
      this.props.reroute('/')
      this.props.openGlobalModal('login')
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
    if (
      this.props.workingDraft
      && this.props.pathname.includes('editStory')
      && haveFieldsChanged(this.props.workingDraft, this.props.originalDraft)
    ) {
      this.setState({
        nextPathAfterSave: path,
      })
      this.props.openGlobalModal('saveEdits')
    }
  }

  _resetCreateStore = () => {
    this.props.resetCreateStore(this.props.originalDraft.id)
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isLoggedIn && nextProps.isLoggedIn) this.closeModal()
  }

  // name correspond to icon name and button name
  openModal = (event) => {
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
    } = this.props

    const spacerSize = this.props.blackHeader ? '65px' : '0px'
    const hasBlackBackground = this.props.blackHeader || this.state.navbarEngaged

    return (
      <div>
        <StyledGrid fluid fixed hasBlackBackground={hasBlackBackground}>
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
    isLoggedIn: state.login.isLoggedIn,
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
    activitiesById: state.entities.users.activitiesById,
    activities: state.entities.users.activities,
    originalDraft: state.storyCreate.draft,
    workingDraft: state.storyCreate.workingDraft,
    pathname: pathname,
    signedUp: state.signup.signedUp,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    attemptLogout: tokens => dispatch(SessionActions.logout(tokens)),
    attemptChangePassword: (userId, oldPassword, newPassword) =>
      dispatch(LoginActions.changePasswordRequest(userId, oldPassword, newPassword)),
    attemptGetUserFeed: userId => dispatch(StoryActions.feedRequest(userId)),
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
