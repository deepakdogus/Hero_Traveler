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
import UserActions from '../Shared/Redux/Entities/Users'
import UXActions from '../Redux/UXRedux'
import HeaderModals from '../Components/HeaderModals'

const StyledGrid = styled(Grid)`
  padding: 15px;
  z-index: 3;
  position: ${props => props.fixed ? 'fixed' : 'absolute'};
  width: 100%;
  top: 0;
  padding-right: 10px;
  background-color: ${props => props.blackBackground ? '#1a1c21' : 'rgba(0,0,0,0)'};
`

const StyledGridBlack = styled(StyledGrid)`
  background-color: ${props => props.theme.Colors.background}
`

const HeaderSpacer = styled.div`
  height: ${props => props.spacerSize};
`

class Header extends React.Component {
  static propTypes = {
    currentUserId: PropTypes.string,
    currentUserProfile: PropTypes.object,
    currentUserEmail: PropTypes.string, 
    isLoggedIn: PropTypes.bool,
    loginReduxFetching: PropTypes.bool, 
    loginReduxError: PropTypes.object, 
    blackHeader: PropTypes.bool,
    attemptLogin: PropTypes.func,
    attemptChangePassword: PropTypes.func,
    closeGlobalModal: PropTypes.func,
    openGlobalModal: PropTypes.func,
    globalModalThatIsOpen: PropTypes.string,
    globalModalParams: PropTypes.object,
    reroute: PropTypes.func,
    attemptUpdateUser: PropTypes.func,
    userEntitiesUpdating: PropTypes.bool,
    userEntitiesError: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      modal: undefined,
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
    const { isLoggedIn, loginReduxFetching, loginReduxError, attemptLogin, attemptChangePassword, closeGlobalModal, openGlobalModal, 
      currentUserId, currentUserProfile, currentUserEmail, globalModalThatIsOpen, globalModalParams, reroute, attemptUpdateUser, userEntitiesUpdating, userEntitiesError } = this.props
    const SelectedGrid = this.props.blackHeader ? StyledGridBlack : StyledGrid
    const spacerSize = this.props.blackHeader ? '65px' : '0px'
    return (
      <div>
        <SelectedGrid fluid>
          {isLoggedIn &&
          <HeaderLoggedIn
              user={currentUserId}
              openModal={this.openModal}
              openGlobalModal={openGlobalModal}
              reroute={reroute}
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
              openLoginModal={this.openLoginModal}
              userId={currentUserId}
              currentUserProfile={currentUserProfile}
              currentUserEmail={currentUserEmail}
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
  }
}

function mapDispatchToProps(dispatch) {
  return {
    attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password)),
    attemptChangePassword: (userId, oldPassword, newPassword) => dispatch(LoginActions.changePasswordRequest(userId, oldPassword, newPassword)),
    closeGlobalModal: () => dispatch(UXActions.closeGlobalModal()),
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
    reroute: (route) => dispatch(push(route)),
    attemptUpdateUser: (updates) => dispatch(UserActions.updateUser(updates))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Header)
