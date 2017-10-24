import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {NavLink} from 'react-router-dom'
import Modal from 'react-modal'
import { mediaMax, mediaMin } from './ContentLayout.component'
import { connect } from 'react-redux'

import { Grid, Row, Col } from './FlexboxGrid'
import logo from '../Shared/Images/ht-logo-white.png'
import RoundedButton from './RoundedButton'
import Icon from './Icon'
import Avatar from './Avatar'
import Login from './Modals/Login'
import Signup from './Modals/Signup'
import ResetPassword from './Modals/ResetPassword'
import Contributor from './Modals/Contributor'
import AddToItinerary from './Modals/AddToItinerary'
import Inbox from './Modals/Inbox'
import RightModal from './RightModal'
import NotificationsThread from './Modals/NotificationsThread'
import {usersExample} from '../Containers/Feed_TEST_DATA'
import LoginActions from '../Shared/Redux/LoginRedux'

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

const contributorModalStyles = {
  content: {
    width: 380,
    margin: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0, .5)'
  }
}

const addToItineraryModalStyles = {
  content: {
    width: 600,
    margin: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0, .5)'
  }
}

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

const StyledRow = styled(Row)`
  height: 65px;
`

const Logo = styled.img`
  height: 30px;
  margin-top: 6px;
`

// Likely refactor this out into its own component later with &nbsp; included
const LoggedInDesktopContainer = styled.div`
  ${mediaMax.desktop`display: none;`}
`
const LoggedInTabletContainer = styled.div`
  ${mediaMin.desktop`display: none;`}
  ${mediaMax.phone`display: none;`}
`
const Divider = styled.div`
  display: inline-block;
  width: 1px;
  background-color: ${props => props.theme.Colors.snow};
  margin-left: 10px;
  margin-right: 10px;
`
const SearchIcon = styled(Icon)`
  height: 17px;
  width: 17px;
`
const MailIcon = styled(Icon)`
  height: 12px;
  width: 18px;
  padding-top: 2px;
`

const NotificationsIcon = styled(Icon)`
  height: 18px;
  width: 18px;
`

const HamburgerIcon = styled(Icon)`
  height: 30px;
  width: 30px;
  margin: 8px;
  display: none;
  ${mediaMax.desktop`display: inline;`}
`

const StyledRoundedButton = styled(RoundedButton)`
  margin-left: 10px;
  margin-right: 10px;
`

const StyledRoundedAvatarButton = styled(RoundedButton)`
  margin-left: 10px;
  margin-right: 20px;
`

const StyledRoundedLoginButton = styled(RoundedButton)`
  margin-left: 10px;
  margin-right: 20px;
  display: inline;
  ${mediaMax.phone`display: none;`}
`

const LoginLink = styled.a`
  font-family: 'montserrat';
  color: #ffffff;
  letter-spacing: 1.5px;
  font-size: 13px;
  display: none;
  ${mediaMax.phone`display: inline;`}
`

const MenuLink = (props) => {
  return (
    <NavLink
      exact={props.exact}
      style={{
        textDecoration: 'none',
        padding: 10,
        marginRight: 10,
        display: 'flex',
        color: 'white',
        fontFamily: 'montserrat',
        fontSize: '15px',
        letterSpacing: '1.2px',
        borderBottomWidth: '3px',
        borderBottomColor: 'transparent',
        borderBottomStyle: 'solid'
      }}
      activeStyle={{
        borderBottomWidth: '3px',
        borderBottomColor: 'red'
      }}
      to={props.to}>
      {props.children}
    </NavLink>
  )
}

class Header extends React.Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
    blackHeader: PropTypes.bool,
    attemptLogin: PropTypes.func,
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
    const {isLoggedIn, attemptLogin} = this.props
    // quick fix to get this merge in - need to refactor accordingly (part of header refactor)
    const SelectedGrid = this.props.blackHeader ? StyledGridBlack : StyledGrid
    const user = usersExample['59d50b1c33aaac0010ef4b3f']
    return (
      <SelectedGrid fluid>
        <StyledRow around="xs" middle="xs">
          <Col>
            <Logo src={logo} alt={'Hero Traveler Logo'}/>
          </Col>
          {isLoggedIn &&
          <LoggedInDesktopContainer>
            <Col>
              <Row middle="xs">
                <MenuLink to='/feed' exact>
                  My Feed
                </MenuLink>
                <Divider>&nbsp;</Divider>
                <span>&nbsp;</span>
                <MenuLink to='/' exact>
                  Explore
                </MenuLink>
              </Row>
            </Col>
          </LoggedInDesktopContainer>
          }
          {!isLoggedIn &&
          <Col lg={5}>
          </Col>
          }
          {isLoggedIn &&
          <Col smOffset={2} lg={5}>
            <Row end='xs' middle='xs'>
              <NavLink
                to='/search'
              >
                <StyledRoundedButton
                  type='headerButton'
                  height='32px'
                  width='32px'
                >
                  <SearchIcon
                    name='explore'
                  />
                </StyledRoundedButton>
              </NavLink>
              <Divider>&nbsp;</Divider>
              <LoggedInDesktopContainer>
                <NavLink
                  to='/createStory'
                >
                  <StyledRoundedButton text='Create'/>
                </NavLink>
                <StyledRoundedButton
                  type='headerButton'
                  height='32px'
                  width='32px'
                  name='inbox'
                  onClick={this.openModal}
                >
                  <MailIcon
                    name='loginEmail'
                  />
                </StyledRoundedButton>
                <StyledRoundedButton
                  type='headerButton'
                  height='32px'
                  width='32px'
                  name='notifications'
                  onClick={this.openModal}
                >
                  <NotificationsIcon name='cameraFlash' />
                </StyledRoundedButton>
                <NavLink
                  to='/profile/59d50b1c33aaac0010ef4b3f'
                >
                  <StyledRoundedAvatarButton
                    type='headerButton'
                    height='32px'
                    width='32px'
                  >
                    <Avatar size='mediumSmall'/>
                  </StyledRoundedAvatarButton>
                </NavLink>
              </LoggedInDesktopContainer>
              <LoggedInTabletContainer>
                <NavLink
                  to='/createStory'
                >
                  <StyledRoundedButton text='Create'/>
                </NavLink>
              </LoggedInTabletContainer>
              <HamburgerIcon
                  name='hamburger'
                  onClick={this.openModal}
              />
            </Row>
          </Col>
          }
          {!isLoggedIn &&
          <Col>
            <Row around='xs' middle='xs'>
              <NavLink
                to='/search'
              >
                <StyledRoundedButton
                  type='headerButton'
                  height='32px'
                  width='32px'
                >
                  <SearchIcon
                    name='explore'
                  />
                </StyledRoundedButton>
              </NavLink>
              <Divider>&nbsp;</Divider>
              <LoginLink
                  onClick={this.openLoginModal}
              >Log In</LoginLink>
              <StyledRoundedLoginButton
                text='Login'
                onClick={this.openLoginModal}
              />
              <HamburgerIcon
                  name='hamburger'
              />
            </Row>
          </Col>
          }
        </StyledRow>

        <Modal
          isOpen={this.state.modal === 'login'}
          contentLabel="Login Modal"
          onRequestClose={this.closeModal}
          style={customModalStyles}
        >
          <Login
            onSignupClick={this.openSignupModal}
            onAttemptLogin={attemptLogin}
          />
        </Modal>
        <Modal
          isOpen={this.state.modal === 'signup'}
          contentLabel="Signup Modal"
          onRequestClose={this.closeModal}
          style={customModalStyles}
        >
          <Signup onLoginClick={this.openLoginModal}/>
        </Modal>
        <Modal
          isOpen={this.state.modal === 'resetPassword'}
          contentLabel="Reset Password Modal"
          onRequestClose={this.closeModal}
          style={customModalStyles}
        >
          <ResetPassword/>
        </Modal>
        <Modal
          isOpen={this.state.modal === 'contributor'}
          contentLabel="Reset Password Modal"
          onRequestClose={this.closeModal}
          style={contributorModalStyles}
        >
          <Contributor/>
        </Modal>
        <Modal
          isOpen={this.state.modal === 'addToItinerary'}
          contentLabel="Add To Itinerary Modal"
          onRequestClose={this.closeModal}
          style={addToItineraryModalStyles}
        >
          <AddToItinerary/>
        </Modal>
        <RightModal
          isOpen={this.state.modal === 'notificationsThread'}
          contentLabel='Notifications Thread'
          onRequestClose={this.closeModal}
        >
          <NotificationsThread closeModal={this.closeModal} profile={user}/>
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'inbox'}
          contentLabel='Inbox'
          onRequestClose={this.closeModal}
        >
          <Inbox closeModal={this.closeModal} profile={user}/>
        </RightModal>
      </SelectedGrid>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.login.isLoggedIn,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password)),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Header)
