import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {NavLink} from 'react-router-dom';
import Modal from 'react-modal'

import { Grid, Row, Col } from './FlexboxGrid';
import logo from '../Shared/Images/ht-logo-white.png'
import RoundedButton from './RoundedButton'
import Icon from './Icon'
import Avatar from './Avatar'
import Login from './Modals/Login'
import Signup from './Modals/Signup'
import ResetPassword from './Modals/ResetPassword'
import Contributor from './Modals/Contributor'
import AddToItinerary from './Modals/AddToItinerary'

const customModalStyles = {
  content: {
    width: 420,
    margin: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0, .5)'
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
  position: absolute;
  width: 100%;
  top: 0;
`

const Logo = styled.img`
  height: 30px;
`

// Likely refactor this out into its own component later with &nbsp; included
const Divider = styled.div`
  display: inline-block;
  width: 1px;
  background-color: ${props => props.theme.Colors.snow};
`

const MenuLinkContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: 'row';
`

const RoundedButtonText = styled.p`
  color: ${props => props.theme.Colors.snow };
  text-align: center;
  font-size: 16px;
  margin: 2.5px 10px;
  letter-spacing: 1.2px;
  text-decoration: none;
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

export default class Header extends React.Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {modal: undefined}
  }

  openLoginModal = () => {
    this.setState({ modal: 'login' })
  }

  openSignupModal = () => {
    this.setState({ modal: 'signup' })
  }

  closeModal = () => {
    this.setState({ modal: undefined })
  }

  render () {
    const {isLoggedIn} = this.props
    return (
      <StyledGrid fluid>
        <Row start="xs">
          <Col xs={12} md={2} >
            <Logo src={logo} alt={'Hero Traveler Logo'}/>
          </Col>
          <Col xs>
            <MenuLinkContainer>
              <MenuLink to='/' exact>
                Explore
              </MenuLink>
              <MenuLink to='/signup/topics'>
                Signup (topics)
              </MenuLink>
              <MenuLink to='/signup/social'>
                Signup (social)
              </MenuLink>
              <MenuLink to='/story/596775b90d4bb70010e2a5f8'>
                Story
              </MenuLink>
            </MenuLinkContainer>
          </Col>
          <Col xs>
            <Row end='xs'>
              <RoundedButton type={'opaque'}>
                <Icon name='explore' />
              </RoundedButton>
              <Divider>&nbsp;</Divider>
              {!isLoggedIn &&
                <RoundedButton
                  text='Login'
                  onClick={this.openLoginModal}
                />
              }
              {isLoggedIn &&
                <div>
                  <RoundedButton>
                    <NavLink 
                      to='/createStory'
                      style={{textDecoration: 'none'}}
                    >
                      <RoundedButtonText>Create</RoundedButtonText>
                    </NavLink>
                  </RoundedButton>
                  <RoundedButton type={'opaque'}>
                    <Icon name='loginEmail' />
                  </RoundedButton>
                  <RoundedButton type={'opaque'}>
                    <Icon name='cameraFlash' />
                  </RoundedButton>
                  <RoundedButton type={'opaque'}>
                    <Avatar />
                  </RoundedButton>
                </div>
              }
            </Row>
          </Col>
        </Row>

        <Modal
          isOpen={this.state.modal === 'login'}
          contentLabel="Login Modal"
          onRequestClose={this.closeModal}
          style={customModalStyles}
        >
          <Login onSignupClick={this.openSignupModal}/>
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
      </StyledGrid>
    )
  }
}
