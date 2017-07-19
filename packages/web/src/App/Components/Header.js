import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Grid, Row, Col } from './FlexboxGrid';
import logo from '../Shared/Images/ht-logo-white.png'
import HeaderTab from './HeaderTab'
import RoundedButton from './RoundedButton'
import Icon from './Icon'
import Avatar from './Avatar'
import {Link, NavLink} from 'react-router-dom';

const StyledGrid = styled(Grid)`
  padding: 15px;
  z-index: 2;
  position: absolute;
  width: 100%;
  top: 0;
`

const Logo = styled.img`
  height: 30px;
`

const TabsContainer = styled.div`
  padding-left: 30px;
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

//<TabsContainer>
//  {isLoggedIn && <HeaderTab text='My Feed' isActive/>}
//  {isLoggedIn && <Divider>&nbsp;</Divider>}
//  <HeaderTab text='Explore' isActive={!isLoggedIn}/>
//</TabsContainer>

export default class Header extends React.Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
  }

  render () {
    const {isLoggedIn} = this.props
    return (
      <StyledGrid fluid>
        <Row start="xs">
          <Col xs={12} md={2} >
            <Logo src={logo} alt={'hero-traveler-logo'}/>
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
              <MenuLink to='/story/123'>
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
                <RoundedButton text='Login'/>
              }
              {isLoggedIn &&
                <div>
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
                </div>
              }
            </Row>
          </Col>
        </Row>
      </StyledGrid>
    )
  }
}
