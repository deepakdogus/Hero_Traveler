import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { Row, Col } from '../FlexboxGrid'
import { mediaMax, mediaMin } from '../ContentLayout.component'
import Avatar from '../Avatar'
import RoundedButton from '../RoundedButton'
import Icon from '../Icon'
import { StyledRow, StyledRoundedButton, Logo, Divider, HamburgerIcon, MenuLink, SearchNav } from './Shared'
import logo from '../../Shared/Images/ht-logo-white.png'
import getImageUrl from '../../Shared/Lib/getImageUrl'

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
  position: relative;
  top: ${props => props.profileAvatar ? '4px' : '-3px'};
`

const StyledRoundedCreateButton = styled(RoundedButton)`
    position: relative;
    bottom: 5px;
`

const StyledRoundedMailButton = styled(StyledRoundedButton)`
    position: relative;
    bottom: 5px;
`

const StyledRoundedNotificationButton = styled(StyledRoundedButton)`
    position: relative;
    bottom: 3px;
`

const Sidebar = styled.div`
  position: absolute;
  top: 70; 
`
const SidebarDemiLink = styled.p`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props => props.theme.Colors.background};
  font-weight: 400;
  letter-spacing: .7px;
  font-size: 16px;
`

class HeaderLoggedIn extends React.Component {
  static PropTypes = {
    openModal: PropTypes.func,
    user: PropTypes.object,
  }

  render () {
    const { openModal, user, profileAvatar } = this.props
    return (
      <StyledRow between="xs" middle="xs">
        <Col>
          <Logo src={logo} alt={'Hero Traveler Logo'}/>
        </Col>
        <LoggedInDesktopContainer>
          <Col>
            <Row middle="xs">
              <MenuLink to='/feed/' exact>
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
            <SearchNav />
            <Divider>&nbsp;</Divider>
            <LoggedInDesktopContainer>
              <NavLink
                to='/createStoryNew/new'
              >
                <StyledRoundedCreateButton text='Create'/>
              </NavLink>
              <StyledRoundedMailButton
                type='headerButton'
                height='32px'
                width='32px'
                name='inbox'
                onClick={openModal}
              >
                <MailIcon
                  name='loginEmail'
                />
              </StyledRoundedMailButton>
              <StyledRoundedNotificationButton
                type='headerButton'
                height='32px'
                width='32px'
                name='notifications'
                onClick={openModal}
              >
                <NotificationsIcon name='cameraFlash' />
              </StyledRoundedNotificationButton>
              <NavLink
                to={`/profile/${user}/view`}
              >
              
                <StyledRoundedAvatarButton
                  type='headerButton'
                  height='32px'
                  width='32px'
                  profileAvatar={profileAvatar}
                >
                  <Avatar
                    type='avatar'
                    size={profileAvatar ? 'avatar' : 'mediumSmall'}
                    avatarUrl={getImageUrl(profileAvatar)}
                  />
                </StyledRoundedAvatarButton>
              <Sidebar>
                <SidebarDemiLink style={{paddingLeft: 20, textAlign: 'start'}}>My Profile</SidebarDemiLink>
                <SidebarDemiLink style={{paddingLeft: 20, textAlign: 'start'}}>Settings</SidebarDemiLink>
                <SidebarDemiLink style={{paddingLeft: 20, textAlign: 'start'}}>Customize Interests</SidebarDemiLink>
                <SidebarDemiLink style={{paddingLeft: 20, textAlign: 'start'}}>FAQ</SidebarDemiLink>
                <SidebarDemiLink style={{paddingLeft: 20, textAlign: 'start'}}> Logout</SidebarDemiLink>
              </Sidebar>

              
              </NavLink>
            </LoggedInDesktopContainer>
            <LoggedInTabletContainer>
              <NavLink
                to='/createStoryNew/new'
              >
                <StyledRoundedButton text='Create'/>
              </NavLink>
            </LoggedInTabletContainer>
            <HamburgerIcon
              name='hamburger'
              onClick={openModal}
            />
          </Row>
        </Col>
      </StyledRow>
    )
  }
}

function mapStateToProps(state, ownProps) {
  let {users} = state.entities
  const profileAvatar =  users.entities[ownProps.user].profile.avatar
  return {
    profileAvatar
  }
}

export default connect(mapStateToProps)(HeaderLoggedIn)
