import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {NavLink} from 'react-router-dom'
import Modal from 'react-modal'

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
  position: ${props => props.fixed ? 'fixed' : 'absolute'};
  width: 100%;
  top: 0;
  padding-right: 10px;
`

const StyledRow = styled(Row)`
  height: 65px;
  background-color: ${props => props.blackBackground ? '#1a1c21' : 'rgba(0,0,0,0)'};
`

const Logo = styled.img`
  height: 30px;
  margin-left: -35px;
  margin-top: 6px;
`

// Likely refactor this out into its own component later with &nbsp; included
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

export default class Header extends React.Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
    blackHeader: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      modal: undefined,
      fixedHeader: this.props.blackHeader || false,
      blackHeader: this.props.blackHeader || false,
    }
  }

  handleScroll = (event) => {
    if(!this.props.blackHeader){
    return event.srcElement.body.scrollTop > 65 
              ? this.setState({ fixedHeader: true, blackHeader: true})
              : this.setState({ fixedHeader: false, blackHeader: false})       
    }
    return
  }

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.handleScroll);
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
      <StyledGrid fixed={this.state.fixedHeader} fluid> 
        <StyledRow blackBackground={this.state.blackHeader} center="xs" middle="xs"> 
          <Col xs={12} md={2} lg={2} >
            <Logo src={logo} alt={'Hero Traveler Logo'}/>
          </Col>
          {isLoggedIn &&
          <Col xsOffset={1} lg={2}>
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
          }
          {!isLoggedIn &&
          <Col lg={5}>
            <Row middle="xs">
              <MenuLink to='/' exact>
                `Explore`
              </MenuLink>
              <Divider>&nbsp;</Divider>          
              <MenuLink to='/signup/topics'>
                Signup (topics)
              </MenuLink>
              <Divider>&nbsp;</Divider>
              <MenuLink to='/signup/social'>
                Signup (social)
              </MenuLink>
              <Divider>&nbsp;</Divider>
              <MenuLink to='/story/596775b90d4bb70010e2a5f8'>
                Story
              </MenuLink>           
            </Row>          
          </Col>            
          }
          {isLoggedIn &&
          <Col xsOffset={2} lg={5}>
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
              <StyledRoundedButton text='Create'/>
              <StyledRoundedButton 
                type='headerButton' 
                height='32px' 
                width='32px'
              >
                <MailIcon 
                  name='loginEmail'
                />
              </StyledRoundedButton>
              <StyledRoundedButton 
                type='headerButton'
                height='32px'
                width='32px'
              >
                <NotificationsIcon name='cameraFlash' />
              </StyledRoundedButton>
              <StyledRoundedAvatarButton 
                type='headerButton'
                height='32px'
                width='32px'
              >
                <Avatar size='mediumSmall'/>
              </StyledRoundedAvatarButton>
            </Row>
          </Col>
          }
          {!isLoggedIn &&
          <Col xsOffset={3} lg={2}>
            <Row end='xs' middle='xs'>
              <StyledRoundedButton 
                type='headerButton' 
                height='32px' 
                width='32px'
              >
                <SearchIcon name='explore' />
              </StyledRoundedButton>
              <Divider>&nbsp;</Divider>
              <StyledRoundedLoginButton
                text='Login'
                onClick={this.openLoginModal}        
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
