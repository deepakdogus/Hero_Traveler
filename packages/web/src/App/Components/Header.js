import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import logo from '../Shared/Images/ht-logo-white.png'

const TabContainer = styled.div`
  display: inline-block;
  padding: 0px 10px;
`

const TabText = styled.p`
  color: white;
`

const Underline = styled.div`
  background-color: red;
  width: 100%;
  height: 3px;
`

class HeaderTab extends React.Component {
  static propTypes = {
    isActive: PropTypes.bool,
    text: PropTypes.string,
  }

  render() {
    const {isActive, text} = this.props
    return (   
      <TabContainer>
        <TabText>{text}</TabText>
        {isActive && <Underline/>}
      </TabContainer>
    )
  }
}

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
          <HeaderTab text='Explore' isActive={!isLoggedIn}/>
        </TabsContainer>
      </HeaderContainer> 
    )
  }
}