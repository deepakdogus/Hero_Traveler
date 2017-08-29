import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {NavLink} from 'react-router-dom'
import Modal from 'react-modal'
import _ from 'lodash'

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
`

const StyledRow = styled(Row)`
  height: 65px;
  background-color: ${props => props.blackBackground ? '#1a1c21' : 'rgba(0,0,0,0)'};
`

class StyledGridWithProp extends StyledGrid {
  static propTypes = {
    fixed: PropTypes.bool,
  }
}

class StyledRowWithProp extends StyledRow {
  static propTypes = {
    blackBackground: PropTypes.bool,
  }
}
// const StyledRow = styled(Row)`
//   height: 65px;
//   background-color: ${props => props.theme.Colors.background};
// `

// const StyledIcon = styled.img`
//   width: ${props => getSize};
//   height: ${props => getSize};
//   margin: ${props => props.center ? 'auto' : 0};
// `


const Logo = styled.img`
  height: 30px;
  margin-left: -35px;
`

// Likely refactor this out into its own component later with &nbsp; included
const Divider = styled.div`
  display: inline-block;
  width: 1px;
  background-color: ${props => props.theme.Colors.snow};
`

// const MenuLinkContainer = styled.div`
//   display: flex;
//   flex: 1;
//   flex-direction: 'row';
//   justify-content: center;
//   align-items: center;
// `

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
    this.state = {
      modal: undefined,
      fixedHeader: false,
      blackHeader: false,
    }
  }

  componentDidMount = () => {
    window.addEventListener('scroll', _.throttle(this.handleScroll, 200));
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', _.throttle(this.handleScroll, 200));
  }

  handleScroll = (e) => {
    return e.srcElement.body.scrollTop > 65 
              ? this.setState({ fixedHeader: true, blackHeader: true})
              : this.setState({ fixedHeader: false, blackHeader: false}) 
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
      <StyledGridWithProp fixed={this.state.fixedHeader} fluid> 
        <StyledRowWithProp blackBackground={this.state.blackHeader} center="xs" middle="xs"> 
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
              <MenuLink to='/' exact>
                Explore
              </MenuLink>              
            </Row>
          </Col>
          }
          {!isLoggedIn &&
          <Col xsOffset={1} lg={4}>
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
          </Col>            
          }
          {isLoggedIn &&
          <Col xsOffset={2} lg={5}>
            <Row end='xs' middle='xs'>
              <RoundedButton type={'opaque'}>
                <Icon name='explore' />
              </RoundedButton>
              <Divider>&nbsp;</Divider>
              <RoundedButton text='Create'/>
              <RoundedButton type={'opaque'}>
                <Icon name='loginEmail' />
              </RoundedButton>
              <RoundedButton type={'opaque'}>
                <Icon name='cameraFlash' />
              </RoundedButton>
              <RoundedButton type={'opaque'}>
                <Avatar />
              </RoundedButton>
            </Row>
          </Col>
          }
          {!isLoggedIn &&
          <Col xsOffset={3} lg={2}>
            <Row end='xs'>
              <RoundedButton type={'opaque'}>
                <Icon name='explore' />
              </RoundedButton>
              <Divider>&nbsp;</Divider>
              <RoundedButton
                text='Login'
                onClick={this.openLoginModal}
              />
            </Row>
          </Col>
          }
        </StyledRowWithProp>

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
      </StyledGridWithProp>
    )
  }
}
