import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
<<<<<<< HEAD
import { push } from 'react-router-redux'
=======
import {push} from 'react-router-redux'
>>>>>>> master
import * as _ from 'lodash'
import { Grid } from '../Components/FlexboxGrid'
import HeaderAnonymous from '../Components/Headers/HeaderAnonymous'
import HeaderLoggedIn from '../Components/Headers/HeaderLoggedIn'
import LoginActions from '../Shared/Redux/LoginRedux'
import UserActions from '../Shared/Redux/Entities/Users'
import SessionActions from '../Shared/Redux/SessionRedux'
import UXActions from '../Redux/UXRedux'
import StoryActions from '../Shared/Redux/Entities/Stories'
import HeaderModals from '../Components/HeaderModals'
import UserActions from '../Shared/Redux/Entities/Users'

// If we don't explicity prevent 'fixed' from being passed to Grid, we get an error about unknown prop on div element
// because apparently react-flexbox-grid passes all props down to underlying React elements
const StyledGrid = styled(({ fixed, ...rest }) => <Grid {...rest} />)`
  padding: 15px;
  z-index: 3;
  position: ${props => props.fixed ? 'fixed' : 'absolute'};
  width: 100%;
  top: 0;
  padding-right: 10px;
  background-color: ${props => props.blackBackground ? '#1a1c21' : 'rgba(0,0,0,0)'};
`

const StyledGridBlack = styled(StyledGrid)`
  background-color: ${props => props.theme.Colors.background};
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
    loginReduxError: PropTypes.object,
    blackHeader: PropTypes.bool,
    attemptLogin: PropTypes.func,
    attemptLogout: PropTypes.func,
    attemptChangePassword: PropTypes.func,
    closeGlobalModal: PropTypes.func,
    openGlobalModal: PropTypes.func,
    globalModalThatIsOpen: PropTypes.string,
    globalModalParams: PropTypes.object,
<<<<<<< HEAD
    reroute: PropTypes.func,
    attemptUpdateUser: PropTypes.func,
    userEntitiesUpdating: PropTypes.bool,
    userEntitiesError: PropTypes.object,
=======
    activitiesById: PropTypes.array,
    activities: PropTypes.object,
    stories: PropTypes.object,
    markSeen: PropTypes.func,
    users: PropTypes.object,
>>>>>>> master
  }

  constructor(props) {
    super(props)
    this.state = {
      modal: undefined,
      navbarEngaged: false,
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  componentDidUpdate(prevProps) {
    if(this.props.currentUser && prevProps.currentUser !== this.props.currentUser){
      this.props.attemptGetUserFeed(this.props.currentUser)
    }
  }

  handleScroll = (event) => {
    // If header is transparent, it should mark itself as "engaged" so we know to style it differently (aka black background)
    if (!this.props.blackHeader){
      if (window.scrollY > 65 && !this.state.navbarEngaged){
        this.setState({ navbarEngaged: true })
      } else if (window.scrollY < 65 && this.state.navbarEngaged) {
        this.setState({ navbarEngaged: false })
      }
    }
  }

  openLoginModal = () => {
    this.setState({ modal: 'login' })
  }

  openSignupModal = () => {
    this.setState({ modal: 'signup' })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isLoggedIn && nextProps.isLoggedIn) this.closeModal()
  }

  // name correspond to icon name and button name
  openModal = (event) => {
    const name = event.target.name
    let modalToOpen;
    if (name === 'inbox' || name === 'loginEmail') modalToOpen = 'inbox'
    else if (name === 'notifications' || name === 'cameraFlash') modalToOpen = 'notificationsThread'
    this.setState({ modal: modalToOpen })
  }

  closeModal = () => {
    this.setState({ modal: undefined })
  }

  render () {
<<<<<<< HEAD
    const { isLoggedIn, loginReduxFetching, loginReduxError, attemptLogin, attemptLogout, attemptChangePassword, closeGlobalModal, openGlobalModal,
      currentUserId, currentUserProfile, currentUserEmail, currentUserNotificationTypes, globalModalThatIsOpen, globalModalParams,
      reroute, attemptUpdateUser, userEntitiesUpdating, userEntitiesError } = this.props
=======
    const {
      isLoggedIn,
      attemptLogin,
      closeGlobalModal,
      currentUser,
      globalModalThatIsOpen,
      globalModalParams,
      activities,
      activitiesById,
      markSeen,
      stories,
      reroute,
      users,
    } = this.props

>>>>>>> master
    const SelectedGrid = (this.props.blackHeader || this.state.navbarEngaged) ? StyledGridBlack : StyledGrid
    const spacerSize = this.props.blackHeader ? '65px' : '0px'
    return (
      <div>
        <SelectedGrid fluid fixed>
          {isLoggedIn &&
          <HeaderLoggedIn
              user={currentUserId}
              openModal={this.openModal}
              openGlobalModal={openGlobalModal}
              reroute={reroute}
              attemptLogout={attemptLogout}
          />
          }
          {!isLoggedIn &&
          <HeaderAnonymous
              openLoginModal={this.openLoginModal}
          />
          }
          <HeaderModals
              closeModal={this.closeModal}
              closeGlobalModal={closeGlobalModal}
              openSignupModal={this.openSignupModal}
              attemptLogin={attemptLogin}
              attemptLogout={attemptLogout}
              openLoginModal={this.openLoginModal}
              user={currentUserId}
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
          />
      </SelectedGrid>
      <HeaderSpacer
          spacerSize={spacerSize}
      />
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
    currentUserId: currentUserId,
    globalModalThatIsOpen: state.ux.modalName,
    globalModalParams: state.ux.params,
    userEntitiesUpdating: state.entities.users.updating,
    userEntitiesError: state.entities.users.error,
    currentUserProfile: (currentUser) && currentUser.profile,
    currentUserEmail: (currentUser) && currentUser.email,
    currentUserNotificationTypes: (currentUser) && currentUser.notificationTypes,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password)),
    attemptLogout: (tokens) => dispatch(SessionActions.logout(tokens)),
    attemptChangePassword: (userId, oldPassword, newPassword) => dispatch(LoginActions.changePasswordRequest(userId, oldPassword, newPassword)),
    attemptGetUserFeed: (userId) => dispatch(StoryActions.feedRequest(userId)),
    closeGlobalModal: () => dispatch(UXActions.closeGlobalModal()),
<<<<<<< HEAD
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
    reroute: (route) => dispatch(push(route)),
    attemptUpdateUser: (updates) => dispatch(UserActions.updateUser(updates))
=======
    markSeen: (activityId) => dispatch(UserActions.activitySeen(activityId)),
    reroute: (path) => dispatch(push(path)),
>>>>>>> master
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Header)
