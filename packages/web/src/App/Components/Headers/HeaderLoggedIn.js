import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { Row, Col } from '../FlexboxGrid'
import { mediaMax, mediaMin } from '../ContentLayout.component'
import Avatar from '../Avatar'
import RoundedButton from '../RoundedButton'
import Icon from '../Icon'
import { StyledRow, StyledRoundedButton, SearchIcon, Logo, Divider, HamburgerIcon, MenuLink } from './Shared'
import logo from '../../Shared/Images/ht-logo-white.png'

const LoggedInDesktopContainer = styled.div`
  ${mediaMax.desktop`display: none;`}
`

const LoggedInTabletContainer = styled.div`
  ${mediaMin.desktop`display: none;`}
  ${mediaMax.phone`display: none;`}
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

const StyledRoundedAvatarButton = styled(RoundedButton)`
  margin-left: 10px;
  margin-right: 20px;
`

export default class HeaderLoggedIn extends React.Component {
  render () {
    return (
        <StyledRow around="xs" middle="xs">
          <Col>
            <Logo src={logo} alt={'Hero Traveler Logo'}/>
          </Col>
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
                  onClick={this.props.openModal}
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
                  onClick={this.props.openModal}
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
                  onClick={this.props.openModal}
              />
            </Row>
          </Col>
        </StyledRow>
    )
  }
}
