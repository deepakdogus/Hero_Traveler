import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import logo from '../Shared/Images/ht-logo-white.png'
import HeaderTab from './HeaderTab'
import RoundedButton from './RoundedButton'
import Icon from './Icon'
import FloatRight from './FloatRight'
import Avatar from './Avatar'

const HeaderContainer = styled.div`
  padding: 15px
`

const Logo = styled.img`
  height: 30px;
`

const TabsContainer = styled.div`
  display: inline-block;
  padding-left: 30px;
`

// Likely refactor this out into its own component later with &nbsp; included
const Divider = styled.div`
  display: inline-block;
  width: 1px;
  background-color: ${props => `${props.theme.Colors.snow}`};
`

const Inline = styled.div`
  display: inline-block;
`

export default class Header extends React.Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
  }

  render () {
    const {isLoggedIn} = this.props
    return (
      <HeaderContainer>
        <Logo src={logo} alt={'hero-traveler-logo'}/>
        <TabsContainer>
          {isLoggedIn && <HeaderTab text='My Feed' isActive/>}
          {isLoggedIn && <Divider>&nbsp;</Divider>}
          <HeaderTab text='Explore' isActive={!isLoggedIn}/>
        </TabsContainer>
        <FloatRight>
          <RoundedButton type={'opaque'}>
            <Icon name='explore' />
          </RoundedButton>
          <Divider>&nbsp;</Divider>
          {!isLoggedIn &&
            <Inline>
              <RoundedButton text='Login'/>
            </Inline>
          }
          {isLoggedIn &&
            <Inline>
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
            </Inline>
          }
        </FloatRight>
      </HeaderContainer> 
    )
  }
}