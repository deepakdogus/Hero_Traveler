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
import ConditionalLink from '../ConditionalLink'

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
  top: ${props => props.profileAvatar ? '4px' : '2px'};
`


const StyledRoundedCreateButton = styled(RoundedButton)`
    position: relative;
    bottom: 1px;
`


const StyledRoundedMailButton = styled(StyledRoundedButton)`
    position: relative;
    bottom: 5px;
`

const StyledRoundedNotificationButton = styled(StyledRoundedButton)`
    position: relative;
    top: 2px;
`


class HeaderLoggedIn extends React.Component {
  static PropTypes = {
    openModal: PropTypes.func,
    user: PropTypes.object,
    pathname: PropTypes.string,
    openSaveEditsModal: PropTypes.func,
  }

  render () {
    const { openModal, user, profileAvatar, pathname, openSaveEditsModal } = this.props

    return (
      <StyledRow between="xs" middle="xs">
        <Col>
          <ConditionalLink
            to="/"
            pathname={pathname}
            openSaveEditsModal={openSaveEditsModal}
          >
            <Logo src={logo} alt={'Hero Traveler Logo'}/>
          </ConditionalLink>
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
                to='/editStory/new'
              >
                <StyledRoundedCreateButton text='Create'/>
              </NavLink>
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
              </NavLink>
            </LoggedInDesktopContainer>
            <LoggedInTabletContainer>
              <NavLink
                to='/editStory/new'
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
